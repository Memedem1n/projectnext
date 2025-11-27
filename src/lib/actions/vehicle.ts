"use server"

import { prisma } from "@/lib/prisma"

// Helper to normalize text for case-insensitive comparison if needed, 
// but Prisma's mode: 'insensitive' handles most.

export async function getVehicleTypes() {
    // In a real scenario, we might fetch distinct types from DB
    // But for now, returning static types is fine or fetch from DB
    try {
        const results = await prisma.vehicleData.groupBy({
            by: ['type'],
        });
        return results.map(r => r.type).filter(Boolean);
    } catch (error) {
        console.error("Error fetching types:", error);
        return ["Otomobil"]; // Fallback
    }
}

export async function getVehicleBrands(type: string) {
    try {
        const results = await prisma.vehicleData.groupBy({
            by: ['brand'],
            where: {
                type: { equals: type, mode: 'insensitive' }
            },
            orderBy: {
                brand: 'asc'
            }
        });
        return results.map(r => r.brand).filter(Boolean);
    } catch (error) {
        console.error("Error fetching brands:", error);
        return [];
    }
}

export async function getVehicleModels(type: string, brand: string) {
    try {
        const results = await prisma.vehicleData.groupBy({
            by: ['model'],
            where: {
                type: { equals: type, mode: 'insensitive' },
                brand: brand
            },
            orderBy: {
                model: 'asc'
            }
        });
        return results.map(r => r.model).filter(Boolean);
    } catch (error) {
        console.error("Error fetching models:", error);
        return [];
    }
}

export async function getVehicleYears(type: string, brand: string, model: string) {
    try {
        const results = await prisma.vehicleData.groupBy({
            by: ['year'],
            where: {
                type: { equals: type, mode: 'insensitive' },
                brand: brand,
                model: model
            },
            orderBy: {
                year: 'desc'
            }
        });
        return results.map(r => r.year).filter(Boolean);
    } catch (error) {
        console.error("Error fetching years:", error);
        return [];
    }
}

export async function getVehicleBodyTypes(type: string, brand: string, model: string, year: number) {
    try {
        const results = await prisma.vehicleData.groupBy({
            by: ['bodyType'],
            where: {
                type: { equals: type, mode: 'insensitive' },
                brand: brand,
                model: model,
                year: year
            },
            orderBy: {
                bodyType: 'asc'
            }
        });
        return results.map(r => r.bodyType).filter((x): x is string => !!x);
    } catch (error) {
        console.error("Error fetching body types:", error);
        return [];
    }
}

export async function getVehicleFuels(type: string, brand: string, model: string, year: number, bodyType: string) {
    try {
        const results = await prisma.vehicleData.groupBy({
            by: ['fuel'],
            where: {
                type: { equals: type, mode: 'insensitive' },
                brand: brand,
                model: model,
                year: year,
                bodyType: bodyType
            },
            orderBy: {
                fuel: 'asc'
            }
        });
        return results.map(r => r.fuel).filter((x): x is string => !!x);
    } catch (error) {
        console.error("Error fetching fuels:", error);
        return [];
    }
}

export async function getVehicleGears(type: string, brand: string, model: string, year: number, bodyType: string, fuel: string) {
    try {
        const results = await prisma.vehicleData.groupBy({
            by: ['gear'],
            where: {
                type: { equals: type, mode: 'insensitive' },
                brand: brand,
                model: model,
                year: year,
                bodyType: bodyType,
                fuel: fuel
            },
            orderBy: {
                gear: 'asc'
            }
        });
        return results.map(r => r.gear).filter((x): x is string => !!x);
    } catch (error) {
        console.error("Error fetching gears:", error);
        return [];
    }
}

export async function getVehicleVersions(type: string, brand: string, model: string, year: number, bodyType: string, fuel: string, gear: string) {
    try {
        const results = await prisma.vehicleData.findMany({
            where: {
                type: { equals: type, mode: 'insensitive' },
                brand: brand,
                model: model,
                year: year,
                bodyType: bodyType,
                fuel: fuel,
                gear: gear
            },
            orderBy: {
                package: 'asc'
            }
        });
        return results;
    } catch (error) {
        console.error("Error fetching versions:", error);
        return [];
    }
}
