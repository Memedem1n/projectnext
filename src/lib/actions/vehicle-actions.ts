'use server'

import prisma from '@/lib/prisma'
import { unstable_cache } from 'next/cache'

export type VehicleOption = {
    id: string
    name: string
    slug: string
}

// Cached version of getVehicleBrands
const getVehicleBrandsCached = unstable_cache(
    async (categorySlug: string) => {
        try {
            const category = await prisma.category.findUnique({
                where: { slug: categorySlug },
                select: { id: true }
            })

            if (!category) return []

            const brands = await prisma.category.findMany({
                where: { parentId: category.id },
                select: { id: true, name: true, slug: true },
                orderBy: { name: 'asc' }
            })

            return brands
        } catch (error) {
            console.error('Error fetching vehicle brands:', error)
            return []
        }
    },
    ['vehicle-brands-v1'],
    { revalidate: 86400, tags: ['vehicle-data'] }
)

export async function getVehicleBrands(categorySlug: string): Promise<VehicleOption[]> {
    return getVehicleBrandsCached(categorySlug)
}

// Cached version of getVehicleModels
const getVehicleModelsCached = unstable_cache(
    async (brandId: string) => {
        try {
            const models = await prisma.category.findMany({
                where: { parentId: brandId },
                select: { id: true, name: true, slug: true },
                orderBy: { name: 'asc' }
            })

            return models
        } catch (error) {
            console.error('Error fetching vehicle models:', error)
            return []
        }
    },
    ['vehicle-models-v1'],
    { revalidate: 86400, tags: ['vehicle-data'] }
)

export async function getVehicleModels(brandId: string): Promise<VehicleOption[]> {
    return getVehicleModelsCached(brandId)
}

// Cached version of getVehicleSubModels
const getVehicleSubModelsCached = unstable_cache(
    async (modelId: string) => {
        try {
            const subModels = await prisma.category.findMany({
                where: { parentId: modelId },
                select: { id: true, name: true, slug: true },
                orderBy: { name: 'asc' }
            })

            return subModels
        } catch (error) {
            console.error('Error fetching vehicle sub-models:', error)
            return []
        }
    },
    ['vehicle-submodels-v1'],
    { revalidate: 86400, tags: ['vehicle-data'] }
)

export async function getVehicleSubModels(modelId: string): Promise<VehicleOption[]> {
    return getVehicleSubModelsCached(modelId)
}
