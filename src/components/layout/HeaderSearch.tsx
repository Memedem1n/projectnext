"use client";

import { Search, X, ChevronRight, Car } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { type SearchSuggestion } from "@/lib/search-utils";

export function HeaderSearch() {
    const [searchQuery, setSearchQuery] = useState("");
    const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);

    const searchRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

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
                        const serverSuggestions: SearchSuggestion[] = result.data.map((cat: any) => ({
                            id: cat.id,
                            type: 'category',
                            title: cat.title,
                            subtitle: cat.subtitle,
                            url: cat.url,
                            icon: Car,
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

        const timeoutId = setTimeout(fetchSuggestions, 300);
        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    const handleSearch = (url?: string) => {
        if (url) {
            router.push(url);
        } else if (searchQuery.trim().length > 0) {
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
        <div ref={searchRef} className="hidden md:flex flex-1 max-w-xl mx-auto relative group">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search className="w-3.5 h-3.5 text-muted-foreground group-focus-within:text-brand-gold transition-colors" />
            </div>
            <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => searchQuery.length >= 2 && setShowSuggestions(true)}
                placeholder="Kelime, ilan no veya mağaza adı ile ara"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-2 pl-10 pr-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold/50 transition-all placeholder:text-muted-foreground/70 h-9"
            />

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
                            const isSelected = index === selectedIndex;
                            return (
                                <div
                                    key={suggestion.id}
                                    onClick={() => handleSearch(suggestion.url)}
                                    onMouseEnter={() => setSelectedIndex(index)}
                                    className={cn(
                                        "px-3 py-2 flex items-center gap-3 cursor-pointer transition-colors",
                                        isSelected ? "bg-white/10" : "hover:bg-white/5"
                                    )}
                                >
                                    <div className="flex-1 min-w-0">
                                        <div className={cn("text-sm font-medium truncate", isSelected ? "text-brand-gold" : "text-foreground")}>
                                            {suggestion.title}
                                        </div>
                                        <div className="text-xs text-muted-foreground truncate">
                                            {suggestion.subtitle}
                                        </div>
                                    </div>
                                    {isSelected && <ChevronRight className="w-3 h-3 text-brand-gold" />}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
