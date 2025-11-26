"use client";

import { useState } from "react";
import { Heart, MapPin, Calendar, Fuel, Gauge, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { toggleFavorite } from "@/lib/actions/favorites";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface FavoritesClientProps {
    initialFavorites: any[];
}

export function FavoritesClient({ initialFavorites }: FavoritesClientProps) {
    const router = useRouter();
    const [favorites, setFavorites] = useState(initialFavorites);

    async function handleRemoveFavorite(favoriteId: string, listingId: string) {
        // Optimistic update
        setFavorites(favorites.filter(f => f.id !== favoriteId));

        const result = await toggleFavorite(listingId);

        if (!result.success) {
            // Revert if failed
            router.refresh();
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Favorilerim</h1>
            </div>

            {/* Listings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.length > 0 ? (
                    favorites.map(({ listing, id: favoriteId }) => (
                        <div key={favoriteId} className="group rounded-2xl bg-white/5 border border-white/10 overflow-hidden hover:border-primary/20 transition-all hover:shadow-lg hover:shadow-primary/5">
                            {/* Image */}
                            <div className="relative aspect-video bg-black/20">
                                {listing.images?.[0]?.url ? (
                                    <img src={listing.images[0].url} alt={listing.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">Resim Yok</div>
                                )}

                                <button
                                    onClick={() => handleRemoveFavorite(favoriteId, listing.id)}
                                    className="absolute top-3 right-3 p-2 rounded-full bg-black/50 text-red-500 hover:bg-black/70 transition-colors backdrop-blur-sm"
                                >
                                    <Heart className="w-5 h-5 fill-current" />
                                </button>

                                <div className="absolute bottom-3 left-3 px-2 py-1 rounded bg-black/50 text-white text-xs backdrop-blur-sm flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    {listing.city} / {listing.district}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-5 space-y-4">
                                <div>
                                    <h3 className="font-bold text-lg group-hover:text-primary transition-colors line-clamp-1">{listing.title}</h3>
                                    <div className="text-primary font-bold text-xl mt-1">
                                        {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(listing.price)}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        {listing.year}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Gauge className="w-4 h-4" />
                                        {listing.km?.toLocaleString()} km
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Fuel className="w-4 h-4" />
                                        {listing.fuel}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Settings className="w-4 h-4" />
                                        {listing.gear}
                                    </div>
                                </div>

                                <Link href={`/listing/${listing.id}`} className="block w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors font-medium text-center">
                                    İlanı Görüntüle
                                </Link>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-20 rounded-2xl bg-white/5 border border-white/5 border-dashed">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 text-muted-foreground">
                            <Heart className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Favori İlan Yok</h3>
                        <p className="text-muted-foreground">Henüz favori ilanınız bulunmuyor.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
