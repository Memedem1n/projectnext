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
        if (!query || query.trim().length < 2) {
            return { success: true, data: [] }
        }

        const normalizedQuery = query.trim()

        // Find categories matching the query
        const categories = await prisma.category.findMany({
            where: {
                name: {
                    contains: normalizedQuery,
                    mode: 'insensitive'
                }
            },
            include: {
                parent: {
                    include: {
                        parent: {
                            include: {
                                parent: {
                                    include: {
                                        parent: true
                                    }
                                }
                            }
                        }
                    }
                }
            },
            take: 10
        })

        // Format results with full path
        const results = categories.map(cat => {
            const path: string[] = []
            let current: any = cat

            // Build path from parent to child
            while (current) {
                path.unshift(current.name)
                current = current.parent
            }

            return {
                id: cat.id,
                title: cat.name,
                subtitle: path.join(' > '),
                url: `/category/${cat.slug}`,
                type: 'category'
            }
        })

        return {
            success: true,
            data: results
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

        return Object.fromEntries(countMap);
    } catch (error) {
        console.error('Error fetching category counts:', error);
        return {};
    }
}
