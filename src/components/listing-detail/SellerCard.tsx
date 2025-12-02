"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, User, Phone, Calendar, Clock, ShieldCheck } from "lucide-react";
import { ChatDialog } from "@/components/chat/ChatDialog";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { getUserListingCount } from "@/lib/actions/listings";

interface SellerCardProps {
    user: {
        id: string;
        name: string | null;
        phone?: string | null;
        role?: string;
        isVerified?: boolean;
        createdAt?: Date | string;
    };
    listingId: string;
    currentUser: { id: string } | null;
    contactPreference?: string; // "call", "message", "both"
    className?: string;
}

export function SellerCard({ user, listingId, currentUser, contactPreference = "both", className }: SellerCardProps) {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [showPhone, setShowPhone] = useState(false);
    const [listingCount, setListingCount] = useState<number | null>(null);
    const router = useRouter();

    const isCorporate = user.role === 'DEALER';
    const showVerifiedBadge = !isCorporate && user.isVerified;

    const canCall = contactPreference === "call" || contactPreference === "both";
    const canMessage = contactPreference === "message" || contactPreference === "both";

    useEffect(() => {
        const fetchCount = async () => {
            const result = await getUserListingCount(user.id);
            if (result.success) {
                setListingCount(result.count);
            }
        };
        fetchCount();
    }, [user.id]);

    // Format name: Name + Surname(3 chars)***
    const formatName = (fullName: string | null) => {
        if (!fullName) return "ProjectNexx Kullanıcısı";
        const parts = fullName.trim().split(' ');
        if (parts.length === 1) return parts[0];

        const surname = parts.pop();
        const name = parts.join(' ');

        const maskedSurname = surname
            ? (surname.length > 3 ? surname.substring(0, 3) : surname) + '***'
            : '***';

        return `${name} ${maskedSurname}`;
    };

    const handleMessageClick = () => {
        if (!currentUser) {
            router.push(`/login?callbackUrl=/listing/${listingId}`);
            return;
        }
        setIsChatOpen(true);
    };

    return (
        <>
            <div className={cn("glass-card p-6 space-y-6", className)}>
                {/* Header */}
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground overflow-hidden">
                            <User className="w-7 h-7" />
                        </div>
                        {isCorporate && (
                            <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1 border-2 border-[#0a0a0a]">
                                <ShieldCheck className="w-3 h-3 text-white" />
                            </div>
                        )}
                        {showVerifiedBadge && (
                            <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1 border-2 border-[#0a0a0a]">
                                <ShieldCheck className="w-3 h-3 text-white" />
                            </div>
                        )}
                    </div>

                    <div>
                        <h3 className="font-semibold text-lg leading-none mb-1.5">{formatName(user.name)}</h3>
                        <div className="flex flex-col gap-1">
                            {isCorporate ? (
                                <span className="text-xs font-medium text-blue-400">Kurumsal Üye</span>
                            ) : showVerifiedBadge ? (
                                <span className="text-xs font-medium text-green-400">Doğrulanmış Satıcı</span>
                            ) : (
                                <span className="text-xs text-muted-foreground">Bireysel Satıcı</span>
                            )}

                            {user.createdAt && (
                                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    Üyelik: {new Date(user.createdAt).getFullYear()}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-2 py-4 border-y border-white/10">
                    <div className="text-center p-2 rounded bg-white/[0.02]">
                        <div className="text-xs text-muted-foreground mb-1">Yanıt Süresi</div>
                        <div className="text-sm font-medium flex items-center justify-center gap-1">
                            <Clock className="w-3 h-3 text-brand-gold" />
                            3 saat
                        </div>
                    </div>
                    <div className="text-center p-2 rounded bg-white/[0.02]">
                        <div className="text-xs text-muted-foreground mb-1">Aktif İlan</div>
                        <div className="text-sm font-medium">
                            {listingCount !== null ? `${listingCount} İlan` : "..."}
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                    {canCall && (
                        <Button
                            onClick={() => setShowPhone(!showPhone)}
                            variant="outline"
                            className="w-full justify-center gap-2 h-11 border-brand-gold/20 hover:bg-brand-gold/10 hover:text-brand-gold hover:border-brand-gold/50 transition-all"
                        >
                            <Phone className="w-4 h-4" />
                            {showPhone ? (user.phone || "0532 *** ** **") : "Telefonu Göster"}
                        </Button>
                    )}

                    {canMessage && (
                        <Button
                            onClick={handleMessageClick}
                            className="w-full justify-center gap-2 h-11 bg-brand-gold text-black hover:bg-brand-gold/90 font-medium shadow-[0_0_15px_rgba(251,191,36,0.2)] hover:shadow-[0_0_20px_rgba(251,191,36,0.3)] transition-all"
                        >
                            <MessageCircle className="w-4 h-4" />
                            Mesaj Gönder
                        </Button>
                    )}
                </div>
            </div>

            <ChatDialog
                isOpen={isChatOpen}
                onClose={() => setIsChatOpen(false)}
                listingId={listingId}
                sellerName={formatName(user.name)}
            />
        </>
    );
}
