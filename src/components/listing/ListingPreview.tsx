"use client";

import Image from "next/image";
import { MapPin, Calendar, Gauge, Fuel, Settings, ShieldCheck, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface ListingPreviewProps {
    formData: any;
    onEdit: (step: string) => void;
}

export function ListingPreview({ formData, onEdit }: ListingPreviewProps) {
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    useEffect(() => {
        if (formData.images && formData.images.length > 0) {
            const url = URL.createObjectURL(formData.images[0]);
            setPreviewImage(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [formData.images]);

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
                                1/{formData.images?.length || 0}
                            </div>
                        </div>
                        <button
                            onClick={() => onEdit("images")}
                            className="text-sm text-brand-gold hover:underline"
                        >
                            Fotoğrafları Düzenle
                        </button>
                    </div>

                    {/* Details Section */}
                    <div className="md:col-span-7 space-y-6">
                        <div>
                            <div className="flex items-start justify-between gap-4">
                                <h3 className="text-xl font-bold leading-tight">{formData.title || "Başlık Girilmedi"}</h3>
                                <button onClick={() => onEdit("details")} className="text-sm text-brand-gold hover:underline shrink-0">
                                    Düzenle
                                </button>
                            </div>
                            <div className="mt-2 text-2xl font-bold text-brand-gold">
                                {formData.price ? `${formData.price} TL` : "Fiyat Girilmedi"}
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground mt-2 text-sm">
                                <MapPin className="w-4 h-4" />
                                {formData.location || "Konum Belirtilmedi"}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                                <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                                    <Calendar className="w-3 h-3" /> Yıl
                                </div>
                                <div className="font-medium">{formData.vehicle?.year || "-"}</div>
                            </div>
                            <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                                <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                                    <Gauge className="w-3 h-3" /> Kilometre
                                </div>
                                <div className="font-medium">{formData.km || "-"} km</div>
                            </div>
                            <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                                <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                                    <Fuel className="w-3 h-3" /> Yakıt
                                </div>
                                <div className="font-medium">{formData.vehicle?.fuel || "-"}</div>
                            </div>
                            <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                                <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                                    <Settings className="w-3 h-3" /> Vites
                                </div>
                                <div className="font-medium">{formData.vehicle?.gear || "-"}</div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            {formData.warranty && (
                                <div className="px-3 py-1.5 bg-green-500/10 text-green-500 rounded-lg text-sm font-medium flex items-center gap-1.5">
                                    <ShieldCheck className="w-4 h-4" /> Garantili
                                </div>
                            )}
                            {formData.exchange && (
                                <div className="px-3 py-1.5 bg-blue-500/10 text-blue-500 rounded-lg text-sm font-medium flex items-center gap-1.5">
                                    <RefreshCw className="w-4 h-4" /> Takaslı
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-white/10">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold">Açıklama</h4>
                        <button onClick={() => onEdit("details")} className="text-sm text-brand-gold hover:underline">
                            Düzenle
                        </button>
                    </div>
                    <p className="text-muted-foreground text-sm whitespace-pre-wrap line-clamp-4">
                        {formData.description || "Açıklama girilmedi."}
                    </p>
                </div>

                <div className="mt-8 pt-8 border-t border-white/10">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold">Özellikler</h4>
                        <button onClick={() => onEdit("features")} className="text-sm text-brand-gold hover:underline">
                            Düzenle
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {formData.equipment && formData.equipment.length > 0 ? (
                            formData.equipment.slice(0, 5).map((item: string, i: number) => (
                                <span key={i} className="px-3 py-1 bg-white/5 rounded-full text-xs border border-white/10">
                                    {item}
                                </span>
                            ))
                        ) : (
                            <span className="text-muted-foreground text-sm">Özellik seçilmedi.</span>
                        )}
                        {formData.equipment && formData.equipment.length > 5 && (
                            <span className="px-3 py-1 bg-white/5 rounded-full text-xs border border-white/10 text-muted-foreground">
                                +{formData.equipment.length - 5} daha
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
