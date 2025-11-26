import { PRICE_TRENDS } from "@/data/homepage-data";
import { TrendingUp } from "lucide-react";

export function PriceTrends() {
    return (
        <section className="py-8">
            <div className="container mx-auto">
                <div className="flex items-center gap-2 mb-6 px-4 md:px-0">
                    <TrendingUp className="w-6 h-6 text-green-500" />
                    <h2 className="text-xl md:text-2xl font-bold tracking-tight">Fiyat Trendleri</h2>
                </div>

                <div className="glass-card p-6">
                    <div className="h-64 flex items-end justify-between gap-2">
                        {PRICE_TRENDS.map((item) => (
                            <div key={item.label} className="flex flex-col items-center gap-2 flex-1">
                                <div
                                    className="w-full bg-primary/20 rounded-t-lg transition-all hover:bg-primary/40 relative group"
                                    style={{ height: `${(item.value / 150) * 100}%` }}
                                >
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                        {item.value}
                                    </div>
                                </div>
                                <span className="text-xs text-muted-foreground">{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
