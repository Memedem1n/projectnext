"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { FavoriteButton } from "./FavoriteButton";
import { DopingBorder } from "@/components/ui/DopingBorder";
import { ListingBadges } from "./ListingBadges";

interface CompactListingCardProps {
    listing: any;
    className?: string;
}

export function CompactListingCard({ listing, className }: CompactListingCardProps) {
    const imageUrl = listing.images?.[0]?.url || listing.image || '/placeholder.svg';
    const price = typeof listing.price === 'number'
        ? `₺${listing.price.toLocaleString('tr-TR')}`
        : listing.price;

    const isDoping = listing.isDoping || false;
    const dopingVariant = listing.listingPackage === 'premium' ? 'premium' :
        listing.listingPackage === 'gold' ? 'gold' :
            listing.dopingType === 'FULL' ? 'premium' :
                listing.dopingType === 'VISUAL' ? 'gold' : 'standard';

    return (
        <DopingBorder isActive={isDoping} variant={dopingVariant} className={cn("h-full", className)}>
            <Link
                href={`/listing/${listing.id}`}
                className={cn(
                    "group glass-card !p-0 overflow-hidden hover:shadow-brand-gold/10 cursor-pointer block transition-all duration-300 hover:scale-[1.02] hover:border-brand-gold/30",
                    // If doping is active, remove default border/bg to let DopingBorder shine
                    isDoping ? "!border-none !bg-transparent" : ""
                )}
            >
                {/* Compact Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-white/5">
                    <Image
                        src={imageUrl}
                        alt={listing.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                        quality={60}
                        loading="lazy"
                        unoptimized
                    />
                    {/* Favorite Button */}
                    <FavoriteButton
                        listingId={listing.id}
                        className="absolute top-1.5 right-1.5 p-1 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-colors z-10"
                    />

                    {/* Badges */}
                    <ListingBadges badges={listing.badges} />
                </div>

                {/* Compact Content */}
                <div className="p-2 space-y-1">
                    {/* Title */}
                    <h3 className="text-[11px] sm:text-xs font-medium line-clamp-2 leading-tight text-foreground/90 group-hover:text-brand-gold transition-colors">
                        {listing.title}
                    </h3>

                    {/* Price */}
                    <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm font-bold text-brand-gold">
                            {price}
                        </span>
                    </div>

                    {/* Location & Date */}
                    <div className="flex items-center justify-between text-[9px] sm:text-[10px] text-muted-foreground">
                        {listing.city && <span className="truncate">{listing.city}</span>}
                        {listing.date && <span className="shrink-0">{listing.date}</span>}
                    </div>
                </div>
            </Link>
        </DopingBorder>
    );
}
