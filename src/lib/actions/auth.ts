"use server";

import { z } from "zod";
import prisma from "@/lib/prisma";
import { hashPassword, comparePassword } from "@/lib/password";
import { encrypt } from "@/lib/auth-edge";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { validateTC } from "@/lib/validators/tc-validator";
import { verifyTCWithNVI } from "@/lib/actions/nvi-verification";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

// Schemas
const RegisterSchema = z.object({
    name: z.string().min(2, "İsim en az 2 karakter olmalıdır"),
    email: z.string().email("Geçerli bir email adresi giriniz"),
    password: z.string().min(6, "Şifre en az 6 karakter olmalıdır"),
    phone: z.string()
        .transform(val => val.replace(/\D/g, '')) // Remove non-digits
        .transform(val => val.startsWith('0') ? val.slice(1) : val) // Remove leading 0
        .refine(val => val.length === 10 && val.startsWith('5'), "Telefon numarası 5 ile başlamalı ve 10 haneli olmalıdır (Örn: 5321234567)"),
    tcIdentityNo: z.string().optional(),
    birthYear: z.string().optional(), // Form sends as string
    role: z.enum(["INDIVIDUAL", "CORPORATE_GALLERY", "CORPORATE_DEALER"]),
    // Corporate fields
    storeName: z.string().optional(),
    city: z.string().optional(),
    district: z.string().optional(),
    taxNumber: z.string().optional(),
});

const LoginSchema = z.object({
    email: z.string().email("Geçerli bir email adresi giriniz"),
    password: z.string().min(1, "Şifre gereklidir"),
});

export async function verifyEmailOTP(email: string, code: string) {
    try {
        const existingToken = await prisma.verificationToken.findFirst({
            where: {
                email,
                token: code
            }
        });

        if (!existingToken) {
            return { success: false, error: "Geçersiz veya süresi dolmuş kod." };
        }

        const hasExpired = new Date(existingToken.expires) < new Date();
        if (hasExpired) {
            return { success: false, error: "Kodun süresi dolmuş." };
        }

        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (!existingUser) {
            return { success: false, error: "Kullanıcı bulunamadı." };
        }

        await prisma.user.update({
            where: { id: existingUser.id },
            data: {
                emailVerified: new Date(),
                status: "ACTIVE"
            }
        });

        await prisma.verificationToken.delete({
            where: { id: existingToken.id }
        });

        // Create Session after verification
        const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
        const session = await encrypt({
            id: existingUser.id,
            email: existingUser.email,
            name: existingUser.name || "",
            role: existingUser.role,
            status: "ACTIVE",
            expires
        });
        (await cookies()).set("session", session, { expires, httpOnly: true });

        return { success: true };

    } catch (error) {
        console.error("OTP Verification Error:", error);
        return { success: false, error: "Doğrulama sırasında bir hata oluştu." };
    }
}

