import { POPULAR_SEARCHES } from "@/data/homepage-data";
import { Search, TrendingUp, TrendingDown, Minus } from "lucide-react";
import Link from "next/link";

export function PopularSearches() {
    return (
        <section className="py-8">
            <div className="container mx-auto">
                <div className="flex items-center gap-2 mb-6 px-4 md:px-0">
                    <Search className="w-6 h-6 text-primary" />
                    <h2 className="text-xl md:text-2xl font-bold tracking-tight">Popüler Aramalar</h2>
                </div>

                <div className="flex flex-wrap gap-3 px-4 md:px-0">
                    {POPULAR_SEARCHES.map((item, index) => (
                        <Link
                            key={index}
                            href={`/search?q=${item.term}`}
                            className="glass-card px-4 py-2 flex items-center gap-2 hover:bg-white/10 transition-colors"
                        >
                            <span className="text-sm font-medium">{item.term}</span>
                            <span className="text-xs text-muted-foreground">({item.count})</span>
                            {item.trend === 'up' && <TrendingUp className="w-3 h-3 text-green-500" />}
                            {item.trend === 'down' && <TrendingDown className="w-3 h-3 text-red-500" />}
                            {item.trend === 'stable' && <Minus className="w-3 h-3 text-gray-500" />}
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
