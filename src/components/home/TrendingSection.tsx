import { getTrendingListings } from "@/data/homepage-data";
import { ListingCard } from "@/components/listing/ListingCard";
import { SectionHeader } from "./SectionHeader";

export function TrendingSection() {
    const listings = getTrendingListings(8);

    return (
        <section className="py-8 bg-white/5">
            <div className="container mx-auto">
                <SectionHeader title="Haftanın Trendleri" description="En çok ilgi gören ilanlar" />
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4 md:px-0">
                    {listings.map((listing) => (
                        <ListingCard key={listing.id} listing={listing} />
                    ))}
                </div>
            </div>
        </section>
    );
}
