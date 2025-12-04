"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, Calendar, Gauge, Fuel, Cog } from "lucide-react";
import { cn } from "@/lib/utils";
import { FavoriteButton } from "./FavoriteButton";
import { DopingBorder } from "@/components/ui/DopingBorder";
import { ListingBadges } from "./ListingBadges";

interface HorizontalListingCardProps {
    listing: any;
    className?: string;
}

export function HorizontalListingCard({ listing, className }: HorizontalListingCardProps) {
    const imageUrl = listing.images?.[0]?.url || listing.image || '/placeholder.svg';
    const price = typeof listing.price === 'number'
        ? `₺${listing.price.toLocaleString('tr-TR')}`
        : listing.price;

    // Extract specs for badges
    const year = listing.year || listing.specs?.year;
    const km = listing.km || listing.specs?.km;
    const fuel = listing.fuel || listing.specs?.fuel;
    const gear = listing.gear || listing.specs?.gear;
    const hp = listing.hp || listing.specs?.hp;
    const cc = listing.cc || listing.specs?.cc;
    const model = listing.model || listing.specs?.model;

    // Badge logic: Corporate sellers are automatically verified
    const isCorporate = listing.user?.role === 'DEALER';
    const showVerifiedBadge = !isCorporate && (listing.user?.isVerified || false);
    const isSwapAvailable = listing.exchange || false;
    const isWarranty = listing.warranty || false;

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
                    "group glass-card !p-0 overflow-hidden hover:shadow-brand-gold/10 cursor-pointer block transition-all duration-300 hover:border-brand-gold/30",
                    // If doping is active, remove default border/bg to let DopingBorder shine
                    isDoping ? "!border-none !bg-transparent" : ""
                )}
            >
                <div className="flex flex-row h-40 sm:h-48">
                    {/* Image - Left Side */}
                    <div className="relative w-48 sm:w-64 flex-shrink-0 bg-white/5">
                        <Image
                            src={imageUrl}
                            alt={listing.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 640px) 192px, 256px"
                            quality={70}
                            loading="lazy"
                            unoptimized
                        />
                        {/* Favorite Button */}
                        <FavoriteButton
                            listingId={listing.id}
                            className="absolute top-2 right-2 p-1.5 bg-black/60 backdrop-blur-sm rounded-full hover:bg-black/80 transition-colors z-10"
                        />

                        {/* Badges (Top Left) */}
                        <ListingBadges badges={listing.badges} />

                        {/* Image Badge - Only show highest priority */}
                        <div className="absolute bottom-2 left-2">
                            {isCorporate ? (
                                <div className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg backdrop-blur-sm border border-blue-400/20">
                                    <span className="text-white text-xs font-bold tracking-wide flex items-center gap-1.5">
                                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        Kurumsal Üye
                                    </span>
                                </div>
                            ) : showVerifiedBadge ? (
                                <div className="px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg shadow-lg backdrop-blur-sm border border-green-400/20">
                                    <span className="text-white text-xs font-bold tracking-wide flex items-center gap-1.5">
                                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        Onaylı Satıcı
                                    </span>
                                </div>
                            ) : null}
                        </div>
                    </div>

                    {/* Content - Right Side */}
                    <div className="flex-1 p-3 sm:p-4 flex flex-col justify-between min-w-0">
                        <div className="space-y-3">
                            {/* Title & Location */}
                            <div className="flex justify-between items-start gap-4">
                                <h3 className="text-base sm:text-lg font-semibold line-clamp-2 leading-tight text-foreground group-hover:text-brand-gold transition-colors">
                                    {listing.title}
                                </h3>
                                {(listing.city || listing.location) && (
                                    <span className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap shrink-0">
                                        <MapPin className="w-3 h-3" />
                                        {listing.city || listing.location}
                                    </span>
                                )}
                            </div>

                            {/* Specs Grid - Modern minimal badges */}
                            <div className="flex flex-wrap gap-2 text-xs">
                                {model && (
                                    <div className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-md text-foreground/90 font-medium">
                                        {model}
                                    </div>
                                )}
                                {year && (
                                    <div className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-md text-muted-foreground flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        <span>{year}</span>
                                    </div>
                                )}
                                {km && (
                                    <div className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-md text-muted-foreground flex items-center gap-1">
                                        <Gauge className="w-3 h-3" />
                                        <span>{typeof km === 'string' ? km : `${km.toLocaleString()} km`}</span>
                                    </div>
                                )}
                                {fuel && (
                                    <div className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-md text-muted-foreground flex items-center gap-1">
                                        <Fuel className="w-3 h-3" />
                                        <span>{fuel}</span>
                                    </div>
                                )}
                                {gear && (
                                    <div className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-md text-muted-foreground flex items-center gap-1">
                                        <Cog className="w-3 h-3" />
                                        <span>{gear}</span>
                                    </div>
                                )}
                                {hp && (
                                    <div className="px-2.5 py-1 bg-gradient-to-r from-brand-gold/10 to-brand-gold/5 border border-brand-gold/20 rounded-md text-brand-gold font-semibold">
                                        {hp} HP
                                    </div>
                                )}
                                {cc && (
                                    <div className="px-2.5 py-1 bg-gradient-to-r from-brand-gold/10 to-brand-gold/5 border border-brand-gold/20 rounded-md text-brand-gold font-semibold">
                                        {cc} cc
                                    </div>
                                )}
                            </div>

                            {/* Feature Badges - Premium style */}
                            {(isSwapAvailable || isWarranty) && (
                                <div className="flex items-center gap-2">
                                    {isSwapAvailable && (
                                        <div className="px-2.5 py-1 bg-purple-500/10 border border-purple-500/20 rounded-md text-purple-400 text-xs font-medium">
                                            Takaslı
                                        </div>
                                    )}
                                    {isWarranty && (
                                        <div className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 rounded-md text-amber-400 text-xs font-medium">
                                            Garantili
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Bottom: Price & Date */}
                        <div className="flex items-end justify-between mt-auto pt-3 border-t border-white/5">
                            <span className="text-xl sm:text-2xl font-bold text-brand-gold">
                                {price}
                            </span>
                            {listing.date && (
                                <span className="text-xs text-muted-foreground">
                                    {listing.date}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </Link>
        </DopingBorder>
    );
}
