import { cn } from "@/lib/utils";

interface AttributeTableProps {
    listing: any; // Using any for now to avoid complex type imports, but should be ListingWithRelations
}

export function AttributeTable({ listing }: AttributeTableProps) {
    // Helper to format boolean values
    const formatBool = (val: boolean | null | undefined) => val ? "Evet" : "Hayır";

    // Check if this is an emlak (real estate) listing
    const isEmlak = listing.category?.slug?.startsWith('emlak');

    // Define attributes to display based on category
    const attributes = isEmlak ? [
        // Emlak-specific attributes
        { label: "İlan No", value: listing.id.substring(0, 8).toUpperCase() },
        { label: "İlan Tarihi", value: new Date(listing.createdAt).toLocaleDateString('tr-TR') },
        { label: "Emlak Tipi", value: listing.propertyType || "Daire" }, // Default to Daire
        { label: "m² (Brüt)", value: listing.squareMeters ? `${listing.squareMeters} m²` : "150 m²" },
        { label: "m² (Net)", value: listing.netSquareMeters ? `${listing.netSquareMeters} m²` : "135 m²" },
        { label: "Oda Sayısı", value: listing.rooms || "3+1" },
        { label: "Bina Yaşı", value: listing.buildingAge?.toString() || "5" },
        { label: "Bulunduğu Kat", value: listing.floor || "4" },
        { label: "Kat Sayısı", value: listing.totalFloors || "8" },
        { label: "Isıtma", value: listing.heatingType || "Kombi (Doğalgaz)" },
        { label: "Banyo Sayısı", value: listing.bathrooms?.toString() || "1" },
        { label: "Balkon", value: formatBool(listing.hasBalcony ?? true) },
        { label: "Asansör", value: formatBool(listing.hasElevator ?? true) },
        { label: "Otopark", value: formatBool(listing.hasParking ?? false) },
        { label: "Eşyalı", value: formatBool(listing.isFurnished ?? false) },
        { label: "Kullanım Durumu", value: listing.usageStatus || "Boş" },
        { label: "Tapu Durumu", value: listing.deedStatus || "Kat Mülkiyetli" },
        { label: "Aidat", value: listing.dues ? `${listing.dues} TL` : "500 TL" },
    ] : [
        // Vehicle-specific attributes
        { label: "İlan No", value: listing.id.substring(0, 8).toUpperCase() },
        { label: "İlan Tarihi", value: new Date(listing.createdAt).toLocaleDateString('tr-TR') },
        { label: "Marka", value: listing.brand },
        { label: "Seri", value: listing.model }, // Assuming model is series for now
        { label: "Model", value: listing.model },
        { label: "Yıl", value: listing.year?.toString() },
        { label: "Yakıt", value: listing.fuel },
        { label: "Vites", value: listing.gear },
        { label: "KM", value: listing.km?.toLocaleString('tr-TR') },
        { label: "Kasa Tipi", value: listing.caseType },
        { label: "Motor Gücü", value: "150 hp" }, // Mock data
        { label: "Motor Hacmi", value: "1598 cc" }, // Mock data
        { label: "Çekiş", value: "Önden Çekiş" }, // Mock data
        { label: "Renk", value: listing.color || "Belirtilmemiş" },
        { label: "Garanti", value: formatBool(listing.warranty) },
        { label: "Takas", value: formatBool(listing.exchange) },
        { label: "Durumu", value: "İkinci El" },
    ];

    return (
        <div className="glass-card overflow-hidden">
            <h2 className="text-xl font-semibold p-6 border-b border-white/10">İlan Özellikleri</h2>
            <div className="divide-y divide-white/5">
                {attributes.map((attr, index) => (
                    attr.value && (
                        <div
                            key={index}
                            className={cn(
                                "flex justify-between px-6 py-3 text-sm hover:bg-brand-gold/5 transition-colors",
                                index % 2 === 0 ? "bg-white/[0.02]" : "bg-transparent"
                            )}
                        >
                            <span className="font-medium text-muted-foreground">{attr.label}</span>
                            <span className="font-semibold text-foreground">{attr.value}</span>
                        </div>
                    )
                ))}
            </div>
        </div>
    );
}
