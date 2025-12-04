"use client";

import { useState } from "react";
import { CategoryHeader } from "@/components/category/CategoryHeader";
import { CategoryListingsClient } from "@/components/category/CategoryListingsClient";
import { ViewMode } from "@/components/listing/ViewModeToggle";
import dynamic from 'next/dynamic';

// Lazy load FilterSidebar
const FilterSidebar = dynamic(() => import("@/components/category/FilterSidebar").then(mod => ({ default: mod.FilterSidebar })), {
    loading: () => <div className="glass-card p-6 h-96 animate-pulse" />,
    ssr: true
});

interface CategoryContentProps {
    category: any;
    listings: any[];
    pagination: any;
    isMainCategory: boolean;
    currentUrl: string;
    treeCategories: any[];
    ancestors: any[];
    currentPath: string[];
}

export function CategoryContent({
    category,
    listings,
    pagination,
    isMainCategory,
    currentUrl,
    treeCategories,
    ancestors,
    currentPath
}: CategoryContentProps) {
    const [viewMode, setViewMode] = useState<ViewMode>('list');
    const [sortBy, setSortBy] = useState<string>('newest');

    // Sort listings client-side (will be server-side later)
    const sortedListings = [...listings].sort((a, b) => {
        switch (sortBy) {
            case 'price-asc':
                return a.price - b.price;
            case 'price-desc':
                return b.price - a.price;
            case 'oldest':
                return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            case 'newest':
            default:
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
    });

    return (
        <>
            <CategoryHeader
                categorySlug={category.slug}
                totalListings={pagination?.totalCount || 0}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                sortBy={sortBy}
                onSortChange={setSortBy}
            />
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-1">
                    <FilterSidebar
                        categories={treeCategories.map((c: any) => ({
                            id: c.id,
                            name: c.name,
                            slug: c.slug,
                            count: isMainCategory ? undefined : c.count
                        }))}
                        currentCategory={{ id: category.id, name: category.name, slug: category.slug }}
                        ancestors={ancestors.map((c: any) => ({ id: c.id, name: c.name, slug: c.slug }))}
                        currentPath={currentPath}
                    />
                </div>
                <div className="lg:col-span-3">
                    <CategoryListingsClient
                        listings={sortedListings}
                        pagination={pagination}
                        isMainCategory={isMainCategory}
                        currentUrl={currentUrl}
                        viewMode={viewMode}
                    />
                </div>
            </div>
        </>
    );
}
