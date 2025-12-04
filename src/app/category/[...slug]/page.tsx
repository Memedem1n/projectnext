import { getHybridListings } from "@/lib/actions/listings";
import { getCategoryBySlug, getCategoryAncestry } from "@/lib/actions/categories";
import { getVehicleCategories } from "@/lib/actions/vehicle-categories";
import { notFound } from "next/navigation";
import { PageBackground } from "@/components/layout/PageBackground";
import { CATEGORIES } from "@/data/categories";
import { CategoryContent } from "@/components/category/CategoryContent";
import prisma from "@/lib/prisma";

// Build static category lookup map
const CATEGORY_MAP = new Map<string, any>();
const buildCategoryMap = (cats: any[], parentPath: any[] = []) => {
    cats.forEach(cat => {
        CATEGORY_MAP.set(cat.id, { ...cat, ancestry: [...parentPath, cat] });
        if (cat.subcategories) buildCategoryMap(cat.subcategories, [...parentPath, cat]);
    });
};
buildCategoryMap(CATEGORIES);

// Generate static pages for main categories at build time
export async function generateStaticParams() {
    return CATEGORIES.map(cat => ({
        slug: [cat.id]
    }));
}

// Force dynamic rendering for real-time search support
export const dynamic = 'force-dynamic';

interface CategoryPageProps {
    params: Promise<{ slug: string[] }>;
    searchParams: Promise<Record<string, string | undefined>>;
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
    const { slug: slugArray } = await params;
    const resolvedSearchParams = await searchParams;
    const currentSlug = slugArray[slugArray.length - 1];
    const page = parseInt(resolvedSearchParams.page || '1');

    // Detect level: 1=main (vasita), 2=sub (otomobil)
    const isMainCategory = slugArray.length === 1;

    // Try to get category from database first
    // If we are deep in the tree (e.g. vasita/otomobil/bmw), currentSlug is "bmw"
    // "bmw" might NOT be a category in DB.
    // So we need to find the "closest" real category.

    let category: any = null;
    let realCategorySlug = "";

    // Iterate backwards to find the first real category
    for (let i = slugArray.length - 1; i >= 0; i--) {
        const s = slugArray[i];
        const res = await getCategoryBySlug(s);
        if (res.success && res.data) {
            category = res.data;
            realCategorySlug = s;
            break;
        }
    }

    if (!category) {
        // Fallback to static categories if DB fails completely
        const staticCategory = CATEGORY_MAP.get(slugArray[0]); // Try root
        if (!staticCategory) notFound();

        category = {
            id: staticCategory.id,
            name: staticCategory.name,
            slug: staticCategory.id,
            children: staticCategory.subcategories || [],
        };
    }

    // Get ancestry
    const ancestryResult = await getCategoryAncestry(category.id);
    const ancestors = ancestryResult.success && ancestryResult.data
        ? ancestryResult.data
        : [category];

    // Determine Sidebar Categories (Tree)
    let treeCategories: any[] = [];

    // 1. If category has children in DB, use them (This now covers Brands and Models!)
    if (category.children?.length > 0) {
        treeCategories = category.children;
    }
    // 2. Fallback to vehicle categories if DB children empty (e.g. leaf nodes or sync issues)
    else {
        const vehicleCats = await getVehicleCategories(slugArray);
        if (vehicleCats.length > 0) {
            treeCategories = vehicleCats;
        }
    }

    // --- SMART COUNTING LOGIC ---
    // We need to populate the 'count' property for treeCategories.
    // Since listings might be in sub-categories, or just tagged with brand/model,
    // we use the Listing fields (brand, model) to aggregate counts efficiently.

