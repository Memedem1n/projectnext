"use client";

import Image from "next/image";
import { MapPin, Calendar, Gauge, Fuel, Settings, ShieldCheck, RefreshCw, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface ListingPreviewProps {
    data: any;
    onBack: () => void;
    onSubmit: () => void;
    isLoading: boolean;
}

export function ListingPreview({ data, onBack, onSubmit, isLoading }: ListingPreviewProps) {
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    useEffect(() => {
        if (data.images && data.images.length > 0) {
            const url = URL.createObjectURL(data.images[0]);
            setPreviewImage(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [data.images]);

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="glass-card p-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">İlan Önizleme</h2>
                    <span className="px-3 py-1 bg-brand-gold/20 text-brand-gold rounded-full text-sm font-medium">
                        Taslak
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    {/* Image Section */}
                    <div className="md:col-span-5 space-y-4">
                        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 bg-black/20">
                            {previewImage ? (
                                <Image
                                    src={previewImage}
                                    alt="Preview"
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                                    Fotoğraf Yok
                                </div>
                            )}
                            <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/60 rounded-lg text-xs text-white backdrop-blur-sm">
                                1/{data.images?.length || 0}
                            </div>
                        </div>
                    </div>

                    {/* Details Section */}
                    <div className="md:col-span-7 space-y-6">
                        <div>
                            <div className="flex items-start justify-between gap-4">
                                <h3 className="text-xl font-bold leading-tight">{data.title || "Başlık Girilmedi"}</h3>
                            </div>
                            <div className="mt-2 text-2xl font-bold text-brand-gold">
                                {data.price ? `${data.price} TL` : "Fiyat Girilmedi"}
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground mt-2 text-sm">
                                <MapPin className="w-4 h-4" />
                                {data.location || "Konum Belirtilmedi"}
                            </div>
                        </div>

                        {/* Doping Badge */}
                        {data.doping && data.doping !== "NONE" && (
                            <div className="p-3 bg-gradient-to-r from-brand-gold/20 to-transparent border border-brand-gold/30 rounded-xl flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-brand-gold flex items-center justify-center text-black">
                                    <Zap className="w-4 h-4" />
                                </div>
                                <div>
                                    <div className="font-bold text-brand-gold text-sm">Doping Aktif</div>
                                    <div className="text-xs text-muted-foreground">
                                        {data.doping === "VISUAL" && "Görsel Doping"}
                                        {data.doping === "SEARCH" && "Öne Çıkarma"}
                                        {data.doping === "FULL" && "Full Paket"}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                                <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                                    <Calendar className="w-3 h-3" /> Yıl
                                </div>
                                <div className="font-medium">{data.vehicle?.year || "-"}</div>
                            </div>
                            <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                                <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                                    <Gauge className="w-3 h-3" /> Kilometre
                                </div>
                                <div className="font-medium">{data.km || "-"} km</div>
                            </div>
                            <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                                <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                                    <Fuel className="w-3 h-3" /> Yakıt
                                </div>
                                <div className="font-medium">{data.vehicle?.fuel || "-"}</div>
                            </div>
                            <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                                <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                                    <Settings className="w-3 h-3" /> Vites
                                </div>
                                <div className="font-medium">{data.vehicle?.gear || "-"}</div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            {data.warranty && (
                                <div className="px-3 py-1.5 bg-green-500/10 text-green-500 rounded-lg text-sm font-medium flex items-center gap-1.5">
                                    <ShieldCheck className="w-4 h-4" /> Garantili
                                </div>
                            )}
                            {data.exchange && (
                                <div className="px-3 py-1.5 bg-blue-500/10 text-blue-500 rounded-lg text-sm font-medium flex items-center gap-1.5">
                                    <RefreshCw className="w-4 h-4" /> Takaslı
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-white/10">
                    <h4 className="font-bold mb-4">Açıklama</h4>
                    <p className="text-muted-foreground text-sm whitespace-pre-wrap line-clamp-4">
                        {data.description || "Açıklama girilmedi."}
                    </p>
                </div>

                <div className="mt-8 pt-8 border-t border-white/10">
                    <h4 className="font-bold mb-4">Özellikler</h4>
                    <div className="flex flex-wrap gap-2">
                        {data.equipment && data.equipment.length > 0 ? (
                            data.equipment.slice(0, 5).map((item: string, i: number) => (
                                <span key={i} className="px-3 py-1 bg-white/5 rounded-full text-xs border border-white/10">
                                    {item}
                                </span>
                            ))
                        ) : (
                            <span className="text-muted-foreground text-sm">Özellik seçilmedi.</span>
                        )}
                        {data.equipment && data.equipment.length > 5 && (
                            <span className="px-3 py-1 bg-white/5 rounded-full text-xs border border-white/10 text-muted-foreground">
                                +{data.equipment.length - 5} daha
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex justify-between pt-6">
                <button
                    onClick={onBack}
                    className="px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-colors"
                >
                    Geri Dön
                </button>
                <button
                    onClick={onSubmit}
                    disabled={isLoading}
                    className="px-8 py-3 bg-brand-gold text-primary-foreground rounded-xl font-bold hover:bg-brand-gold/90 transition-colors disabled:opacity-50"
                >
                    {isLoading ? "İşleniyor..." : "İlanı Yayınla"}
                </button>
            </div>
        </div>
    );
}

