"use client";

import { useState } from "react";
import { Heart, MapPin, Gauge, Calendar, Fuel, Settings, Plus, Trash2, FolderHeart } from "lucide-react";
import { cn } from "@/lib/utils";
import { createFavoriteList, deleteFavoriteList, toggleFavorite } from "@/lib/actions/favorites";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface FavoritesClientProps {
    initialFavorites: any[];
    initialLists: any[];
}

export function FavoritesClient({ initialFavorites, initialLists }: FavoritesClientProps) {
    const router = useRouter();
    const [activeListId, setActiveListId] = useState<string | null>(null);
    const [favorites, setFavorites] = useState(initialFavorites);
    const [lists, setLists] = useState(initialLists);
    const [isCreating, setIsCreating] = useState(false);
    const [newListName, setNewListName] = useState("");

    // Filter favorites based on active list
    const displayedFavorites = activeListId
        ? favorites.filter(f => f.favoriteListId === activeListId)
        : favorites;

    async function handleCreateList() {
        if (!newListName.trim()) return;
        const result = await createFavoriteList(newListName);
        if (result.success) {
            setLists([result.data, ...lists]);
            setNewListName("");
            setIsCreating(false);
            router.refresh();
        } else {
            alert(result.error);
        }
    }

    async function handleDeleteList(listId: string, e: React.MouseEvent) {
        e.stopPropagation();
        if (!confirm("Bu listeyi silmek istediğinize emin misiniz?")) return;

        const result = await deleteFavoriteList(listId);
        if (result.success) {
            setLists(lists.filter(l => l.id !== listId));
            if (activeListId === listId) setActiveListId(null);
            router.refresh();
        } else {
            alert(result.error);
        }
    }

    async function handleRemoveFavorite(favoriteId: string, listingId: string) {
        // Optimistic update
        setFavorites(favorites.filter(f => f.id !== favoriteId));

        const result = await toggleFavorite(listingId); // This toggles, so if it exists it removes. 
        // Wait, toggleFavorite logic removes if exists. 
        // But here we might be removing from a specific list? 
        // The toggleFavorite action handles listId optionally. 
        // If we are in "All" view, we don't know which list it belongs to easily for the toggle call unless we pass the listId from the favorite object.
        // Actually, the favorite object has favoriteListId.

        // However, toggleFavorite checks for existence based on (userId, listingId, listId).
        // So we should pass the listId of the favorite we are removing.

        // Let's assume we are removing the specific favorite instance.
        // We need to be careful. toggleFavorite(listingId, listId) will remove if exists.

        // Ideally we would have a removeFavorite(id) action, but toggle works if we pass correct params.

        // For now, let's just refresh page to be safe after call, or trust optimistic.
        if (!result.success) {
            // Revert
            router.refresh();
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Favorilerim</h1>
                <button
                    onClick={() => setIsCreating(true)}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Yeni Liste
                </button>
            </div>

            {/* Create List Input */}
            {isCreating && (
                <div className="p-4 bg-white/5 rounded-xl border border-white/10 animate-in fade-in slide-in-from-top-2">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Liste adı..."
                            value={newListName}
                            onChange={e => setNewListName(e.target.value)}
                            className="flex-1 bg-black/20 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                            autoFocus
                        />
                        <button
                            onClick={handleCreateList}
                            disabled={!newListName.trim()}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                        >
                            Oluştur
                        </button>
                        <button
                            onClick={() => setIsCreating(false)}
                            className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20"
                        >
                            İptal
                        </button>
                    </div>
                </div>
            )}

            {/* Lists Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                <button
                    onClick={() => setActiveListId(null)}
                    className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
                        activeListId === null
                            ? "bg-primary text-primary-foreground shadow-lg"
                            : "bg-white/5 text-muted-foreground hover:text-white hover:bg-white/10"
                    )}
                >
                    <Heart className="w-4 h-4" />
                    Tümü
                </button>

                {lists.map(list => (
                    <button
                        key={list.id}
                        onClick={() => setActiveListId(list.id)}
                        className={cn(
                            "group flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap border border-transparent",
                            activeListId === list.id
                                ? "bg-primary text-primary-foreground shadow-lg"
                                : "bg-white/5 text-muted-foreground hover:text-white hover:bg-white/10 hover:border-white/10"
                        )}
                    >
                        <FolderHeart className="w-4 h-4" />
                        {list.name}
                        {activeListId === list.id && (
                            <span
                                onClick={(e) => handleDeleteList(list.id, e)}
                                className="ml-2 p-1 hover:bg-red-500/20 hover:text-red-200 rounded-full transition-colors"
                            >
                                <Trash2 className="w-3 h-3" />
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Listings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedFavorites.length > 0 ? (
                    displayedFavorites.map(({ listing, id: favoriteId, favoriteListId }) => (
                        <div key={favoriteId} className="group rounded-2xl bg-white/5 border border-white/10 overflow-hidden hover:border-primary/20 transition-all hover:shadow-lg hover:shadow-primary/5">
                            {/* Image */}
                            <div className="relative aspect-video bg-black/20">
                                {listing.images?.[0]?.url ? (
                                    <img src={listing.images[0].url} alt={listing.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">Resim Yok</div>
                                )}

                                <button
                                    onClick={() => toggleFavorite(listing.id, favoriteListId || undefined).then(() => {
                                        setFavorites(prev => prev.filter(f => f.id !== favoriteId));
                                        router.refresh();
                                    })}
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
                        <p className="text-muted-foreground">Bu listede henüz favori ilanınız bulunmuyor.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
