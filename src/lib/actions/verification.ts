"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { generatePhoneVerificationToken } from "@/lib/tokens";

// Mock SMS Sender
async function sendSMS(phone: string, message: string) {
    console.log("------------------------------------------------");
    console.log(`[SMS MOCK] To: ${phone}`);
    console.log(`[SMS MOCK] Message: ${message}`);
    console.log("------------------------------------------------");
    // In production, integrate with Netgsm or Firebase here
}

export async function sendPhoneOTP(phone: string) {
    try {
        const token = await generatePhoneVerificationToken(phone);
        await sendSMS(phone, `Sahibinden.next doğrulama kodunuz: ${token.token}`);
        return { success: true, message: "Doğrulama kodu gönderildi." };
    } catch (error) {
        console.error("SMS sending error:", error);
        return { success: false, error: "SMS gönderilemedi." };
    }
}

export async function verifyPhoneOTP(phone: string, code: string, userId: string) {
    try {
        // Check if already verified
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { phoneVerified: true }
        });

        if (user?.phoneVerified) {
            return { success: false, error: "Telefon numarası zaten doğrulanmış." };
        }

        const existingToken = await prisma.verificationToken.findFirst({
            where: {
                phone,
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

        await prisma.user.update({
            where: { id: userId },
            data: {
                phoneVerified: true,
                phoneVerifiedAt: new Date(),
                phone: phone // Update phone in case it was changed/added
            }
        });

        await prisma.verificationToken.delete({
            where: { id: existingToken.id }
        });

        revalidatePath("/dashboard");
        return { success: true, message: "Telefon numarası başarıyla doğrulandı." };

    } catch (error) {
        console.error("Phone verification error:", error);
        return { success: false, error: "Doğrulama sırasında bir hata oluştu." };
    }
}

// ... (verifySellerStatus stays same)

import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export async function uploadIdentityDocument(formData: FormData) {
    try {
        const userId = formData.get("userId") as string;
        const tcIdentityNo = formData.get("tcIdentityNo") as string;
        const name = formData.get("name") as string;
        const surname = formData.get("surname") as string;
        const birthYear = formData.get("birthYear") as string;
        const file = formData.get("file") as File;

        if (!userId || !tcIdentityNo || !name || !surname || !birthYear || !file) {
            return { success: false, error: "Eksik bilgi." };
        }

        // Validate TC No length
        if (tcIdentityNo.length !== 11) {
            return { success: false, error: "TC Kimlik No 11 haneli olmalıdır." };
        }

        // Validate birth year
        const birthYearNum = parseInt(birthYear);
        const currentYear = new Date().getFullYear();
        if (birthYearNum < 1900 || birthYearNum > currentYear) {
            return { success: false, error: "Geçersiz doğum yılı." };
        }

        // Check if already verified or pending
        const existingVerification = await prisma.identityVerification.findUnique({
            where: { userId }
        });

        if (existingVerification?.status === "APPROVED") {
            return { success: false, error: "Kimlik doğrulaması zaten tamamlanmış." };
        }

        // Create secure-uploads directory if not exists
        const uploadDir = join(process.cwd(), "public", "secure-uploads");
        await mkdir(uploadDir, { recursive: true });

        // Save file
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const fileName = `${userId}-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
        const filePath = join(uploadDir, fileName);

        await writeFile(filePath, buffer);

        const secureUrl = `/secure-uploads/${fileName}`;

        // Create or Update Identity Verification Record
        await prisma.identityVerification.upsert({
            where: { userId },
            update: {
                tcIdentityNo,
                documentUrl: secureUrl,
                status: "PENDING",
                rejectionReason: null
            },
            create: {
                userId,
                tcIdentityNo,
                documentUrl: secureUrl,
                status: "PENDING"
            }
        });

        // Store name, surname, birthYear in user record for future NVI verification
        await prisma.user.update({
            where: { id: userId },
            data: {
                name: `${name} ${surname}`, // Update full name
            }
        });

        revalidatePath("/dashboard/verification");
        return { success: true, message: "Kimlik belgesi yüklendi. Onay bekleniyor." };

    } catch (error) {
        console.error("Identity upload error:", error);
        return { success: false, error: "Dosya yüklenirken bir hata oluştu." };
    }
}

export async function requestBadge(userId: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { identityVerification: true }
        });

        if (!user?.phoneVerified) {
            return { success: false, error: "Telefon numaranızı doğrulamanız gerekmektedir." };
        }

        if (user.identityVerification?.status !== "APPROVED") {
            return { success: false, error: "Kimlik doğrulamanızın onaylanması gerekmektedir." };
        }

        // Create Badge Request
        await prisma.badgeRequest.create({
            data: {
                userId,
                type: "DEALER_VERIFIED",
                status: "PENDING"
            }
        });

        revalidatePath("/dashboard/verification");
        return { success: true, message: "Rozet talebiniz alındı. Yönetici onayı bekleniyor." };

    } catch (error) {
        console.error("Badge request error:", error);
        return { success: false, error: "Talep oluşturulurken bir hata oluştu." };
    }
}

// Admin Actions
export async function approveIdentity(verificationId: string) {
    try {
        const verification = await prisma.identityVerification.update({
            where: { id: verificationId },
            data: { status: "APPROVED" },
            include: { user: true }
        });

        await prisma.user.update({
            where: { id: verification.userId },
            data: {
                identityVerified: true,
                identityVerifiedAt: new Date(),
                tcIdentityNo: verification.tcIdentityNo
            }
        });

        // Check if phone is also verified, if so, create Badge Request automatically
        if (verification.user.phoneVerified) {
            // Check if badge request already exists
            const existingBadgeRequest = await prisma.badgeRequest.findFirst({
                where: {
                    userId: verification.userId,
                    type: "DEALER_VERIFIED"
                }
            });

            if (!existingBadgeRequest) {
                await prisma.badgeRequest.create({
                    data: {
                        userId: verification.userId,
                        type: "DEALER_VERIFIED",
                        status: "PENDING"
                    }
                });
            }
        }

        revalidatePath("/admin/verifications");
        return { success: true, message: "Kimlik onaylandı ve rozet talebi oluşturuldu." };
    } catch (error) {
        console.error("Approve identity error:", error);
        return { success: false, error: "İşlem başarısız." };
    }
}

export async function rejectIdentity(verificationId: string, reason: string) {
    try {
        await prisma.identityVerification.update({
            where: { id: verificationId },
            data: {
                status: "REJECTED",
                rejectionReason: reason
            }
        });

        revalidatePath("/admin/verifications");
        return { success: true, message: "Kimlik reddedildi." };
    } catch (error) {
        return { success: false, error: "İşlem başarısız." };
    }
}

export async function approveBadge(requestId: string) {
    try {
        const request = await prisma.badgeRequest.update({
            where: { id: requestId },
            data: { status: "APPROVED" }
        });

        // Add Badge to User
        await prisma.userBadge.create({
            data: {
                userId: request.userId,
                type: "DEALER_VERIFIED"
            }
        });

        revalidatePath("/admin/verifications");
        return { success: true, message: "Rozet talebi onaylandı." };
    } catch (error) {
        console.error(error);
        return { success: false, error: "İşlem başarısız." };
    }
}

export async function rejectBadge(requestId: string, reason: string) {
    try {
        await prisma.badgeRequest.update({
            where: { id: requestId },
            data: {
                status: "REJECTED",
                rejectionReason: reason
            }
        });

        revalidatePath("/admin/verifications");
        return { success: true, message: "Rozet talebi reddedildi." };
    } catch (error) {
        return { success: false, error: "İşlem başarısız." };
    }
}
