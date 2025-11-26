"use client";

import { useComparison } from "@/context/ComparisonContext";
import { X, ArrowLeft, Calendar, Gauge, Fuel, Settings as SettingsIcon, Car, Palette, ShieldCheck, RefreshCw, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ComparePage() {
    const { selectedListings, removeFromCompare, clearCompare } = useComparison();

    if (selectedListings.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center space-y-6 max-w-md">
                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto">
                        <Car className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <h1 className="text-2xl font-bold">Karşılaştırma Listesi Boş</h1>
                    <p className="text-muted-foreground">
                        Karşılaştırmak istediğiniz araçları seçin. En fazla 3 araç karşılaştırabilirsiniz.
                    </p>
                    <Link
                        href="/category/vasita"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        İlan Listesine Dön
                    </Link>
                </div>
            </div>
        );
    }

    const specs = [
        { key: "title", label: "İlan Başlığı", icon: Car },
        { key: "price", label: "Fiyat", icon: null },
        { key: "location", label: "Konum", icon: MapPin },
        { key: "year", label: "Yıl", icon: Calendar },
        { key: "km", label: "Kilometre", icon: Gauge },
        { key: "fuel", label: "Yakıt", icon: Fuel },
        { key: "gear", label: "Vites", icon: SettingsIcon },
        { key: "color", label: "Renk", icon: Palette },
        { key: "verifiedReport", label: "Ekspertiz Raporu", icon: ShieldCheck },
    ];

    return (
        <div className="min-h-screen pt-24 pb-12 px-4">
            <div className="container mx-auto max-w-7xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <Link
                            href="/category/vasita"
                            className="inline-flex items-center gap-2 text-muted-foreground hover:text-white mb-4 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Geri Dön
                        </Link>
                        <h1 className="text-3xl font-bold">Araç Karşılaştırma</h1>
                        <p className="text-muted-foreground mt-1">
                            {selectedListings.length} araç karşılaştırılıyor
                        </p>
                    </div>
                    <button
                        onClick={clearCompare}
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-sm font-medium"
                    >
                        Tümünü Temizle
                    </button>
                </div>

                {/* Comparison Table */}
                <div className="glass-card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="p-4 text-left sticky left-0 bg-black z-10 min-w-[200px]">
                                        <span className="text-muted-foreground font-medium">Özellik</span>
                                    </th>
                                    {selectedListings.map((listing) => (
                                        <th key={listing.id} className="p-4 min-w-[280px]">
                                            <div className="relative">
                                                <button
                                                    onClick={() => removeFromCompare(listing.id)}
                                                    className="absolute -top-2 -right-2 p-1.5 bg-red-500/80 hover:bg-red-500 rounded-full text-white transition-colors z-10"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                                <div className="aspect-video relative rounded-lg overflow-hidden mb-3">
                                                    <Image
                                                        src={listing.image}
                                                        alt={listing.title}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {specs.map((spec, idx) => {
                                    const Icon = spec.icon;
                                    return (
                                        <tr
                                            key={spec.key}
                                            className={cn(
                                                "border-b border-white/5",
                                                idx % 2 === 0 ? "bg-white/5" : ""
                                            )}
                                        >
                                            <td className="p-4 sticky left-0 bg-black z-10">
                                                <div className="flex items-center gap-2 font-medium">
                                                    {Icon && <Icon className="w-4 h-4 text-primary" />}
                                                    {spec.label}
                                                </div>
                                            </td>
                                            {selectedListings.map((listing) => (
                                                <td key={listing.id} className="p-4 text-center">
                                                    {spec.key === "title" && (
                                                        <div className="font-bold text-left">{listing.title}</div>
                                                    )}
                                                    {spec.key === "price" && (
                                                        <div className="text-primary font-bold text-xl">{listing.price}</div>
                                                    )}
                                                    {spec.key === "location" && (
                                                        <div className="text-sm text-muted-foreground">{listing.location}</div>
                                                    )}
                                                    {spec.key === "year" && (
                                                        <div>{listing.specs?.year || "-"}</div>
                                                    )}
                                                    {spec.key === "km" && (
                                                        <div>{listing.specs?.km || "-"}</div>
                                                    )}
                                                    {spec.key === "fuel" && (
                                                        <div>{listing.specs?.fuel || "-"}</div>
                                                    )}
                                                    {spec.key === "gear" && (
                                                        <div>{listing.specs?.gear || "-"}</div>
                                                    )}
                                                    {spec.key === "color" && (
                                                        <div>{listing.details?.color || "-"}</div>
                                                    )}
                                                    {spec.key === "verifiedReport" && (
                                                        <div>
                                                            {listing.verifiedReport ? (
                                                                <span className="inline-flex items-center gap-1 text-xs bg-blue-500/10 text-blue-500 px-2 py-1 rounded border border-blue-500/20">
                                                                    <ShieldCheck className="w-3 h-3" />
                                                                    Var
                                                                </span>
                                                            ) : (
                                                                <span className="text-muted-foreground">-</span>
                                                            )}
                                                        </div>
                                                    )}
                                                </td>
                                            ))}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {selectedListings.map((listing) => (
                        <Link
                            key={listing.id}
                            href={`/listing/${listing.id}`}
                            className="p-4 glass-card hover:border-primary/30 transition-colors text-center font-medium"
                        >
                            İlanı Görüntüle: {listing.title}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

function cn(...classes: (string | boolean | undefined)[]) {
    return classes.filter(Boolean).join(" ");
}
