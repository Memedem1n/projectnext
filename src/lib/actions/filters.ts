'use server'

import prisma from '@/lib/prisma'
import { decrypt } from '@/lib/auth-edge'
import { cookies } from 'next/headers'

interface SavedFilterData {
    name: string
    filterConfig: any
    categorySlug?: string
}

export async function createSavedFilter(data: SavedFilterData) {
    try {
        // Get user from session
        const cookieStore = await cookies()
        const session = cookieStore.get('session')?.value

        if (!session) {
            return {
                success: false,
                error: 'Unauthorized - Please login to save filters'
            }
        }

        const payload = await decrypt(session)
        if (!payload || !payload.userId) {
            return {
                success: false,
                error: 'Invalid session'
            }
        }

        const savedFilter = await prisma.savedFilter.create({
            data: {
                name: data.name,
                userId: payload.userId as string,
                filterConfig: data.filterConfig,
                categorySlug: data.categorySlug
            }
        })

        return {
            success: true,
            data: savedFilter
        }
    } catch (error) {
        console.error('Error creating saved filter:', error)
        return {
            success: false,
            error: 'Failed to save filter'
        }
    }
}

export async function getSavedFilters() {
    try {
        const cookieStore = await cookies()
        const session = cookieStore.get('session')?.value

        if (!session) {
            return {
                success: false,
                error: 'Unauthorized'
            }
        }

        const payload = await decrypt(session)
        if (!payload || !payload.userId) {
            return {
                success: false,
                error: 'Invalid session'
            }
        }

        const filters = await prisma.savedFilter.findMany({
            where: {
                userId: payload.userId as string
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return {
            success: true,
            data: filters
        }
    } catch (error) {
        console.error('Error fetching saved filters:', error)
        return {
            success: false,
            error: 'Failed to load filters'
        }
    }
}

export async function deleteSavedFilter(filterId: string) {
    try {
        const cookieStore = await cookies()
        const session = cookieStore.get('session')?.value

        if (!session) {
            return {
                success: false,
                error: 'Unauthorized'
            }
        }

        const payload = await decrypt(session)
        if (!payload || !payload.userId) {
            return {
                success: false,
                error: 'Invalid session'
            }
        }

        // Verify ownership before deleting
        const filter = await prisma.savedFilter.findUnique({
            where: { id: filterId }
        })

        if (!filter || filter.userId !== payload.userId) {
            return {
                success: false,
                error: 'Filter not found or access denied'
            }
        }

        await prisma.savedFilter.delete({
            where: { id: filterId }
        })

        return {
            success: true
        }
    } catch (error) {
        console.error('Error deleting saved filter:', error)
        return {
            success: false,
            error: 'Failed to delete filter'
        }
    }
}
