import { getNearbyListings } from "@/data/homepage-data";
import { ListingCard } from "@/components/listing/ListingCard";
import { MapPin } from "lucide-react";

export function NearbyListings() {
    const listings = getNearbyListings(4);

    return (
        <section className="py-8 bg-white/5">
            <div className="container mx-auto">
                <div className="flex items-center justify-between mb-6 px-4 md:px-0">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <MapPin className="w-5 h-5 text-primary" />
                            <h2 className="text-xl md:text-2xl font-bold tracking-tight">Yakınınızdakiler</h2>
                        </div>
                        <p className="text-sm text-muted-foreground">Konumunuza özel ilanlar</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-4 md:px-0">
                    {listings.map((listing) => (
                        <ListingCard key={listing.id} listing={listing} />
                    ))}
                </div>
            </div>
        </section>
    );
}
