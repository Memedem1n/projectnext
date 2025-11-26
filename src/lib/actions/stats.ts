'use server';

import { prisma } from "@/lib/prisma";
import { unstable_cache } from 'next/cache';

/**
 * Generate random stats - cached for 24 hours
 * This creates realistic demo data that changes daily
 */
const generateDailyStats = unstable_cache(
    async () => {
        // Generate consistent random values based on date seed
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        const seed = today.split('-').reduce((acc, val) => acc + parseInt(val), 0);

        // Seeded random number generator
        const seededRandom = (min: number, max: number, offset: number = 0) => {
            const x = Math.sin(seed + offset) * 10000;
            const rand = x - Math.floor(x);
            return Math.floor(rand * (max - min + 1)) + min;
        };

        return {
            activeUsers: seededRandom(2500, 4500, 1),
            totalListings: seededRandom(45000, 65000, 2),
            newListingsToday: seededRandom(150, 350, 3),
            soldToday: seededRandom(50, 150, 4)
        };
    },
    ['daily-stats-v1'],
    { revalidate: 86400, tags: ['site-stats'] }
);

/**
 * Get cached site-wide statistics
 * Returns instantly - no aggregation needed
 */
export async function getSiteStats() {
    try {
        const stats = await generateDailyStats();
        return { success: true, data: stats };
    } catch (error) {
        console.error("getSiteStats error:", error);
        return {
            success: false,
            error: "Failed to fetch stats",
            data: {
                activeUsers: 0,
                totalListings: 0,
                newListingsToday: 0,
                soldToday: 0
            }
        };
    }
}

/**
 * Get category statistics (cached)
 */
export async function getCategoryStats(categoryId?: string) {
    try {
        if (categoryId) {
            const stats = await prisma.categoryStats.findUnique({
                where: { categoryId },
                include: { category: true }
            });
            return { success: true, data: stats };
        }

        // Get all category stats
        const allStats = await prisma.categoryStats.findMany({
            include: { category: true },
            orderBy: { listingCount: 'desc' }
        });
        return { success: true, data: allStats };
    } catch (error) {
        console.error("getCategoryStats error:", error);
        return { success: false, error: "Failed to fetch category stats" };
    }
}

/**
 * ADMIN ONLY: Recompute all statistics
 * This is expensive - should run via cron or admin panel
 */
export async function recomputeStats() {
    try {
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        // 1. Total listings (active only)
        const totalListings = await prisma.listing.count({
            where: { isActive: true }
        });

        // 2. New listings today
        const newListingsToday = await prisma.listing.count({
            where: {
                isActive: true,
                createdAt: { gte: startOfToday }
            }
        });

        // 3. Sold today (placeholder until sold status is implemented)
        // For now, we'll assume 0 or use a mock logic if needed
        const soldToday = 0;

        // 4. Active users (placeholder until session tracking is implemented)
        // For now, we'll use a random number around the previous mock value or 0
        // Let's keep it 0 for now to be accurate to "database data"
        const activeUsers = 0;

        // Update site stats
        await prisma.siteStats.upsert({
            where: { id: "singleton" },
            create: {
                id: "singleton",
                activeUsers,
                totalListings,
                newListingsToday,
                soldToday,
                lastUpdated: now
            },
            update: {
                activeUsers,
                totalListings,
                newListingsToday,
                soldToday,
                lastUpdated: now
            }
        });

        // 5. Category stats
        const categories = await prisma.category.findMany();

        for (const category of categories) {
            const listingCount = await prisma.listing.count({
                where: {
                    categoryId: category.id,
                    isActive: true
                }
            });

            await prisma.categoryStats.upsert({
                where: { categoryId: category.id },
                create: {
                    categoryId: category.id,
                    listingCount,
                    lastUpdated: now
                },
                update: {
                    listingCount,
                    lastUpdated: now
                }
            });
        }

        return { success: true, message: "Stats recomputed successfully" };
    } catch (error) {
        console.error("recomputeStats error:", error);
        return { success: false, error: "Failed to recompute stats" };
    }
}
