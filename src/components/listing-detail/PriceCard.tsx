import { MapPin, Calendar, Eye, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface PriceCardProps {
    listing: {
        price: number;
        city: string | null;
        district: string | null;
        createdAt: Date;
        views: number;
    };
    className?: string;
}

export function PriceCard({ listing, className }: PriceCardProps) {
    // Calculate time ago
    const timeAgo = (date: Date) => {
        const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " yıl önce";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " ay önce";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " gün önce";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " saat önce";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " dakika önce";
        return "Az önce";
    };

    return (
        <div className={cn("glass-card p-6 space-y-6 sticky top-24", className)}>
            {/* Price Section */}
            <div className="space-y-1">
                <div className="text-sm text-muted-foreground font-medium">Satış Fiyatı</div>
                <div className="text-4xl font-bold text-brand-gold tracking-tight">
                    {listing.price.toLocaleString('tr-TR')} <span className="text-2xl font-semibold">TL</span>
                </div>
            </div>

            {/* Location */}
            <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/5">
                <MapPin className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                    <div className="font-medium text-foreground">
                        {listing.city}, {listing.district}
                    </div>
                    <div className="text-xs text-muted-foreground">
                        Konumu Haritada Göster
                    </div>
                </div>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar className="w-3.5 h-3.5" />
                        İlan Tarihi
                    </div>
                    <div className="text-sm font-medium">
                        {new Date(listing.createdAt).toLocaleDateString('tr-TR')}
                    </div>
                </div>

                <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="w-3.5 h-3.5" />
                        Son Güncelleme
                    </div>
                    <div className="text-sm font-medium">
                        {timeAgo(listing.createdAt)}
                    </div>
                </div>

                <div className="space-y-1 col-span-2">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Eye className="w-3.5 h-3.5" />
                        Görüntülenme
                    </div>
                    <div className="text-sm font-medium">
                        {listing.views.toLocaleString()} kez görüntülendi
                    </div>
                </div>
            </div>
        </div>
    );
}
