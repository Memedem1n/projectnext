'use server'

import { cookies } from 'next/headers'
import { decrypt } from '@/lib/auth-edge'
import { prisma } from '@/lib/prisma'

export async function getCurrentUser() {
    try {
        const cookieStore = await cookies()
        const sessionCookie = cookieStore.get('session')

        if (!sessionCookie) return null

        const session = await decrypt(sessionCookie.value)
        if (!session?.id) return null

        const user = await prisma.user.findUnique({
            where: { id: session.id as string },
            select: {
                id: true,
                role: true,
                name: true,
                email: true,
                phone: true
            }
        })

        return user
    } catch (error) {
        console.error('Error getting current user:', error)
        return null
    }
}

export async function getUserFavorites() {
    try {
        const user = await getCurrentUser();
        if (!user) return { success: false, error: "Unauthorized" };

        const favorites = await prisma.favorite.findMany({
            where: { userId: user.id },
            include: {
                listing: {
                    include: {
                        images: { orderBy: { order: 'asc' }, take: 1 },
                        category: true,
                        equipment: { include: { equipment: true } },
                        damage: true,
                        user: { select: { id: true, name: true, email: true, phone: true, avatar: true, createdAt: true, role: true } }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return { success: true, data: favorites.map(f => f.listing) };
    } catch (error) {
        console.error('Error getting user favorites:', error);
        return { success: false, error: "Failed to fetch favorites" };
    }
}

export async function toggleFavorite(listingId: string) {
    try {
        const user = await getCurrentUser();
        if (!user) return { success: false, error: "Unauthorized" };

        const existing = await prisma.favorite.findFirst({
            where: {
                userId: user.id,
                listingId
            }
        });

        if (existing) {
            await prisma.favorite.delete({
                where: { id: existing.id }
            });
            return { success: true, isFavorite: false };
        } else {
            await prisma.favorite.create({
                data: {
                    userId: user.id,
                    listingId
                }
            });
            return { success: true, isFavorite: true };
        }
    } catch (error) {
        console.error('Error toggling favorite:', error);
        return { success: false, error: "Failed to toggle favorite" };
    }
}

export async function getUserListings() {
    try {
        const user = await getCurrentUser();
        if (!user) return { success: false, error: "Unauthorized" };

        const listings = await prisma.listing.findMany({
            where: { userId: user.id },
            include: {
                images: { orderBy: { order: 'asc' }, take: 1 },
                category: true,
                equipment: { include: { equipment: true } },
                damage: true,
                user: { select: { id: true, name: true, email: true, phone: true, avatar: true, createdAt: true, role: true } }
            },
            orderBy: { createdAt: 'desc' }
        });

        return { success: true, data: listings };
    } catch (error) {
        console.error('Error getting user listings:', error);
        return { success: false, error: "Failed to fetch listings" };
    }
}

export async function deleteUserListing(listingId: string) {
    try {
        const user = await getCurrentUser();
        if (!user) return { success: false, error: "Unauthorized" };

        const listing = await prisma.listing.findFirst({
            where: {
                id: listingId,
                userId: user.id
            }
        });

        if (!listing) {
            return { success: false, error: "Listing not found or unauthorized" };
        }

        await prisma.listing.delete({
            where: { id: listingId }
        });

        return { success: true };
    } catch (error) {
        console.error('Error deleting listing:', error);
        return { success: false, error: "Failed to delete listing" };
    }
}

export async function updateUserProfile(data: { name?: string; phone?: string }) {
    try {
        const user = await getCurrentUser();
        if (!user) return { success: false, error: "Unauthorized" };

        await prisma.user.update({
            where: { id: user.id },
            data: {
                ...(data.name && { name: data.name }),
                ...(data.phone && { phone: data.phone })
            }
        });

        return { success: true };
    } catch (error) {
        console.error('Error updating profile:', error);
        return { success: false, error: "Failed to update profile" };
    }
}
