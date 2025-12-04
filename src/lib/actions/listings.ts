
'use server'

import prisma from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { Listing, Image, Category, ListingEquipment, Equipment, DamageReport } from '@prisma/client'
import { unstable_cache, revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { decrypt } from '@/lib/auth-edge'
import { findEurotaxData } from "@/lib/eurotax"

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
    city?: string
    district?: string
    neighborhood?: string
    // Emlak Filters
    minSqm?: number
    maxSqm?: number
    minSqmGross?: number
    maxSqmGross?: number
    rooms?: string
    minFloor?: number
    maxFloor?: number
    totalFloors?: number
    buildingAge?: string
    heatingType?: string
    bathroomCount?: number
    furnished?: string // "true" | "false"
    hasBalcony?: string // "true" | "false"
    hasElevator?: string
    hasParking?: string
    creditSuitable?: string
    usageStatus?: string
    deedStatus?: string
    sellerType?: string
    listingDate?: string
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
            damageStatus,
            // Emlak
            minSqm, maxSqm,
            minSqmGross, maxSqmGross,
            rooms,
            minFloor, maxFloor,
            totalFloors,
            buildingAge,
            heatingType,
            bathroomCount,
            furnished,
            hasBalcony,
            hasElevator,
            hasParking,
            creditSuitable,
            usageStatus,
            deedStatus,
            sellerType,
            listingDate
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

        // Calculate date for listingDate filter
        let dateFilter: Date | undefined;
        if (listingDate) {
            const days = parseInt(listingDate);
            if (!isNaN(days)) {
                dateFilter = new Date();
                dateFilter.setDate(dateFilter.getDate() - days);
            }
        }

        // Parse numeric filters
        const parseNum = (val: any) => {
            if (typeof val === 'number') return val;
            if (typeof val === 'string' && val.trim() !== '') {
                const parsed = parseInt(val.replace(/\./g, '')); // Handle dots if any
                return isNaN(parsed) ? undefined : parsed;
            }
            return undefined;
        };

        const _minPrice = parseNum(minPrice);
        const _maxPrice = parseNum(maxPrice);
        const _minYear = parseNum(minYear);
        const _maxYear = parseNum(maxYear);
        const _minKm = parseNum(minKm);
        const _maxKm = parseNum(maxKm);
        const _minHp = parseNum(minHp);
        const _maxHp = parseNum(maxHp);
        const _minCc = parseNum(minCc);
        const _maxCc = parseNum(maxCc);

        // Emlak Numeric Filters
        const _minSqm = parseNum(minSqm);
        const _maxSqm = parseNum(maxSqm);
        const _minSqmGross = parseNum(minSqmGross);
        const _maxSqmGross = parseNum(maxSqmGross);
        const _minFloor = parseNum(minFloor);
        const _maxFloor = parseNum(maxFloor);
        const _totalFloors = parseNum(totalFloors);
        const _bathroomCount = parseNum(bathroomCount);

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
            ...(_minPrice !== undefined && { price: { gte: _minPrice } }),
            ...(_maxPrice !== undefined && { price: { lte: _maxPrice } }),
            ...(_minYear !== undefined && { year: { gte: _minYear } }),
            ...(_maxYear !== undefined && { year: { lte: _maxYear } }),
            ...(_minKm !== undefined && { km: { gte: _minKm } }),
            ...(_maxKm !== undefined && { km: { lte: _maxKm } }),

            // Brand & Model
            ...(brand && { brand: { equals: brand, mode: 'insensitive' } }),
            ...(model && { model: { equals: model, mode: 'insensitive' } }),

            // Technical Filters (support both legacy field names and new ones)
            ...((fuel || fuelType) && { fuel: { equals: fuel || fuelType, mode: 'insensitive' } }),
            ...((gear || transmission) && { gear: { equals: gear || transmission, mode: 'insensitive' } }),
            ...((caseType || bodyType) && { caseType: { equals: caseType || bodyType, mode: 'insensitive' } }),

            // Vehicle Specs
            ...(_minHp !== undefined && { motorPower: { gte: _minHp } }),
            ...(_maxHp !== undefined && { motorPower: { lte: _maxHp } }),
            ...(_minCc !== undefined && { engineVolume: { gte: _minCc } }),
            ...(_maxCc !== undefined && { engineVolume: { lte: _maxCc } }),
            ...(driveType && { traction: { equals: driveType, mode: 'insensitive' } }),

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

            // Location Filters
            ...(params?.city && { city: { equals: params.city, mode: 'insensitive' } }),
            ...(params?.district && { district: { equals: params.district, mode: 'insensitive' } }),
            ...(params?.neighborhood && { neighborhood: { equals: params.neighborhood, mode: 'insensitive' } }),

            // Emlak Filters
            ...(minSqm !== undefined && { sqmNet: { gte: minSqm } }),
            ...(maxSqm !== undefined && { sqmNet: { lte: maxSqm } }),
            ...(minSqmGross !== undefined && { sqmGross: { gte: minSqmGross } }),
            ...(maxSqmGross !== undefined && { sqmGross: { lte: maxSqmGross } }),
            ...(rooms && { rooms: { equals: rooms } }),
            ...(minFloor !== undefined && { floor: { gte: minFloor } }),
            ...(maxFloor !== undefined && { floor: { lte: maxFloor } }),
            ...(totalFloors !== undefined && { totalFloors: { equals: totalFloors } }),
            ...(buildingAge && { buildingAge: { equals: buildingAge } }),
            ...(heatingType && { heating: { equals: heatingType } }),
            ...(bathroomCount !== undefined && { bathrooms: { gte: bathroomCount } }),
            ...(furnished === 'true' && { furnished: true }),
            ...(creditSuitable === 'true' && { creditSuitable: true }),
            ...(usageStatus && { usingStatus: { equals: usageStatus } }),
            ...(deedStatus && { titleStatus: { equals: deedStatus } }),

            // Boolean Features (Equipment or Column)
            ...(hasBalcony === 'true' && { balcony: true }),
            // For others like Elevator, Parking, we use Equipment relation
            ...((hasElevator === 'true' || hasParking === 'true') && {
                equipment: {
                    some: {
                        equipment: {
                            name: {
                                in: [
                                    ...(hasElevator === 'true' ? ['Asansör'] : []),
                                    ...(hasParking === 'true' ? ['Otopark', 'Kapalı Otopark'] : [])
                                ]
                            }
                        }
                    }
                }
            }),

            // Seller Type
            ...(sellerType === 'Sahibinden' && { user: { role: 'INDIVIDUAL' } }),
            ...(sellerType === 'Emlak Ofisinden' && { user: { role: 'DEALER' } }),

            // Listing Date
            ...(dateFilter && { createdAt: { gte: dateFilter } }),
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

// ... (getCachedSubcategoryListings remains same)


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
    ['subcategory-listings-v2'],
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

        // Enrich with Eurotax data
        const eurotaxData = findEurotaxData({
            brand: listing.brand,
            year: listing.year,
            fuel: listing.fuel,
            gear: listing.gear,
            caseType: listing.caseType,
            model: listing.model
        });

        const enrichedListing = {
            ...listing,
            motorPower: eurotaxData?.["Motor Gücü"] || null,
            engineVolume: eurotaxData?.["Motor Hacmi"] || null,
            traction: eurotaxData?.["Alt Model"]?.includes("Quattro") || eurotaxData?.["Alt Model"]?.includes("4Matic") || eurotaxData?.["Alt Model"]?.includes("xDrive") ? "4x4" : "Önden Çekiş", // Simple inference
            series: eurotaxData?.path_8 || null,
            version: eurotaxData?.["Alt Model"] || null,
            eurotaxId: eurotaxData?.full_path || null
        };

        return {
            success: true,
            data: enrichedListing
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
                price: parseInt(data.price.toString().replace(/\./g, "")),
                categoryId: data.categoryId,
                userId: userId,
                status: 'PENDING', // Require approval
                isActive: false,   // Not active until approved
                publishedAt: null, // Will be set on approval
                expiresAt: (() => {
                    const days = data.listingPackage === 'premium' ? 90 : data.listingPackage === 'gold' ? 60 : 30;
                    return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
                })(),

                // New Fields
                expertReports: (() => {
                    const reports = data.expertReports || [];
                    if (reports.length > 10) {
                        throw new Error('En fazla 10 adet ekspertiz raporu yüklenebilir.');
                    }
                    return reports;
                })(),
                contactPreference: data.contactPreference || "both",
                listingPackage: data.listingPackage || "standard",
                isPremium: data.listingPackage === "premium", // Only Premium package gets isPremium flag for showcase

                // Vehicle Details
                brand: data.brand,
                model: data.model,
                year: data.year ? parseInt(data.year) : null,
                km: data.km ? parseInt(data.km.toString().replace(/\./g, "")) : null,
                color: data.color,
                fuel: data.fuel,
                gear: data.gear,
                caseType: data.caseType,
                version: data.version,
                package: data.package,
                motorPower: data.motorPower ? parseInt(data.motorPower) : null,
                engineVolume: data.engineVolume ? parseInt(data.engineVolume) : null,
                traction: data.traction,

                // Status
                warranty: data.warranty || false,
                exchange: data.exchange || false,
                tramer: data.tramer,
                plate: data.plate,
                plateNationality: data.plateNationality,

                // Location
                city: data.city,
                district: data.district,
                neighborhood: data.neighborhood,

                // Real Estate Specifics
                sqmNet: data.sqmNet ? parseInt(data.sqmNet) : null,
                sqmGross: data.sqmGross ? parseInt(data.sqmGross) : null,
                rooms: data.rooms,
                floor: data.floor ? parseInt(data.floor) : null,
                totalFloors: data.totalFloors ? parseInt(data.totalFloors) : null,
                buildingAge: data.buildingAge,
                heating: data.heating,
                bathrooms: data.bathrooms ? parseInt(data.bathrooms) : null,
                balcony: data.balcony || false,
                furnished: data.furnished || false,
                usingStatus: data.usingStatus,
                dues: data.dues ? parseInt(data.dues) : null,
                creditSuitable: data.creditSuitable || false,
                titleStatus: data.titleStatus,
                front: data.front,
                material: data.material,

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
                },

                // Doping Fields - Derived from Package
                isDoping: data.listingPackage === 'gold' || data.listingPackage === 'premium' || (data.doping && data.doping !== "NONE"),
                dopingType: (() => {
                    if (data.listingPackage === 'premium') return 'FULL';
                    if (data.listingPackage === 'gold') return 'VISUAL';
                    return data.doping !== "NONE" ? data.doping : null;
                })(),
                dopingStartDate: (data.listingPackage !== 'standard' || (data.doping && data.doping !== "NONE")) ? new Date() : null,
                dopingEndDate: (() => {
                    const days = data.listingPackage === 'premium' ? 90 : data.listingPackage === 'gold' ? 60 : 30;
                    return (data.listingPackage !== 'standard' || (data.doping && data.doping !== "NONE"))
                        ? new Date(Date.now() + days * 24 * 60 * 60 * 1000)
                        : null;
                })(),
            }
        })


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
                },

                // Doping Fields (Update if changed)
                isDoping: data.doping && data.doping !== "NONE",
                dopingType: data.doping !== "NONE" ? data.doping : null,
                dopingStartDate: data.doping !== "NONE" ? new Date() : null,
                dopingEndDate: data.doping !== "NONE" ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : null,
            }
        })


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

