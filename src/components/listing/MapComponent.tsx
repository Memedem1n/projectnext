"use client";

import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { LatLngExpression, divIcon } from "leaflet";
import { MapPin, X } from "lucide-react";
import { Listing } from "@/data/mock-data";
import Image from "next/image";
import Link from "next/link";
import { renderToStaticMarkup } from "react-dom/server";

interface MapComponentProps {
    listings: Listing[];
}

// İstanbul merkez koordinatları
const ISTANBUL_CENTER: LatLngExpression = [41.0082, 28.9784];

// Custom marker icon with price
function createPriceIcon(price: string, isSelected: boolean) {
    // Format price with thousand separators (full price, no K shorthand)
    const priceNum = price.replace(/[^\d]/g, '');
    const priceFormatted = parseInt(priceNum).toLocaleString('tr-TR');

    const iconHtml = renderToStaticMarkup(
        <div
            className={`px-3 py-1.5 rounded-full font-bold text-sm shadow-lg border-2 whitespace-nowrap ${isSelected
                ? "bg-black text-white border-black scale-110"
                : "bg-white text-black border-gray-300"
                }`}
            style={{
                fontFamily: "system-ui, -apple-system, sans-serif",
            }}
        >
            {priceFormatted} ₺
        </div>
    );

    return divIcon({
        html: iconHtml,
        className: "custom-price-marker",
        iconSize: [80, 32],
        iconAnchor: [40, 16],
    });
}

export default function MapComponent({ listings }: MapComponentProps) {
    const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

    // Mock positions around Istanbul (gerçek bir uygulamada listing.coordinates kullanılır)
    const listingsWithCoords = listings.slice(0, 30).map((listing, idx) => {
        const cluster = idx % 4;
        const baseLat = cluster === 0 ? 41.05 : cluster === 1 ? 41.01 : cluster === 2 ? 40.99 : 41.03;
        const baseLng = cluster === 0 ? 28.95 : cluster === 1 ? 29.0 : cluster === 2 ? 29.05 : 28.98;

        return {
            ...listing,
            position: [
                baseLat + (Math.random() - 0.5) * 0.04,
                baseLng + (Math.random() - 0.5) * 0.04,
            ] as LatLngExpression,
        };
    });

    return (
        <div className="relative w-full h-[700px] rounded-3xl overflow-hidden shadow-2xl border border-white/10">
            <MapContainer
                center={ISTANBUL_CENTER}
                zoom={12}
                style={{ height: "100%", width: "100%", borderRadius: "1.5rem" }}
                zoomControl={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {listingsWithCoords.map((listing) => (
                    <Marker
                        key={listing.id}
                        position={listing.position}
                        icon={createPriceIcon(
                            listing.price,
                            selectedListing?.id === listing.id
                        )}
                        eventHandlers={{
                            click: () => setSelectedListing(listing),
                        }}
                    >
                        <Popup>
                            <div className="p-2 min-w-[200px]">
                                <div className="relative h-32 w-full rounded-lg overflow-hidden mb-2">
                                    <Image
                                        src={listing.image}
                                        alt={listing.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <h4 className="font-bold text-sm mb-1 line-clamp-2">{listing.title}</h4>
                                <p className="text-blue-600 font-bold text-base mb-2">{listing.price}</p>
                                <p className="text-xs text-gray-600 mb-3">{listing.location}</p>
                                <Link
                                    href={`/listing/${listing.id}`}
                                    className="block text-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700"
                                >
                                    İlanı Görüntüle
                                </Link>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

            {/* Selected Listing Card */}
            {selectedListing && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-lg z-[1000] px-4">
                    <div className="glass-card p-6 flex gap-6 relative shadow-2xl border-white/20">
                        <button
                            onClick={() => setSelectedListing(null)}
                            className="absolute top-3 right-3 p-1.5 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        <div className="w-48 h-36 relative rounded-xl overflow-hidden shrink-0 shadow-lg">
                            <Image
                                src={selectedListing.image}
                                alt={selectedListing.title}
                                fill
                                className="object-cover"
                            />
                        </div>

                        <div className="flex-1 min-w-0 flex flex-col">
                            <h3 className="font-bold text-lg line-clamp-2 mb-2">{selectedListing.title}</h3>
                            <p className="text-primary font-bold text-2xl mb-3">{selectedListing.price}</p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                                <MapPin className="w-4 h-4" />
                                {selectedListing.location}
                            </div>

                            <div className="mt-auto flex gap-3">
                                <Link
                                    href={`/listing/${selectedListing.id}`}
                                    className="flex-1 text-center px-5 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition-all hover:scale-105 shadow-lg"
                                >
                                    İlanı Görüntüle
                                </Link>
                                <button
                                    onClick={() => setSelectedListing(null)}
                                    className="px-4 py-3 glass-card hover:bg-white/10 rounded-xl transition-colors"
                                >
                                    Kapat
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Map Info Badge */}
            <div className="absolute top-6 left-6 glass-card px-4 py-2 z-[1000] shadow-lg">
                <p className="text-sm font-medium">
                    <span className="text-primary font-bold">{listingsWithCoords.length}</span> ilan gösteriliyor
                </p>
            </div>
        </div>
    );
}
