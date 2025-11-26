"use server";

import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

// Add or Remove from Favorites
export async function toggleFavorite(listingId: string) {
    const session = await getSession();
    if (!session) return { success: false, error: "Oturum açmanız gerekiyor." };

    try {
        // Check if already favorited
        const existingFavorite = await prisma.favorite.findFirst({
            where: {
                userId: session.id,
                listingId: listingId
            }
        });

        if (existingFavorite) {
            // Remove
            await prisma.favorite.delete({
                where: { id: existingFavorite.id }
            });
            revalidatePath("/dashboard/favorites");
            return { success: true, action: "removed", message: "Favorilerden kaldırıldı." };
        } else {
            // Add
            await prisma.favorite.create({
                data: {
                    userId: session.id,
                    listingId: listingId
                }
            });
            revalidatePath("/dashboard/favorites");
            return { success: true, action: "added", message: "Favorilere eklendi." };
        }

    } catch (error) {
        console.error("Toggle favorite error:", error);
        return { success: false, error: "İşlem başarısız." };
    }
}

// Get User Favorites
export async function getUserFavorites() {
    const session = await getSession();
    if (!session) return { success: false, error: "Oturum açmanız gerekiyor." };

    try {
        const favorites = await prisma.favorite.findMany({
            where: { userId: session.id },
            include: {
                listing: {
                    include: {
                        images: {
                            where: { isCover: true },
                            take: 1
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        return { success: true, data: favorites };
    } catch (error) {
        console.error("Get favorites error:", error);
        return { success: false, error: "Favoriler getirilemedi." };
    }
}
