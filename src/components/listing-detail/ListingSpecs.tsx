import { Car, Calendar, Gauge, Fuel, Settings2, ShieldCheck, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface ListingSpecsProps {
    listing: any;
}

export function ListingSpecs({ listing }: ListingSpecsProps) {
    // Check if it's a vehicle listing (either by category or by presence of vehicle-specific fields)
    const isVasita = listing.category?.slug?.startsWith('vasita') || listing.brand || listing.model;

    // Helper to capitalize
    const capitalize = (s: string) => s ? s.charAt(0).toUpperCase() + s.slice(1) : "";

    // Vehicle Specs List (Matching the image order)
    const specs = [
        { label: "İlan No", value: listing.listingNumber || listing.id.substring(0, 8), highlight: true },
        { label: "İlan Tarihi", value: new Date(listing.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }) },
        { label: "Marka", value: listing.brand },
        { label: "Seri", value: listing.series },
        { label: "Model", value: listing.model },
        { label: "Yıl", value: listing.year },
        { label: "Yakıt Tipi", value: listing.fuel },
        { label: "Vites", value: listing.gear },
        { label: "Araç Durumu", value: listing.km === 0 ? "Sıfır" : "İkinci El" },
        { label: "KM", value: listing.km?.toLocaleString() },
        { label: "Kasa Tipi", value: listing.caseType },
        { label: "Motor Gücü", value: listing.motorPower },
        { label: "Motor Hacmi", value: listing.engineVolume },
        // { label: "Çekiş", value: listing.traction }, // Hidden as requested
        { label: "Renk", value: capitalize(listing.color) },
        {
            label: "Garanti",
            value: listing.warranty ? "Evet" : "Hayır",
            render: listing.warranty ? (
                <span className="flex items-center gap-1 text-green-500 font-bold">
                    <ShieldCheck className="w-4 h-4" />
                    Evet
                </span>
            ) : "Hayır"
        },
        { label: "Ağır Hasar Kayıtlı", value: listing.heavyDamage ? "Evet" : "Hayır" },
        {
            label: "Plaka / Uyruk",
            value: listing.plateNationality || (listing.plate?.match(/^(0[1-9]|[1-7][0-9]|8[0-1])\s*[A-Z]{1,3}\s*\d{2,4}$/) ? "Türkiye (TR) Plakalı" : "Yabancı Uyruklu")
        },
        { label: "Kimden", value: listing.user?.role === 'DEALER' ? 'Galeriden' : 'Sahibinden' },
        { label: "Takas", value: listing.exchange ? "Evet" : "Hayır" },
    ];

    return (
        <div className="glass-card p-0 overflow-hidden">
            <div className="p-6 border-b border-white/10">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Car className="w-5 h-5 text-brand-gold" />
                    Araç Bilgileri
                </h2>
            </div>

            <div className="p-6">
                <div className="grid grid-cols-1 gap-y-0">
                    {specs.map((spec, index) => (
                        <div
                            key={index}
                            className={cn(
                                "flex justify-between items-center py-3 border-b border-white/5 hover:bg-white/[0.02] px-2 transition-colors",
                                index === specs.length - 1 && "border-0"
                            )}
                        >
                            <span className="text-muted-foreground font-medium text-sm">{spec.label}</span>
                            <span className={cn(
                                "font-medium text-sm text-right",
                                spec.highlight ? "text-red-500" : "text-foreground"
                            )}>
                                {spec.render || spec.value || "-"}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
