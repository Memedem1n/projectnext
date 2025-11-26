'use client';

import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface EmlakFilters {
    minPrice: string;
    maxPrice: string;
    minSqm: string;
    maxSqm: string;
    rooms: string;
    minFloor: string;
    maxFloor: string;
    buildingAge: string;
    heatingType: string;
    furnished: string;
    deedStatus: string;
    hasBalcony: string;
    hasElevator: string;
    hasParking: string;
}

interface EmlakFilterSectionProps {
    isExpanded: boolean;
}

export function EmlakFilterSection({ isExpanded }: EmlakFilterSectionProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [filters, setFilters] = useState<EmlakFilters>({
        minPrice: '',
        maxPrice: '',
        minSqm: '',
        maxSqm: '',
        rooms: '',
        minFloor: '',
        maxFloor: '',
        buildingAge: '',
        heatingType: '',
        furnished: '',
        deedStatus: '',
        hasBalcony: '',
        hasElevator: '',
        hasParking: '',
    });

    useEffect(() => {
        setFilters({
            minPrice: searchParams.get("minPrice") || "",
            maxPrice: searchParams.get("maxPrice") || "",
            minSqm: searchParams.get("minSqm") || "",
            maxSqm: searchParams.get("maxSqm") || "",
            rooms: searchParams.get("rooms") || "",
            minFloor: searchParams.get("minFloor") || "",
            maxFloor: searchParams.get("maxFloor") || "",
            buildingAge: searchParams.get("buildingAge") || "",
            heatingType: searchParams.get("heatingType") || "",
            furnished: searchParams.get("furnished") || "",
            deedStatus: searchParams.get("deedStatus") || "",
            hasBalcony: searchParams.get("hasBalcony") || "",
            hasElevator: searchParams.get("hasElevator") || "",
            hasParking: searchParams.get("hasParking") || "",
        });
    }, [searchParams]);

    const handleApplyFilters = () => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value) params.set(key, value);
        });
        router.push(`?${params.toString()}`);
    };

    if (!isExpanded) return null;

    return (
        <div className="space-y-4 mt-3">
            {/* Price Range */}
            <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Fiyat (TL)</label>
                <div className="flex items-center gap-2">
                    <Input
                        type="number"
                        placeholder="Min"
                        value={filters.minPrice}
                        onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                        className="bg-white/5 border-white/10 focus:bg-white/10 transition-colors text-xs h-9"
                    />
                    <span className="text-muted-foreground text-xs">-</span>
                    <Input
                        type="number"
                        placeholder="Max"
                        value={filters.maxPrice}
                        onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                        className="bg-white/5 border-white/10 focus:bg-white/10 transition-colors text-xs h-9"
                    />
                </div>
            </div>

            {/* Square Meters */}
            <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">m² (Net)</label>
                <div className="flex items-center gap-2">
                    <Input
                        type="number"
                        placeholder="Min"
                        value={filters.minSqm}
                        onChange={(e) => setFilters({ ...filters, minSqm: e.target.value })}
                        className="bg-white/5 border-white/10 focus:bg-white/10 transition-colors text-xs h-9"
                    />
                    <span className="text-muted-foreground text-xs">-</span>
                    <Input
                        type="number"
                        placeholder="Max"
                        value={filters.maxSqm}
                        onChange={(e) => setFilters({ ...filters, maxSqm: e.target.value })}
                        className="bg-white/5 border-white/10 focus:bg-white/10 transition-colors text-xs h-9"
                    />
                </div>
            </div>

            {/* Rooms */}
            <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Oda Sayısı</label>
                <select
                    value={filters.rooms}
                    onChange={(e) => setFilters({ ...filters, rooms: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-xs focus:bg-white/10 transition-colors"
                >
                    <option value="">Tümü</option>
                    <option value="1+0">1+0</option>
                    <option value="1+1">1+1</option>
                    <option value="2+1">2+1</option>
                    <option value="3+1">3+1</option>
                    <option value="4+1">4+1</option>
                    <option value="5+1">5+1 ve üzeri</option>
                </select>
            </div>

            {/* Floor */}
            <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Kat</label>
                <div className="flex items-center gap-2">
                    <Input
                        type="number"
                        placeholder="Min"
                        value={filters.minFloor}
                        onChange={(e) => setFilters({ ...filters, minFloor: e.target.value })}
                        className="bg-white/5 border-white/10 focus:bg-white/10 transition-colors text-xs h-9"
                    />
                    <span className="text-muted-foreground text-xs">-</span>
                    <Input
                        type="number"
                        placeholder="Max"
                        value={filters.maxFloor}
                        onChange={(e) => setFilters({ ...filters, maxFloor: e.target.value })}
                        className="bg-white/5 border-white/10 focus:bg-white/10 transition-colors text-xs h-9"
                    />
                </div>
            </div>

            {/* Heating Type */}
            <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Isıtma</label>
                <select
                    value={filters.heatingType}
                    onChange={(e) => setFilters({ ...filters, heatingType: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-xs focus:bg-white/10 transition-colors"
                >
                    <option value="">Tümü</option>
                    <option value="Kombi (Doğalgaz)">Kombi (Doğalgaz)</option>
                    <option value="Merkezi">Merkezi</option>
                    <option value="Soba">Soba</option>
                    <option value="Klima">Klima</option>
                    <option value="Yerden Isıtma">Yerden Isıtma</option>
                </select>
            </div>

            {/* Deed Status */}
            <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Tapu Durumu</label>
                <select
                    value={filters.deedStatus}
                    onChange={(e) => setFilters({ ...filters, deedStatus: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-xs focus:bg-white/10 transition-colors"
                >
                    <option value="">Tümü</option>
                    <option value="Kat Mülkiyetli">Kat Mülkiyetli</option>
                    <option value="Kat İrtifaklı">Kat İrtifaklı</option>
                    <option value="Arsa Tapulu">Arsa Tapulu</option>
                </select>
            </div>

            {/* Boolean Filters */}
            <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Özellikler</label>
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs cursor-pointer hover:text-brand-gold transition-colors">
                        <input
                            type="checkbox"
                            checked={filters.hasBalcony === 'true'}
                            onChange={(e) => setFilters({ ...filters, hasBalcony: e.target.checked ? 'true' : '' })}
                            className="rounded border-white/20 bg-white/5"
                        />
                        Balkon
                    </label>
                    <label className="flex items-center gap-2 text-xs cursor-pointer hover:text-brand-gold transition-colors">
                        <input
                            type="checkbox"
                            checked={filters.hasElevator === 'true'}
                            onChange={(e) => setFilters({ ...filters, hasElevator: e.target.checked ? 'true' : '' })}
                            className="rounded border-white/20 bg-white/5"
                        />
                        Asansör
                    </label>
                    <label className="flex items-center gap-2 text-xs cursor-pointer hover:text-brand-gold transition-colors">
                        <input
                            type="checkbox"
                            checked={filters.hasParking === 'true'}
                            onChange={(e) => setFilters({ ...filters, hasParking: e.target.checked ? 'true' : '' })}
                            className="rounded border-white/20 bg-white/5"
                        />
                        Otopark
                    </label>
                    <label className="flex items-center gap-2 text-xs cursor-pointer hover:text-brand-gold transition-colors">
                        <input
                            type="checkbox"
                            checked={filters.furnished === 'true'}
                            onChange={(e) => setFilters({ ...filters, furnished: e.target.checked ? 'true' : '' })}
                            className="rounded border-white/20 bg-white/5"
                        />
                        Eşyalı
                    </label>
                </div>
            </div>

            {/* Apply Button */}
            <button
                onClick={handleApplyFilters}
                className="w-full bg-brand-gold hover:bg-brand-gold/90 text-[#1c1917] font-semibold py-2 px-4 rounded-lg transition-all hover:scale-105 active:scale-95 text-sm"
            >
                Filtrele
            </button>
        </div>
    );
}
