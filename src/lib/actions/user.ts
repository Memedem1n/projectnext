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
                        user: { select: { id: true, name: true, role: true } }
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
