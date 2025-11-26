"use client";

import { useEffect, useState } from "react";
import { getUserFavorites, toggleFavorite } from "@/lib/actions/user";
import { Heart, AlertCircle } from "lucide-react";
import { ListingCard } from "@/components/listing/ListingCard";
import { adaptListingToMockFormat } from "@/lib/adapters/listing-adapter";
import type { Listing } from "@/types/listing";

export function FavoritesTab() {
    const [favorites, setFavorites] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadFavorites();
    }, []);

    const loadFavorites = async () => {
        setLoading(true);
        const result = await getUserFavorites();
        if (result.success && result.data) {
            setFavorites(result.data);
        } else {
            setError(result.error || "Favoriler yüklenemedi");
        }
        setLoading(false);
    };

    const handleRemoveFavorite = async (id: string) => {
        const result = await toggleFavorite(id);
        if (result.success) {
            setFavorites(favorites.filter(f => f.id !== id));
        }
    };

    if (loading) {
        return (
            <div className="glass-card p-8 text-center">
                <div className="animate-spin w-8 h-8 border-2 border-brand-gold border-t-transparent rounded-full mx-auto"></div>
                <p className="text-muted-foreground mt-4">Favoriler yükleniyor...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="glass-card p-8 text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">Hata Oluştu</p>
                <p className="text-muted-foreground">{error}</p>
            </div>
        );
    }

    if (favorites.length === 0) {
        return (
            <div className="glass-card p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-2">Favori İlan Yok</h3>
                <p className="text-muted-foreground">Beğendiğiniz ilanları favorilere ekleyin</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {favorites.map((listing) => (
                <div key={listing.id} className="relative">
                    <ListingCard listing={adaptListingToMockFormat(listing)} />
                    <button
                        onClick={() => handleRemoveFavorite(listing.id)}
                        className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors z-10"
                    >
                        <Heart className="w-4 h-4 fill-current" />
                    </button>
                </div>
            ))}
        </div>
    );
}
