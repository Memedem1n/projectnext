/* eslint-disable */
"use client";

import { CATEGORIES } from "@/data/categories";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight, ArrowLeft, X, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { FilterSlider } from "@/components/listing/FilterSlider";

export interface FilterState {
    priceRange: [number, number];
    kmRange: [number, number];
    yearRange: [number, number];
    fuelType: string;
    gearType: string;
    // Damage filters
    damageStatus: string; // "Hatasız" | "Boyalı" | "Değişen" | "Hasarlı" | ""
    hasDamageRecord: string; // "yes" | "no" | "any"
    maxDamageAmount: number;
    maxDamagedParts: number;
}

interface SidebarProps {
    onFilterChange?: (filters: FilterState) => void;
    initialFilters?: FilterState;
    maxPrice?: number;
    maxKm?: number;
    maxYear?: number;
    minYear?: number;
    maxDamage?: number;
}

const DEFAULT_FILTERS: FilterState = {
    priceRange: [0, 100000000000], // 100 milyar TL
    kmRange: [0, 1000000], // 1 milyon km
    yearRange: [1990, 2025],
    fuelType: "",
    gearType: "",
    damageStatus: "",
    hasDamageRecord: "any",
    maxDamageAmount: 100000000, // 100 milyon TL
    maxDamagedParts: 10,
};