    try {
        if (treeCategories.length > 0) {
            // Case 1: We are displaying Brands (e.g. under Otomobil)
            // Ancestors: [Vasıta, Otomobil] -> We are at Otomobil. treeCategories are Brands.
            if (ancestors.length === 2 && ancestors[1].slug === 'otomobil') {
                const brandCounts = await prisma.listing.groupBy({
                    by: ['brand'],
                    where: { status: 'ACTIVE', isActive: true, brand: { not: null } },
                    _count: { brand: true }
                });
                const countMap = new Map(brandCounts.map(c => [c.brand?.toLowerCase(), c._count.brand]));

                treeCategories = treeCategories.map(c => ({
                    ...c,
                    count: countMap.get(c.name.toLowerCase()) || 0
                }));
            }
            // Case 2: We are displaying Models (e.g. under BMW)
            // Ancestors: [Vasıta, Otomobil, BMW] -> We are at BMW. treeCategories are Models.
            else if (ancestors.length === 3) {
                const brandName = ancestors[2].name; // "BMW"
                const modelCounts = await prisma.listing.groupBy({
                    by: ['model'],
                    where: { status: 'ACTIVE', isActive: true, brand: brandName, model: { not: null } },
                    _count: { model: true }
                });
                const countMap = new Map(modelCounts.map(c => [c.model?.toLowerCase(), c._count.model]));

                treeCategories = treeCategories.map(c => ({
                    ...c,
                    count: countMap.get(c.name.toLowerCase()) || 0
                })).filter(c => c.count > 0);
            }
            // Case 3: We are displaying SubModels (e.g. under 3 Serisi)
            // Ancestors: [Vasıta, Otomobil, BMW, 3 Serisi] -> We are at 3 Serisi. treeCategories are SubModels.
            else if (ancestors.length === 4) {
                // We don't have a direct 'subModel' field on Listing yet (it's in vehicleData but maybe not on Listing?)
                // Let's check Listing model. It has 'version', 'package'.
                // If we added 'subModel' to Listing, we could count.
                // For now, we might skip counting or use 'version' if it maps.
                // Or we can count by categoryId if listings are migrated to submodel categories!

                const catCounts = await prisma.listing.groupBy({
                    by: ['categoryId'],
                    where: { status: 'ACTIVE', isActive: true, categoryId: { in: treeCategories.map(c => c.id) } },
                    _count: { categoryId: true }
                });
                const countMap = new Map(catCounts.map(c => [c.categoryId, c._count.categoryId]));

                treeCategories = treeCategories.map(c => ({
                    ...c,
                    count: countMap.get(c.id) || 0
                })).filter(c => c.count > 0); // User requested to hide empty sub-model categories
            }
        }
    } catch (e) {
        console.error('Error calculating counts:', e);
    }

    // Prepare Filters for Listings
    const filters: any = {
        categoryId: category.id, // This will match if listings are moved to this category
        page,
        limit: 20,
        ...resolvedSearchParams
    };

    // INTELLIGENT FILTERING FOR LEGACY LISTINGS
    // If listings are still attached to "Otomobil" but we are at "BMW", we need to filter by brand.
    // We can check the ancestry depth.

    // Ancestors: [Vasıta, Otomobil, BMW, 3 Serisi]
    // Index:     0       1         2    3

    if (ancestors.length >= 3) {
        // We are at Brand level or deeper (e.g. BMW)
        const brandCat = ancestors[2];
        filters.brand = brandCat.name; // "BMW"

        // If we are at Model level
        if (ancestors.length >= 4) {
            const modelCat = ancestors[3];
            filters.model = modelCat.name; // "3 Serisi"
        }

        // CRITICAL: If we are filtering by brand/model, we should search in the ROOT category (Vasıta)
        // because listings might be attached to Vasıta, Otomobil, or the specific Brand category.
        // Searching in the root with strict brand/model filters ensures we find them all.

        if (ancestors[0]) {
            filters.categoryId = ancestors[0].id;
        }
    }

    // Fetch Listings
    const result = await getHybridListings(filters);

    let listings: any[] = [];
    let pagination: any = null;

    if (result.success && result.data) {
        listings = result.data.map((l: any) => ({
            id: l.id,
            title: l.title,
            price: l.price,
            image: l.images?.[0]?.url || 'https://picsum.photos/800/600',
            images: l.images,
            date: new Date(l.createdAt).toLocaleDateString('tr-TR'),
            city: l.city,
            district: l.district,
            categoryId: l.categoryId,
            brand: l.brand,
            model: l.model,
            year: l.year,
            km: l.km,
            fuel: l.fuel,
            gear: l.gear,
            hp: l.motorPower,
            cc: l.engineVolume,
            warranty: l.warranty,
            exchange: l.exchange,
            user: l.user,
            isDoping: l.isDoping,
            isPremium: l.isPremium,
            listingPackage: l.listingPackage,
            dopingType: l.dopingType,
            badges: l.badges
        }));
        pagination = result.pagination;
    }

    const currentUrl = `/category/${slugArray.join('/')}`;

    return (
        <div className="min-h-screen bg-background pt-24 pb-12 relative overflow-hidden">
            <PageBackground />
            <div className="container mx-auto px-4 relative z-10">
                <CategoryContent
                    category={{
                        ...category,
                        name: category.name // Use real name
                    }}
                    listings={listings}
                    pagination={pagination}
                    isMainCategory={isMainCategory}
                    currentUrl={currentUrl}
                    treeCategories={treeCategories}
                    ancestors={ancestors}
                    currentPath={slugArray}
                />
            </div>
        </div>
    );
}
