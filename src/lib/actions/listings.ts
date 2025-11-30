'use server'

import prisma from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { Listing, Image, Category, ListingEquipment, Equipment, DamageReport } from '@prisma/client'
import { unstable_cache, revalidateTag, revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { decrypt } from '@/lib/auth-edge'

import { getAllChildCategoryIds } from './categories'

export type ListingWithRelations = Listing & {
    images: Image[]
    category: Category
    equipment: (ListingEquipment & { equipment: Equipment })[]
    damage: DamageReport[]
    user: {
        id: string
        name: string | null
        email: string
        phone: string | null
        avatar: string | null
        createdAt: Date
    }
}

export async function getListings(params?: {
    categoryId?: string
    limit?: number
    offset?: number
    search?: string
    minPrice?: number
    maxPrice?: number
    minYear?: number
    maxYear?: number
    minKm?: number
    maxKm?: number
    brand?: string
    model?: string
    // Legacy filters (already mapped in DB)
    fuel?: string
    gear?: string  // transmission
    caseType?: string  // body type
    // New filters
    fuelType?: string
    transmission?: string
    driveType?: string
    bodyType?: string
    minHp?: number
    maxHp?: number
    minCc?: number
    maxCc?: number
    color?: string
    condition?: string
    exchange?: string
    tramerRecord?: string
    sortBy?: 'createdAt' | 'price' | 'km' | 'year'
    sortOrder?: 'asc' | 'desc'
    damageStatus?: 'hasarsiz' | 'degisen' | 'boyali'
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
            status: 'ACTIVE',
            isActive: true,
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
                    user: { select: { id: true, name: true, email: true, phone: true, avatar: true, createdAt: true } }
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
                        select: { name: true, slug: true }
                    },
                    user: {
                        select: { name: true, id: true }
                    }
                }
            }),
            prisma.listing.count({ where: { categoryId: { in: categoryIds } } })
        ]);

        return { listings, totalCount };
    },
    ['subcategory-listings'],
    { revalidate: 86400, tags: ['listings'] }
);

export async function getListingsByCategory(categoryId: string, page: number = 1) {
    try {
        const { listings, totalCount } = await getCachedSubcategoryListings(categoryId, page);

        return {
            success: true,
            data: listings,
            total: totalCount,
            page,
            totalPages: Math.ceil(totalCount / 20)
        }
    } catch (error) {
        console.error('Error fetching listings by category:', error)
        return {
            success: false,
            error: 'Failed to fetch listings'
        }
    }
}

