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
export async function verifyUserIdentity(userId: string) {
    try {
        await prisma.user.update({
            where: { id: userId },
            data: {
                identityVerified: true,
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
 * Reject user identity - resets identityDoc and identityVerified
 */
export async function rejectUserIdentity(userId: string, reason?: string) {
    try {
        await prisma.user.update({
            where: { id: userId },
            data: {
                identityVerified: false,
                identityDoc: null, // Clear the document so they can upload again
                // Optionally store rejection reason
            },
        });

        revalidatePath("/admin/verifications");
        return { success: true };
    } catch (error) {
        console.error("Reject identity error:", error);
        return { success: false, error: "Kimlik reddedilirken bir hata oluştu." };
    }
}
