import { Phone, MessageCircle, Heart, Share2, ShieldCheck, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface SellerSidebarProps {
    price: string;
    seller: {
        name: string;
        image?: string;
        rating: number;
        joinDate: string;
        location: string;
    };
}

export function SellerSidebar({ price, seller }: SellerSidebarProps) {
    return (
        <div className="space-y-6 sticky top-24">
            {/* Price Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 backdrop-blur-xl">
                <div className="text-sm text-muted-foreground mb-2">Fiyat</div>
                <div className="text-3xl font-bold text-brand-gold mb-6">{price}</div>

                <div className="flex items-center gap-3 mb-4">
                    <button className="p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
                        <Heart className="w-5 h-5" />
                    </button>
                    <button className="p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
                        <Share2 className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-3">
                    <button className="w-full py-4 rounded-xl bg-brand-gold text-[#1c1917] font-bold hover:bg-brand-gold/90 transition-colors flex items-center justify-center gap-2">
                        <Phone className="w-5 h-5" />
                        <span>Ara</span>
                    </button>
                    <button className="w-full py-4 rounded-xl bg-white/10 text-white font-bold hover:bg-white/20 transition-colors flex items-center justify-center gap-2">
                        <MessageCircle className="w-5 h-5" />
                        <span>Mesaj Gönder</span>
                    </button>
                </div>
            </div>

            {/* Seller Card */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xl font-bold text-white">
                        {seller.name.charAt(0)}
                    </div>
                    <div>
                        <div className="font-bold text-lg">{seller.name}</div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                            <span className="text-white font-medium">{seller.rating}</span>
                            <span>• {seller.location}</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-white/10">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Üyelik Tarihi</span>
                        <span className="font-medium">{seller.joinDate}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Diğer İlanları</span>
                        <a href="#" className="text-brand-gold hover:underline">Tümünü Gör</a>
                    </div>
                </div>
            </div>

            {/* Safety Tips */}
            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 flex gap-3">
                <ShieldCheck className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <div className="text-xs text-blue-200/80 leading-relaxed">
                    <strong>Güvenlik İpucu:</strong> Kapora göndermeden önce aracı mutlaka görün. Şüpheli durumlarda bizimle iletişime geçin.
                </div>
            </div>
        </div>
    );
}