export async function getUserListingCount(userId: string) {
    try {
        const count = await prisma.listing.count({
            where: {
                userId,
                status: 'ACTIVE',
                isActive: true,
            },
        });
        return { success: true, count };
    } catch (error) {
        console.error("Error fetching user listing count:", error);
        return { success: false, count: 0 };
    }
}


export async function deleteListing(listingId: string, reason: string, details?: string) {
    try {
        const cookieStore = await cookies()
        const sessionCookie = cookieStore.get('session')

        if (!sessionCookie?.value) {
            return {
                success: false,
                error: 'Unauthorized: No session cookie found'
            }
        }

        const session = await decrypt(sessionCookie.value)

        if (!session?.id) {
            return {
                success: false,
                error: 'Unauthorized'
            }
        }

        // Verify ownership
        const listing = await prisma.listing.findUnique({
            where: { id: listingId },
            select: { userId: true }
        })

        if (!listing) {
            return {
                success: false,
                error: 'Listing not found'
            }
        }

        if (listing.userId !== session.id) {
            return {
                success: false,
                error: 'Unauthorized'
            }
        }

        // Record feedback
        await prisma.listingFeedback.create({
            data: {
                reason,
                details,
                listingId
            }
        })

        // Soft delete the listing
        await prisma.listing.update({
            where: { id: listingId },
            data: {
                status: 'DELETED',
                isActive: false
            }
        })

        revalidatePath('/dashboard/my-listings')
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

export async function restoreListing(listingId: string, packageType: string = 'standard') {
    try {
        const cookieStore = await cookies()
        const sessionCookie = cookieStore.get('session')

        if (!sessionCookie?.value) {
            return {
                success: false,
                error: 'Unauthorized'
            }
        }

        const session = await decrypt(sessionCookie.value)
        if (!session?.id) {
            return {
                success: false,
                error: 'Unauthorized'
            }
        }

        // Verify ownership
        const listing = await prisma.listing.findUnique({
            where: { id: listingId },
            select: { userId: true }
        })

        if (!listing) {
            return {
                success: false,
                error: 'Listing not found'
            }
        }

        if (listing.userId !== session.id) {
            return {
                success: false,
                error: 'Unauthorized'
            }
        }

        // Calculate expiration based on package
        let durationDays = 30;
        if (packageType === 'gold') durationDays = 60;
        if (packageType === 'premium') durationDays = 90;

        // Restore listing to ACTIVE status with new package and expiration
        await prisma.listing.update({
            where: { id: listingId },
            data: {
                status: 'ACTIVE',
                isActive: true,
                listingPackage: packageType,
                publishedAt: new Date(),
                expiresAt: new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000)
            }
        })

        revalidatePath('/dashboard/my-listings')
        return {
            success: true
        }
    } catch (error) {
        console.error('Error restoring listing:', error)
        return {
            success: false,
            error: 'Failed to restore listing'
        }
    }
}

export async function addListingBadge(listingId: string, badge: string) {
    try {
        const cookieStore = await cookies()
        const sessionCookie = cookieStore.get('session')

        if (!sessionCookie?.value) {
            return { success: false, error: 'Unauthorized' }
        }

        const session = await decrypt(sessionCookie.value)
        if (!session?.id) {
            return { success: false, error: 'Unauthorized' }
        }

        const listing = await prisma.listing.findUnique({
            where: { id: listingId },
            select: { userId: true, badges: true }
        })

        if (!listing) return { success: false, error: 'Listing not found' }
        if (listing.userId !== session.id) return { success: false, error: 'Unauthorized' }

        // If badge already exists, don't add it again
        if (listing.badges.includes(badge)) {
            return { success: true }
        }

        await prisma.listing.update({
            where: { id: listingId },
            data: {
                badges: {
                    push: badge
                }
            }
        })

        revalidatePath('/dashboard/my-listings')
        return { success: true }
    } catch (error) {
        console.error('Error adding badge:', error)
        return { success: false, error: 'Failed to add badge' }
    }
}
