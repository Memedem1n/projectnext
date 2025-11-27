"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Approve Listing (Admin)
export async function approveListing(listingId: string) {
    try {
        await prisma.listing.update({
            where: { id: listingId },
            data: {
                status: "ACTIVE",
                isActive: true,
                approvedAt: new Date(),
            }
        });

        revalidatePath("/admin/listings");
        revalidatePath("/");

        return { success: true, message: "İlan onaylandı ve yayına alındı." };
    } catch (error) {
        console.error("Listing approval error:", error);
        return { success: false, error: "İlan onaylanırken bir hata oluştu." };
    }
}

// Reject Listing (Admin)
export async function rejectListing(listingId: string, reason: string) {
    try {
        await prisma.listing.update({
            where: { id: listingId },
            data: {
                status: "REJECTED",
                isActive: false,
                rejectionReason: reason
            }
        });

        revalidatePath("/admin/listings");

        return { success: true, message: "İlan reddedildi." };
    } catch (error) {
        console.error("Listing rejection error:", error);
        return { success: false, error: "İlan reddedilirken bir hata oluştu." };
    }
}

// Soft Delete Listing (Admin)
export async function softDeleteListing(listingId: string) {
    try {
        await prisma.listing.update({
            where: { id: listingId },
            data: {
                status: "DELETED",
                isActive: false,
                deletedAt: new Date()
            }
        })
        revalidatePath('/admin/listings')
        return { success: true }
    } catch (error) {
        console.error('Soft delete listing error:', error)
        return { success: false, error: 'İlan silinirken bir hata oluştu' }
    }
}
