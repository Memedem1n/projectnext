'use server'

import prisma from '@/lib/prisma'
import { cookies } from 'next/headers'
import { decrypt } from '@/lib/auth-edge'
import { revalidatePath } from 'next/cache'

/**
 * Get current user ID from session
 */
async function getCurrentUserId(): Promise<{ success: boolean; userId?: string; error?: string }> {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('session')

    if (!sessionCookie) {
        return { success: false, error: 'Unauthorized' }
    }

    const session = await decrypt(sessionCookie.value)
    if (!session || !session.userId) {
        return { success: false, error: 'Invalid session' }
    }

    return { success: true, userId: session.userId as string }
}

/**
 * Get user's listings
 */
export async function getUserListings() {
    try {
        const auth = await getCurrentUserId()
        if (!auth.success || !auth.userId) {
            return { success: false, error: auth.error }
        }

        const listings = await prisma.listing.findMany({
            where: { userId: auth.userId },
            include: {
                images: { orderBy: { order: 'asc' }, take: 1 },
                category: true,
            },
            orderBy: { createdAt: 'desc' }
        })

        return { success: true, data: listings }
    } catch (error) {
        console.error('Error fetching user listings:', error)
        return { success: false, error: 'Failed to fetch listings' }
    }
}

/**
 * Delete user listing
 */
export async function deleteUserListing(listingId: string) {
    try {
        const auth = await getCurrentUserId()
        if (!auth.success || !auth.userId) {
            return { success: false, error: auth.error }
        }

        // Verify ownership
        const listing = await prisma.listing.findUnique({
            where: { id: listingId },
            select: { userId: true }
        })

        if (!listing) {
            return { success: false, error: 'Listing not found' }
        }

        if (listing.userId !== auth.userId) {
            return { success: false, error: 'Unauthorized' }
        }

        await prisma.listing.delete({
            where: { id: listingId }
        })

        revalidatePath('/account')
        return { success: true }
    } catch (error) {
        console.error('Error deleting listing:', error)
        return { success: false, error: 'Failed to delete listing' }
    }
}

/**
 * Get user's favorites
 */
export async function getUserFavorites() {
    try {
        const auth = await getCurrentUserId()
        if (!auth.success || !auth.userId) {
            return { success: false, error: auth.error }
        }

        const favorites = await prisma.favorite.findMany({
            where: { userId: auth.userId },
            include: {
                listing: {
                    include: {
                        images: { orderBy: { order: 'asc' }, take: 1 },
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
                }
            },
            orderBy: { createdAt: 'desc' }
        })

        return { success: true, data: favorites.map(f => f.listing) }
    } catch (error) {
        console.error('Error fetching favorites:', error)
        return { success: false, error: 'Failed to fetch favorites' }
    }
}

/**
 * Toggle favorite (add/remove)
 */
export async function toggleFavorite(listingId: string) {
    try {
        const auth = await getCurrentUserId()
        if (!auth.success || !auth.userId) {
            return { success: false, error: auth.error }
        }

        // Check if already favorited
        const existing = await prisma.favorite.findUnique({
            where: {
                userId_listingId: {
                    userId: auth.userId,
                    listingId
                }
            }
        })

        if (existing) {
            // Remove from favorites
            await prisma.favorite.delete({
                where: { id: existing.id }
            })
            return { success: true, favorited: false }
        } else {
            // Add to favorites
            await prisma.favorite.create({
                data: {
                    userId: auth.userId,
                    listingId
                }
            })
            return { success: true, favorited: true }
        }
    } catch (error) {
        console.error('Error toggling favorite:', error)
        return { success: false, error: 'Failed to toggle favorite' }
    }
}

/**
 * Check if listing is favorited by current user
 */
export async function isListingFavorited(listingId: string) {
    try {
        const auth = await getCurrentUserId()
        if (!auth.success || !auth.userId) {
            return { success: true, favorited: false }
        }

        const favorite = await prisma.favorite.findUnique({
            where: {
                userId_listingId: {
                    userId: auth.userId,
                    listingId
                }
            }
        })

        return { success: true, favorited: !!favorite }
    } catch (error) {
        console.error('Error checking favorite:', error)
        return { success: true, favorited: false }
    }
}

/**
 * Update user profile
 */
export async function updateUserProfile(data: {
    name?: string
    phone?: string
    twoFactorEnabled?: boolean
}) {
    try {
        const auth = await getCurrentUserId()
        if (!auth.success || !auth.userId) {
            return { success: false, error: auth.error }
        }

        const user = await prisma.user.update({
            where: { id: auth.userId },
            data: {
                ...(data.name && { name: data.name }),
                ...(data.phone && { phone: data.phone }),
                ...(data.twoFactorEnabled !== undefined && { twoFactorEnabled: data.twoFactorEnabled })
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                twoFactorEnabled: true
            }
        })

        revalidatePath('/account')
        return { success: true, data: user }
    } catch (error) {
        console.error('Error updating profile:', error)
        return { success: false, error: 'Failed to update profile' }
    }
}
