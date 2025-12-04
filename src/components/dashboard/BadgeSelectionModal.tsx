"use client";

import { useState } from "react";
import { X, Check, AlertCircle, TrendingDown, Star, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import { addListingBadge } from "@/lib/actions/listings";

interface BadgeSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    listingId: string | null;
}

const BADGES = [
    {
        id: "URGENT",
        title: "Acil Acil",
        description: "İlanınızda kırmızı 'Acil' etiketi görünür.",
        price: 100,
        icon: AlertCircle,
        color: "text-red-500",
        bgColor: "bg-red-500/10",
        borderColor: "border-red-500/20"
    },
    {
        id: "PRICE_DROPPED",
        title: "Fiyat Düştü",
        description: "İlanınızda yeşil 'Fiyat Düştü' etiketi görünür.",
        price: 75,
        icon: TrendingDown,
        color: "text-green-500",
        bgColor: "bg-green-500/10",
        borderColor: "border-green-500/20"
    },
    {
        id: "OPPORTUNITY",
        title: "Fırsat",
        description: "İlanınızda turuncu 'Fırsat' etiketi görünür.",
        price: 120,
        icon: Star,
        color: "text-orange-500",
        bgColor: "bg-orange-500/10",
        borderColor: "border-orange-500/20"
    }
];

export function BadgeSelectionModal({ isOpen, onClose, listingId }: BadgeSelectionModalProps) {
    const [selectedBadge, setSelectedBadge] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen || !listingId) return null;

    const handlePurchase = async () => {
        if (!selectedBadge) return;

        setIsSubmitting(true);
        try {
            // Simulate payment delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            const result = await addListingBadge(listingId, selectedBadge);
            if (result.success) {
                alert("Rozet başarıyla eklendi!");
                onClose();
            } else {
                alert("Hata: " + result.error);
            }
        } catch (error) {
            console.error(error);
            alert("Bir hata oluştu.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="w-full max-w-2xl bg-[#1c1c1c] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                    <h2 className="text-xl font-bold">İlan Rozeti Ekle</h2>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {BADGES.map((badge) => {
                            const Icon = badge.icon;
                            const isSelected = selectedBadge === badge.id;

                            return (
                                <div
                                    key={badge.id}
                                    onClick={() => setSelectedBadge(badge.id)}
                                    className={cn(
                                        "relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 flex flex-col gap-3",
                                        isSelected
                                            ? "border-primary bg-primary/5"
                                            : "border-white/5 bg-white/5 hover:border-white/10 hover:bg-white/10"
                                    )}
                                >
                                    <div className={cn(
                                        "w-10 h-10 rounded-lg flex items-center justify-center",
                                        badge.bgColor,
                                        badge.color
                                    )}>
                                        <Icon className="w-5 h-5" />
                                    </div>

                                    <div>
                                        <h3 className="font-bold">{badge.title}</h3>
                                        <p className="text-xs text-muted-foreground mt-1">{badge.description}</p>
                                    </div>

                                    <div className="mt-auto pt-3 border-t border-white/5 flex items-center justify-between">
                                        <span className="font-bold text-lg">{badge.price} TL</span>
                                        {isSelected && (
                                            <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                                                <Check className="w-3 h-3 text-black" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex gap-3">
                        <Tag className="w-5 h-5 text-blue-400 shrink-0" />
                        <div className="text-sm text-blue-200">
                            Seçtiğiniz rozet ilanınızda kalıcı olarak görünecektir. Ödeme işlemi güvenli altyapımız üzerinden gerçekleştirilir.
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-white/10 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-xl hover:bg-white/5 transition-colors font-medium"
                    >
                        İptal
                    </button>
                    <button
                        onClick={handlePurchase}
                        disabled={!selectedBadge || isSubmitting}
                        className="px-6 py-2 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isSubmitting ? "İşleniyor..." : "Satın Al ve Uygula"}
                    </button>
                </div>
            </div>
        </div>
    );
}
