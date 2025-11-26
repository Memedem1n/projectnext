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

const getCategoryBySlugCached = unstable_cache(
    async (slug: string) => {
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
        return category
    },
    ['category-by-slug-v2'],
    { revalidate: 600, tags: ['categories-v2'] } // 10 minutes cache
)

export async function getCategoryBySlug(slug: string) {
    try {
        const category = await getCategoryBySlugCached(slug)

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

const getCategoryAncestryLoop = unstable_cache(
    async (categoryId: string) => {
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

        return ancestors;
    },
    ['category-ancestry-v2'],
    { revalidate: 600, tags: ['categories-v2'] } // 10 minutes cache
)

export async function getCategoryAncestry(categoryId: string) {
    try {
        const ancestors = await getCategoryAncestryLoop(categoryId);

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

// Cache the entire category structure for efficient lookup
const getCategoryStructure = unstable_cache(
    async () => {
        const categories = await prisma.category.findMany({
            select: {
                id: true,
                parentId: true
            }
        });
        return categories;
    },
    ['all-categories-structure-v2'],
    { revalidate: 600, tags: ['categories-v2'] } // 10 minutes cache
);

export async function getAllChildCategoryIds(categoryId: string): Promise<string[]> {
    // Fetch all categories (cached)
    const allCategories = await getCategoryStructure();

    // Build adjacency list in memory
    const childrenMap = new Map<string, string[]>();
    allCategories.forEach(cat => {
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
