"use client";

import { useState, useEffect } from "react";
import { Search, ChevronRight } from "lucide-react";
import { CATEGORIES, Category } from "@/data/categories";
import { cn } from "@/lib/utils";

interface CategorySearchProps {
    onSelect: (categoryId: string, subcategoryId?: string) => void;
}

export function CategorySearch({ onSelect }: CategorySearchProps) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<{ category: Category; subcategory?: Category }[]>([]);

    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return;
        }

        const searchResults: { category: Category; subcategory?: Category }[] = [];
        const lowerQuery = query.toLowerCase();

        CATEGORIES.forEach((cat) => {
            // Check main category
            if (cat.name.toLowerCase().includes(lowerQuery)) {
                searchResults.push({ category: cat });
            }

            // Check subcategories
            if (cat.subcategories) {
                cat.subcategories.forEach((sub) => {
                    if (sub.name.toLowerCase().includes(lowerQuery)) {
                        searchResults.push({ category: cat, subcategory: sub });
                    }
                });
            }
        });

        setResults(searchResults);
    }, [query]);

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
            </div>

            {/* Show main categories when query is empty */}
            {!query && (
                <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden max-h-[400px] overflow-y-auto custom-scrollbar">
                    <div className="p-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Ana Kategoriler
                    </div>
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => onSelect(cat.id)}
                            className="w-full flex items-center justify-between p-4 hover:bg-primary/10 transition-colors text-left border-b border-white/5 last:border-0 group"
                        >
                            <div className="flex items-center gap-3">
                                {cat.icon && <cat.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />}
                                <div className="font-medium group-hover:text-primary transition-colors">
                                    {cat.name}
                                </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                        </button>
                    ))}
                </div>
            )}

            {query && results.length > 0 && (
                <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden max-h-[300px] overflow-y-auto custom-scrollbar">
                    {results.map((result, index) => (
                        <button
                            key={`${result.category.id}-${result.subcategory?.id || "main"}-${index}`}
                            onClick={() => onSelect(result.category.id, result.subcategory?.id)}
                            className="w-full flex items-center justify-between p-4 hover:bg-primary/10 transition-colors text-left border-b border-white/5 last:border-0"
                        >
                            <div className="flex items-center gap-3">
                                <div className="text-muted-foreground">
                                    {result.category.name}
                                </div>
                                {result.subcategory && (
                                    <>
                                        <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
                                        <div className="font-medium text-primary">
                                            {result.subcategory.name}
                                        </div>
                                    </>
                                )}
                            </div>
                            <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        </button>
                    ))}
                </div>
            )}

            {query && results.length === 0 && (
                <div className="text-center p-4 text-muted-foreground">
                    Sonuç bulunamadı.
                </div>
            )}
        </div>
    );
}
