"use client";

import { ListingCard } from "@/components/listing/ListingCard";
import { CompactListingCard } from "@/components/listing/CompactListingCard";
import { HorizontalListingCard } from "@/components/listing/HorizontalListingCard";
import { Pagination } from "@/components/listing/Pagination";
import { cn } from "@/lib/utils";
import { ViewMode } from "@/components/listing/ViewModeToggle";

interface CategoryListingsClientProps {
    listings: any[];
    pagination: any;
    isMainCategory: boolean;
    currentUrl: string;
    viewMode: ViewMode;
}

export function CategoryListingsClient({
    listings,
    pagination,
    isMainCategory,
    currentUrl,
    viewMode
}: CategoryListingsClientProps) {

    if (isMainCategory) {
        return (
            <div className="glass-card p-12 text-center">
                <p className="text-xl font-semibold text-muted-foreground mb-4">
                    Lütfen sol taraftan bir alt kategori seçin
                </p>
                <p className="text-sm text-muted-foreground">
                    Alt kategorilerde ilanları görebilirsiniz
                </p>
            </div>
        );
    }

    if (listings.length === 0) {
        return (
            <div className="glass-card p-12 text-center">
                <p className="text-lg text-muted-foreground">Bu kriterlere uygun ilan bulunamadı.</p>
                <p className="text-sm text-muted-foreground mt-2">Filtreleri temizleyerek tekrar deneyebilirsiniz.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Listings Grid/List */}
            <div className={cn(
                "transition-all duration-300",
                viewMode === 'grid'
                    // Grid: Responsive columns
                    ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3"
                    // List: Full width, single column with gaps
                    : "flex flex-col gap-3"
            )}>
                {listings.map(listing => (
                    viewMode === 'grid' ? (
                        <CompactListingCard key={listing.id} listing={listing} />
                    ) : (
                        <HorizontalListingCard key={listing.id} listing={listing} />
                    )
                ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
                <Pagination
                    currentPage={pagination.page}
                    totalPages={pagination.totalPages}
                    baseUrl={currentUrl}
                />
            )}
        </div>
    );
}
