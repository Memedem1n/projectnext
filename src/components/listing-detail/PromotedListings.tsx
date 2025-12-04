"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getListings } from "@/lib/actions/listings";
import { cn } from "@/lib/utils";
import { MapPin, Calendar, Star } from "lucide-react";

interface PromotedListingsProps {
    categoryId?: string;
    currentListingId: string;
}

export function PromotedListings({ categoryId, currentListingId }: PromotedListingsProps) {
    const [listings, setListings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPromoted = async () => {
            try {
                // Fetch promoted listings (mocking 'isDoping' filter by fetching recent ones for now if API doesn't support it yet)
                // Ideally: getListings({ isDoping: true, categoryId, limit: 4 })
                const result = await getListings({
                    categoryId,
                    limit: 4,
                    // isDoping: true // Uncomment when API supports it
                });

                if (result.success && result.data) {
                    // Filter out current listing and ensure we have some "promoted" look
                    // For now, just taking other listings as placeholders for promoted ones
                    const filtered = result.data.filter((l: any) => l.id !== currentListingId);
                    setListings(filtered);
                }
            } catch (error) {
                console.error("Error fetching promoted listings:", error);
            } finally {
                setLoading(false);
            }
        };

        if (categoryId) {
            fetchPromoted();
        }
    }, [categoryId, currentListingId]);

    if (loading) {
        return <div className="animate-pulse h-64 bg-white/5 rounded-lg" />;
    }

    if (listings.length === 0) {
        return null;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 border-b border-white/10 pb-4">
                <div className="p-1.5 rounded-md bg-brand-gold/20">
                    <Star className="w-5 h-5 text-brand-gold fill-brand-gold" />
                </div>
                <h2 className="text-xl font-semibold">Öne Çıkan İlanlar</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {listings.map((listing) => (
                    <Link
                        key={listing.id}
                        href={`/listing/${listing.id}`}
                        className="group glass-card overflow-hidden border-brand-gold/20 hover:border-brand-gold/50 transition-all duration-300 relative"
                    >
                        {/* Doping Badge */}
                        <div className="absolute top-2 right-2 z-10 bg-brand-gold text-black text-[10px] font-bold px-2 py-1 rounded shadow-lg">
                            ÖNE ÇIKAN
                        </div>

                        {/* Image */}
                        <div className="relative aspect-[4/3] overflow-hidden">
                            <Image
                                src={listing.images[0]?.url || "/placeholder.svg"}
                                alt={listing.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                            <div className="absolute bottom-3 left-3 right-3">
                                <span className="text-white font-bold text-lg block">
                                    {listing.price.toLocaleString('tr-TR')} TL
                                </span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-3 space-y-2 bg-gradient-to-b from-white/5 to-transparent">
                            <h3 className="font-medium text-sm text-foreground truncate group-hover:text-brand-gold transition-colors">
                                {listing.title}
                            </h3>
                            <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                                <MapPin className="w-3 h-3" />
                                <span className="truncate">{listing.city}, {listing.district}</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