export async function getListingById(id: string) {
    try {
        const listing = await prisma.listing.findUnique({
            where: { id },
            include: {
                images: {
                    orderBy: {
                        order: 'asc'
                    }
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
                        avatar: true,
                        createdAt: true
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
            data: {
                views: {
                    increment: 1
                }
            }
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

export async function checkFreeListingEligibility(categoryId: string) {
    try {
        const cookieStore = await cookies()
        const sessionCookie = cookieStore.get('session')

        if (!sessionCookie) return { eligible: false }

        const session = await decrypt(sessionCookie.value)
        const userId = session?.id as string

        if (!userId) return { eligible: false }

        // Check listings in the last year for this category
        const oneYearAgo = new Date()
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)

        const count = await prisma.listing.count({
            where: {
                userId: userId,
                categoryId: categoryId,
                createdAt: { gte: oneYearAgo },
                // Exclude deleted or rejected listings from the count?
                // Usually "used right" implies published listings.
                status: { notIn: ['REJECTED', 'DELETED'] }
            }
        })

        console.log(`[Eligibility Check] User: ${userId}, Category: ${categoryId}, Count: ${count}`);

        return { eligible: count === 0 }
    } catch (error) {
        console.error('Error checking eligibility:', error)
        return { eligible: false }
    }
}

export async function createListing(data: any) {
    console.log('[DEBUG] createListing received data:', JSON.stringify(data, null, 2));
    try {
        const cookieStore = await cookies()
        const sessionCookie = cookieStore.get('session')

        if (!sessionCookie) {
            return {
                success: false,
                error: 'Unauthorized'
            }
        }

        const session = await decrypt(sessionCookie.value)
        console.log('[DEBUG] createListing session:', JSON.stringify(session, null, 2))
        const userId = session?.id as string

        if (!userId) {
            return {
                success: false,
                error: 'Unauthorized'
            }
        }

        // Create listing with relations
        const listing = await prisma.listing.create({
            data: {
                title: data.title,
                description: data.description,
                price: parseInt(data.price),
                categoryId: data.categoryId,
                userId: userId,
                status: 'PENDING', // Default status
                isActive: false,   // Default active state

                // New Fields
                expertReports: (() => {
                    const reports = data.expertReports || [];
                    if (reports.length > 10) {
                        throw new Error('En fazla 10 adet ekspertiz raporu yüklenebilir.');
                    }
                    return reports;
                })(),
                contactPreference: data.contactPreference || "both",

                // Vehicle Details
                brand: data.brand,
                model: data.model,
                year: data.year ? parseInt(data.year) : null,
                km: data.km ? parseInt(data.km) : null,
                color: data.color,
                fuel: data.fuel,
                gear: data.gear,
                caseType: data.caseType,
                version: data.version,
                package: data.package,

                // Status
                warranty: data.warranty || false,
                exchange: data.exchange || false,
                tramer: data.tramer,

                // Location
                city: data.city,
                district: data.district,

                // Relations
                images: {
                    create: data.images.map((img: any, index: number) => ({
                        url: img.url,
                        order: img.order ?? index,
                        isCover: (img.order ?? index) === 0
                    }))
                },

                // Equipment
                equipment: {
                    create: data.equipmentIds?.map((equipmentId: string) => ({
                        equipment: {
                            connect: { id: equipmentId }
                        }
                    })) || []
                },

                // Damage Report
                damage: {
                    create: data.damageReports?.map((item: any) => ({
                        part: item.part,
                        status: item.status,
                        description: item.description
                    })) || []
                }
            }
        })

        revalidateTag('listings')
        revalidatePath('/category', 'page')

        return {
            success: true,
            data: listing
        }
    } catch (error: any) {
        console.error('Error creating listing:', error)
        return {
            success: false,
            error: error.message || 'Failed to create listing'
        }

    }
}

export async function updateListing(id: string, data: any) {
    try {
        const cookieStore = await cookies()
        const sessionCookie = cookieStore.get('session')

        if (!sessionCookie) {
            return {
                success: false,
                error: 'Unauthorized'
            }
        }

        const session = await decrypt(sessionCookie.value)
        const userId = session?.id as string

        if (!userId) {
            return {
                success: false,
                error: 'Unauthorized'
            }
        }

        // Check ownership
        const existingListing = await prisma.listing.findUnique({
            where: { id },
            select: { userId: true }
        })

        if (!existingListing) {
            return {
                success: false,
                error: 'Listing not found'
            }
        }

        if (existingListing.userId !== userId) {
            return {
                success: false,
                error: 'Unauthorized'
            }
        }

        // Prepare Damage Report updates
        // First delete existing reports, then create new ones (simplest approach for full update)
        // Or we can use deleteMany and create

        // Transaction might be better but for now let's do sequential operations or nested update

        // 1. Upload Listing Images (Handled in frontend, we get URLs here)
        // data.images is array of { url, order, isCover }

        // Update listing
        const listing = await prisma.listing.update({
            where: { id },
            data: {
                title: data.title,
                description: data.description,
                price: parseInt(data.price),
                categoryId: data.categoryId,

                // Reset status to PENDING for re-approval
                status: 'PENDING',
                isActive: false,
                rejectionReason: null, // Clear any previous rejection

                // Vehicle Details
                brand: data.brand,
                model: data.model,
                year: data.year ? parseInt(data.year) : null,
                km: data.km ? parseInt(data.km) : null,
                color: data.color,
                fuel: data.fuel,
                gear: data.gear,
                caseType: data.caseType,
                version: data.version,
                package: data.package,

                // Status
                warranty: data.warranty || false,
                exchange: data.exchange || false,
                tramer: data.tramer,

                // Location
                city: data.city,
                district: data.district,

                // New Fields
                expertReports: (() => {
                    const reports = data.expertReports || [];
                    if (reports.length > 10) {
                        throw new Error('En fazla 10 adet ekspertiz raporu yüklenebilir.');
                    }
                    return reports;
                })(),
                contactPreference: data.contactPreference || "both",
                listingPackage: data.listingPackage,

                // Relations - Images
                // Delete all existing images and recreate (simplest for reordering)
                images: {
                    deleteMany: {},
                    create: data.images.map((img: any, index: number) => ({
                        url: img.url,
                        order: img.order ?? index,
                        isCover: (img.order ?? index) === 0
                    }))
                },

                // Equipment
                equipment: {
                    deleteMany: {},
                    create: data.equipmentIds?.map((equipmentId: string) => ({
                        equipment: {
                            connect: { id: equipmentId }
                        }
                    })) || []
                },

                // Damage Report
                damage: {
                    deleteMany: {},
                    create: data.damageReports?.map((item: any) => ({
                        part: item.part,
                        status: item.status,
                        description: item.description
                    })) || []
                }
            }
        })

        revalidateTag('listings')
        revalidatePath('/category', 'page')

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
        const cookieStore = await cookies()
        const sessionCookie = cookieStore.get('session')

        if (!sessionCookie) {
            return {
                success: false,
                error: 'Unauthorized'
            }
        }

        const session = await decrypt(sessionCookie.value)
        const userId = session?.id as string

        if (!userId) {
            return {
                success: false,
                error: 'Unauthorized'
            }
        }

        // Check if listing exists and belongs to user
        const listing = await prisma.listing.findUnique({
            where: { id },
            select: { userId: true }
        })

        if (!listing) {
            return {
                success: false,
                error: 'Listing not found'
            }
        }

        // Allow admin or owner to delete
        // For now, we only check ownership as we don't have role in session yet
        if (listing.userId !== userId) {
            return {
                success: false,
                error: 'Unauthorized'
            }
        }

        await prisma.listing.delete({
            where: { id }
        })

        revalidateTag('listings')
        revalidatePath('/category', 'page')

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

export async function getHybridListings(params: any) {
    const { page = 1, limit = 20, ...rest } = params;
    const offset = (page - 1) * limit;
    const result = await getListings({ ...rest, limit, offset });

    return {
        ...result,
        pagination: {
            page: Number(page),
            totalPages: Math.ceil((result.total || 0) / limit),
            totalItems: result.total || 0
        }
    };
}
