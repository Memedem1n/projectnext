
import { AlertCircle, TrendingDown, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface ListingBadgesProps {
    badges: string[];
    className?: string;
}

export function ListingBadges({ badges, className }: ListingBadgesProps) {
    if (!badges || badges.length === 0) return null;

    const hasPriceDropped = badges.includes("PRICE_DROPPED");
    const hasUrgent = badges.includes("URGENT");
    const hasOpportunity = badges.includes("OPPORTUNITY");

    return (
        <>
            {/* Diagonal Ribbon - Price Dropped */}
            {hasPriceDropped && (
                <div className="absolute top-[12px] -left-[32px] w-[120px] -rotate-45 bg-gradient-to-r from-emerald-600 to-green-500 text-white text-[9px] font-bold text-center py-1 shadow-lg z-20 border-y border-white/20">
                    <span className="drop-shadow-md">FİYAT DÜŞTÜ</span>
                </div>
            )}

            {/* Bottom Left Badges Container */}
            <div className={cn("absolute bottom-2 left-2 z-20 flex flex-col gap-1.5 items-start pointer-events-none", className)}>

                {/* Urgent Badge */}
                {hasUrgent && (
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-gradient-to-r from-red-600 to-red-500 text-white text-[10px] font-bold rounded-md shadow-lg animate-pulse border border-white/10 backdrop-blur-sm">
                        <AlertCircle className="w-3 h-3 fill-white/20" />
                        <span className="tracking-wide">ACİL</span>
                    </div>
                )}

                {/* Opportunity Badge */}
                {hasOpportunity && (
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[10px] font-bold rounded-md shadow-lg border border-white/10 backdrop-blur-sm">
                        <Star className="w-3 h-3 fill-white/20" />
                        <span className="tracking-wide">FIRSAT</span>
                    </div>
                )}
            </div>
        </>
    );
}
