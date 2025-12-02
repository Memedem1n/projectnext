"use client";

import { Check, Star, Zap, TrendingUp, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

export type DopingType = "NONE" | "VISUAL" | "SEARCH" | "FULL";

interface DopingOption {
    id: DopingType;
    title: string;
    description: string;
    price: number;
    features: string[];
    icon: React.ElementType;
    recommended?: boolean;
}

const DOPING_OPTIONS: DopingOption[] = [
    {
        id: "NONE",
        title: "Standart İlan",
        description: "İlanınız standart görünümde yayınlanır.",
        price: 0,
        features: [
            "Standart listeleme",
            "30 gün yayında kalma",
            "Temel istatistikler"
        ],
        icon: FileText
    },
    {
        id: "VISUAL",
        title: "Görsel Doping",
        description: "İlanınız parlak gümüş çerçeve ile dikkat çeker.",
        price: 150,
        features: [
            "Parlak Gümüş Çerçeve",
            "Kalın Başlık",
            "Listelemede Dikkat Çeker",
            "Daha Fazla Tıklanma"
        ],
        icon: Eye,
        recommended: true
    },
    {
        id: "SEARCH",
        title: "Öne Çıkarma",
        description: "Arama sonuçlarında ve önerilerde en üstte çıkın.",
        price: 250,
        features: [
            "Arama Önerilerinde En Üstte",
            "Kategori Sayfasında Sabitleme",
            "Vitrin Gösterimi",
            "2x Daha Fazla Görüntülenme"
        ],
        icon: TrendingUp
    },
    {
        id: "FULL",
        title: "Full Paket",
        description: "Hem görsel fark yaratın hem de en üstte olun.",
        price: 350,
        features: [
            "Görsel Doping (Gümüş Çerçeve)",
            "Arama Önerilerinde En Üstte",
            "Kategori Sabitleme",
            "Maksimum Görüntülenme"
        ],
        icon: Zap
    }
];

import { FileText } from "lucide-react";

interface DopingSelectorProps {
    selectedDoping: DopingType;
    onSelect: (doping: DopingType) => void;
}

export function DopingSelector({ selectedDoping, onSelect }: DopingSelectorProps) {
    return (
        <div className="space-y-6">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">İlanını Öne Çıkar</h2>
                <p className="text-muted-foreground">Daha hızlı satış yapmak için doping paketlerinden birini seçin.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {DOPING_OPTIONS.map((option) => {
                    const isSelected = selectedDoping === option.id;
                    const Icon = option.icon;

                    return (
                        <div
                            key={option.id}
                            onClick={() => onSelect(option.id)}
                            className={cn(
                                "relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 flex flex-col gap-4",
                                isSelected
                                    ? "border-brand-gold bg-brand-gold/5 shadow-xl shadow-brand-gold/10 scale-[1.02]"
                                    : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10",
                                option.recommended && !isSelected && "border-brand-gold/50"
                            )}
                        >
                            {option.recommended && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-gold text-black text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                    En Çok Tercih Edilen
                                </div>
                            )}

                            <div className="flex items-center justify-between">
                                <div className={cn(
                                    "w-12 h-12 rounded-lg flex items-center justify-center",
                                    isSelected ? "bg-brand-gold text-black" : "bg-white/10 text-white"
                                )}>
                                    <Icon className="w-6 h-6" />
                                </div>
                                {isSelected && (
                                    <div className="w-6 h-6 bg-brand-gold rounded-full flex items-center justify-center">
                                        <Check className="w-4 h-4 text-black" />
                                    </div>
                                )}
                            </div>

                            <div>
                                <h3 className="font-bold text-lg">{option.title}</h3>
                                <p className="text-sm text-muted-foreground mt-1 min-h-[40px]">{option.description}</p>
                            </div>

                            <div className="text-2xl font-bold">
                                {option.price === 0 ? "Ücretsiz" : `${option.price} TL`}
                            </div>

                            <div className="space-y-2 pt-4 border-t border-white/10 flex-1">
                                {option.features.map((feature, i) => (
                                    <div key={i} className="flex items-center gap-2 text-sm">
                                        <Check className={cn("w-4 h-4", isSelected ? "text-brand-gold" : "text-muted-foreground")} />
                                        <span className={isSelected ? "text-foreground" : "text-muted-foreground"}>{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
