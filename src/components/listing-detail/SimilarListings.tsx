"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getListings } from "@/lib/actions/listings";
import { cn } from "@/lib/utils";
import { MapPin, Calendar } from "lucide-react";

interface SimilarListingsProps {
    categoryId: string;
    currentListingId: string;
}

export function SimilarListings({ categoryId, currentListingId }: SimilarListingsProps) {
    const [listings, setListings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSimilar = async () => {
            try {
                // Fetch listings in the same category
                const result = await getListings({
                    categoryId,
                    limit: 5, // Fetch a few similar items
                });

                if (result.success && result.data) {
                    // Filter out current listing
                    const filtered = result.data.filter((l: any) => l.id !== currentListingId);
                    setListings(filtered);
                }
            } catch (error) {
                console.error("Error fetching similar listings:", error);
            } finally {
                setLoading(false);
            }
        };

        if (categoryId) {
            fetchSimilar();
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
            <h2 className="text-xl font-semibold border-b border-white/10 pb-4">Benzer İlanlar</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {listings.map((listing) => (
                    <Link
                        key={listing.id}
                        href={`/listing/${listing.id}`}
                        className="group glass-card overflow-hidden hover:border-brand-gold/50 transition-all duration-300"
                    >
                        {/* Image */}
                        <div className="relative aspect-[4/3] overflow-hidden">
                            <Image
                                src={listing.images[0]?.url || "/placeholder.svg"}
                                alt={listing.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                            <div className="absolute bottom-2 left-2 right-2 flex justify-between items-end">
                                <span className="text-white font-bold text-lg">
                                    {listing.price.toLocaleString('tr-TR')} TL
                                </span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-4 space-y-2">
                            <h3 className="font-medium text-foreground truncate group-hover:text-brand-gold transition-colors">
                                {listing.title}
                            </h3>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <MapPin className="w-3 h-3" />
                                <span className="truncate">{listing.city}, {listing.district}</span>
                            </div>
                            <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs text-muted-foreground">
                                <span>{listing.model}</span>
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {new Date(listing.createdAt).toLocaleDateString('tr-TR')}
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
