"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Phone, MessageCircle, User, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface SellerCardProps {
    user: {
        name: string | null;
        phone?: string | null;
        role?: string;
        isVerified?: boolean;
    };
}

export function SellerCard({ user }: SellerCardProps) {
    const [showPhone, setShowPhone] = useState(false);

    const isCorporate = user.role === 'DEALER';
    // Corporate sellers are automatically verified, no need to show both badges
    const showVerifiedBadge = !isCorporate && user.isVerified;

    // Format phone number for display (masking)
    const formatPhone = (phone: string | null | undefined) => {
        if (!phone) return "Belirtilmemiş";
        if (showPhone) return phone;
        // Mask: 0532 *** ** 99
        return phone.replace(/(\d{4})\s?(\d{3})\s?(\d{2})\s?(\d{2})/, "$1 *** ** $4")
            .replace(/(\d{4})(\d{3})(\d{2})(\d{2})/, "$1 *** ** $4"); // Fallback if no spaces
    };

    return (
        <div className="glass-card p-6 space-y-6">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <User className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="font-semibold text-lg">{user.name || "ProjectNexx Kullanıcısı"}</h3>
                    {/* Show only highest priority badge */}
                    {isCorporate ? (
                        <div className="flex items-center gap-1.5 mt-1.5 px-2.5 py-1 bg-gradient-to-r from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-md w-fit">
                            <svg className="w-3.5 h-3.5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-xs text-blue-500 font-semibold">Kurumsal Üye</span>
                        </div>
                    ) : showVerifiedBadge ? (
                        <div className="flex items-center gap-1.5 mt-1.5 px-2.5 py-1 bg-gradient-to-r from-green-500/10 to-emerald-600/10 border border-green-500/20 rounded-md w-fit">
                            <svg className="w-3.5 h-3.5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-xs text-green-500 font-semibold">Doğrulanmış Satıcı</span>
                        </div>
                    ) : null}
                </div>
            </div>

            <div className="space-y-3">
                <Button
                    onClick={() => setShowPhone(!showPhone)}
                    className={cn(
                        "w-full justify-start gap-3 h-12 text-base transition-all",
                        showPhone
                            ? "bg-green-500 hover:bg-green-600 text-white"
                            : "bg-primary/10 hover:bg-primary/20 text-primary"
                    )}
                    variant="ghost"
                >
                    <Phone className="w-5 h-5" />
                    <span className="font-semibold tracking-wide">
                        {formatPhone(user.phone || "0532 555 44 33")}
                    </span>
                    {!showPhone && <span className="ml-auto text-xs opacity-70">Göster</span>}
                </Button>

                <Button className="w-full justify-start gap-3 h-12 text-base bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                    <MessageCircle className="w-5 h-5" />
                    Mesaj Gönder
                </Button>
            </div>

            <div className="pt-4 border-t border-white/10">
                <p className="text-xs text-muted-foreground text-center">
                    Güvenli alışveriş için ödemenizi ürünü teslim almadan yapmayın.
                </p>
            </div>
        </div>
    );
}
