"use client";

import { Check, Star, Zap, Crown } from "lucide-react";
import { cn } from "@/lib/utils";

export type PackageType = "standard" | "gold" | "premium";

interface ListingPackagesProps {
    selectedPackage: PackageType;
    onChange: (pkg: PackageType) => void;
    isFreeEligible?: boolean;
}

const packages = [
    {
        id: "standard" as PackageType,
        title: "Standart İlan",
        price: "Ücretsiz",
        icon: Star,
        color: "text-blue-400",
        bg: "bg-blue-400/10",
        border: "border-blue-400/20",
        features: [
            "30 Gün Yayında Kalma",
            "10 Fotoğraf Yükleme",
            "Standart Sıralama",
            "Temel İstatistikler"
        ]
    },
    {
        id: "gold" as PackageType,
        title: "Gold İlan",
        price: "250 ₺",
        icon: Zap,
        color: "text-yellow-400",
        bg: "bg-yellow-400/10",
        border: "border-yellow-400/20",
        popular: true,
        features: [
            "60 Gün Yayında Kalma",
            "25 Fotoğraf Yükleme",
            "Üst Sıralarda Gösterim",
            "Kalın Yazı & Renkli Çerçeve",
            "Detaylı İstatistikler"
        ]
    },
    {
        id: "premium" as PackageType,
        title: "Premium İlan",
        price: "500 ₺",
        icon: Crown,
        color: "text-purple-400",
        bg: "bg-purple-400/10",
        border: "border-purple-400/20",
        features: [
            "90 Gün Yayında Kalma",
            "50 Fotoğraf + Video",
            "Anasayfa Vitrin",
            "Sosyal Medya Reklamı",
            "Ekspertiz Hediye",
            "Premium Destek"
        ]
    }
];

export function ListingPackages({ selectedPackage, onChange, isFreeEligible = true }: ListingPackagesProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {packages.map((pkg) => {
                const Icon = pkg.icon;
                const isSelected = selectedPackage === pkg.id;
                const isDisabled = pkg.id === "standard" && !isFreeEligible;

                return (
                    <button
                        key={pkg.id}
                        onClick={() => !isDisabled && onChange(pkg.id)}
                        disabled={isDisabled}
                        className={cn(
                            "relative flex flex-col p-6 rounded-2xl border transition-all duration-300 text-left group",
                            isSelected
                                ? `bg-white/5 ${pkg.border} ring-2 ring-offset-2 ring-offset-transparent ring-brand-gold`
                                : "bg-white/5 border-white/5 hover:border-white/20 hover:-translate-y-1",
                            isDisabled && "opacity-50 cursor-not-allowed hover:translate-y-0 hover:border-white/5 grayscale"
                        )}
                    >
                        {pkg.popular && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-brand-gold to-orange-500 text-black text-xs font-bold shadow-lg shadow-orange-500/20">
                                EN ÇOK TERCİH EDİLEN
                            </div>
                        )}

                        <div className="flex justify-between items-start mb-6">
                            <div className={cn("p-3 rounded-xl", pkg.bg)}>
                                <Icon className={cn("w-6 h-6", pkg.color)} />
                            </div>
                            <div className={cn("text-xl font-bold", pkg.color)}>
                                {isDisabled ? "Hakkınız Doldu" : pkg.price}
                            </div>
                        </div>

                        <h3 className="text-lg font-bold mb-2">{pkg.title}</h3>

                        <div className="space-y-3 mt-4 flex-1">
                            {pkg.features.map((feature, idx) => (
                                <div key={idx} className="flex items-center gap-3 text-sm text-muted-foreground">
                                    <Check className={cn("w-4 h-4 shrink-0", pkg.color)} />
                                    <span>{feature}</span>
                                </div>
                            ))}
                        </div>

                        <div className={cn(
                            "mt-8 w-full py-3 rounded-xl font-medium text-center transition-colors",
                            isSelected
                                ? "bg-brand-gold text-primary-foreground"
                                : isDisabled
                                    ? "bg-white/5 text-muted-foreground"
                                    : "bg-white/10 group-hover:bg-white/20"
                        )}>
                            {isSelected ? "Seçildi" : isDisabled ? "Seçilemez" : "Seç"}
                        </div>
                    </button>
                );
            })}
        </div>
    );
}