export function Sidebar({
    onFilterChange,
    initialFilters = DEFAULT_FILTERS,
    maxPrice = 100000000000,
    maxKm = 1000000,
    maxYear = 2025,
    minYear = 1990,
    maxDamage = 100000000
}: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentSub = searchParams.get("sub");

    const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState<FilterState>(initialFilters);

    // Effect to sync state with URL
    useEffect(() => {
        if (pathname.startsWith("/category/")) {
            const slug = pathname.split("/")[2];
            const category = CATEGORIES.find(c => c.id === slug || c.subcategories?.some(s => s.id === slug));

            if (category) {
                setExpandedCategory(category.id);
                setActiveCategory(category.id);
                // Show filters for vasita category
                if (category.id === "vasita") {
                    setShowFilters(true);
                }
            }
        } else {
            setActiveCategory(null);
            setExpandedCategory(null);
            setShowFilters(false);
        }
    }, [pathname]);

    const handleCategoryClick = (categoryId: string) => {
        if (expandedCategory === categoryId) {
            setExpandedCategory(null);
        } else {
            setExpandedCategory(categoryId);
        }
    };

    const handleBackToMain = () => {
        setExpandedCategory(null);
        setActiveCategory(null);
    };

    const handleFilterChange = (newFilters: Partial<FilterState>) => {
        const updatedFilters = { ...filters, ...newFilters };
        setFilters(updatedFilters);
        // onFilterChange?.(updatedFilters); // Removed immediate application
    };

    const resetFilters = () => {
        setFilters(DEFAULT_FILTERS);
        onFilterChange?.(DEFAULT_FILTERS);
    };

    const getActiveFilterCount = () => {
        let count = 0;
        if (filters.priceRange[0] !== DEFAULT_FILTERS.priceRange[0] || filters.priceRange[1] !== DEFAULT_FILTERS.priceRange[1]) count++;
        if (filters.kmRange[0] !== DEFAULT_FILTERS.kmRange[0] || filters.kmRange[1] !== DEFAULT_FILTERS.kmRange[1]) count++;
        if (filters.yearRange[0] !== DEFAULT_FILTERS.yearRange[0] || filters.yearRange[1] !== DEFAULT_FILTERS.yearRange[1]) count++;
        if (filters.fuelType) count++;
        if (filters.gearType) count++;
        if (filters.damageStatus) count++;
        if (filters.hasDamageRecord !== "any") count++;
        if (filters.maxDamageAmount !== DEFAULT_FILTERS.maxDamageAmount) count++;
        if (filters.maxDamagedParts !== DEFAULT_FILTERS.maxDamagedParts) count++;
        return count;
    };

    const activeFilterCount = getActiveFilterCount();

    // Filter categories if one is active (Focus Mode)
    const displayedCategories = activeCategory
        ? CATEGORIES.filter(c => c.id === activeCategory)
        : CATEGORIES;

    return (
        <aside className="hidden lg:block w-64 sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto pr-4 transition-all duration-300 space-y-4">
            {/* Categories */}
            <div className="glass-card p-4 space-y-1">
                <div className="flex items-center justify-between mb-3 px-3">
                    <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        {activeCategory ? "Seçili Kategori" : "Kategoriler"}
                    </h2>
                    {activeCategory && (
                        <Link
                            href="/"
                            onClick={handleBackToMain}
                            className="text-xs text-primary hover:underline flex items-center gap-1"
                        >
                            <ArrowLeft className="w-3 h-3" />
                            Tümü
                        </Link>
                    )}
                </div>

                {displayedCategories.map((category) => {
                    const isExpanded = expandedCategory === category.id;
                    const isActive = activeCategory === category.id;

                    return (
                        <div key={category.id} className="space-y-1">
                            <div
                                onClick={() => handleCategoryClick(category.id)}
                                className={cn(
                                    "flex items-center justify-between group px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200",
                                    isActive ? "bg-primary/10 text-primary" : "hover:bg-white/5 text-foreground/80 hover:text-foreground"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    {category.icon && <category.icon className={cn("w-4 h-4 transition-colors", isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary")} />}
                                    <span className="text-sm font-medium">
                                        {category.name}
                                    </span>
                                </div>
                                {category.subcategories && (
                                    isExpanded ? <ChevronDown className="w-3 h-3 opacity-50" /> : <ChevronRight className="w-3 h-3 opacity-50" />
                                )}
                            </div>

                            {/* Subcategories Accordion */}
                            <div className={cn(
                                "grid transition-all duration-300 ease-in-out pl-9 overflow-hidden",
                                isExpanded ? "grid-rows-[1fr] opacity-100 mb-2" : "grid-rows-[0fr] opacity-0"
                            )}>
                                <div className="min-h-0 space-y-1 border-l border-white/10 pl-2">
                                    <Link
                                        href={`/category/${category.id}`}
                                        className={cn(
                                            "block text-sm py-1.5 px-2 rounded-md transition-colors hover:text-primary",
                                            pathname === `/category/${category.id}` && !currentSub ? "text-primary font-medium bg-primary/5" : "text-muted-foreground"
                                        )}
                                    >
                                        Tüm {category.name} İlanları
                                    </Link>
                                    {category.subcategories?.map((sub) => (
                                        <Link
                                            key={sub.id}
                                            href={`/category/${category.id}?sub=${sub.id}`}
                                            className={cn(
                                                "block text-sm py-1.5 px-2 rounded-md transition-colors hover:text-primary",
                                                currentSub === sub.id ? "text-primary font-medium bg-primary/5" : "text-muted-foreground"
                                            )}
                                        >
                                            {sub.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Filters - Only show for vasita */}
            {showFilters && (
                <div className="glass-card p-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <SlidersHorizontal className="w-4 h-4 text-primary" />
                            <h3 className="text-sm font-bold">Filtreler</h3>
                            {activeFilterCount > 0 && (
                                <span className="px-2 py-0.5 bg-primary/20 text-primary text-xs font-bold rounded-full">
                                    {activeFilterCount}
                                </span>
                            )}
                        </div>
                        {activeFilterCount > 0 && (
                            <button
                                onClick={resetFilters}
                                className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                            >
                                <X className="w-3 h-3" />
                                Temizle
                            </button>
                        )}
                    </div>

                    {/* Price Range */}
                    <FilterSlider
                        label="Fiyat Aralığı"
                        min={0}
                        max={maxPrice}
                        step={1000000}
                        value={filters.priceRange}
                        onChange={(value) => handleFilterChange({ priceRange: value })}
                        formatValue={(val) => val.toLocaleString('tr-TR')}
                        unit="₺"
                    />

                    {/* KM Range */}
                    <FilterSlider
                        label="KM Aralığı"
                        min={0}
                        max={maxKm}
                        step={10000}
                        value={filters.kmRange}
                        onChange={(value) => handleFilterChange({ kmRange: value })}
                        formatValue={(val) => val.toLocaleString('tr-TR')}
                        unit="km"
                    />

                    {/* Year Range */}
                    <FilterSlider
                        label="Model Yılı"
                        min={minYear}
                        max={maxYear}
                        step={1}
                        value={filters.yearRange}
                        onChange={(value) => handleFilterChange({ yearRange: value })}
                    />

                    {/* Fuel Type */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Yakıt Tipi</label>
                        <select
                            value={filters.fuelType}
                            onChange={(e) => handleFilterChange({ fuelType: e.target.value })}
                            className="w-full px-3 py-2 text-sm bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary transition-colors"
                        >
                            <option value="">Tümü</option>
                            <option value="Benzin">Benzin</option>
                            <option value="Dizel">Dizel</option>
                            <option value="LPG & Benzin">LPG & Benzin</option>
                            <option value="Hybrid">Hybrid</option>
                            <option value="Elektrik">Elektrik</option>
                        </select>
                    </div>

                    {/* Gear Type */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Vites Tipi</label>
                        <select
                            value={filters.gearType}
                            onChange={(e) => handleFilterChange({ gearType: e.target.value })}
                            className="w-full px-3 py-2 text-sm bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary transition-colors"
                        >
                            <option value="">Tümü</option>
                            <option value="Manuel">Manuel</option>
                            <option value="Otomatik">Otomatik</option>
                            <option value="Yarı Otomatik">Yarı Otomatik</option>
                        </select>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-white/10 pt-4 mt-2">
                        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
                            Hasar Bilgileri
                        </h4>
                    </div>

                    {/* Damage Status */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Hasar Durumu</label>
                        <select
                            value={filters.damageStatus}
                            onChange={(e) => handleFilterChange({ damageStatus: e.target.value })}
                            className="w-full px-3 py-2 text-sm bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary transition-colors"
                        >
                            <option value="">Tümü</option>
                            <option value="Hatasız">Hatasız</option>
                            <option value="Boyalı">Boyalı</option>
                            <option value="Değişen">Değişen</option>
                            <option value="Hasarlı">Hasarlı</option>
                        </select>
                    </div>

                    {/* Damage Record */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Hasar Kaydı</label>
                        <select
                            value={filters.hasDamageRecord}
                            onChange={(e) => handleFilterChange({ hasDamageRecord: e.target.value })}
                            className="w-full px-3 py-2 text-sm bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary transition-colors"
                        >
                            <option value="any">Farketmez</option>
                            <option value="no">Hasar Kaydı Yok</option>
                            <option value="yes">Hasar Kaydı Var</option>
                        </select>
                    </div>

                    {/* Max Damage Amount */}
                    <FilterSlider
                        label="Max Hasar Bedeli"
                        min={0}
                        max={maxDamage}
                        step={100000}
                        value={[0, filters.maxDamageAmount]}
                        onChange={(value) => handleFilterChange({ maxDamageAmount: value[1] })}
                        formatValue={(val) => val.toLocaleString('tr-TR')}
                        unit="₺"
                    />

                    {/* Max Damaged Parts Count */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium">Max Hasarlı Parça Sayısı</label>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{filters.maxDamagedParts} parça</span>
                        </div>
                        <input
                            type="range"
                            min={0}
                            max={10}
                            step={1}
                            value={filters.maxDamagedParts}
                            onChange={(e) => handleFilterChange({ maxDamagedParts: Number(e.target.value) })}
                            className="w-full h-2 bg-white/10 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-background"
                        />
                    </div>

                    {/* Apply Button */}
                    <button
                        onClick={() => onFilterChange?.(filters)}
                        className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 mt-4"
                    >
                        Filtreleri Uygula
                    </button>
                </div>
            )}
        </aside>
    );
}
