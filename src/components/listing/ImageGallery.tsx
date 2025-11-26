import { useState } from "react";
import { ChevronLeft, ChevronRight, Expand } from "lucide-react";

import { cn } from "@/lib/utils";

interface ImageGalleryProps {
    images: string[];
}

export function ImageGallery({ images }: ImageGalleryProps) {
    const [currentImage, setCurrentImage] = useState(0);

    const nextImage = () => {
        setCurrentImage((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-white/5 group">
                <img
                    key={currentImage}
                    src={images[currentImage]}
                    alt={`Vehicle image ${currentImage + 1}`}
                    className="w-full h-full object-cover animate-in fade-in duration-300"
                />

                {/* Navigation Buttons */}
                <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={prevImage}
                        className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors backdrop-blur-sm"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                        onClick={nextImage}
                        className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors backdrop-blur-sm"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </div>

                {/* Counter */}
                <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-black/50 text-white text-sm backdrop-blur-sm">
                    {currentImage + 1} / {images.length}
                </div>
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-4">
                {images.map((img, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentImage(idx)}
                        className={cn(
                            "aspect-video rounded-lg overflow-hidden border-2 transition-all",
                            currentImage === idx ? "border-primary opacity-100" : "border-transparent opacity-50 hover:opacity-75"
                        )}
                    >
                        <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                ))}
            </div>
        </div>
    );
}
