import Link from "next/link";
import { ChevronRight, Share2, Heart, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FavoriteButton } from "@/components/listing/FavoriteButton";
import { cn } from "@/lib/utils";

interface ListingHeaderProps {
    title: string;
    category: {
        name: string;
        slug: string;
    } | null;
    listingId: string;
    className?: string;
}

export function ListingHeader({ title, category, listingId, className }: ListingHeaderProps) {
    return (
        <div className={cn("space-y-4 mb-6", className)}>
            {/* Breadcrumbs */}
            <div className="flex items-center flex-wrap gap-2 text-sm text-muted-foreground">
                <Link href="/" className="hover:text-foreground transition-colors">
                    Anasayfa
                </Link>
                <ChevronRight className="w-4 h-4 text-white/20" />
                <Link
                    href={`/category/${category?.slug || 'vasita'}`}
                    className="hover:text-foreground transition-colors"
                >
                    {category?.name || 'Kategori'}
                </Link>
                <ChevronRight className="w-4 h-4 text-white/20" />
                <span className="text-foreground font-medium truncate max-w-[200px] md:max-w-none">
                    {title}
                </span>
            </div>

            {/* Title & Actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-white/10">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
                    {title}
                </h1>

                <div className="flex items-center gap-2">
                    <FavoriteButton
                        listingId={listingId}
                        className="rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:text-brand-gold transition-colors w-10 h-10 flex items-center justify-center p-0"
                    />

                    <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full bg-white/5 border-white/10 hover:bg-white/10 hover:text-brand-gold transition-colors w-10 h-10"
                    >
                        <Share2 className="w-4 h-4" />
                    </Button>

                    <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full bg-white/5 border-white/10 hover:bg-white/10 hover:text-red-400 transition-colors w-10 h-10"
                    >
                        <Flag className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
