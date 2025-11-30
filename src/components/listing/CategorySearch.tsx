"use client";

import { useState, useEffect } from "react";
import { Search, ChevronRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { getCategories, searchCategories } from "@/lib/actions/categories";
import { useDebounce } from "use-debounce";
import { Category } from "@prisma/client";

interface CategorySearchProps {
    onSelect: (category: Category, subcategory?: Category) => void;
}

export function CategorySearch({ onSelect }: CategorySearchProps) {
    const [query, setQuery] = useState("");
    const [debouncedQuery] = useDebounce(query, 300);

    const [rootCategories, setRootCategories] = useState<Category[]>([]);
    const [results, setResults] = useState<{ parent: Category | null; category: Category }[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch root categories on mount
    useEffect(() => {
        const fetchRoots = async () => {
            const res = await getCategories(null);
            if (res.success && res.data) {
                setRootCategories(res.data);
            }
        };
        fetchRoots();
    }, []);

    // Search when query changes
    useEffect(() => {
        const performSearch = async () => {
            if (!debouncedQuery.trim()) {
                setResults([]);
                return;
            }

            setIsLoading(true);
            const res = await searchCategories(debouncedQuery);
            setIsLoading(false);

            if (res.success && res.data) {
                // Transform to flat list with parent context
                const formattedResults = res.data.map((cat: any) => ({
                    parent: cat.parent,
                    category: cat
                }));
                setResults(formattedResults);
            }
        };

        performSearch();
    }, [debouncedQuery]);

    return (
        <div className="w-full max-w-2xl mx-auto space-y-4">
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Kategori veya ürün ara... (Örn: Otomobil, Telefon)"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:border-primary transition-colors text-lg"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    autoFocus
                />
                {isLoading && (
                    <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground animate-spin" />
                )}
            </div>

            {/* Show root categories when query is empty */}
            {!query && rootCategories.length > 0 && (
                <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden max-h-[400px] overflow-y-auto custom-scrollbar">
                    <div className="p-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Ana Kategoriler
                    </div>
                    {rootCategories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => onSelect(cat)}
                            className="w-full flex items-center justify-between p-4 hover:bg-primary/10 transition-colors text-left border-b border-white/5 last:border-0 group"
                        >
                            <div className="flex items-center gap-3">
                                {/* We can map icons dynamically if needed, or use a generic icon */}
                                <div className="font-medium group-hover:text-primary transition-colors">
                                    {cat.name}
                                </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                        </button>
                    ))}
                </div>
            )}

            {/* Search Results */}
            {query && results.length > 0 && (
                <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden max-h-[300px] overflow-y-auto custom-scrollbar">
                    {results.map((result, index) => (
                        <button
                            key={`${result.category.id}-${index}`}
                            onClick={() => onSelect(result.parent || result.category, result.parent ? result.category : undefined)}
                            className="w-full flex items-center justify-between p-4 hover:bg-primary/10 transition-colors text-left border-b border-white/5 last:border-0"
                        >
                            <div className="flex items-center gap-3">
                                {result.parent ? (
                                    <>
                                        <div className="text-muted-foreground">
                                            {result.parent.name}
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
                                        <div className="font-medium text-primary">
                                            {result.category.name}
                                        </div>
                                    </>
                                ) : (
                                    <div className="font-medium text-primary">
                                        {result.category.name}
                                    </div>
                                )}
                            </div>
                            <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        </button>
                    ))}
                </div>
            )}

            {query && !isLoading && results.length === 0 && (
                <div className="text-center p-4 text-muted-foreground">
                    Sonuç bulunamadı.
                </div>
            )}
        </div>
    );
}
