import { Phone, MessageCircle, Star, MapPin, ShieldCheck, Calendar } from "lucide-react";

interface SellerSidebarProps {
    price: string;
    seller: {
        name: string;
        rating: number;
        joinDate: string;
        location: string;
        verifiedStatus?: {
            phone: boolean;
            id: boolean;
        };
    };
}

export function SellerSidebar({ price, seller }: SellerSidebarProps) {
    return (
        <div className="space-y-6 sticky top-24">
            {/* Price Card with CTA */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 space-y-4">
                <div className="text-sm text-muted-foreground">Fiyat</div>
                <div className="text-3xl font-bold text-brand-gold">{price}</div>

                <div className="flex gap-2">
                    <button className="flex-1 py-3 rounded-xl bg-brand-gold hover:bg-brand-gold/90 text-[#1c1917] transition-colors flex items-center justify-center gap-2 font-semibold">
                        <Phone className="w-4 h-4" />
                        Ara
                    </button>
                    <button className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center gap-2 font-medium">
                        <MessageCircle className="w-4 h-4" />
                        Mesaj
                    </button>
                </div>
            </div>

            {/* Seller Card */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-brand-gold/20 flex items-center justify-center text-brand-gold font-bold text-xl">
                        {seller.name.charAt(0)}
                    </div>
                    <div>
                        <div className="font-bold text-lg">{seller.name}</div>
                        <div className="flex items-center gap-1 text-sm text-yellow-500">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="font-medium">{seller.rating}</span>
                            <span className="text-muted-foreground">(120 Değerlendirme)</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-white/10">
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>Üyelik: {seller.joinDate}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span>{seller.location}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <ShieldCheck className="w-4 h-4 text-green-500" />
                        <span className="text-green-500">Doğrulanmış Satıcı</span>
                    </div>
                    {seller.verifiedStatus && (
                        <div className="flex gap-2 pt-2">
                            {seller.verifiedStatus.phone && (
                                <div className="flex items-center gap-1 text-xs bg-green-500/10 text-green-500 px-2 py-1 rounded border border-green-500/20">
                                    <Phone className="w-3 h-3" />
                                    Telefon Onaylı
                                </div>
                            )}
                            {seller.verifiedStatus.id && (
                                <div className="flex items-center gap-1 text-xs bg-blue-500/10 text-blue-500 px-2 py-1 rounded border border-blue-500/20">
                                    <ShieldCheck className="w-3 h-3" />
                                    Kimlik Onaylı
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <button className="w-full py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-colors text-sm font-medium">
                    Satıcının Diğer İlanları
                </button>
            </div>

            {/* Safety Tips */}
            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-sm space-y-2">
                <div className="font-bold text-blue-400 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" />
                    Güvenlik İpuçları
                </div>
                <p className="text-muted-foreground text-xs leading-relaxed">
                    Kapora ödemesi yapmadan önce aracı mutlaka görün. Ekspertiz yaptırmadan aracı teslim almayın.
                </p>
            </div>
        </div>
    );
}
