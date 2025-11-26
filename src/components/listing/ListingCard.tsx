"use client";

import Link from "next/link";
import Image from "next/image";
import { Repeat } from "lucide-react";
import { cn } from "@/lib/utils";
import { useComparison } from "@/context/ComparisonContext";
import { Listing } from "@/data/mock-data";
import { FavoriteButton } from "./FavoriteButton";

interface ListingCardProps {
    listing: Listing;
    className?: string;
    showCompare?: boolean;
    compact?: boolean;
}

export function ListingCard({ listing, className, showCompare = true, compact = false }: ListingCardProps) {
    const { addToCompare, isInCompare } = useComparison();

    return (
        <Link
            href={`/listing/${listing.id}`}
            prefetch={true}
            className={cn(
                "group glass-card !p-0 overflow-hidden hover:shadow-primary/20 cursor-pointer block transition-all duration-300 hover:scale-[1.02]",
                className
            )}
        >
            <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                    src={listing.image}
                    alt={listing.title}
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
                    listingId={listing.id}
                    className="absolute top-2 right-2 p-1.5 bg-black/50 backdrop-blur-md rounded-full hover:bg-black/70 transition-colors z-10"
                />

                {showCompare && listing.categoryId === "vasita" && (
                    <button
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCompare(listing); }}
                        className={cn("absolute top-2 left-2 px-2 py-1 backdrop-blur-xl rounded-full text-[10px] font-bold z-20 flex items-center gap-1 shadow-lg border", isInCompare(listing.id) ? "bg-primary/90 text-primary-foreground border-primary" : "bg-white/10 text-white border-white/20")}
                    >
                        <Repeat className="w-3 h-3" />
                    </button>
                )}
            </div>
            <div className="p-2.5 space-y-1.5">
                <h3 className={cn("font-medium line-clamp-2 leading-tight", compact ? "text-[10px]" : "text-xs")}>{listing.title}</h3>
                <div className="mt-1.5 flex items-center justify-between">
                    {listing.price.toLocaleString()} TL
                    <span className="text-[10px] text-muted-foreground">{listing.date}</span>
                </div>
            </div>
        </Link>
    );
}
