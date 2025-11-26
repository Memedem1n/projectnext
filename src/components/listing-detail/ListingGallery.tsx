"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ListingImage {
    id: string;
    url: string;
    order: number;
}

interface ListingGalleryProps {
    images: ListingImage[];
    title: string;
}

export function ListingGallery({ images, title }: ListingGalleryProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    if (!images || images.length === 0) {
        return (
            <div className="glass-card aspect-[4/3] flex items-center justify-center bg-white/5">
                <span className="text-muted-foreground">Görsel Yok</span>
            </div>
        );
    }

    const nextImage = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-[4/3] group">
                {/* Glow Effect */}
                <div className="absolute inset-0 transform scale-105 blur-2xl opacity-40 transition-all duration-500 group-hover:opacity-60 group-hover:scale-110 -z-10">
                    <Image
                        src={images[currentIndex].url}
                        alt=""
                        fill
                        className="object-cover"
                    />
                </div>

                <div className="glass-card relative w-full h-full overflow-hidden border border-white/10 shadow-2xl">
                    <Image
                        src={images[currentIndex].url}
                        alt={`${title} - Görsel ${currentIndex + 1}`}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        priority
                    />

                    {/* Navigation Arrows */}
                    {images.length > 1 && (
                        <>
                            <button
                                onClick={(e) => { e.preventDefault(); prevImage(); }}
                                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-brand-gold"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button
                                onClick={(e) => { e.preventDefault(); nextImage(); }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-brand-gold"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </>
                    )}

                    {/* Image Counter badge */}
                    <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md text-white text-xs font-medium">
                        {currentIndex + 1} / {images.length}
                    </div>
                </div>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {images.map((image, index) => (
                        <button
                            key={image.id}
                            onClick={() => setCurrentIndex(index)}
                            className={cn(
                                "relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all",
                                index === currentIndex
                                    ? "border-brand-gold ring-2 ring-brand-gold/20"
                                    : "border-transparent opacity-70 hover:opacity-100"
                            )}
                        >
                            <Image
                                src={image.url}
                                alt={`Thumbnail ${index + 1}`}
                                fill
                                className="object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
