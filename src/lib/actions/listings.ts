'use server'

import prisma from '@/lib/prisma'
import { Prisma } from '@prisma/client'
minYear ?: number
maxYear ?: number
minKm ?: number
maxKm ?: number
brand ?: string
model ?: string
// Legacy filters (already mapped in DB)
fuel ?: string
gear ?: string  // transmission
caseType ?: string  // body type
// New filters
fuelType ?: string
transmission ?: string
driveType ?: string
bodyType ?: string
minHp ?: number
maxHp ?: number
minCc ?: number
maxCc ?: number
color ?: string
condition ?: string
exchange ?: string
tramerRecord ?: string
sortBy ?: 'createdAt' | 'price' | 'km' | 'year'
sortOrder ?: 'asc' | 'desc'
damageStatus ?: 'hasarsiz' | 'degisen' | 'boyali'
}) {
    try {
        const {
            categoryId,
            limit = 20,
            offset = 0,
            search,
            minPrice,
            maxPrice,
            minYear,
            maxYear,
            minKm,
            maxKm,
            brand,
            model,
            fuel,
            gear,
            caseType,
            fuelType,
            transmission,
            driveType,
            bodyType,
            minHp,
            maxHp,
            minCc,
            maxCc,
            color,
            condition,
            exchange,
            tramerRecord,
            sortBy = 'createdAt',
            sortOrder = 'desc',
            damageStatus
        } = params || {}

        // If categoryId is provided, get all descendant category IDs for recursive filtering
        let categoryIds: string[] | undefined;
        if (categoryId) {
            try {
                categoryIds = await getAllChildCategoryIds(categoryId);
            } catch (err) {
                console.error('Error fetching category children:', err);
                categoryIds = [categoryId];
            }
        }

        const where: Prisma.ListingWhereInput = {
            ...(categoryIds ? { categoryId: { in: categoryIds } } : {}),
            ...(search && {
                OR: [
                    { title: { contains: search, mode: 'insensitive' } },
                    { description: { contains: search, mode: 'insensitive' } },
                    { brand: { contains: search, mode: 'insensitive' } },
                    { model: { contains: search, mode: 'insensitive' } },
                ]
            }),
            // Price & Basic Filters
            ...(minPrice !== undefined && { price: { gte: minPrice } }),
            ...(maxPrice !== undefined && { price: { lte: maxPrice } }),
            ...(minYear !== undefined && { year: { gte: minYear } }),
            ...(maxYear !== undefined && { year: { lte: maxYear } }),
            ...(minKm !== undefined && { km: { gte: minKm } }),
            ...(maxKm !== undefined && { km: { lte: maxKm } }),

            // Brand & Model
            ...(brand && { brand: { equals: brand, mode: 'insensitive' } }),
            ...(model && { model: { equals: model, mode: 'insensitive' } }),

            // Technical Filters (support both legacy field names and new ones)
            ...((fuel || fuelType) && { fuel: { equals: fuel || fuelType, mode: 'insensitive' } }),
            ...((gear || transmission) && { gear: { equals: gear || transmission, mode: 'insensitive' } }),
            ...((caseType || bodyType) && { caseType: { equals: caseType || bodyType, mode: 'insensitive' } }),

            // Color
            ...(color && { color: { equals: color, mode: 'insensitive' } }),

            // Exchange (boolean conversion)
            ...(exchange === 'yes' && { exchange: true }),
            ...(exchange === 'no' && { exchange: false }),

            // Tramer Record (string match)
            ...(tramerRecord && { tramer: { not: null } }),

            // Damage Status
            ...(damageStatus === 'hasarsiz' && {
                damage: {
                    none: {
                        status: { in: ['Changed', 'Painted', 'Local Paint'] }
                    }
                }
            }),
            ...(damageStatus === 'degisen' && {
                damage: {
                    some: {
                        status: 'Changed'
                    }
                }
            }),
            ...(damageStatus === 'boyali' && {
                damage: {
                    some: {
                        status: { in: ['Painted', 'Local Paint'] }
                    }
                }
            }),
        }

        // Direct Prisma call instead of cached
        const [listings, total] = await Promise.all([
            prisma.listing.findMany({
                where,
                include: {
                    images: { orderBy: { order: 'asc' } },
                    category: true,
                    equipment: { include: { equipment: true } },
                    damage: true,
                    user: { select: { id: true, name: true, email: true } }
                },
                orderBy: { [sortBy]: sortOrder },
                take: limit,
                skip: offset,
            }),
            prisma.listing.count({ where })
        ]);

        return {
            success: true,
            data: listings,
            total,
            hasMore: offset + limit < total
        }
    } catch (error) {
        console.error('Error fetching listings:', error)
        return {
            success: false,
            error: 'Failed to fetch listings'
        }
    }
}

