"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
// import { generatePhoneVerificationToken } from "@/lib/tokens";

// Mock SMS Sender
async function sendSMS(phone: string, message: string) {
    console.log("------------------------------------------------");
    console.log(`[SMS MOCK] To: ${phone}`);
    console.log(`[SMS MOCK] Message: ${message}`);
    console.log("------------------------------------------------");
    // In production, integrate with Netgsm or Firebase here
}

export async function sendPhoneOTP(phone: string) {
    return { success: false, error: "Telefon doğrulama özelliği şu anda bakımda.", message: "" };
    /*
    try {
        const token = await generatePhoneVerificationToken(phone);
        await sendSMS(phone, `Sahibinden.next doğrulama kodunuz: ${token.token}`);
        return { success: true, message: "Doğrulama kodu gönderildi." };
    } catch (error) {
        console.error("SMS sending error:", error);
        return { success: false, error: "SMS gönderilemedi." };
    }
    */
}

export async function verifyPhoneOTP(phone: string, code: string, userId: string) {
    return { success: false, error: "Telefon doğrulama özelliği şu anda bakımda.", message: "" };
    /*
    try {
        // Check if already verified
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { phoneVerified: true }
        });

        if (user?.phoneVerified) {
            return { success: false, error: "Telefon numarası zaten doğrulanmış." };
        }

        // VerificationToken model does not have 'phone' field yet.
        // Disabling this logic until schema is updated.
        
        const existingToken = await prisma.verificationToken.findFirst({
            where: {
                // phone, // Error: phone does not exist
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
    */
}

export async function verifySellerStatus(userId: string) {
    // Placeholder for seller verification logic
    return { success: true };
}

export async function uploadIdentityDocument(formData: FormData) {
    return { success: false, error: "Bu özellik şu anda aktif değil.", message: "" };
}

export async function requestBadge(userId: string) {
    return { success: false, error: "Bu özellik şu anda aktif değil.", message: "" };
}

// Admin Actions
export async function approveIdentity(verificationId: string) {
    return { success: false, error: "Bu özellik şu anda aktif değil.", message: "" };
}

export async function rejectIdentity(verificationId: string, reason: string) {
    return { success: false, error: "Bu özellik şu anda aktif değil.", message: "" };
}

export async function approveBadge(requestId: string) {
    return { success: false, error: "Bu özellik şu anda aktif değil.", message: "" };
}

export async function rejectBadge(requestId: string, reason: string) {
    return { success: false, error: "Bu özellik şu anda aktif değil." };
}
