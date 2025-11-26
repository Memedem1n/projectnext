"use client";

import { useComparison } from "@/context/ComparisonContext";
import { X, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { memo } from "react";

export const ComparisonBar = memo(function ComparisonBar() {
    const { selectedListings, removeFromCompare, clearCompare } = useComparison();

    if (selectedListings.length === 0) return null;

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-4xl w-full px-4 animate-slide-up">
            <div className="bg-black/90 backdrop-blur-xl border-2 border-primary/20 rounded-2xl p-6 shadow-2xl shadow-primary/20">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                            {selectedListings.length}
                        </div>
                        <div>
                            <div className="font-bold text-white">Karşılaştır</div>
                            <div className="text-xs text-muted-foreground">
                                {selectedListings.length} / 3 araç seçildi
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Link
                            href="/compare"
                            className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-lg shadow-primary/30">
                            Karşılaştır
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                        <button
                            onClick={clearCompare}
                            className="px-4 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-sm font-medium">
                            Temizle
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    {selectedListings.map((listing) => (
                        <div
                            key={listing.id}
                            className="relative group bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-primary/30 transition-colors">
                            <button
                                onClick={() => removeFromCompare(listing.id)}
                                className="absolute top-2 right-2 z-10 p-1.5 bg-red-500/80 hover:bg-red-500 rounded-full text-white transition-colors">
                                <X className="w-3 h-3" />
                            </button>
                            <div className="aspect-video relative">
                                <Image
                                    src={listing.image}
                                    alt={listing.title}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, 300px"
                                />
                            </div>
                            <div className="p-3">
                                <h4 className="text-xs font-medium line-clamp-1 text-white mb-1">
                                    {listing.title}
                                </h4>
                                <p className="text-sm font-bold text-primary">{listing.price}</p>
                            </div>
                        </div>
                    ))}
                    {[...Array(3 - selectedListings.length)].map((_, i) => (
                        <div
                            key={`empty-${i}`}
                            className="bg-white/5 border border-dashed border-white/10 rounded-xl flex items-center justify-center aspect-[4/3] text-muted-foreground text-xs">
                            Boş Slot
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
});
