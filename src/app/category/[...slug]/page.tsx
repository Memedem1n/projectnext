import { getHybridListings } from "@/lib/actions/listings";
import { getCategoryBySlug, getCategoryAncestry } from "@/lib/actions/categories";
import { notFound } from "next/navigation";
import { PageBackground } from "@/components/layout/PageBackground";
import { CATEGORIES } from "@/data/categories";
import { CategoryContent } from "@/components/category/CategoryContent";

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

    // Try to get category from database first, fallback to static data
    const categoryResult = await getCategoryBySlug(currentSlug);
    let category: any;

    if (!categoryResult.success || !categoryResult.data) {
        // Fallback to static categories
        const staticCategory = CATEGORY_MAP.get(currentSlug);
        if (!staticCategory) notFound();

        category = {
            id: staticCategory.id,
            name: staticCategory.name,
            slug: staticCategory.id,
            children: staticCategory.subcategories || [],
        };
    } else {
        category = categoryResult.data;
    }

    // Get ancestry - try database first, fallback to static
    const ancestryResult = await getCategoryAncestry(category.id);
    const staticData = CATEGORY_MAP.get(category.id);
    const ancestors = ancestryResult.success && ancestryResult.data && ancestryResult.data.length > 0
        ? ancestryResult.data : staticData?.ancestry || [category];

    let treeCategories: any[] = [];
    if (category.children?.length > 0) {
        treeCategories = category.children.map((child: any) => ({
            ...child, count: staticData?.subcategories?.find((c: any) => c.id === child.id)?.count
        }));
    } else if (staticData?.subcategories?.length > 0) {
        treeCategories = staticData.subcategories.map((child: any) => ({
            id: child.id, name: child.name, slug: child.id, count: child.count,
            subcategories: child.subcategories
        }));
    }

    // Use hybrid fetching strategy (Cached for category/brand, Real-time for model/filters)
    const result = await getHybridListings({
        categoryId: category.id,
        page,
        limit: 20,
        ...resolvedSearchParams // Pass all search params (brand, model, price, etc.)
    });

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
            warranty: l.warranty,
            exchange: l.exchange,
            user: l.user
        }));
        // Use the normalized pagination from getHybridListings
        pagination = result.pagination;
    }

    const currentUrl = `/category/${slugArray.join('/')}`;

    return (
        <div className="min-h-screen bg-background pt-24 pb-12 relative overflow-hidden">
            <PageBackground />
            <div className="container mx-auto px-4 relative z-10">
                <CategoryContent
                    category={category}
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