// Cached listing query for subcategories (e.g., Vasıta > Otomobil)
// Revalidates every 24 hours for performance
// Cached listing query for subcategories (e.g., Vasıta > Otomobil)
// Revalidates every 24 hours for performance
const getCachedSubcategoryListings = unstable_cache(
    async (categoryId: string, page: number = 1, limit: number = 20) => {
        const offset = (page - 1) * limit;

        // Get all descendant category IDs for recursive filtering
        let categoryIds: string[] = [categoryId];
        try {
            const childrenIds = await getAllChildCategoryIds(categoryId);
            if (childrenIds && childrenIds.length > 0) {
                categoryIds = childrenIds;
            }
        } catch (err) {
            console.error('Error fetching category children for cache:', err);
        }

        const [listings, totalCount] = await Promise.all([
            prisma.listing.findMany({
                where: { categoryId: { in: categoryIds } },
                take: limit,
                skip: offset,
                orderBy: { createdAt: 'desc' },
                include: {
                    images: {
                        take: 1,
                        orderBy: { order: 'asc' },
                        select: { url: true, id: true }
                    },
                    category: {
                        select: { id: true, name: true, slug: true }
                    },
                    user: {
                        select: { name: true }
                    }
                }
            }),
            prisma.listing.count({
                where: { categoryId: { in: categoryIds } }
            })
        ]);

        return { listings, totalCount };
    },
    ['subcategory-listings-v1'],
    { revalidate: 86400, tags: ['listings'] } // 24 hours cache
);


export async function getCachedListingsByCategory(
    categoryId: string,
    page: number = 1,
    limit: number = 20
) {
    try {
        const { listings, totalCount } = await getCachedSubcategoryListings(categoryId, page, limit);

        return {
            success: true,
            data: listings,
            pagination: {
                page,
                limit,
                totalCount,
                totalPages: Math.ceil(totalCount / limit)
            }
        };
    } catch (error) {
        console.error('Error fetching cached listings:', error);
        return {
            success: false,
            error: 'Failed to fetch listings'
        };
    }
}

/**
 * Hybrid fetching strategy:
 * - If 'model' is present: Use Real-time DB (getListings)
 * - If 'model' is missing: Use Cached DB (getCachedListingsByCategory)
 * 
 * Note: For now, we'll use getListings directly for filtered queries even without model,
 * because getCachedListingsByCategory doesn't support filters yet.
 * We will only use cache for pure category navigation (no filters).
 */
export async function getHybridListings(params: {
    categoryId: string,
    page?: number,
    limit?: number,
    [key: string]: any
}): Promise<{
    success: boolean;
    data?: any[];
    pagination?: {
        page: number;
        limit: number;
        totalCount: number;
        totalPages: number;
    };
    error?: string;
}> {
    const { categoryId, page = 1, limit = 20, ...filters } = params;

    // Check if there are any active filters other than pagination
    const hasFilters = Object.keys(filters).length > 0;

    // If there are filters (brand, model, price, etc.), use real-time search
    if (hasFilters) {
        // Map page/limit to offset/limit for getListings
        const result = await getListings({
            categoryId,
            limit,
            offset: (page - 1) * limit,
            ...filters
        });

        // Normalize response to match cached structure
        if (result.success) {
            return {
                success: true,
                data: result.data,
                pagination: {
                    page,
                    limit,
                    totalCount: result.total || 0,
                    totalPages: Math.ceil((result.total || 0) / limit)
                }
            };
        }
        return {
            success: false,
            error: result.error
        };
    }

    // If no filters (pure category view), use cache
    return await getCachedListingsByCategory(categoryId, page, limit);
}


export async function getListingById(id: string) {
    try {
        const listing = await prisma.listing.findUnique({
            where: { id },
            include: {
                images: {
                    orderBy: { order: 'asc' }
                },
                category: true,
                equipment: {
                    include: {
                        equipment: true
                    }
                },
                damage: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                    }
                }
            }
        })

        if (!listing) {
            return {
                success: false,
                error: 'Listing not found'
            }
        }

        // Increment view count
        await prisma.listing.update({
            where: { id },
            data: { views: { increment: 1 } }
        })

        return {
            success: true,
            data: listing
        }
    } catch (error) {
        console.error('Error fetching listing:', error)
        return {
            success: false,
            error: 'Failed to fetch listing'
        }
    }
}

