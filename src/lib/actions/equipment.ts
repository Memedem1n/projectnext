'use server'

import prisma from '@/lib/prisma'

export async function getAllEquipment() {
    try {
        const equipment = await prisma.equipment.findMany({
            orderBy: {
                name: 'asc'
            }
        })

        return {
            success: true,
            data: equipment
        }
    } catch (error) {
        console.error('Error fetching equipment:', error)
        return {
            success: false,
            error: 'Failed to fetch equipment'
        }
    }
}

export async function getEquipmentByCategory(category: string) {
    try {
        const equipment = await prisma.equipment.findMany({
            where: {
                category
            },
            orderBy: {
                name: 'asc'
            }
        })

        return {
            success: true,
            data: equipment
        }
    } catch (error) {
        console.error('Error fetching equipment by category:', error)
        return {
            success: false,
            error: 'Failed to fetch equipment'
        }
    }
}

export async function getEquipmentGrouped() {
    try {
        const equipment = await prisma.equipment.findMany({
            orderBy: {
                name: 'asc'
            }
        })

        // Group by category
        const grouped = equipment.reduce((acc, item) => {
            const category = item.category || 'other'
            if (!acc[category]) {
                acc[category] = []
            }
            acc[category].push(item)
            return acc
        }, {} as Record<string, typeof equipment>)

        return {
            success: true,
            data: grouped
        }
    } catch (error) {
        console.error('Error fetching grouped equipment:', error)
        return {
            success: false,
            error: 'Failed to fetch equipment'
        }
    }
}
