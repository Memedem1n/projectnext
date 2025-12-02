"use server";

import prisma from "@/lib/prisma";
import { unstable_cache } from "next/cache";

export async function getVehicleCategories(slugs: string[]) {
    // Determine depth based on slugs
    // slugs[0] = "vasita" (Category)
    // slugs[1] = "otomobil" (Subcategory)
    // slugs[2] = "bmw" (Brand)
    // slugs[3] = "3-serisi" (Model)

    // If we are at "vasita" or "otomobil", we rely on standard categories first.
    // But if we are at "otomobil", we want to show BRANDS.

    const lastSlug = slugs[slugs.length - 1];

    // Check if the current slug corresponds to a known category that implies vehicle data
    // For now, we assume "otomobil", "arazi-suv-pickup", "motosiklet" etc. trigger this.
    // We can check if the category has children in DB. If not, we look for vehicle data.

    // 1. Check if it's a brand level (e.g. we are at "bmw")
    // We need to know if the previous slug was a category (like "otomobil").

    // Let's try to infer context from the path.
    // Level 0: vasita
    // Level 1: otomobil
    // Level 2: Brand (bmw)
    // Level 3: Model (3-serisi)

    const depth = slugs.length;

    if (depth === 2) {
        // We are at "otomobil" level. Fetch BRANDS.
        const categorySlug = slugs[1];

        // Only fetch brands for "otomobil" for now
        if (categorySlug === 'otomobil') {
            return await getBrands();
        }

        // For other categories (hasarli-araclar, etc.), return empty for now
        return [];
    }

    if (depth === 3) {
        // We are at Brand level (e.g. "bmw"). Fetch MODELS.
        const brandSlug = slugs[2];
        // We need to map slug back to real name (e.g. "bmw" -> "BMW", "alfa-romeo" -> "Alfa Romeo")
        // This is tricky without a lookup. We might need to search case-insensitive or maintain a slug map.
        // For now, let's try to find a brand that matches the slug.

        return await getModels(brandSlug);
    }

    return [];
}

const getBrands = unstable_cache(
    async () => {
        const [brands, brandCounts] = await Promise.all([
            prisma.vehicleData.findMany({
                distinct: ['brand'],
                select: { brand: true },
                orderBy: { brand: 'asc' }
            }),
            prisma.listing.groupBy({
                by: ['brand'],
                where: {
                    status: 'ACTIVE',
                    isActive: true,
                    brand: { not: null }
                },
                _count: {
                    brand: true
                }
            })
        ]);

        const countMap = new Map(brandCounts.map(c => [c.brand, c._count.brand]));

        return brands.map(b => ({
            id: b.brand.toLowerCase().replace(/\s+/g, '-'),
            name: b.brand,
            slug: b.brand.toLowerCase().replace(/\s+/g, '-'),
            count: countMap.get(b.brand) || 0
        }));
    },
    ['vehicle-brands'],
    { revalidate: 3600, tags: ['listings'] }
);

const getModels = unstable_cache(
    async (brandSlug: string) => {
        // We need to find the real brand name from the slug
        const allBrands = await prisma.vehicleData.findMany({
            distinct: ['brand'],
            select: { brand: true }
        });

        const brand = allBrands.find(b => b.brand.toLowerCase().replace(/\s+/g, '-') === brandSlug);

        if (!brand) return [];

        const [models, modelCounts] = await Promise.all([
            prisma.vehicleData.findMany({
                where: { brand: brand.brand },
                distinct: ['model'],
                select: { model: true },
                orderBy: { model: 'asc' }
            }),
            prisma.listing.groupBy({
                by: ['model'],
                where: {
                    status: 'ACTIVE',
                    isActive: true,
                    brand: brand.brand,
                    model: { not: null }
                },
                _count: {
                    model: true
                }
            })
        ]);

        const countMap = new Map(modelCounts.map(c => [c.model, c._count.model]));

        return models.map(m => ({
            id: m.model.toLowerCase().replace(/\s+/g, '-'),
            name: m.model,
            slug: m.model.toLowerCase().replace(/\s+/g, '-'),
            count: countMap.get(m.model) || 0
        }));
    },
    ['vehicle-models'],
    { revalidate: 3600, tags: ['listings'] }
);
