"use server";

import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

// Add or Remove from Favorites
export async function toggleFavorite(listingId: string, listId?: string) {
    const session = await getSession();
    if (!session) return { success: false, error: "Oturum açmanız gerekiyor." };

    try {
        // Check if already favorited in this list (or general list if listId is null)
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
        }
    }

// Create a new Favorite List
export async function createFavoriteList(name: string) {
        const session = await getSession();
        if (!session) return { success: false, error: "Oturum açmanız gerekiyor." };

        try {
            const newList = await prisma.favoriteList.create({
                data: {
                    userId: session.id,
                    name: name
                }
            });
            revalidatePath("/dashboard/favorites");
            return { success: true, data: newList, message: "Liste oluşturuldu." };
        } catch (error) {
            console.error("Create list error:", error);
            return { success: false, error: "Liste oluşturulurken bir hata oluştu." };
        }
    }

    // Delete a Favorite List
    export async function deleteFavoriteList(listId: string) {
        const session = await getSession();
        if (!session) return { success: false, error: "Oturum açmanız gerekiyor." };

        try {
            await prisma.favoriteList.delete({
                where: {
                    id: listId,
                    userId: session.id // Ensure ownership
                }
            });
            revalidatePath("/dashboard/favorites");
            return { success: true, message: "Liste silindi." };
        } catch (error) {
            console.error("Delete list error:", error);
            return { success: false, error: "Liste silinemedi." };
        }
    }

    // Get User Favorites (Grouped or specific list)
    export async function getUserFavorites(listId?: string) {
        const session = await getSession();
        if (!session) return { success: false, error: "Oturum açmanız gerekiyor." };

        try {
            if (listId) {
                // Get favorites for specific list
                const favorites = await prisma.favorite.findMany({
                    where: {
                        userId: session.id,
                        favoriteListId: listId
                    },
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
            } else {
                // Get all favorites (including those in lists and general)
                // Or maybe just "General" ones? 
                // Usually "All Favorites" view shows everything.
                // But if we want "General" tab, we filter by favoriteListId: null

                // Let's return ALL for now, frontend can filter or we can add a mode.
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
                        },
                        favoriteList: true
                    },
                    orderBy: { createdAt: 'desc' }
                });
                return { success: true, data: favorites };
            }
        } catch (error) {
            console.error("Get favorites error:", error);
            return { success: false, error: "Favoriler getirilemedi." };
        }
    }

    // Get User's Favorite Lists
    export async function getUserFavoriteLists() {
        const session = await getSession();
        if (!session) return { success: false, error: "Oturum açmanız gerekiyor." };

        try {
            const lists = await prisma.favoriteList.findMany({
                where: { userId: session.id },
                orderBy: { createdAt: 'desc' },
                include: {
                    _count: {
                        select: { favorites: true }
                    }
                }
            });
            return { success: true, data: lists };
        } catch (error) {
            console.error("Get lists error:", error);
            return { success: false, error: "Listeler getirilemedi." };
        }
    }
