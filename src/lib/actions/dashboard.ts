'use server'

import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function getUserStats() {
    const session = await getSession();

    if (!session) {
        return { success: false, error: 'Not authenticated' };
    }

    try {
        const [activeListingsCount, totalViewsResult, totalFavoritesResult] = await Promise.all([
            prisma.listing.count({
                where: { userId: session.id, isActive: true }
            }),
            prisma.listing.aggregate({
                where: { userId: session.id },
                _sum: { views: true }
            }),
            prisma.listing.findMany({
                where: { userId: session.id },
                select: { _count: { select: { favorites: true } } }
            })
        ]);

        const totalViews = totalViewsResult._sum.views || 0;
        const totalFavorites = totalFavoritesResult.reduce((acc: number, curr: { _count: { favorites: number } }) => acc + curr._count.favorites, 0);

        return {
            success: true,
            data: {
                activeListingsCount,
                totalViews,
                totalFavorites,
                isCorporate: session.role === "CORPORATE_GALLERY" || session.role === "CORPORATE_DEALER",
                isPending: session.status === "PENDING"
            }
        };
    } catch (error) {
        console.error('getUserStats error:', error);
        return { success: false, error: 'Failed to fetch stats' };
    }
}

export async function getUserListings() {
    const session = await getSession();

    if (!session) {
        return { success: false, error: 'Not authenticated' };
    }

    try {
        const listings = await prisma.listing.findMany({
            where: { userId: session.id },
            orderBy: { createdAt: 'desc' },
            include: {
                images: {
                    where: { isCover: true },
                    take: 1
                }
            }
        });

        return { success: true, data: listings };
    } catch (error) {
        console.error('getUserListings error:', error);
        return { success: false, error: 'Failed to fetch listings' };
    }
}
