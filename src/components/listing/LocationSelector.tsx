import { useState, useEffect, useMemo } from "react";
import { MapPin, ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import locationsData from "@/data/locations.json";

interface LocationSelectorProps {
    onSelect: (location: { city: string; district: string; neighborhood: string }) => void;
    initialLocation?: { city: string; district: string; neighborhood: string };
}

export function LocationSelector({ onSelect, initialLocation }: LocationSelectorProps) {
    const [city, setCity] = useState(initialLocation?.city || "");
    const [district, setDistrict] = useState(initialLocation?.district || "");
    const [neighborhood, setNeighborhood] = useState(initialLocation?.neighborhood || "");

    const [openDropdown, setOpenDropdown] = useState<"city" | "district" | "neighborhood" | null>(null);

    // Reset downstream selections when upstream changes
    const handleCityChange = (newCity: string) => {
        setCity(newCity);
        setDistrict("");
        setNeighborhood("");
        setOpenDropdown(null);
    };

    const handleDistrictChange = (newDistrict: string) => {
        setDistrict(newDistrict);
        setNeighborhood("");
        setOpenDropdown(null);
    };

    const handleNeighborhoodChange = (newNeighborhood: string) => {
        setNeighborhood(newNeighborhood);
        setOpenDropdown(null);
        onSelect({ city, district, neighborhood: newNeighborhood });
    };

    // Derived Data
    const cities = useMemo(() => locationsData.map(l => l.name), []);

    const counties = useMemo(() => {
        if (!city) return [];
        const cityData = locationsData.find(l => l.name === city);
        return cityData ? cityData.counties.map(c => c.name) : [];
    }, [city]);

    const neighborhoods = useMemo(() => {
        if (!city || !district) return [];
        const cityData = locationsData.find(l => l.name === city);
        if (!cityData) return [];
        const countyData = cityData.counties.find(c => c.name === district);
        if (!countyData) return [];

        // Flatten neighborhoods from all districts (semts)
        const allNeighborhoods: string[] = [];
        countyData.districts.forEach(d => {
            d.neighborhoods.forEach(n => {
                allNeighborhoods.push(n.name);
            });
        });
        return allNeighborhoods.sort();
    }, [city, district]);

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
                <MapPin className="w-5 h-5 text-brand-gold" />
                Konum Bilgileri
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* City Selector */}
                <div className="relative">
                    <label className="block text-sm font-medium mb-2">İl</label>
                    <button
                        onClick={() => setOpenDropdown(openDropdown === "city" ? null : "city")}
                        className={cn(
                            "w-full bg-black/20 border rounded-xl p-3 flex items-center justify-between transition-colors text-left",
                            openDropdown === "city" ? "border-brand-gold ring-1 ring-brand-gold" : "border-white/10 hover:border-brand-gold/50"
                        )}
                    >
                        <span className={city ? "text-foreground" : "text-muted-foreground"}>
                            {city || "İl Seçiniz"}
                        </span>
                        <ChevronDown className={cn("w-4 h-4 transition-transform", openDropdown === "city" && "rotate-180")} />
                    </button>

                    {openDropdown === "city" && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a1a] border border-white/10 rounded-xl overflow-hidden z-50 max-h-60 overflow-y-auto shadow-xl">
                            {cities.map(c => (
                                <button
                                    key={c}
                                    onClick={() => handleCityChange(c)}
                                    className="w-full p-3 text-left hover:bg-white/5 transition-colors flex items-center justify-between"
                                >
                                    {c}
                                    {city === c && <Check className="w-4 h-4 text-brand-gold" />}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* District Selector */}
                <div className="relative">
                    <label className="block text-sm font-medium mb-2">İlçe</label>
                    <button
                        onClick={() => setOpenDropdown(openDropdown === "district" ? null : "district")}
                        disabled={!city}
                        className={cn(
                            "w-full bg-black/20 border rounded-xl p-3 flex items-center justify-between transition-colors text-left",
                            openDropdown === "district" ? "border-brand-gold ring-1 ring-brand-gold" : "border-white/10 hover:border-brand-gold/50",
                            !city && "opacity-50 cursor-not-allowed"
                        )}
                    >
                        <span className={district ? "text-foreground" : "text-muted-foreground"}>
                            {district || "İlçe Seçiniz"}
                        </span>
                        <ChevronDown className={cn("w-4 h-4 transition-transform", openDropdown === "district" && "rotate-180")} />
                    </button>

                    {openDropdown === "district" && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a1a] border border-white/10 rounded-xl overflow-hidden z-50 max-h-60 overflow-y-auto shadow-xl">
                            {counties.map(c => (
                                <button
                                    key={c}
                                    onClick={() => handleDistrictChange(c)}
                                    className="w-full p-3 text-left hover:bg-white/5 transition-colors flex items-center justify-between"
                                >
                                    {c}
                                    {district === c && <Check className="w-4 h-4 text-brand-gold" />}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Neighborhood Selector */}
                <div className="relative">
                    <label className="block text-sm font-medium mb-2">Mahalle</label>
                    <button
                        onClick={() => setOpenDropdown(openDropdown === "neighborhood" ? null : "neighborhood")}
                        disabled={!district}
                        className={cn(
                            "w-full bg-black/20 border rounded-xl p-3 flex items-center justify-between transition-colors text-left",
                            openDropdown === "neighborhood" ? "border-brand-gold ring-1 ring-brand-gold" : "border-white/10 hover:border-brand-gold/50",
                            !district && "opacity-50 cursor-not-allowed"
                        )}
                    >
                        <span className={neighborhood ? "text-foreground" : "text-muted-foreground truncate"}>
                            {neighborhood || "Mahalle Seçiniz"}
                        </span>
                        <ChevronDown className={cn("w-4 h-4 transition-transform", openDropdown === "neighborhood" && "rotate-180")} />
                    </button>

                    {openDropdown === "neighborhood" && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a1a] border border-white/10 rounded-xl overflow-hidden z-50 max-h-60 overflow-y-auto shadow-xl">
                            {neighborhoods.map((n, i) => (
                                <button
                                    key={`${n}-${i}`}
                                    onClick={() => handleNeighborhoodChange(n)}
                                    className="w-full p-3 text-left hover:bg-white/5 transition-colors flex items-center justify-between"
                                >
                                    <span className="truncate">{n}</span>
                                    {neighborhood === n && <Check className="w-4 h-4 text-brand-gold shrink-0" />}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