export async function createListing(data: {
    // Basic Info
    title: string
    description: string
    price: number

    // Category
    categoryId: string

    // Vehicle Info (optional)
    brand?: string
    model?: string
    year?: number
    km?: number
    color?: string
    fuel?: string
    gear?: string
    caseType?: string
    version?: string
    package?: string

    // Additional
    warranty?: boolean
    exchange?: boolean
    tramer?: string
    city?: string
    district?: string
    neighborhood?: string

    // Emlak Specific
    sqm?: number
    sqmGross?: number
    rooms?: string
    floor?: string
    totalFloors?: number
    heating?: string
    buildingAge?: string
    furnished?: boolean
    deedStatus?: string
    usageStatus?: string
    monthlyDues?: number
    creditSuitable?: boolean
    bathroomCount?: number
    balcony?: boolean
    elevator?: boolean
    parking?: boolean
    inComplex?: boolean

    // Images (URLs from Supabase Storage)
    images?: { url: string; order: number }[]

    // Equipment
    equipmentIds?: string[]

    // Damage Reports
    damageReports?: { part: string; status: string; description?: string }[]
}) {
    try {
        // Get user ID from session
        const cookieStore = await cookies()
        const sessionCookie = cookieStore.get('session')

        if (!sessionCookie) {
            return {
                success: false,
                error: 'Unauthorized: Please log in to create a listing'
            }
        }

        const session = await decrypt(sessionCookie.value)
        if (!session || !session.userId) {
            return {
                success: false,
                error: 'Invalid session'
            }
        }

        const userId = session.userId as string

        const listing = await prisma.listing.create({
            data: {
                title: data.title,
                description: data.description,
                price: data.price,
                categoryId: data.categoryId,
                userId,
                brand: data.brand,
                model: data.model,
                year: data.year,
                km: data.km,
                color: data.color,
                fuel: data.fuel,
                gear: data.gear,
                caseType: data.caseType,
                version: data.version,
                package: data.package,
                warranty: data.warranty,
                exchange: data.exchange,
                tramer: data.tramer,
                city: data.city,
                district: data.district,
                neighborhood: data.neighborhood,

                // Emlak Fields
                sqm: data.sqm,
                sqmGross: data.sqmGross,
                rooms: data.rooms,
                floor: data.floor,
                totalFloors: data.totalFloors,
                heating: data.heating,
                buildingAge: data.buildingAge,
                furnished: data.furnished,
                deedStatus: data.deedStatus,
                usageStatus: data.usageStatus,
                monthlyDues: data.monthlyDues,
                creditSuitable: data.creditSuitable,
                bathroomCount: data.bathroomCount,
                balcony: data.balcony,
                elevator: data.elevator,
                parking: data.parking,
                inComplex: data.inComplex,

                // Approval System
                status: 'PENDING',
                isActive: false,

                // Images
                images: data.images ? {
                    createMany: {
                        data: data.images.map((img, index) => ({
                            url: img.url,
                            order: img.order ?? index,
                            isCover: index === 0
                        }))
                    }
                } : undefined,
                equipment: data.equipmentIds ? {
                    createMany: {
                        data: data.equipmentIds.map(eqId => ({
                            equipmentId: eqId
                        }))
                    }
                } : undefined,
                damage: data.damageReports ? {
                    createMany: {
                        data: data.damageReports
                    }
                } : undefined
            },
            include: {
                images: true,
                category: true,
                equipment: {
                    include: {
                        equipment: true
                    }
                },
                damage: true
            }
        })

        return {
            success: true,
            data: listing,
            message: '✅ İlanınız alındı! Yönetici onayından sonra 12 saat içinde yayına alınacaktır.'
        }
    } catch (error) {
        console.error('Error creating listing:', error)
        return {
            success: false,
            error: 'Failed to create listing'
        }
    }
}

export async function updateListing(id: string, data: Partial<{
    title: string
    description: string
    price: number
    isPremium: boolean
}>) {
    try {
        const listing = await prisma.listing.update({
            where: { id },
            data,
            include: {
                images: true,
                category: true,
                equipment: {
                    include: {
                        equipment: true
                    }
                },
                damage: true
            }
        })

        return {
            success: true,
            data: listing
        }
    } catch (error) {
        console.error('Error updating listing:', error)
        return {
            success: false,
            error: 'Failed to update listing'
        }
    }
}

export async function deleteListing(id: string) {
    try {
        await prisma.listing.delete({
            where: { id }
        })

        return {
            success: true
        }
    } catch (error) {
        console.error('Error deleting listing:', error)
        return {
            success: false,
            error: 'Failed to delete listing'
        }
    }
}
