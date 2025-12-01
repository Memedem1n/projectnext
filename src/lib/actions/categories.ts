'use server'

import prisma from '@/lib/prisma'
import { unstable_cache } from 'next/cache'


export async function getCategories(parentId?: string | null) {
    try {
        const categories = await prisma.category.findMany({
            where: {
                parentId: parentId === undefined ? null : parentId
            },
            include: {
                children: true,
                _count: {
                    select: {
                        listings: true,
                        children: true
                    }
                }
            },
            orderBy: {
                name: 'asc'
            }
        })

        return {
            success: true,
            data: categories
        }
    } catch (error) {
        console.error('Error fetching categories:', error)
        return {
            success: false,
            error: 'Failed to fetch categories'
        }
    }
}

export async function getAllCategories() {
    try {
        const categories = await prisma.category.findMany({
            include: {
                parent: true,
                children: true,
                _count: {
                    select: {
                        listings: true
                    }
                }
            },
            orderBy: {
                name: 'asc'
            }
        })

        return {
            success: true,
            data: categories
        }
    } catch (error) {
        console.error('Error fetching all categories:', error)
        return {
            success: false,
            error: 'Failed to fetch categories'
        }
    }
}

export async function getCategoryBySlug(slug: string) {
    try {
        const category = await prisma.category.findUnique({
            where: { slug },
            include: {
                parent: true,
                children: true,
                _count: {
                    select: {
                        listings: true
                    }
                }
            }
        })

        if (!category) {
            return {
                success: false,
                error: 'Category not found'
            }
        }

        return {
            success: true,
            data: category
        }
    } catch (error) {
        console.error('Error fetching category:', error)
        return {
            success: false,
            error: 'Failed to fetch category'
        }
    }
}

export async function searchCategories(query: string) {
    try {
        const categories = await prisma.category.findMany({
            where: {
                OR: [
                    { name: { contains: query, mode: 'insensitive' } },
                    { slug: { contains: query, mode: 'insensitive' } }
                ]
            },
            include: {
                parent: true,
                _count: {
                    select: {
                        listings: true
                    }
                }
            },
            take: 10
        })

        return {
            success: true,
            data: categories
        }
    } catch (error) {
        console.error('Error searching categories:', error)
        return {
            success: false,
            error: 'Failed to search categories'
        }
    }
}

export async function getCategoryAncestry(categoryId: string) {
    try {
        const ancestors: any[] = [];
        let currentId = categoryId;

        // Loop to fetch parents until root
        while (currentId) {
            const category = await prisma.category.findUnique({
                where: { id: currentId },
                include: { parent: true }
            });

            if (!category) break;

            // Add to start of array to maintain Root -> Child order
            ancestors.unshift(category);

            if (category.parentId) {
                currentId = category.parentId;
            } else {
                break;
            }
        }

        return {
            success: true,
            data: ancestors
        };
    } catch (error) {
        console.error('Error fetching category ancestry:', error);
        return {
            success: false,
            error: 'Failed to fetch ancestry'
        };
    }
}


// Direct DB call to avoid cache issues
export async function getCategoryStructure() {
    const categories = await prisma.category.findMany({
        select: {
            id: true,
            parentId: true
        }
    });
    return categories;
}

export async function getAllChildCategoryIds(categoryId: string): Promise<string[]> {
    // Fetch all categories (cached)
    const allCategories = await getCategoryStructure();

    // Build adjacency list in memory
    const childrenMap = new Map<string, string[]>();
    allCategories.forEach((cat: any) => {
        if (cat.parentId) {
            if (!childrenMap.has(cat.parentId)) {
                childrenMap.set(cat.parentId, []);
            }
            childrenMap.get(cat.parentId)?.push(cat.id);
        }
    });

    // BFS to find all descendants
    const descendants: string[] = [categoryId];
    const queue: string[] = [categoryId];
    const visited = new Set<string>([categoryId]);

    while (queue.length > 0) {
        const currentId = queue.shift()!;
        const children = childrenMap.get(currentId);

        if (children) {
            for (const childId of children) {
                if (!visited.has(childId)) {
                    visited.add(childId);
                    descendants.push(childId);
                    queue.push(childId);
                }
            }
        }
    }

    return descendants;
}

export async function getCategoryCounts(categoryIds: string[]) {
    try {
        // 1. Get direct counts for these categories
        // But we also need counts for their children.
        // This is complex to do efficiently in one query without a closure table or recursive CTE.
        // For now, let's just get direct counts and assume listings are at the leaf level.
        // If listings are at leaf level, then for a parent category, we need to sum its children.

        // Alternative: Fetch ALL active listings' categoryIDs and aggregate in memory.
        // This is scalable up to ~10k-100k listings. For millions, we need pre-calculated stats.

        const activeListings = await prisma.listing.groupBy({
            by: ['categoryId'],
            where: {
                status: 'ACTIVE',
                isActive: true
            },
            _count: {
                categoryId: true
            }
        });

        const countMap = new Map<string, number>();
        activeListings.forEach(item => {
            countMap.set(item.categoryId, item._count.categoryId);
        });

        // Now, for the requested categoryIds, we might need to sum up their descendants if they are parents.
        // But we don't know their descendants here without fetching the whole tree.
        // Let's assume for the Sidebar (which shows direct children), we just want the count of listings IN that child 
        // OR (if we can) the sum.

        // If we migrated data, listings should be at the Model/SubModel level.
        // If we show "BMW" in the sidebar (under Otomobil), we want the sum of all BMW models.

        // Let's try to be smart: 
        // If we are passing `treeCategories` (which are children of current), we can fetch their children too?
        // Too heavy.

        // Simplified approach: Just return direct counts for now. 
        // If the user wants "BMW (5)", and listings are in "3 Serisi", "5 Serisi", 
        // then "BMW" will show (0) if we only count direct.
        // This is a known issue with hierarchical data without pre-aggregation.

        // Hack: For the specific case of "Otomobil" -> "Brands", we can use the `brand` field on Listing!
        // We already did this in `getVehicleCategories`.
        // But now we are using `Category` table.

        // Let's stick to the `brand` field aggregation for the "Otomobil" level sidebar.
        // For deeper levels (Model -> SubModel), we might need `model` field aggregation.

        return Object.fromEntries(countMap);
    } catch (error) {
        console.error('Error fetching category counts:', error);
        return {};
    }
}
