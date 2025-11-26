import { getHotDeals } from "@/data/homepage-data";
import { ListingCard } from "@/components/listing/ListingCard";
import { Flame } from "lucide-react";

export function HotDeals() {
    const listings = getHotDeals(6);

    return (
        <section className="py-8">
            <div className="container mx-auto">
                <div className="flex items-center gap-2 mb-6 px-4 md:px-0">
                    <div className="p-2 bg-orange-500/20 rounded-full">
                        <Flame className="w-6 h-6 text-orange-500" />
                    </div>
                    <div>
                        <h2 className="text-xl md:text-2xl font-bold tracking-tight">Sıcak Fırsatlar</h2>
                        <p className="text-sm text-muted-foreground">Kaçırılmayacak fiyatlar</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 px-4 md:px-0">
                    {listings.map((listing) => (
                        <ListingCard key={listing.id} listing={listing} compact />
                    ))}
                </div>
            </div>
        </section>
    );
}
