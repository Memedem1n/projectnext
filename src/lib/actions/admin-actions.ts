"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * Approve a corporate account - sets status to ACTIVE
 */
export async function approveCorporateAccount(userId: string) {
    try {
        await prisma.user.update({
            where: { id: userId },
            data: {
                status: "ACTIVE",
            },
        });

        revalidatePath("/admin/approvals");
        return { success: true };
    } catch (error) {
        console.error("Approve account error:", error);
        return { success: false, error: "Hesap onaylanırken bir hata oluştu." };
    }
}

/**
 * Reject a corporate account - sets status to REJECTED
 */
export async function rejectCorporateAccount(userId: string, reason?: string) {
    try {
        await prisma.user.update({
            where: { id: userId },
            data: {
                status: "REJECTED",
                // Optionally store rejection reason in a new field if needed
            },
        });

        revalidatePath("/admin/approvals");
        return { success: true };
    } catch (error) {
        console.error("Reject account error:", error);
        return { success: false, error: "Hesap reddedilirken bir hata oluştu." };
    }
}

/**
 * Suspend an active account
 */
export async function suspendAccount(userId: string) {
    try {
        await prisma.user.update({
            where: { id: userId },
            data: {
                status: "SUSPENDED",
            },
        });

        revalidatePath("/admin/users");
        return { success: true };
    } catch (error) {
        console.error("Suspend account error:", error);
        return { success: false, error: "Hesap askıya alınırken bir hata oluştu." };
    }
}

/**
 * Verify user identity - sets identityVerified to true
 */
/**
 * Verify user identity - sets identityVerified to true
 */
export async function verifyUserIdentity(userId: string) {
    try {
        await prisma.user.update({
            where: { id: userId },
            data: {
                identityVerified: true,
                identityVerificationStatus: 'VERIFIED',
                identityVerifiedAt: new Date(),
            },
        });

        revalidatePath("/admin/verifications");
        return { success: true };
    } catch (error) {
        console.error("Verify identity error:", error);
        return { success: false, error: "Kimlik doğrulanırken bir hata oluştu." };
    }
}

/**
 * Reject user identity - sets status to REJECTED
 */
export async function rejectUserIdentity(userId: string, reason?: string) {
    try {
        await prisma.user.update({
            where: { id: userId },
            data: {
                identityVerified: false,
                identityVerificationStatus: 'REJECTED',
                // identityDoc: null, // Keep doc for record or let user overwrite
            },
        });

        revalidatePath("/admin/verifications");
        return { success: true };
    } catch (error) {
        console.error("Reject identity error:", error);
        return { success: false, error: "Kimlik reddedilirken bir hata oluştu." };
    }
}

/**
 * Verify corporate verification
 */
export async function verifyCorporate(userId: string) {
    try {
        await prisma.user.update({
            where: { id: userId },
            data: {
                corporateVerified: true,
                corporateVerificationStatus: 'VERIFIED',
            },
        });

        revalidatePath("/admin/verifications");
        return { success: true };
    } catch (error) {
        console.error("Verify corporate error:", error);
        return { success: false, error: "Kurumsal üyelik onaylanırken bir hata oluştu." };
    }
}

/**
 * Reject corporate verification
 */
export async function rejectCorporate(userId: string, reason?: string) {
    try {
        await prisma.user.update({
            where: { id: userId },
            data: {
                corporateVerified: false,
                corporateVerificationStatus: 'REJECTED',
            },
        });

        revalidatePath("/admin/verifications");
        return { success: true };
    } catch (error) {
        console.error("Reject corporate error:", error);
        return { success: false, error: "Kurumsal üyelik reddedilirken bir hata oluştu." };
    }
}
