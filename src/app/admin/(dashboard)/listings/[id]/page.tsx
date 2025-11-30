import { getListingById } from "@/lib/actions/listings";
import { notFound } from "next/navigation";
import { ListingGallery } from "@/components/listing-detail/ListingGallery";
import { SellerCard } from "@/components/listing-detail/SellerCard";
import { AttributeTable } from "@/components/listing-detail/AttributeTable";
import { SafetyTips } from "@/components/listing-detail/SafetyTips";
import { DamageReportsSection } from "@/components/listing-detail/DamageReportsSection";
import { EquipmentSection } from "@/components/listing-detail/EquipmentSection";
import { MapPin, Calendar, Eye, Share2, ChevronLeft } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { PageBackground } from "@/components/layout/PageBackground";
import { AdminActionBar } from "@/components/admin/AdminActionBar";

interface PageProps {
    params: {
        id: string;
    };
}

export default async function AdminListingDetailPage({ params }: PageProps) {
    const { id } = await params;
    const result = await getListingById(id);

    if (!result.success || !result.data) {
        notFound();
    }

    const listing = result.data;

    return (
        <div className="min-h-screen bg-background pt-8 pb-32 relative overflow-hidden">
            {/* Admin Action Bar */}
            <AdminActionBar listingId={listing.id} currentStatus={listing.status} />

            <div className="container mx-auto px-4 relative z-10">
                {/* Breadcrumb & Header */}
                <div className="mb-6 space-y-4">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <Link
                            href="/admin/listings?status=pending"
                            className={buttonVariants({ variant: 'ghost', size: 'sm', className: "gap-1 pl-0 hover:bg-transparent hover:text-brand-gold transition-colors" })}
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Listeye Dön
                        </Link>
                        <div className="h-4 w-px bg-white/10" />
                        <div className="flex items-center gap-2">
                            <span className="text-brand-gold font-medium">Admin Önizleme Modu</span>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-white/10">
                        <h1 className="text-2xl md:text-3xl font-bold">{listing.title}</h1>
                        <div className="flex items-center gap-3">
                            <Button variant="outline" size="icon" className="rounded-full bg-white/5 border-white/10 hover:bg-white/10 hover:text-brand-gold transition-colors" disabled>
                                <Share2 className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Gallery & Details */}
                    <div className="lg:col-span-2 space-y-8">
                        <ListingGallery images={listing.images} title={listing.title} />
                        <AttributeTable listing={listing} />

                        {/* Vehicle-specific sections - only show for vasıta category */}
                        {listing.category?.slug?.startsWith('vasita') && (
                            <>
                                <DamageReportsSection damageReports={listing.damage || []} />
                                <EquipmentSection equipment={listing.equipment || []} />
                            </>
                        )}

                        {/* Description */}
                        <div className="glass-card p-6">
                            <h2 className="text-xl font-semibold mb-4 pb-4 border-b border-white/10">Açıklama</h2>
                            <div className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
                                {listing.description || "Açıklama bulunmamaktadır."}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Price & Seller */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Price Card */}
                        <div className="glass-card p-6 space-y-4">
                            <div>
                                <div className="text-3xl font-bold text-brand-gold mb-1">
                                    {listing.price.toLocaleString('tr-TR')} TL
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <MapPin className="w-4 h-4 text-brand-gold" />
                                    {listing.city}, {listing.district}
                                </div>
                            </div>

                            {/* Badges */}
                            <div className="flex flex-wrap gap-2 pt-2">
                                {(listing.exchange) && (
                                    <span className="px-2 py-1 bg-white/5 border border-white/10 rounded text-xs text-muted-foreground">
                                        Takaslı
                                    </span>
                                )}
                                {(listing.warranty) && (
                                    <span className="px-2 py-1 bg-white/5 border border-white/10 rounded text-xs text-muted-foreground">
                                        Garantili
                                    </span>
                                )}
                            </div>

                            {/* Quick Specs */}
                            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/10 text-sm">
                                {listing.year && (
                                    <div className="flex flex-col">
                                        <span className="text-muted-foreground text-xs">Yıl</span>
                                        <span className="font-medium">{listing.year}</span>
                                    </div>
                                )}
                                {listing.km && (
                                    <div className="flex flex-col">
                                        <span className="text-muted-foreground text-xs">KM</span>
                                        <span className="font-medium">{typeof listing.km === 'string' ? listing.km : `${listing.km.toLocaleString()}`}</span>
                                    </div>
                                )}
                                {listing.fuel && (
                                    <div className="flex flex-col">
                                        <span className="text-muted-foreground text-xs">Yakıt</span>
                                        <span className="font-medium">{listing.fuel}</span>
                                    </div>
                                )}
                                {listing.gear && (
                                    <div className="flex flex-col">
                                        <span className="text-muted-foreground text-xs">Vites</span>
                                        <span className="font-medium">{listing.gear}</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-white/10">
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3 text-brand-gold" />
                                    {new Date(listing.createdAt).toLocaleDateString('tr-TR')}
                                </div>
                                <div className="flex items-center gap-1">
                                    <Eye className="w-3 h-3 text-brand-gold" />
                                    {listing.views} görüntülenme
                                </div>
                            </div>
                        </div>

                        <SellerCard
                            user={listing.user}
                            listingId={listing.id}
                            currentUser={null} // Admin view, no chat needed
                        />
                        <SafetyTips />
                    </div>
                </div>
            </div>
        </div>
    );
}
