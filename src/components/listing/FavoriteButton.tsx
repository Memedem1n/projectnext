"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { toggleFavorite } from "@/lib/actions/favorites";
import { useRouter } from "next/navigation";

interface FavoriteButtonProps {
    listingId: string;
    isFavorited?: boolean; // Initial state
    className?: string;
}

export function FavoriteButton({ listingId, isFavorited = false, className }: FavoriteButtonProps) {
    const router = useRouter();
    const [liked, setLiked] = useState(isFavorited);
    const [loading, setLoading] = useState(false);

    async function handleToggle(e: React.MouseEvent) {
        e.preventDefault();
        e.stopPropagation();

        if (loading) return;

        // Optimistic update
        const previousLiked = liked;
        setLiked(!liked);
        setLoading(true);

        try {
            const result = await toggleFavorite(listingId);

            if (!result.success) {
                if (result.error === "Oturum açmanız gerekiyor.") {
                    router.push("/login");
                    setLiked(previousLiked); // Revert
                } else {
                    alert(result.error);
                    setLiked(previousLiked); // Revert
                }
            } else {
                setLiked(result.action === "added");
            }
        } catch (error) {
            console.error(error);
            setLiked(previousLiked); // Revert
        } finally {
            setLoading(false);
        }
    }

    return (
        <button
            onClick={handleToggle}
            disabled={loading}
            className={cn(
                "p-2 rounded-full transition-all hover:scale-110 active:scale-95",
                liked ? "bg-red-500/10 text-red-500" : "bg-black/20 text-white hover:bg-black/40",
                className
            )}
        >
            <Heart className={cn("w-5 h-5", liked && "fill-current")} />
        </button>
    );
}
