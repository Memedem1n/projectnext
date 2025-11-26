import { getPremiumListings } from "@/data/homepage-data";
import { ListingCard } from "@/components/listing/ListingCard";
import { Crown } from "lucide-react";

export function PremiumShowcase() {
    const listings = getPremiumListings(5);

    return (
        <section className="py-8">
            <div className="container mx-auto">
                <div className="flex items-center gap-2 mb-6 px-4 md:px-0">
                    <div className="p-2 bg-brand-gold/20 rounded-full">
                        <Crown className="w-6 h-6 text-brand-gold" />
                    </div>
                    <div>
                        <h2 className="text-xl md:text-2xl font-bold tracking-tight">Premium Vitrin</h2>
                        <p className="text-sm text-muted-foreground">Seçkin ilanlar</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 px-4 md:px-0">
                    {listings.map((listing) => (
                        <ListingCard key={listing.id} listing={listing} />
                    ))}
                </div>
            </div>
        </section>
    );
}
