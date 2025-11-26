import { Timer } from "lucide-react";
import { ListingCard } from "@/components/listing/ListingCard";
import { getHotDeals } from "@/data/homepage-data";

export function DealOfTheDay() {
    const deal = getHotDeals(1)[0]; // Get first hot deal

    if (!deal) return null;

    return (
        <section className="py-8">
            <div className="container mx-auto px-4 md:px-0">
                <div className="glass-card p-6 md:p-8 bg-gradient-to-br from-primary/20 to-transparent border-primary/20">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="flex-1 space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-500 text-sm font-bold animate-pulse">
                                <Timer className="w-4 h-4" />
                                Günün Fırsatı
                            </div>
                            <h2 className="text-3xl font-bold">Sınırlı Süre İçin Özel Fiyat</h2>
                            <p className="text-lg text-muted-foreground">
                                Bu fırsat 24 saat içinde sona erecek. Hemen inceleyin ve kaçırmayın.
                            </p>
                            <div className="flex gap-4 text-center">
                                <div className="bg-background/50 backdrop-blur px-4 py-2 rounded-lg min-w-[80px]">
                                    <div className="text-2xl font-bold">05</div>
                                    <div className="text-[10px] uppercase text-muted-foreground">Saat</div>
                                </div>
                                <div className="bg-background/50 backdrop-blur px-4 py-2 rounded-lg min-w-[80px]">
                                    <div className="text-2xl font-bold">42</div>
                                    <div className="text-[10px] uppercase text-muted-foreground">Dakika</div>
                                </div>
                                <div className="bg-background/50 backdrop-blur px-4 py-2 rounded-lg min-w-[80px]">
                                    <div className="text-2xl font-bold">18</div>
                                    <div className="text-[10px] uppercase text-muted-foreground">Saniye</div>
                                </div>
                            </div>
                        </div>
                        <div className="w-full md:w-[400px]">
                            <ListingCard listing={deal} className="shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
