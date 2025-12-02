"use client";

import Link from "next/link";
import Image from "next/image";
import { Repeat } from "lucide-react";
import { cn } from "@/lib/utils";
import { useComparison } from "@/context/ComparisonContext";
import { FavoriteButton } from "./FavoriteButton";
import { DopingBorder } from "@/components/ui/DopingBorder";

interface ListingCardProps {
    listing: any; // Using any for now to support both mock and real data structures if they differ
    className?: string;
    showCompare?: boolean;
    compact?: boolean;
    viewMode?: "grid" | "list";
}

export function ListingCard({ listing, className, showCompare = true, compact = false, viewMode = "grid" }: ListingCardProps) {
    const { addToCompare, isInCompare } = useComparison();

    // Handle different data structures (mock vs real)
    const listingId = listing.id;
    const listingTitle = listing.title;
    const listingPrice = listing.price;
    const listingDate = listing.date || new Date(listing.createdAt).toLocaleDateString('tr-TR');
    const listingImage = listing.image || (listing.images && listing.images[0]?.url) || "/placeholder.png";
    const isDoping = listing.isDoping || false;

    return (
        <DopingBorder isActive={isDoping} className={cn("h-full", className)}>
            <Link
                href={`/listing/${listingId}`}
                prefetch={true}
                className={cn(
                    "group glass-card !p-0 overflow-hidden hover:shadow-primary/20 cursor-pointer block transition-all duration-300 hover:scale-[1.02] h-full flex flex-col",
                    viewMode === "list" ? "flex-row" : "flex-col",
                    // If doping is active, we remove the default border/bg styles that might conflict, 
                    // but glass-card usually handles it well. DopingBorder adds the outer glow.
                    isDoping ? "!border-none !bg-transparent" : ""
                )}
            >
                <div className={cn("relative overflow-hidden", viewMode === "list" ? "w-48 h-36" : "aspect-[4/3]")}>
                    <Image
                        src={listingImage}
                        alt={listingTitle}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        quality={75}
                        loading="lazy"
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                        unoptimized
                    />

                    <FavoriteButton
                        listingId={listingId}
                        className="absolute top-2 right-2 p-1.5 bg-black/50 backdrop-blur-md rounded-full hover:bg-black/70 transition-colors z-10"
                    />

                    {showCompare && listing.categoryId === "vasita" && (
                        <button
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCompare(listing); }}
                            className={cn("absolute top-2 left-2 px-2 py-1 backdrop-blur-xl rounded-full text-[10px] font-bold z-20 flex items-center gap-1 shadow-lg border", isInCompare(listingId) ? "bg-primary/90 text-primary-foreground border-primary" : "bg-white/10 text-white border-white/20")}
                        >
                            <Repeat className="w-3 h-3" />
                        </button>
                    )}
                </div>
                <div className="p-2.5 space-y-1.5 flex-1 flex flex-col justify-between bg-card/50">
                    <div>
                        <h3 className={cn("font-medium line-clamp-2 leading-tight", compact ? "text-[10px]" : "text-xs")}>{listingTitle}</h3>
                    </div>
                    <div className="mt-1.5 flex items-center justify-between">
                        <span className="font-semibold">{listingPrice?.toLocaleString()} TL</span>
                        <span className="text-[10px] text-muted-foreground">{listingDate}</span>
                    </div>
                </div>
            </Link>
        </DopingBorder>
    );
}
