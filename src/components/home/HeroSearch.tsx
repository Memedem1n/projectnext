/* eslint-disable */
"use client";

import { Search, TrendingUp, TrendingDown, Minus, Home, Car, Monitor, Briefcase, Wrench, Tractor, ChevronRight, X } from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { POPULAR_SEARCHES } from "@/data/homepage-data";
import { useRouter } from "next/navigation";
import { getSearchSuggestions, type SearchSuggestion } from "@/lib/search-utils";
import { cn } from "@/lib/utils";

// Manual category list to ensure all categories are shown regardless of data/categories.ts
const HERO_CATEGORIES = [
    { id: "ikinci-el", name: "İkinci El", icon: Monitor },
    { id: "yedek-parca", name: "Yedek Parça", icon: Wrench },
    { id: "emlak", name: "Emlak", icon: Home },
    { id: "vasita", name: "Vasıta", icon: Car },
    { id: "is-makineleri", name: "İş Makineleri", icon: Tractor },
    { id: "is-ilanlari", name: "İş İlanları", icon: Briefcase }
];

export function HeroSearch() {
    const [searchQuery, setSearchQuery] = useState("");
    const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);

    const searchRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const isFullyActive = (catId: string) => catId === 'emlak' || catId === 'vasita';

    // Click outside handler
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Search logic
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (searchQuery.trim().length >= 2) {
                try {
                    const { searchCategories } = await import('@/lib/actions/categories');
                    const result = await searchCategories(searchQuery);
                    if (result.success && result.data) {
                        // Map server results to suggestion format
                        const serverSuggestions: SearchSuggestion[] = result.data.map((cat: any) => ({
                            id: cat.id,
                            type: 'category',
                            title: cat.title,
                            subtitle: cat.subtitle,
                            url: cat.url,
                            icon: Car, // Default icon, logic can be improved
                            score: 100
                        }));
                        setSuggestions(serverSuggestions);
                        setShowSuggestions(true);
                    }
                } catch (error) {
                    console.error('Search error:', error);
                }
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        };

        const timeoutId = setTimeout(fetchSuggestions, 300); // Debounce
        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    const handleSearch = (url?: string) => {
        if (url) {
            router.push(url);
        } else if (searchQuery.trim().length > 0) {
            // Default search action if no specific suggestion selected
            router.push(`/category/vasita?search=${encodeURIComponent(searchQuery.trim())}`);
        }
        setShowSuggestions(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setSelectedIndex(prev => (prev > -1 ? prev - 1 : prev));
        } else if (e.key === "Enter") {
            e.preventDefault();
            if (selectedIndex >= 0 && suggestions[selectedIndex]) {
                handleSearch(suggestions[selectedIndex].url);
            } else {
                handleSearch();
            }
        } else if (e.key === "Escape") {
            setShowSuggestions(false);
            inputRef.current?.blur();
        }
    };

    return (
        <div className="space-y-8 relative z-50">
            {/* Search Bar */}
            <div ref={searchRef} className="relative max-w-2xl mx-auto">
                <div className={cn(
                    "glass-card p-2 md:p-3 flex items-center gap-2 md:gap-3 shadow-2xl transition-all duration-300",
                    showSuggestions && suggestions.length > 0 ? "rounded-t-2xl rounded-b-none border-b-0" : "rounded-2xl"
                )}>
                    <Search className="w-6 h-6 text-muted-foreground ml-2" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onFocus={() => searchQuery.length >= 2 && setShowSuggestions(true)}
                        placeholder="Aradığınız ürünü veya hizmeti yazın..."
                        className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground text-base md:text-lg min-w-0"
                    />
                    {searchQuery.length > 0 && (
                        <button
                            onClick={() => { setSearchQuery(""); setSuggestions([]); inputRef.current?.focus(); }}
                            className="p-1 hover:bg-white/10 rounded-full text-muted-foreground"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                    <button
                        onClick={() => handleSearch()}
                        className="bg-brand-gold hover:bg-brand-gold/90 text-[#1c1917] px-6 py-3 md:px-8 md:py-4 rounded-xl font-bold transition-all hover:scale-105 active:scale-95 text-base md:text-lg whitespace-nowrap shadow-lg shadow-brand-gold/20 flex items-center justify-center"
                    >
                        Ara
                    </button>
                </div>

                {/* Suggestions Dropdown */}
                {showSuggestions && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-[#0f0f11]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 max-h-[400px] overflow-y-auto">

                        {/* Promoted Suggestions (Doping) */}
                        {searchQuery.length >= 2 && (
                            <div className="p-2 bg-gradient-to-r from-brand-gold/10 to-transparent border-b border-white/5">
                                <div className="text-[10px] font-bold text-brand-gold uppercase tracking-wider mb-2 px-2">Öne Çıkanlar</div>
                                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                                    {/* Mock Promoted Items */}
                                    {[1, 2].map((i) => (
                                        <div key={i} className="min-w-[140px] bg-black/40 rounded-lg p-2 border border-brand-gold/30 cursor-pointer hover:bg-black/60 transition-colors group">
                                            <div className="relative h-20 w-full mb-2 rounded-md overflow-hidden">
                                                <div className="absolute inset-0 bg-gray-800 animate-pulse" /> {/* Placeholder Image */}
                                                <div className="absolute top-1 left-1 bg-brand-gold text-black text-[8px] font-bold px-1.5 py-0.5 rounded">Fırsat</div>
                                            </div>
                                            <div className="text-xs font-medium text-white truncate group-hover:text-brand-gold">Sahibinden Temiz</div>
                                            <div className="text-[10px] text-gray-400">İstanbul, Kadıköy</div>
                                            <div className="text-xs font-bold text-brand-gold mt-1">1.250.000 TL</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="py-1">
                            {suggestions.map((suggestion, index) => {
                                const Icon = suggestion.icon;
                                const isSelected = index === selectedIndex;

                                return (
                                    <div
                                        key={suggestion.id}
                                        onClick={() => handleSearch(suggestion.url)}
                                        onMouseEnter={() => setSelectedIndex(index)}
                                        className={cn(
                                            "px-4 py-3 flex items-center gap-4 cursor-pointer transition-colors",
                                            isSelected ? "bg-white/10" : "hover:bg-white/5"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                                            isSelected ? "bg-brand-gold/20 text-brand-gold" : "bg-white/5 text-muted-foreground"
                                        )}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className={cn("font-medium truncate", isSelected ? "text-brand-gold" : "text-foreground")}>
                                                {suggestion.title}
                                            </div>
                                            <div className="text-xs text-muted-foreground truncate flex items-center gap-1">
                                                {suggestion.subtitle}
                                                <ChevronRight className="w-3 h-3 opacity-50" />
                                            </div>
                                        </div>
                                        {isSelected && (
                                            <ChevronRight className="w-4 h-4 text-brand-gold" />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Popular Searches - Wide Layout with Only Active Category Searches */}
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-center gap-2 mb-5">
                    <TrendingUp className="w-4 h-4 text-brand-gold/60" />
                    <span className="text-sm font-medium text-muted-foreground/60">Popüler Aramalar</span>
                </div>
                <div className="flex flex-wrap gap-0 px-4 justify-center items-center">
                    {POPULAR_SEARCHES
                        .filter(item =>
                            // Only show searches related to Emlak and Vasıta
                            item.term.toLowerCase().includes('bmw') ||
                            item.term.toLowerCase().includes('kiralık') ||
                            item.term.toLowerCase().includes('daire') ||
                            item.term.toLowerCase().includes('toyota') ||
                            item.term.toLowerCase().includes('villa') ||
                            item.term.toLowerCase().includes('corolla')
                        )
                        .slice(0, 6)
                        .map((item, index, arr) => {
                            const TrendIcon = item.trend === 'up' ? TrendingUp
                                : item.trend === 'down' ? TrendingDown
                                    : Minus;
                            const trendColor = item.trend === 'up' ? 'text-green-400'
                                : item.trend === 'down' ? 'text-red-400'
                                    : 'text-gray-400';

                            return (
                                <div key={index} className="flex items-center">
                                    <Link
                                        href={`/search?q=${item.term}`}
                                        className="group px-5 py-3 hover:bg-white/5 rounded-lg transition-all flex items-center gap-3"
                                    >
                                        <span className="text-sm md:text-base font-medium group-hover:text-brand-gold transition-colors">
                                            {item.term}
                                        </span>
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-xs text-muted-foreground/60">({item.count})</span>
                                            <TrendIcon className={`w-4 h-4 ${trendColor}`} />
                                        </div>
                                    </Link>
                                    {index < arr.length - 1 && (
                                        <div className="hidden md:block w-px h-8 bg-white/10" />
                                    )}
                                </div>
                            );
                        })}
                </div>
            </div>

            {/* Categories - Grid Layout with Emlak & Vasıta in Center */}
            <div className="max-w-5xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 px-4">
                    {HERO_CATEGORIES.map((cat) => {
                        const Icon = cat.icon;
                        const isActive = isFullyActive(cat.id);

                        return (
                            <Link
                                key={cat.id}
                                href={isActive ? `/category/${cat.id}` : "#"}
                                onClick={(e) => {
                                    if (!isActive) {
                                        e.preventDefault();
                                    }
                                }}
                                className={`group flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all relative ${isActive
                                    ? 'bg-gradient-to-br from-white/10 to-white/5 hover:from-brand-gold/20 hover:to-brand-gold/10 border-white/10 hover:border-brand-gold/30 hover:scale-105 cursor-pointer'
                                    : 'bg-gradient-to-br from-white/5 to-white/[0.02] border-white/5 opacity-75 cursor-not-allowed'
                                    }`}
                            >
                                {/* Coming Soon Badge */}
                                {!isActive && (
                                    <div className="absolute -top-2 -right-2 bg-amber-500/90 text-white text-[10px] font-bold px-2 py-1 rounded-full z-10 shadow-lg">
                                        Yakında
                                    </div>
                                )}

                                <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all ${isActive
                                    ? 'bg-brand-gold/20 group-hover:bg-brand-gold/30 group-hover:scale-110'
                                    : 'bg-brand-gold/10'
                                    }`}>
                                    <Icon className={`w-7 h-7 ${isActive ? 'text-brand-gold' : 'text-brand-gold/50'}`} />
                                </div>
                                <span className={`text-xs md:text-sm font-semibold text-center transition-colors leading-tight ${isActive
                                    ? 'group-hover:text-brand-gold'
                                    : 'text-muted-foreground/60'
                                    }`}>
                                    {cat.name}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
