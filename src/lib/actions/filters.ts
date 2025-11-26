'use server'

import prisma from '@/lib/prisma'
import { decrypt } from '@/lib/auth-edge'
import { cookies } from 'next/headers'

interface SavedFilterData {
    name: string
    filterConfig: any
    categorySlug?: string
}

// SavedFilter model does not exist in schema yet.
// Disabling these actions to pass build.

export async function createSavedFilter(data: SavedFilterData) {
    return {
        success: false,
        error: 'Feature not available yet'
    }
}

export async function getSavedFilters() {
    return {
        success: true,
        data: []
    }
}

export async function deleteSavedFilter(filterId: string) {
    return {
        success: false,
        error: 'Feature not available yet'
    }
}
