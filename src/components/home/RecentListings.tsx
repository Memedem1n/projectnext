"use client";

import { ListingCard } from "@/components/listing/ListingCard";
import { SectionHeader } from "./SectionHeader";
import type { Listing } from "@/data/mock-data";

interface RecentListingsProps {
    listings?: Listing[];
}

export function RecentListings({ listings = [] }: RecentListingsProps) {

    return (
        <section className="py-8">
            <div className="container mx-auto">
                <SectionHeader title="Son Eklenenler" href="/category/vasita" description="En yeni ilanları keşfedin" />
                <div className="flex overflow-x-auto pb-8 -mx-4 px-4 md:mx-0 md:px-0 gap-4 md:gap-6 scrollbar-hide snap-x snap-mandatory">
                    {listings.map((listing) => (
                        <div key={listing.id} className="w-[280px] flex-shrink-0 snap-start">
                            <ListingCard listing={listing} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
