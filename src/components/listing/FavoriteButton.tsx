"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Heart, Plus, X, Check, List } from "lucide-react";
import { cn } from "@/lib/utils";
import { toggleFavorite, getUserFavoriteLists, createFavoriteList } from "@/lib/actions/favorites";
import { useRouter } from "next/navigation";

interface FavoriteButtonProps {
    listingId: string;
    isFavorited?: boolean; // Initial state
    className?: string;
}

export function FavoriteButton({ listingId, isFavorited = false, className }: FavoriteButtonProps) {
    const router = useRouter();
    const [liked, setLiked] = useState(isFavorited);
    const [showModal, setShowModal] = useState(false);
    const [lists, setLists] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [newListName, setNewListName] = useState("");
    const [creatingList, setCreatingList] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (showModal) {
            loadLists();
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [showModal]);

    async function loadLists() {
        const result = await getUserFavoriteLists();
        if (result.success) {
            setLists(result.data || []);
        }
    }

    async function handleHeartClick(e: React.MouseEvent) {
        e.preventDefault();
        e.stopPropagation();

        // If not logged in, this will fail on server side, but we should handle redirect.
        // For now, let's try to open modal. If fetching lists fails with "Not authenticated", we redirect.

        setShowModal(true);
    }

    async function handleToggle(listId?: string) {
        setLoading(true);
        const result = await toggleFavorite(listingId, listId);
        setLoading(false);

        if (!result.success) {
            if (result.error === "Oturum açmanız gerekiyor.") {
                router.push("/login");
            } else {
                alert(result.error);
            }
            return;
        }

        // If we just toggled the default list (null), update the main heart icon
        if (!listId) {
            setLiked(result.action === "added");
        }

        // Refresh lists to show updated counts or status if we had that info
        loadLists();
    }

    async function handleCreateList() {
        if (!newListName.trim()) return;
        setCreatingList(true);
        const result = await createFavoriteList(newListName);
        setCreatingList(false);

        if (result.success) {
            setNewListName("");
            loadLists();
        } else {
            alert(result.error);
        }
    }

    const ModalContent = () => (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setShowModal(false)}>
            <div
                className="bg-[#121212] border border-white/10 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-brand-gold/10 rounded-lg">
                            <Heart className="w-4 h-4 text-brand-gold" />
                        </div>
                        <h3 className="font-semibold text-white">Favorilere Ekle</h3>
                    </div>
                    <button
                        onClick={() => setShowModal(false)}
                        className="p-1.5 hover:bg-white/10 rounded-full text-muted-foreground hover:text-white transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="p-4 space-y-4">
                    {/* Default List */}
                    <button
                        onClick={() => handleToggle(undefined)}
                        className={cn(
                            "w-full flex items-center justify-between p-3 rounded-xl border transition-all group",
                            liked
                                ? "bg-brand-gold/10 border-brand-gold/20 text-brand-gold"
                                : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10 text-muted-foreground hover:text-white"
                        )}
                    >
                        <div className="flex items-center gap-3">
                            <Heart className={cn("w-5 h-5", liked && "fill-current")} />
                            <span className="font-medium">Genel Favoriler</span>
                        </div>
                        {liked && <Check className="w-4 h-4" />}
                    </button>

                    {/* User Lists */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 px-1 pb-1">
                            <List className="w-3 h-3 text-muted-foreground" />
                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Özel Listelerim</p>
                        </div>

                        <div className="max-h-[200px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                            {lists.length === 0 ? (
                                <div className="text-center py-4 text-sm text-muted-foreground bg-white/5 rounded-xl border border-dashed border-white/10">
                                    Henüz özel bir listeniz yok
                                </div>
                            ) : (
                                lists.map(list => {
                                    // We don't have isFavorited info for each list in this simple implementation yet
                                    // But we can show the count
                                    return (
                                        <button
                                            key={list.id}
                                            onClick={() => handleToggle(list.id)}
                                            className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-colors group"
                                        >
                                            <span className="font-medium text-sm text-gray-300 group-hover:text-white">{list.name}</span>
                                            <span className="text-xs px-2 py-1 rounded-full bg-black/20 text-muted-foreground">
                                                {list._count?.favorites || 0}
                                            </span>
                                        </button>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* Create New List */}
                    <div className="pt-3 border-t border-white/10">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Yeni liste oluştur..."
                                value={newListName}
                                onChange={e => setNewListName(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleCreateList()}
                                className="flex-1 bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-gold/50 focus:ring-1 focus:ring-brand-gold/50 transition-all placeholder:text-muted-foreground/50"
                            />
                            <button
                                onClick={handleCreateList}
                                disabled={creatingList || !newListName.trim()}
                                className="px-3 py-2 bg-brand-gold text-black font-medium rounded-lg hover:bg-brand-gold/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <button
                onClick={handleHeartClick}
                className={cn(
                    "p-2 rounded-full transition-all hover:scale-110 active:scale-95",
                    liked ? "bg-red-500/10 text-red-500" : "bg-black/20 text-white hover:bg-black/40",
                    className
                )}
            >
                <Heart className={cn("w-5 h-5", liked && "fill-current")} />
            </button>

            {showModal && mounted && createPortal(<ModalContent />, document.body)}
        </>
    );
}
