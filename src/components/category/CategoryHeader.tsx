"use client";

import Link from "next/link";
import { ChevronRight, ChevronDown, ArrowUpDown } from "lucide-react";
import { CATEGORIES } from "@/data/categories";
import { ViewModeToggle, ViewMode } from "@/components/listing/ViewModeToggle";

interface CategoryHeaderProps {
    categorySlug: string;
    totalListings: number;
    viewMode: ViewMode;
    onViewModeChange: (mode: ViewMode) => void;
    sortBy: string;
    onSortChange: (sort: string) => void;
}

export function CategoryHeader({
    categorySlug,
    totalListings,
    viewMode,
    onViewModeChange,
    sortBy,
    onSortChange
}: CategoryHeaderProps) {
    // Recursively search for category by slug in nested structure
    const findCategoryBySlug = (cats: any[], slug: string): any => {
        for (const cat of cats) {
            if (cat.id === slug) return cat;
            if (cat.subcategories) {
                const found = findCategoryBySlug(cat.subcategories, slug);
                if (found) return found;
            }
        }
        return null;
    };

    const category = findCategoryBySlug(CATEGORIES, categorySlug) || {
        id: categorySlug,
        name: categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1),
        icon: null
    };

    return (
        <div className="space-y-4 mb-8">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Link href="/" className="hover:text-primary transition-colors">Anasayfa</Link>
                <ChevronRight className="w-4 h-4" />
                <span className="text-foreground font-medium">{category.name}</span>
            </div>

            {/* Title and Controls */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">{category.name} İlanları</h1>
                    {totalListings > 0 && (
                        <p className="text-muted-foreground">
                            Aradığınız kriterlere uygun <span className="text-primary font-bold">{totalListings}</span> ilan bulundu
                        </p>
                    )}
                </div>

                {/* Controls: Sort & View Mode */}
                <div className="flex items-center gap-3">
                    {/* Sort Dropdown */}
                    <div className="flex items-center gap-2">
                        <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
                        <div className="relative">
                            <select
                                value={sortBy}
                                onChange={(e) => onSortChange(e.target.value)}
                                className="appearance-none bg-white/5 border border-white/10 rounded-lg py-2 pl-3 pr-8 text-sm focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-colors cursor-pointer min-w-[140px]"
                            >
                                <option value="newest" className="bg-zinc-900">En Yeni</option>
                                <option value="oldest" className="bg-zinc-900">En Eski</option>
                                <option value="price-asc" className="bg-zinc-900">Fiyat (Artan)</option>
                                <option value="price-desc" className="bg-zinc-900">Fiyat (Azalan)</option>
                            </select>
                            <ChevronDown className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                        </div>
                    </div>

                    {/* View Mode Toggle */}
                    <ViewModeToggle mode={viewMode} onModeChange={onViewModeChange} />
                </div>
            </div>
        </div>
    );
}
