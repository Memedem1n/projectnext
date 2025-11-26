import { getListings } from "@/lib/actions/listings";
import { PageBackground } from "@/components/layout/PageBackground";
import { CategoryContent } from "@/components/category/CategoryContent";

// Search page is always dynamic (real-time)
export const dynamic = 'force-dynamic';

interface SearchPageProps {
    searchParams: Promise<Record<string, string | undefined>>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const resolvedSearchParams = await searchParams;
    const page = parseInt(resolvedSearchParams.page || '1');
    const query = resolvedSearchParams.q || '';

    // Use real-time search
    const result = await getListings({
        search: query,
        page,
        limit: 20,
        ...resolvedSearchParams
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
        pagination = {
            page,
            limit: 20,
            totalCount: result.total || 0,
            totalPages: Math.ceil((result.total || 0) / 20)
        };
    }

    // Mock category structure for the layout
    const category = {
        id: 'search',
        name: `"${query}" Arama Sonuçları`,
        slug: 'search',
        children: []
    };

    return (
        <div className="min-h-screen bg-background pt-24 pb-12 relative overflow-hidden">
            <PageBackground />
            <div className="container mx-auto px-4 relative z-10">
                <CategoryContent
                    category={category}
                    listings={listings}
                    pagination={pagination}
                    isMainCategory={false}
                    currentUrl={`/search?q=${encodeURIComponent(query)}`}
                    treeCategories={[]}
                    ancestors={[]}
                    currentPath={['search']}
                />
            </div>
        </div>
    );
}