export async function register(prevState: any, formData: FormData) {
    try {
        const rawData = Object.fromEntries(formData.entries());
        const validatedFields = RegisterSchema.safeParse(rawData);

        if (!validatedFields.success) {
            return {
                success: false,
                error: validatedFields.error.flatten().fieldErrors,
            };
        }

        const { name, email, password, role, storeName, phone, city, district, taxNumber, tcIdentityNo, birthYear } = validatedFields.data;

        // TC Identity Validation (Algorithm + NVI Service)
        let isIdentityVerified = false;
        if (tcIdentityNo) {
            // 1. Algorithm Check
            if (!validateTC(tcIdentityNo)) {
                return { success: false, error: "Geçersiz TC Kimlik Numarası (Algoritma hatası)." };
            }

            // 2. NVI Service Check (Real Verification)
            if (birthYear) {
                // Split name into first and last name roughly
                const nameParts = name.trim().split(' ');
                const surname = nameParts.pop() || "";
                const firstName = nameParts.join(' ');

                if (!firstName || !surname) {
                    return { success: false, error: "Lütfen ad ve soyadınızı tam giriniz." };
                }

                const nviResult = await verifyTCWithNVI({
                    tcno: tcIdentityNo,
                    name: firstName,
                    surname: surname,
                    birthYear: parseInt(birthYear)
                });

                if (!nviResult.success) {
                    return { success: false, error: nviResult.message || "Kimlik bilgileri doğrulanamadı." };
                }

                isIdentityVerified = true;
            } else {
                return { success: false, error: "Kimlik doğrulaması için doğum yılı gereklidir." };
            }
        } else if (role === "INDIVIDUAL") {
            // return { success: false, error: "TC Kimlik Numarası zorunludur." };
        }

        // Check if user exists (Email, Phone, TC)
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email },
                    { phone },
                    { tcIdentityNo: tcIdentityNo || undefined }
                ]
            },
        });

        if (existingUser) {
            if (existingUser.email === email) return { success: false, error: "Bu email adresi ile kayıtlı kullanıcı bulunmaktadır." };
            if (existingUser.phone === phone) return { success: false, error: "Bu telefon numarası ile kayıtlı kullanıcı bulunmaktadır." };
            if (tcIdentityNo && existingUser.tcIdentityNo === tcIdentityNo) return { success: false, error: "Bu TC Kimlik Numarası ile daha önce kayıt olunmuş. (1 TC = 1 Hesap)" };
        }

        const hashedPassword = await hashPassword(password);
        const isCorporate = role !== "INDIVIDUAL";
        const status = isCorporate ? "PENDING" : "ACTIVE";

        // Handle Corporate Document Upload
        let documentUrl: string | undefined;
        if (isCorporate) {
            const documentFile = formData.get("document") as File;
            if (documentFile && documentFile.size > 0) {
                try {
                    const { writeFile, mkdir } = await import("fs/promises");
                    const { join } = await import("path");

                    // Create secure-uploads directory
                    const uploadDir = join(process.cwd(), "public", "secure-uploads", "corporate-docs");
                    await mkdir(uploadDir, { recursive: true });

                    // Save file
                    const bytes = await documentFile.arrayBuffer();
                    const buffer = Buffer.from(bytes);
                    const timestamp = Date.now();
                    const sanitizedName = documentFile.name.replace(/[^a-zA-Z0-9.]/g, "_");
                    const fileName = `${timestamp}-${sanitizedName}`;
                    const filePath = join(uploadDir, fileName);

                    await writeFile(filePath, buffer);
                    documentUrl = `/secure-uploads/corporate-docs/${fileName}`;
                } catch (uploadError) {
                    console.error("Document upload error:", uploadError);
                    return { success: false, error: "Belge yüklenirken bir hata oluştu." };
                }
            }
        }

        // Create User
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: role,
                status: status,
                phone: phone,
                tcIdentityNo: tcIdentityNo,
                identityVerified: isIdentityVerified,
                identityVerifiedAt: isIdentityVerified ? new Date() : null,
                dealerProfile: isCorporate ? {
                    create: {
                        storeName: storeName || name,
                        slug: (storeName || name).toLowerCase().replace(/[^a-z0-9]/g, "-") + "-" + Math.floor(Math.random() * 1000),
                        phone: phone,
                        city: city || "",
                        district: district || "",
                        taxNumber: taxNumber || null,
                        taxPlateDoc: documentUrl, // Store document URL
                    }
                } : undefined
            },
        });

        // Send Verification Email
        try {
            const verificationToken = await generateVerificationToken(email);
            await sendVerificationEmail(verificationToken.email, verificationToken.token);
        } catch (emailError) {
            console.error("Email sending failed:", emailError);
        }

        // Redirect to verify page with email param
        return { success: true, isCorporate, redirectUrl: `/verify-email?email=${encodeURIComponent(email)}` };

    } catch (error) {
        console.error("Registration error:", error);
        return {
            success: false,
            error: "Kayıt sırasında bir hata oluştu.",
        };
    }
}

export async function login(prevState: any, formData: FormData) {
    try {
        const rawData = Object.fromEntries(formData.entries());
        const validatedFields = LoginSchema.safeParse(rawData);
        const rememberMe = formData.get("rememberMe") === "on";

        if (!validatedFields.success) {
            return {
                success: false,
                error: "Geçersiz giriş bilgileri.",
            };
        }

        const { email, password } = validatedFields.data;

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user || !user.password) {
            return {
                success: false,
                error: "Email veya şifre hatalı.",
            };
        }

        const isPasswordValid = await comparePassword(password, user.password);

        if (!isPasswordValid) {
            return {
                success: false,
                error: "Email veya şifre hatalı.",
            };
        }

        // Create Session
        // Standard: 24 hours, Remember Me: 30 days
        const sessionDuration = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
        const expires = new Date(Date.now() + sessionDuration);

        const session = await encrypt({
            id: user.id,
            email: user.email,
            name: user.name || "",
            role: user.role,
            status: user.status,
            expires
        });

        (await cookies()).set("session", session, { expires, httpOnly: true });

        return { success: true };

    } catch (error) {
        console.error("Login error:", error);
        return {
            success: false,
            error: "Giriş yapılırken bir hata oluştu.",
        };
    }
}

export async function logout() {
    (await cookies()).set("session", "", { expires: new Date(0) });
    redirect("/login");
}
