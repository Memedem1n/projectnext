"use client";

import { useState } from "react";

import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageGalleryProps {
    images: string[];
}

export function ImageGallery({ images }: ImageGalleryProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextImage = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-[16/9] bg-black/5 rounded-2xl overflow-hidden group">
                <img
                    key={currentIndex}
                    src={images[currentIndex]}
                    alt={`Vehicle image ${currentIndex + 1}`}
                    className="w-full h-full object-cover animate-in fade-in duration-300"
                />

                {/* Navigation Arrows */}
                <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={(e) => { e.stopPropagation(); prevImage(); }}
                        className="w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-brand-gold transition-colors backdrop-blur-sm"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); nextImage(); }}
                        className="w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-brand-gold transition-colors backdrop-blur-sm"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </div>

                {/* Fullscreen Button */}
                <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-brand-gold transition-colors backdrop-blur-sm opacity-0 group-hover:opacity-100">
                    <Maximize2 className="w-5 h-5" />
                </button>

                {/* Counter */}
                <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-black/50 text-white text-xs font-medium backdrop-blur-sm">
                    {currentIndex + 1} / {images.length}
                </div>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                {images.map((img, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={cn(
                            "relative flex-shrink-0 w-24 aspect-[16/9] rounded-lg overflow-hidden transition-all",
                            currentIndex === idx ? "ring-2 ring-brand-gold ring-offset-2 ring-offset-background" : "opacity-70 hover:opacity-100"
                        )}
                    >
                        <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                ))}
            </div>
        </div>
    );
}
