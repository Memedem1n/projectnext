import { getListingById } from "@/lib/actions/listings";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { ListingGallery } from "@/components/listing-detail/ListingGallery";
import { SellerCard } from "@/components/listing-detail/SellerCard";
import { ListingSpecs } from "@/components/listing-detail/ListingSpecs";
import { ListingHeader } from "@/components/listing-detail/ListingHeader";
import { PriceCard } from "@/components/listing-detail/PriceCard";
import { SafetyTips } from "@/components/listing-detail/SafetyTips";
import { DamageReportsSection } from "@/components/listing-detail/DamageReportsSection";
import { EquipmentSection } from "@/components/listing-detail/EquipmentSection";
import { PageBackground } from "@/components/layout/PageBackground";
import { SimilarListings } from "@/components/listing-detail/SimilarListings";
import { PromotedListings } from "@/components/listing-detail/PromotedListings";
import { getSession } from "@/lib/session";

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params;
    const result = await getListingById(id);

    if (!result.success || !result.data) {
        return {
            title: "İlan Bulunamadı",
        };
    }

    const listing = result.data;

    return {
        title: `${listing.title} - ProjectNexx`,
        description: listing.description?.substring(0, 160) || "İlan detayları",
    };
}

export const revalidate = 3600; // Revalidate every 1 hour

export default async function ListingDetailPage({ params }: PageProps) {
    const { id } = await params;
    const session = await getSession();
    const result = await getListingById(id);

    if (!result.success || !result.data) {
        notFound();
    }

    const listing = result.data;

    return (
        <div className="min-h-screen bg-background pt-24 pb-12 relative overflow-hidden">
            <PageBackground />

            <div className="container mx-auto px-4 relative z-10 max-w-7xl">
                {/* Header Section */}
                <ListingHeader
                    title={listing.title}
                    category={listing.category}
                    listingId={listing.id}
                />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left Column: Gallery (6 cols) */}
                    <div className="lg:col-span-6 space-y-8">
                        <ListingGallery images={listing.images} title={listing.title} />

                        {/* Description & Other Details (Below Gallery on mobile, but here for flow) */}
                        <div className="space-y-8">
                            {/* Description */}
                            <div className="glass-card p-8">
                                <h2 className="text-xl font-semibold mb-6 pb-4 border-b border-white/10">Açıklama</h2>
                                <div className="whitespace-pre-wrap text-muted-foreground leading-relaxed text-sm md:text-base">
                                    {listing.description || "Açıklama bulunmamaktadır."}
                                </div>
                            </div>

                            {/* Vehicle Specific Sections */}
                            {(listing.category?.slug?.startsWith('vasita') || listing.brand || listing.model) && (
                                <>
                                    <DamageReportsSection
                                        damageReports={listing.damage || []}
                                        tramer={listing.tramer}
                                        plate={listing.plate}
                                        plateNationality={listing.plateNationality}
                                    />
                                </>
                            )}
                        </div>
                    </div>

                    {/* Right Column Wrapper (6 cols) */}
                    <div className="lg:col-span-6 space-y-6">
                        {/* Sticky Wrapper */}
                        <div className="sticky top-24 space-y-6">
                            {/* Top Row: Specs & Sidebar Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Specs */}
                                <div>
                                    <ListingSpecs listing={listing} />
                                </div>

                                {/* Sidebar Cards */}
                                <div className="space-y-6">
                                    <PriceCard listing={listing} />

                                    <SellerCard
                                        user={listing.user}
                                        listingId={listing.id}
                                        currentUser={session?.user ? { id: session.user.id } : null}
                                        contactPreference={listing.contactPreference}
                                    />

                                    <SafetyTips />
                                </div>
                            </div>

                            {/* Equipment Section (Full Width) */}
                            {(listing.category?.slug?.startsWith('vasita') || listing.brand || listing.model) && (
                                <EquipmentSection equipment={listing.equipment || []} />
                            )}
                        </div>
                    </div>
                </div>

                {/* Similar Listings */}
                <div className="mt-12 space-y-12">
                    <PromotedListings categoryId={listing.categoryId} currentListingId={listing.id} />
                    <SimilarListings categoryId={listing.categoryId} currentListingId={listing.id} />
                </div>
            </div>
        </div>
    );
}
