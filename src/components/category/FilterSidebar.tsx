/* eslint-disable */
'use client';

import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Filter, ChevronDown, ChevronUp, Save, FolderOpen, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { VehicleDamageZoneSelector, DamageZoneMap } from './VehicleDamageZoneSelector';
import { createSavedFilter, getSavedFilters, deleteSavedFilter } from '@/lib/actions/filters';
import locationsData from '@/data/locations.json';

// Types for the location data
interface Neighborhood {
    name: string;
    code: string;
}

interface SubDistrict {
    name: string;
    neighborhoods: Neighborhood[];
}

interface District {
    name: string;
    districts: SubDistrict[];
}

interface City {
    name: string;
    counties: District[];
}

// Cast the imported data to the correct type
const TURKEY_LOCATIONS = locationsData as City[];

interface CategoryLink {
    id: string;
    name: string;
    slug: string;
    count?: number;
}

interface FilterSidebarProps {
    categories?: CategoryLink[];
    currentCategory?: CategoryLink;
    ancestors?: CategoryLink[];
    parentCategory?: CategoryLink | null;
    currentPath?: string[];
}

export function FilterSidebar({ categories = [], currentCategory, ancestors = [], parentCategory, currentPath = [] }: FilterSidebarProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Helper functions for number formatting
    const formatNumber = (value: string) => {
        if (!value) return "";
        // Remove existing dots and non-digits
        const cleanVal = value.replace(/\D/g, "");
        if (!cleanVal) return "";
        // Format with dots
        return new Intl.NumberFormat('tr-TR').format(parseInt(cleanVal));
    };

    const parseNumber = (value: string) => {
        if (!value) return "";
        return value.replace(/\./g, "");
    };

    // Detect category type based on slug or ancestors
    // Detect category type based on slug or ancestors
    const isEmlakCategory = currentCategory?.slug?.startsWith('emlak') ||
        currentCategory?.slug?.startsWith('konut') ||
        currentCategory?.slug?.startsWith('isyeri') ||
        currentCategory?.slug?.startsWith('arsa') ||
        currentCategory?.slug?.startsWith('bina') ||
        currentCategory?.slug?.startsWith('devremulk') ||
        currentCategory?.slug?.startsWith('turistik-tesis') ||
        ancestors?.some(a => a.slug === 'emlak');

    const isVasitaCategory = currentCategory?.slug === 'vasita' ||
        ancestors?.some(a => a.slug === 'vasita') ||
        (!isEmlakCategory); // Default to vasıta if not emlak

    const [expandedSections, setExpandedSections] = useState({
        location: true,
        basic: true,
        technical: false,
        damage: false,
        saved: false,
    });

    const [savedFilters, setSavedFilters] = useState<any[]>([]);
    const [showSaveDialog, setShowSaveDialog] = useState(false);
    const [filterName, setFilterName] = useState('');

    const [filters, setFilters] = useState({
        minPrice: '',
        maxPrice: '',
        // Vasita Filters
        minYear: '',
        maxYear: '',
        minKm: '',
        maxKm: '',
        damageStatus: '',
        fuelType: '',
        transmission: '',
        driveType: '',
        bodyType: '',
        minHp: '',
        maxHp: '',
        minCc: '',
        maxCc: '',
        color: '',
        condition: '',
        exchange: '',
        tramerRecord: '',
        damagedZones: {} as DamageZoneMap,
        // Emlak Filters
        city: '',
        district: '',
        neighborhood: '',
        minSqm: '',
        maxSqm: '',
        minSqmGross: '',
        maxSqmGross: '',
        rooms: '',
        minFloor: '',
        maxFloor: '',
        totalFloors: '',
        buildingAge: '',
        heatingType: '',
        furnished: '',
        deedStatus: '',
        hasBalcony: '',
        hasElevator: '',
        hasParking: '',
        monthlyDues: '',
        creditSuitable: '',
        usageStatus: '',
        bathroomCount: '',
        kitchenCount: '',
        kitchenType: '',
        inComplex: '',
        sellerType: '',
        listingDate: '',
        // Internal Features
        hasSteelDoor: '',
        hasFiberInternet: '',
        hasAlarm: '',
        hasSauna: '',
        hasFireplace: '',
        hasAirConditioning: '',
        hasPantry: '',
        hasDressingRoom: '',
        hasVideoIntercom: '',
        hasSpotlight: '',
        hasSmartHome: '',
        hasJacuzzi: '',
        hasLaminateFloor: '',
        hasCeramicFloor: '',
        hasPVCJoinery: '',
        hasShowerCabin: '',
        hasWallpaper: '',
        hasTerrace: '',
        hasBuiltInKitchen: '',
        // External Features
        hasSecurity: '',
        hasPool: '',
        hasGarden: '',
        hasGym: '',
        hasGenerator: '',
        hasWaterTank: '',
        hasFireEscape: '',
        hasCableTV: '',
        hasSatellite: '',
        hasCameraSystem: '',
        hasDoorman: '',
        hasPlayground: '',
        hasThermalInsulation: '',
        hasSoundInsulation: '',
        // Location Features
        isNearMetro: '',
        isNearBusStop: '',
        isNearTram: '',
        isNearMarmaray: '',
        isNearMetrobus: '',
        hasSeaView: '',
        hasNatureView: '',
        hasCityView: '',
        isCentral: '',
        isNearHighway: '',
    });

    // Derived state for location dropdowns
    const [availableDistricts, setAvailableDistricts] = useState<District[]>([]);
    const [availableNeighborhoods, setAvailableNeighborhoods] = useState<string[]>([]);

    useEffect(() => {
        const damagedZonesParam = searchParams.get("damagedZones");
        let parsedDamagedZones: DamageZoneMap = {};

        if (damagedZonesParam) {
            try {
                parsedDamagedZones = JSON.parse(damagedZonesParam);
            } catch (e) {
                parsedDamagedZones = {};
            }
        }

        setFilters({
            minPrice: formatNumber(searchParams.get("minPrice") || ""),
            maxPrice: formatNumber(searchParams.get("maxPrice") || ""),
            minYear: formatNumber(searchParams.get("minYear") || ""),
            maxYear: formatNumber(searchParams.get("maxYear") || ""),
            minKm: formatNumber(searchParams.get("minKm") || ""),
            maxKm: formatNumber(searchParams.get("maxKm") || ""),
            fuelType: searchParams.get("fuelType") || "",
            transmission: searchParams.get("transmission") || "",
            driveType: searchParams.get("driveType") || "",
            bodyType: searchParams.get("bodyType") || "",
            minHp: formatNumber(searchParams.get("minHp") || ""),
            maxHp: formatNumber(searchParams.get("maxHp") || ""),
            minCc: formatNumber(searchParams.get("minCc") || ""),
            maxCc: formatNumber(searchParams.get("maxCc") || ""),
            color: searchParams.get("color") || "",
            condition: searchParams.get("condition") || "",
            exchange: searchParams.get("exchange") || "",
            damageStatus: searchParams.get("damageStatus") || "",
            tramerRecord: searchParams.get("tramerRecord") || "",
            damagedZones: parsedDamagedZones,
            // Emlak
            city: searchParams.get("city") || "",
            district: searchParams.get("district") || "",
            neighborhood: searchParams.get("neighborhood") || "",
            minSqm: formatNumber(searchParams.get("minSqm") || ""),
            maxSqm: formatNumber(searchParams.get("maxSqm") || ""),
            minSqmGross: formatNumber(searchParams.get("minSqmGross") || ""),
            maxSqmGross: formatNumber(searchParams.get("maxSqmGross") || ""),
            rooms: searchParams.get("rooms") || "",
            minFloor: formatNumber(searchParams.get("minFloor") || ""),
            maxFloor: formatNumber(searchParams.get("maxFloor") || ""),
            totalFloors: formatNumber(searchParams.get("totalFloors") || ""),
            buildingAge: searchParams.get("buildingAge") || "",
            heatingType: searchParams.get("heatingType") || "",
            furnished: searchParams.get("furnished") || "",
            deedStatus: searchParams.get("deedStatus") || "",
            hasBalcony: searchParams.get("hasBalcony") || "",
            hasElevator: searchParams.get("hasElevator") || "",
            hasParking: searchParams.get("hasParking") || "",
            monthlyDues: formatNumber(searchParams.get("monthlyDues") || ""),
            creditSuitable: searchParams.get("creditSuitable") || "",
            usageStatus: searchParams.get("usageStatus") || "",
            bathroomCount: searchParams.get("bathroomCount") || "",
            kitchenCount: formatNumber(searchParams.get("kitchenCount") || ""),
            kitchenType: searchParams.get("kitchenType") || "",
            inComplex: searchParams.get("inComplex") || "",
            sellerType: searchParams.get("sellerType") || "",
            listingDate: searchParams.get("listingDate") || "",
            // Internal Features
            hasSteelDoor: searchParams.get("hasSteelDoor") || "",
            hasFiberInternet: searchParams.get("hasFiberInternet") || "",
            hasAlarm: searchParams.get("hasAlarm") || "",
            hasSauna: searchParams.get("hasSauna") || "",
            hasFireplace: searchParams.get("hasFireplace") || "",
            hasAirConditioning: searchParams.get("hasAirConditioning") || "",
            hasPantry: searchParams.get("hasPantry") || "",
            hasDressingRoom: searchParams.get("hasDressingRoom") || "",
            hasVideoIntercom: searchParams.get("hasVideoIntercom") || "",
            hasSpotlight: searchParams.get("hasSpotlight") || "",
            hasSmartHome: searchParams.get("hasSmartHome") || "",
            hasJacuzzi: searchParams.get("hasJacuzzi") || "",
            hasLaminateFloor: searchParams.get("hasLaminateFloor") || "",
            hasCeramicFloor: searchParams.get("hasCeramicFloor") || "",
            hasPVCJoinery: searchParams.get("hasPVCJoinery") || "",
            hasShowerCabin: searchParams.get("hasShowerCabin") || "",
            hasWallpaper: searchParams.get("hasWallpaper") || "",
            hasTerrace: searchParams.get("hasTerrace") || "",
            hasBuiltInKitchen: searchParams.get("hasBuiltInKitchen") || "",
            // External Features
            hasSecurity: searchParams.get("hasSecurity") || "",
            hasPool: searchParams.get("hasPool") || "",
            hasGarden: searchParams.get("hasGarden") || "",
            hasGym: searchParams.get("hasGym") || "",
            hasGenerator: searchParams.get("hasGenerator") || "",
            hasWaterTank: searchParams.get("hasWaterTank") || "",
            hasFireEscape: searchParams.get("hasFireEscape") || "",
            hasCableTV: searchParams.get("hasCableTV") || "",
            hasSatellite: searchParams.get("hasSatellite") || "",
            hasCameraSystem: searchParams.get("hasCameraSystem") || "",
            hasDoorman: searchParams.get("hasDoorman") || "",
            hasPlayground: searchParams.get("hasPlayground") || "",
            hasThermalInsulation: searchParams.get("hasThermalInsulation") || "",
            hasSoundInsulation: searchParams.get("hasSoundInsulation") || "",
            // Location Features
            isNearMetro: searchParams.get("isNearMetro") || "",
            isNearBusStop: searchParams.get("isNearBusStop") || "",
            isNearTram: searchParams.get("isNearTram") || "",
            isNearMarmaray: searchParams.get("isNearMarmaray") || "",
            isNearMetrobus: searchParams.get("isNearMetrobus") || "",
            hasSeaView: searchParams.get("hasSeaView") || "",
            hasNatureView: searchParams.get("hasNatureView") || "",
            hasCityView: searchParams.get("hasCityView") || "",
            isCentral: searchParams.get("isCentral") || "",
            isNearHighway: searchParams.get("isNearHighway") || "",
        });

        // Update derived state based on URL params
        const cityParam = searchParams.get("city");
        const districtParam = searchParams.get("district");

        if (cityParam) {
            const city = TURKEY_LOCATIONS.find(c => c.name === cityParam);
            if (city) {
                setAvailableDistricts(city.counties);
                if (districtParam) {
                    const district = city.counties.find(d => d.name === districtParam);
                    if (district) {
                        const neighborhoods = district.districts.flatMap(sd =>
                            sd.neighborhoods.map(n => n.name)
                        ).sort();
                        setAvailableNeighborhoods(neighborhoods);
                    }
                }
            }
        }
    }, [searchParams]);

    const handleClearFilters = () => {
        setFilters({
            minPrice: "",
            maxPrice: "",
            minYear: "",
            maxYear: "",
            minKm: "",
            maxKm: "",
            fuelType: "",
            transmission: "",
            driveType: "",
            bodyType: "",
            minHp: "",
            maxHp: "",
            minCc: "",
            maxCc: "",
            color: "",
            condition: "",
            exchange: "",
            damageStatus: "",
            tramerRecord: "",
            damagedZones: {},
            // Emlak
            city: "",
            district: "",
            neighborhood: "",
            minSqm: "",
            maxSqm: "",
            minSqmGross: "",
            maxSqmGross: "",
            rooms: "",
            minFloor: "",
            maxFloor: "",
            totalFloors: "",
            buildingAge: "",
            heatingType: "",
            furnished: "",
            deedStatus: "",
            hasBalcony: "",
            hasElevator: "",
            hasParking: "",
            monthlyDues: "",
            creditSuitable: "",
            usageStatus: "",
            bathroomCount: "",
            kitchenCount: "",
            kitchenType: "",
            inComplex: "",
            sellerType: "",
            listingDate: "",
            // Internal Features
            hasSteelDoor: "",
            hasFiberInternet: "",
            hasAlarm: "",
            hasSauna: "",
            hasFireplace: "",
            hasAirConditioning: "",
            hasPantry: "",
            hasDressingRoom: "",
            hasVideoIntercom: "",
            hasSpotlight: "",
            hasSmartHome: "",
            hasJacuzzi: "",
            hasLaminateFloor: "",
            hasCeramicFloor: "",
            hasPVCJoinery: "",
            hasShowerCabin: "",
            hasWallpaper: "",
            hasTerrace: "",
            hasBuiltInKitchen: "",
            // External Features
            hasSecurity: "",
            hasPool: "",
            hasGarden: "",
            hasGym: "",
            hasGenerator: "",
            hasWaterTank: "",
            hasFireEscape: "",
            hasCableTV: "",
            hasSatellite: "",
            hasCameraSystem: "",
            hasDoorman: "",
            hasPlayground: "",
            hasThermalInsulation: "",
            hasSoundInsulation: "",
            // Location Features
            isNearMetro: "",
            isNearBusStop: "",
            isNearTram: "",
            isNearMarmaray: "",
            isNearMetrobus: "",
            hasSeaView: "",
            hasNatureView: "",
            hasCityView: "",
            isCentral: "",
            isNearHighway: "",
        });
        setAvailableDistricts([]);
        setAvailableNeighborhoods([]);
        router.push(pathname);
    };

    const toggleSection = (section: keyof typeof expandedSections) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const filteredAncestors = ancestors.filter(ancestor => ancestor.id !== currentCategory?.id);

    const buildAncestorPath = (targetIndex: number) => {
        const pathSegments = filteredAncestors.slice(0, targetIndex + 1).map(a => a.slug);
        const path = `/category/${pathSegments.join('/')}`;

        // Calculate how many levels up we're navigating
        // filteredAncestors.length is the current depth
        // targetIndex + 1 is the target depth
        const levelsUp = filteredAncestors.length - (targetIndex + 1);

        // If going 2+ levels up, reset filters. If going 1 level up, preserve them.
        if (levelsUp >= 2) {
            return path;
        } else {
            // Preserve filters for 1 level up
            const params = searchParams.toString();
            return params ? `${path}?${params}` : path;
        }
    };

    const buildChildPath = (childSlug: string) => {
        let path;
        if (currentPath && currentPath.length > 0) {
            path = `/category/${[...currentPath, childSlug].join('/')}`;
        } else {
            const pathSegments = [...filteredAncestors.map(a => a.slug)];
            if (currentCategory) {
                pathSegments.push(currentCategory.slug);
            }
            pathSegments.push(childSlug);
            path = `/category/${pathSegments.join('/')}`;
        }

        // Preserve filters when drilling down to sub-categories
        const params = searchParams.toString();
        return params ? `${path}?${params}` : path;
    };

    const handleApplyFilters = () => {
        const params = new URLSearchParams(searchParams.toString());

        Object.entries(filters).forEach(([key, value]) => {
            if (key === 'damagedZones') {
                const dz = value as DamageZoneMap;
                if (Object.keys(dz).length > 0) {
                    params.set(key, JSON.stringify(value));
                } else {
                    params.delete(key);
                }
            } else if (value) {
                // Parse numbers before sending to URL
                if ([
                    'minPrice', 'maxPrice', 'minYear', 'maxYear', 'minKm', 'maxKm',
                    'minHp', 'maxHp', 'minCc', 'maxCc',
                    'minSqm', 'maxSqm', 'minSqmGross', 'maxSqmGross',
                    'minFloor', 'maxFloor', 'totalFloors', 'monthlyDues', 'kitchenCount'
                ].includes(key)) {
                    params.set(key, parseNumber(value as string));
                } else {
                    params.set(key, value as string);
                }
            } else {
                params.delete(key);
            }
        });

        params.delete("offset");
        router.push(`${pathname}?${params.toString()}`);
    };

    const loadSavedFilters = async () => {
        const result = await getSavedFilters();
        if (result.success && result.data) {
            setSavedFilters(result.data);
        }
    };

    const handleSaveFilter = async () => {
        if (!filterName.trim()) return;

        const result = await createSavedFilter({
            name: filterName,
            filterConfig: filters,
            categorySlug: currentCategory?.slug
        });

        if (result.success) {
            setFilterName('');
            setShowSaveDialog(false);
            await loadSavedFilters();
        } else {
            alert(result.error || 'Failed to save filter');
        }
    };

    const handleLoadFilter = (savedFilter: any) => {
        const config = savedFilter.filterConfig;
        setFilters(config);

        // Restore derived state for locations
        if (config.city) {
            const city = TURKEY_LOCATIONS.find(c => c.name === config.city);
            if (city) {
                setAvailableDistricts(city.counties);
                if (config.district) {
                    const district = city.counties.find(d => d.name === config.district);
                    if (district) {
                        const neighborhoods = district.districts.flatMap(sd =>
                            sd.neighborhoods.map(n => n.name)
                        ).sort();
                        setAvailableNeighborhoods(neighborhoods);
                    }
                }
            }
        } else {
            setAvailableDistricts([]);
            setAvailableNeighborhoods([]);
        }

        handleApplyFilters();
    };

    const handleDeleteFilter = async (filterId: string) => {
        const result = await deleteSavedFilter(filterId);
        if (result.success) {
            await loadSavedFilters();
        } else {
            alert(result.error || 'Failed to delete filter');
        }
    };

    return (
        <div className="space-y-4 sticky top-24">
            {/* Category Navigation Box */}
            <div className="glass-card p-5 border-white/10 bg-gradient-to-b from-white/5 to-white/[0.02]">
                <h3 className="font-semibold text-base mb-3 text-foreground/90">Kategoriler</h3>

                <div className="flex flex-col space-y-0.5">
                    {filteredAncestors.map((ancestor, index) => (
                        <Link
                            key={ancestor.id}
                            href={buildAncestorPath(index)}
                            className={cn(
                                "flex items-center text-sm text-muted-foreground hover:text-brand-gold transition-colors py-1.5",
                            )}
                            style={{ paddingLeft: `${index * 12}px` }}
                        >
                            <span className="mr-2 w-1.5 h-1.5 rounded-full bg-white/30 flex-shrink-0" />
                            {ancestor.name}
                        </Link>
                    ))}

                    {currentCategory && (
                        <div
                            className={cn(
                                "flex items-center text-sm font-bold text-brand-gold py-1.5",
                            )}
                            style={{ paddingLeft: `${filteredAncestors.length * 12}px` }}
                        >
                            <span className="mr-2 w-1.5 h-1.5 rounded-full bg-brand-gold flex-shrink-0 shadow-[0_0_8px_rgba(254,204,128,0.6)]" />
                            {currentCategory.name}
                        </div>
                    )}

                    {categories.length > 0 && (
                        <div className="flex flex-col mt-1 max-h-[280px] overflow-y-auto pr-1 custom-scrollbar">
                            {categories.map((cat) => (
                                <Link
                                    key={cat.id}
                                    href={buildChildPath(cat.slug)}
                                    className={cn(
                                        "flex items-center justify-between text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all py-1.5 px-2 rounded-sm group flex-shrink-0",
                                    )}
                                    style={{ paddingLeft: `${(filteredAncestors.length + 1) * 12}px` }}
                                >
                                    <div className="flex items-center gap-2 truncate">
                                        <span>{cat.name}</span>
                                        {cat.count !== undefined && (
                                            <span className="text-[10px] text-muted-foreground/50 group-hover:text-brand-gold/70">
                                                ({cat.count.toLocaleString('tr-TR')})
                                            </span>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Filters Box */}
            <div className="glass-card p-6 border-white/10 bg-gradient-to-b from-white/5 to-white/[0.02]">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                        <Filter className="w-5 h-5 text-brand-gold" />
                        Filtreler
                    </h3>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowSaveDialog(true)}
                            className="text-xs text-muted-foreground hover:text-brand-gold transition-colors flex items-center gap-1"
                            title="Filtreyi Kaydet"
                        >
                            <Save className="w-3 h-3" />
                        </button>
                        <button
                            onClick={handleClearFilters}
                            className="text-xs text-muted-foreground hover:text-brand-gold transition-colors"
                        >
                            Temizle
                        </button>
                    </div>
                </div>

                <div className="space-y-3">
                    {/* SAVED FILTERS SECTION */}
                    <div className="border-b border-white/10 pb-3">
                        <button
                            onClick={() => {
                                toggleSection('saved');
                                if (!expandedSections.saved) {
                                    loadSavedFilters();
                                }
                            }}
                            className="flex items-center justify-between w-full py-2 text-sm font-medium text-foreground/90 hover:text-brand-gold transition-colors"
                        >
                            <span className="flex items-center gap-2">
                                <FolderOpen className="w-4 h-4" />
                                Kaydedilenler
                            </span>
                            {expandedSections.saved ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>

                        {expandedSections.saved && (
                            <div className="space-y-2 mt-3">
                                {savedFilters.length === 0 ? (
                                    <p className="text-xs text-muted-foreground text-center py-2">Kayıtlı filtre yok</p>
                                ) : (
                                    savedFilters.map((filter) => (
                                        <div
                                            key={filter.id}
                                            className="flex items-center justify-between p-2 rounded bg-white/5 hover:bg-white/10 transition-colors group"
                                        >
                                            <button
                                                onClick={() => handleLoadFilter(filter)}
                                                className="text-xs text-foreground hover:text-brand-gold flex-1 text-left truncate"
                                            >
                                                {filter.name}
                                            </button>
                                            <button
                                                onClick={() => handleDeleteFilter(filter.id)}
                                                className="text-muted-foreground hover:text-red-500 transition-colors ml-2 opacity-0 group-hover:opacity-100"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>

                    {/* BASIC FILTERS SECTION */}
                    {/* LOCATION FILTERS SECTION - Emlak & Vasita */}
                    {(isEmlakCategory || isVasitaCategory) && (
                        <div className="border-b border-white/10 pb-3">
                            <button
                                onClick={() => toggleSection('location')}
                                className="flex items-center justify-between w-full py-2 text-sm font-medium text-foreground/90 hover:text-brand-gold transition-colors"
                            >
                                <span>Adres Bilgileri</span>
                                {expandedSections.location ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>

                            {expandedSections.location && (
                                <div className="space-y-4 mt-3">
                                    {/* City */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-muted-foreground">İl</label>
                                        <select
                                            value={filters.city}
                                            onChange={(e) => {
                                                const cityName = e.target.value;
                                                const city = TURKEY_LOCATIONS.find(c => c.name === cityName);
                                                setAvailableDistricts(city ? city.counties : []);
                                                setAvailableNeighborhoods([]);
                                                setFilters({ ...filters, city: cityName, district: '', neighborhood: '' });
                                            }}
                                            className="w-full dark-select px-3 py-2 text-xs"
                                        >
                                            <option value="">İl Seçiniz</option>
                                            {TURKEY_LOCATIONS.map((city) => (
                                                <option key={city.name} value={city.name}>{city.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* District */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-muted-foreground">İlçe</label>
                                        <select
                                            value={filters.district}
                                            onChange={(e) => {
                                                const districtName = e.target.value;
                                                const city = TURKEY_LOCATIONS.find(c => c.name === filters.city);
                                                const district = city?.counties.find(d => d.name === districtName);

                                                if (district) {
                                                    const neighborhoods = district.districts.flatMap(sd =>
                                                        sd.neighborhoods.map(n => n.name)
                                                    ).sort();
                                                    setAvailableNeighborhoods(neighborhoods);
                                                } else {
                                                    setAvailableNeighborhoods([]);
                                                }
                                                setFilters({ ...filters, district: districtName, neighborhood: '' });
                                            }}
                                            disabled={!filters.city}
                                            className="w-full dark-select px-3 py-2 text-xs disabled:opacity-50"
                                        >
                                            <option value="">İlçe Seçiniz</option>
                                            {availableDistricts.map((district) => (
                                                <option key={district.name} value={district.name}>{district.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Neighborhood */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-muted-foreground">Mahalle</label>
                                        <select
                                            value={filters.neighborhood}
                                            onChange={(e) => setFilters({ ...filters, neighborhood: e.target.value })}
                                            disabled={!filters.district}
                                            className="w-full dark-select px-3 py-2 text-xs disabled:opacity-50"
                                        >
                                            <option value="">Mahalle Seçiniz</option>
                                            {availableNeighborhoods.map((neighborhood) => (
                                                <option key={neighborhood} value={neighborhood}>{neighborhood}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* BASIC FILTERS SECTION */}
                    <div className="border-b border-white/10 pb-3">
                        <button
                            onClick={() => toggleSection('basic')}
                            className="flex items-center justify-between w-full py-2 text-sm font-medium text-foreground/90 hover:text-brand-gold transition-colors"
                        >
                            <span>Temel Filtreler</span>
                            {expandedSections.basic ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>

                        {expandedSections.basic && (
                            <div className="space-y-4 mt-3">
                                {/* Price Range - Common */}
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-muted-foreground">Fiyat (TL)</label>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            type="text"
                                            placeholder="Min"
                                            value={filters.minPrice}
                                            onChange={(e) => setFilters({ ...filters, minPrice: formatNumber(e.target.value) })}
                                            className="bg-white/5 border-white/10 focus:bg-white/10 transition-colors text-xs h-9"
                                        />
                                        <span className="text-muted-foreground text-xs">-</span>
                                        <Input
                                            type="text"
                                            placeholder="Max"
                                            value={filters.maxPrice}
                                            onChange={(e) => setFilters({ ...filters, maxPrice: formatNumber(e.target.value) })}
                                            className="bg-white/5 border-white/10 focus:bg-white/10 transition-colors text-xs h-9"
                                        />
                                    </div>
                                </div>

                                {/* Emlak Specific Basic Filters */}
                                {isEmlakCategory && (
                                    <>
                                        {/* Square Meters (Net) */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-muted-foreground">m² (Net)</label>
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    type="text"
                                                    placeholder="Min"
                                                    value={filters.minSqm}
                                                    onChange={(e) => setFilters({ ...filters, minSqm: formatNumber(e.target.value) })}
                                                    className="bg-white/5 border-white/10 focus:bg-white/10 transition-colors text-xs h-9"
                                                />
                                                <span className="text-muted-foreground text-xs">-</span>
                                                <Input
                                                    type="text"
                                                    placeholder="Max"
                                                    value={filters.maxSqm}
                                                    onChange={(e) => setFilters({ ...filters, maxSqm: formatNumber(e.target.value) })}
                                                    className="bg-white/5 border-white/10 focus:bg-white/10 transition-colors text-xs h-9"
                                                />
                                            </div>
                                        </div>

                                        {/* Square Meters (Gross) */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-muted-foreground">m² (Brüt)</label>
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    type="text"
                                                    placeholder="Min"
                                                    value={filters.minSqmGross}
                                                    onChange={(e) => setFilters({ ...filters, minSqmGross: formatNumber(e.target.value) })}
                                                    className="bg-white/5 border-white/10 focus:bg-white/10 transition-colors text-xs h-9"
                                                />
                                                <span className="text-muted-foreground text-xs">-</span>
                                                <Input
                                                    type="text"
                                                    placeholder="Max"
                                                    value={filters.maxSqmGross}
                                                    onChange={(e) => setFilters({ ...filters, maxSqmGross: formatNumber(e.target.value) })}
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
                                                className="w-full dark-select px-3 py-2 text-xs"
                                            >
                                                <option value="">Tümü</option>
                                                <option value="1+0">1+0 (Stüdyo)</option>
                                                <option value="1+1">1+1</option>
                                                <option value="2+1">2+1</option>
                                                <option value="3+1">3+1</option>
                                                <option value="3+2">3+2</option>
                                                <option value="4+1">4+1</option>
                                                <option value="4+2">4+2</option>
                                                <option value="5+1">5+1</option>
                                                <option value="5+2">5+2</option>
                                                <option value="6+1">6+1 ve üzeri</option>
                                            </select>
                                        </div>
                                    </>
                                )}

                                {/* Vehicle Specific Basic Filters */}
                                {isVasitaCategory && (
                                    <>
                                        {/* Year Range */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-muted-foreground">Yıl</label>
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    type="text"
                                                    placeholder="Min"
                                                    value={filters.minYear}
                                                    onChange={(e) => setFilters({ ...filters, minYear: formatNumber(e.target.value) })}
                                                    className="bg-white/5 border-white/10 focus:bg-white/10 transition-colors text-xs h-9"
                                                />
                                                <span className="text-muted-foreground text-xs">-</span>
                                                <Input
                                                    type="text"
                                                    placeholder="Max"
                                                    value={filters.maxYear}
                                                    onChange={(e) => setFilters({ ...filters, maxYear: formatNumber(e.target.value) })}
                                                    className="bg-white/5 border-white/10 focus:bg-white/10 transition-colors text-xs h-9"
                                                />
                                            </div>
                                        </div>

                                        {/* KM Range */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-muted-foreground">Kilometre</label>
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    type="text"
                                                    placeholder="Min"
                                                    value={filters.minKm}
                                                    onChange={(e) => setFilters({ ...filters, minKm: formatNumber(e.target.value) })}
                                                    className="bg-white/5 border-white/10 focus:bg-white/10 transition-colors text-xs h-9"
                                                />
                                                <span className="text-muted-foreground text-xs">-</span>
                                                <Input
                                                    type="text"
                                                    placeholder="Max"
                                                    value={filters.maxKm}
                                                    onChange={(e) => setFilters({ ...filters, maxKm: formatNumber(e.target.value) })}
                                                    className="bg-white/5 border-white/10 focus:bg-white/10 transition-colors text-xs h-9"
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    {/* TECHNICAL FILTERS SECTION */}
                    <div className="border-b border-white/10 pb-3">
                        <button
                            onClick={() => toggleSection('technical')}
                            className="flex items-center justify-between w-full py-2 text-sm font-medium text-foreground/90 hover:text-brand-gold transition-colors"
                        >
                            <span>Teknik Özellikler</span>
                            {expandedSections.technical ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>

                        {expandedSections.technical && (
                            <div className="space-y-4 mt-3">
                                {/* Emlak Technical Filters */}
                                {isEmlakCategory && (
                                    <>
                                        {/* Floor Info */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-muted-foreground">Bulunduğu Kat</label>
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    type="text"
                                                    placeholder="Min"
                                                    value={filters.minFloor}
                                                    onChange={(e) => setFilters({ ...filters, minFloor: formatNumber(e.target.value) })}
                                                    className="bg-white/5 border-white/10 focus:bg-white/10 transition-colors text-xs h-9"
                                                />
                                                <span className="text-muted-foreground text-xs">-</span>
                                                <Input
                                                    type="text"
                                                    placeholder="Max"
                                                    value={filters.maxFloor}
                                                    onChange={(e) => setFilters({ ...filters, maxFloor: formatNumber(e.target.value) })}
                                                    className="bg-white/5 border-white/10 focus:bg-white/10 transition-colors text-xs h-9"
                                                />
                                            </div>
                                        </div>

                                        {/* Total Floors */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-muted-foreground">Kat Sayısı</label>
                                            <Input
                                                type="text"
                                                placeholder="Kat Sayısı"
                                                value={filters.totalFloors}
                                                onChange={(e) => setFilters({ ...filters, totalFloors: formatNumber(e.target.value) })}
                                                className="bg-white/5 border-white/10 focus:bg-white/10 transition-colors text-xs h-9"
                                            />
                                        </div>

                                        {/* Building Age */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-muted-foreground">Bina Yaşı</label>
                                            <select
                                                value={filters.buildingAge}
                                                onChange={(e) => setFilters({ ...filters, buildingAge: e.target.value })}
                                                className="w-full dark-select px-3 py-2 text-xs"
                                            >
                                                <option value="">Tümü</option>
                                                <option value="0">0 (Yeni)</option>
                                                <option value="1-5">1-5</option>
                                                <option value="6-10">6-10</option>
                                                <option value="11-15">11-15</option>
                                                <option value="16-20">16-20</option>
                                                <option value="21+">21 ve üzeri</option>
                                            </select>
                                        </div>

                                        {/* Heating Type */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-muted-foreground">Isıtma</label>
                                            <select
                                                value={filters.heatingType}
                                                onChange={(e) => setFilters({ ...filters, heatingType: e.target.value })}
                                                className="w-full dark-select px-3 py-2 text-xs"
                                            >
                                                <option value="">Tümü</option>
                                                <option value="Kombi (Doğalgaz)">Kombi (Doğalgaz)</option>
                                                <option value="Merkezi">Merkezi</option>
                                                <option value="Merkezi (Pay Ölçer)">Merkezi (Pay Ölçer)</option>
                                                <option value="Soba">Soba</option>
                                                <option value="Klima">Klima</option>
                                                <option value="Yerden Isıtma">Yerden Isıtma</option>
                                                <option value="Jeotermal">Jeotermal</option>
                                            </select>
                                        </div>

                                        {/* Bathrooms */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-muted-foreground">Banyo Sayısı</label>
                                            <select
                                                value={filters.bathroomCount}
                                                onChange={(e) => setFilters({ ...filters, bathroomCount: e.target.value })}
                                                className="w-full dark-select px-3 py-2 text-xs"
                                            >
                                                <option value="">Tümü</option>
                                                <option value="1">1</option>
                                                <option value="2">2</option>
                                                <option value="3">3</option>
                                                <option value="4+">4 ve üzeri</option>
                                            </select>
                                        </div>

                                        {/* Kitchens */}
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="space-y-2">
                                                <label className="text-xs font-medium text-muted-foreground">Mutfak</label>
                                                <Input
                                                    type="text"
                                                    placeholder="Sayısı"
                                                    value={filters.kitchenCount}
                                                    onChange={(e) => setFilters({ ...filters, kitchenCount: formatNumber(e.target.value) })}
                                                    className="bg-white/5 border-white/10 focus:bg-white/10 transition-colors text-xs h-9"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-medium text-muted-foreground">Mutfak Tipi</label>
                                                <select
                                                    value={filters.kitchenType}
                                                    onChange={(e) => setFilters({ ...filters, kitchenType: e.target.value })}
                                                    className="w-full dark-select px-3 py-2 text-xs"
                                                >
                                                    <option value="">Tümü</option>
                                                    <option value="Kapalı">Kapalı</option>
                                                    <option value="Amerikan">Amerikan</option>
                                                </select>
                                            </div>
                                        </div>

                                        {/* Deed Status */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-muted-foreground">Tapu Durumu</label>
                                            <select
                                                value={filters.deedStatus}
                                                onChange={(e) => setFilters({ ...filters, deedStatus: e.target.value })}
                                                className="w-full dark-select px-3 py-2 text-xs"
                                            >
                                                <option value="">Tümü</option>
                                                <option value="Kat Mülkiyetli">Kat Mülkiyetli</option>
                                                <option value="Kat İrtifaklı">Kat İrtifaklı</option>
                                                <option value="Arsa Tapulu">Arsa Tapulu</option>
                                                <option value="Hisseli">Hisseli</option>
                                            </select>
                                        </div>

                                        {/* Usage Status */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-muted-foreground">Kullanım Durumu</label>
                                            <select
                                                value={filters.usageStatus}
                                                onChange={(e) => setFilters({ ...filters, usageStatus: e.target.value })}
                                                className="w-full dark-select px-3 py-2 text-xs"
                                            >
                                                <option value="">Tümü</option>
                                                <option value="Boş">Boş</option>
                                                <option value="Kiracılı">Kiracılı</option>
                                                <option value="Mülk Sahibi">Mülk Sahibi</option>
                                            </select>
                                        </div>

                                        {/* Seller Type */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-muted-foreground">Kimden</label>
                                            <select
                                                value={filters.sellerType}
                                                onChange={(e) => setFilters({ ...filters, sellerType: e.target.value })}
                                                className="w-full dark-select px-3 py-2 text-xs"
                                            >
                                                <option value="">Tümü</option>
                                                <option value="Sahibinden">Sahibinden</option>
                                                <option value="Emlak Ofisinden">Emlak Ofisinden</option>
                                                <option value="İnşaat Firmasından">İnşaat Firmasından</option>
                                                <option value="Bankadan">Bankadan</option>
                                            </select>
                                        </div>

                                        {/* Listing Date */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-muted-foreground">İlan Tarihi</label>
                                            <select
                                                value={filters.listingDate}
                                                onChange={(e) => setFilters({ ...filters, listingDate: e.target.value })}
                                                className="w-full dark-select px-3 py-2 text-xs"
                                            >
                                                <option value="">Tümü</option>
                                                <option value="1">Son 24 Saat</option>
                                                <option value="3">Son 3 Gün</option>
                                                <option value="7">Son 1 Hafta</option>
                                                <option value="30">Son 1 Ay</option>
                                            </select>
                                        </div>

                                        {/* Boolean Features */}
                                        {/* Detailed Features Section */}
                                        <div className="space-y-4 pt-4 border-t border-white/5">
                                            <label className="text-sm font-medium text-brand-gold block mb-2">Detaylı Özellikler</label>

                                            {/* Internal Features */}
                                            <div className="space-y-2">
                                                <label className="text-xs font-medium text-muted-foreground block">İç Özellikler</label>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {[
                                                        { key: 'hasBalcony', label: 'Balkon' },
                                                        { key: 'hasSteelDoor', label: 'Çelik Kapı' },
                                                        { key: 'hasFiberInternet', label: 'Fiber İnternet' },
                                                        { key: 'hasAlarm', label: 'Alarm' },
                                                        { key: 'hasSauna', label: 'Sauna' },
                                                        { key: 'hasFireplace', label: 'Şömine' },
                                                        { key: 'hasAirConditioning', label: 'Klima' },
                                                        { key: 'hasPantry', label: 'Kiler' },
                                                        { key: 'hasDressingRoom', label: 'Giyinme Odası' },
                                                        { key: 'hasVideoIntercom', label: 'Görüntülü Diafon' },
                                                        { key: 'hasSpotlight', label: 'Spot Aydınlatma' },
                                                        { key: 'hasSmartHome', label: 'Akıllı Ev' },
                                                        { key: 'hasJacuzzi', label: 'Jakuzi' },
                                                        { key: 'hasLaminateFloor', label: 'Laminant Zemin' },
                                                        { key: 'hasCeramicFloor', label: 'Seramik Zemin' },
                                                        { key: 'hasPVCJoinery', label: 'PVC Doğrama' },
                                                        { key: 'hasShowerCabin', label: 'Duşakabin' },
                                                        { key: 'hasWallpaper', label: 'Duvar Kağıdı' },
                                                        { key: 'hasTerrace', label: 'Teras' },
                                                        { key: 'hasBuiltInKitchen', label: 'Ankastre Mutfak' },
                                                        { key: 'furnished', label: 'Eşyalı' },
                                                    ].map((feature) => (
                                                        <label key={feature.key} className="flex items-center gap-2 text-xs cursor-pointer hover:text-brand-gold transition-colors">
                                                            <Checkbox
                                                                checked={filters[feature.key as keyof typeof filters] === 'true'}
                                                                onChange={(e) => setFilters({ ...filters, [feature.key]: e.target.checked ? 'true' : '' })}
                                                            />
                                                            {feature.label}
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* External Features */}
                                            <div className="space-y-2 pt-2 border-t border-white/5">
                                                <label className="text-xs font-medium text-muted-foreground block">Dış Özellikler</label>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {[
                                                        { key: 'hasElevator', label: 'Asansör' },
                                                        { key: 'hasParking', label: 'Otopark' },
                                                        { key: 'hasSecurity', label: 'Güvenlik' },
                                                        { key: 'hasPool', label: 'Yüzme Havuzu' },
                                                        { key: 'hasGarden', label: 'Bahçe' },
                                                        { key: 'hasGym', label: 'Spor Salonu' },
                                                        { key: 'hasGenerator', label: 'Jeneratör' },
                                                        { key: 'hasWaterTank', label: 'Su Deposu' },
                                                        { key: 'hasFireEscape', label: 'Yangın Merdiveni' },
                                                        { key: 'hasCableTV', label: 'Kablo TV' },
                                                        { key: 'hasSatellite', label: 'Uydu' },
                                                        { key: 'hasCameraSystem', label: 'Kamera Sistemi' },
                                                        { key: 'hasDoorman', label: 'Kapıcı' },
                                                        { key: 'hasPlayground', label: 'Oyun Parkı' },
                                                        { key: 'hasThermalInsulation', label: 'Isı Yalıtımı' },
                                                        { key: 'hasSoundInsulation', label: 'Ses Yalıtımı' },
                                                        { key: 'inComplex', label: 'Site İçinde' },
                                                    ].map((feature) => (
                                                        <label key={feature.key} className="flex items-center gap-2 text-xs cursor-pointer hover:text-brand-gold transition-colors">
                                                            <Checkbox
                                                                checked={filters[feature.key as keyof typeof filters] === 'true'}
                                                                onChange={(e) => setFilters({ ...filters, [feature.key]: e.target.checked ? 'true' : '' })}
                                                            />
                                                            {feature.label}
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Location Features */}
                                            <div className="space-y-2 pt-2 border-t border-white/5">
                                                <label className="text-xs font-medium text-muted-foreground block">Konum Özellikleri</label>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {[
                                                        { key: 'isNearMetro', label: 'Metroya Yakın' },
                                                        { key: 'isNearBusStop', label: 'Otobüs Durağına Yakın' },
                                                        { key: 'isNearTram', label: 'Tramvaya Yakın' },
                                                        { key: 'isNearMarmaray', label: 'Marmaraya Yakın' },
                                                        { key: 'isNearMetrobus', label: 'Metrobüse Yakın' },
                                                        { key: 'hasSeaView', label: 'Deniz Manzaralı' },
                                                        { key: 'hasNatureView', label: 'Doğa Manzaralı' },
                                                        { key: 'hasCityView', label: 'Şehir Manzaralı' },
                                                        { key: 'isCentral', label: 'Merkezi Konum' },
                                                        { key: 'isNearHighway', label: 'Otobana Yakın' },
                                                        { key: 'creditSuitable', label: 'Krediye Uygun' },
                                                        { key: 'exchange', label: 'Takaslı' },
                                                    ].map((feature) => (
                                                        <label key={feature.key} className="flex items-center gap-2 text-xs cursor-pointer hover:text-brand-gold transition-colors">
                                                            <Checkbox
                                                                checked={filters[feature.key as keyof typeof filters] === 'true'}
                                                                onChange={(e) => setFilters({ ...filters, [feature.key]: e.target.checked ? 'true' : '' })}
                                                            />
                                                            {feature.label}
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* Vehicle Technical Filters */}
                                {isVasitaCategory && (
                                    <>
                                        {/* Fuel Type */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-muted-foreground">Yakıt Tipi</label>
                                            <select
                                                value={filters.fuelType}
                                                onChange={(e) => setFilters({ ...filters, fuelType: e.target.value })}
                                                className="w-full dark-select px-3 py-2 text-xs"
                                            >
                                                <option value="">Tümü</option>
                                                <option value="benzin">Benzin</option>
                                                <option value="dizel">Dizel</option>
                                                <option value="lpg">LPG & CNG</option>
                                                <option value="hybrid">Hibrit</option>
                                                <option value="electric">Elektrik</option>
                                            </select>
                                        </div>

                                        {/* Transmission */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-muted-foreground">Vites</label>
                                            <select
                                                value={filters.transmission}
                                                onChange={(e) => setFilters({ ...filters, transmission: e.target.value })}
                                                className="w-full dark-select px-3 py-2 text-xs"
                                            >
                                                <option value="">Tümü</option>
                                                <option value="manual">Manuel</option>
                                                <option value="automatic">Otomatik</option>
                                                <option value="semi-automatic">Yarı Otomatik</option>
                                            </select>
                                        </div>

                                        {/* Drive Type */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-muted-foreground">Çekiş</label>
                                            <select
                                                value={filters.driveType}
                                                onChange={(e) => setFilters({ ...filters, driveType: e.target.value })}
                                                className="w-full dark-select px-3 py-2 text-xs"
                                            >
                                                <option value="">Tümü</option>
                                                <option value="fwd">Önden Çekiş</option>
                                                <option value="rwd">Arkadan İtiş</option>
                                                <option value="awd">4WD (Sürekli)</option>
                                                <option value="4wd">4WD (Bağlanabilir)</option>
                                            </select>
                                        </div>

                                        {/* Body Type */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-muted-foreground">Kasa Tipi</label>
                                            <select
                                                value={filters.bodyType}
                                                onChange={(e) => setFilters({ ...filters, bodyType: e.target.value })}
                                                className="w-full dark-select px-3 py-2 text-xs"
                                            >
                                                <option value="">Tümü</option>
                                                <option value="sedan">Sedan</option>
                                                <option value="hatchback">Hatchback</option>
                                                <option value="station-wagon">Station Wagon</option>
                                                <option value="suv">SUV</option>
                                                <option value="coupe">Coupe</option>
                                                <option value="cabrio">Cabrio</option>
                                                <option value="mpv">MPV</option>
                                                <option value="pickup">Pickup</option>
                                            </select>
                                        </div>

                                        {/* Engine Power (HP) */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-muted-foreground">Motor Gücü (HP)</label>
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    type="text"
                                                    placeholder="Min"
                                                    value={filters.minHp}
                                                    onChange={(e) => setFilters({ ...filters, minHp: formatNumber(e.target.value) })}
                                                    className="bg-white/5 border-white/10 focus:bg-white/10 transition-colors text-xs h-9"
                                                />
                                                <span className="text-muted-foreground text-xs">-</span>
                                                <Input
                                                    type="text"
                                                    placeholder="Max"
                                                    value={filters.maxHp}
                                                    onChange={(e) => setFilters({ ...filters, maxHp: formatNumber(e.target.value) })}
                                                    className="bg-white/5 border-white/10 focus:bg-white/10 transition-colors text-xs h-9"
                                                />
                                            </div>
                                        </div>

                                        {/* Engine Size (cc) */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-muted-foreground">Motor Hacmi (cc)</label>
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    type="text"
                                                    placeholder="Min"
                                                    value={filters.minCc}
                                                    onChange={(e) => setFilters({ ...filters, minCc: formatNumber(e.target.value) })}
                                                    className="bg-white/5 border-white/10 focus:bg-white/10 transition-colors text-xs h-9"
                                                />
                                                <span className="text-muted-foreground text-xs">-</span>
                                                <Input
                                                    type="text"
                                                    placeholder="Max"
                                                    value={filters.maxCc}
                                                    onChange={(e) => setFilters({ ...filters, maxCc: formatNumber(e.target.value) })}
                                                    className="bg-white/5 border-white/10 focus:bg-white/10 transition-colors text-xs h-9"
                                                />
                                            </div>
                                        </div>

                                        {/* Color */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-muted-foreground">Renk</label>
                                            <select
                                                value={filters.color}
                                                onChange={(e) => setFilters({ ...filters, color: e.target.value })}
                                                className="w-full dark-select px-3 py-2 text-xs"
                                            >
                                                <option value="">Tümü</option>
                                                <option value="white">Beyaz</option>
                                                <option value="black">Siyah</option>
                                                <option value="gray">Gri</option>
                                                <option value="silver">Gümüş</option>
                                                <option value="red">Kırmızı</option>
                                                <option value="blue">Mavi</option>
                                                <option value="green">Yeşil</option>
                                                <option value="yellow">Sarı</option>
                                                <option value="orange">Turuncu</option>
                                                <option value="brown">Kahverengi</option>
                                                <option value="beige">Bej</option>
                                            </select>
                                        </div>

                                        {/* Vehicle Condition */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-muted-foreground">Araç Durumu</label>
                                            <select
                                                value={filters.condition}
                                                onChange={(e) => setFilters({ ...filters, condition: e.target.value })}
                                                className="w-full dark-select px-3 py-2 text-xs"
                                            >
                                                <option value="">Tümü</option>
                                                <option value="new">Sıfır</option>
                                                <option value="used">İkinci El</option>
                                            </select>
                                        </div>

                                        {/* Exchange */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-muted-foreground">Takas</label>
                                            <select
                                                value={filters.exchange}
                                                onChange={(e) => setFilters({ ...filters, exchange: e.target.value })}
                                                className="w-full dark-select px-3 py-2 text-xs"
                                            >
                                                <option value="">Tümü</option>
                                                <option value="yes">Evet</option>
                                                <option value="no">Hayır</option>
                                            </select>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    {/* DAMAGE FILTERS SECTION - Only for Vasita */}
                    {
                        isVasitaCategory && (
                            <div className="pb-3">
                                <button
                                    onClick={() => toggleSection('damage')}
                                    className="flex items-center justify-between w-full py-2 text-sm font-medium text-foreground/90 hover:text-brand-gold transition-colors"
                                >
                                    <span>Hasar Bilgileri</span>
                                    {expandedSections.damage ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                </button>

                                {expandedSections.damage && (
                                    <div className="space-y-4 mt-3">
                                        {/* Damage Status */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-muted-foreground">Hasar Durumu</label>
                                            <div className="space-y-1.5">
                                                {['hasarsiz', 'degisen', 'boyali'].map((status) => {
                                                    const isSelected = filters.damageStatus === status;
                                                    return (
                                                        <div
                                                            key={status}
                                                            onClick={() => setFilters({ ...filters, damageStatus: isSelected ? '' : status })}
                                                            className="flex items-center gap-2 cursor-pointer group select-none"
                                                        >
                                                            <div className={cn(
                                                                "w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all",
                                                                isSelected
                                                                    ? "border-brand-gold bg-brand-gold/20"
                                                                    : "border-white/20 group-hover:border-white/40"
                                                            )}>
                                                                <div className={cn(
                                                                    "w-2 h-2 rounded-full bg-brand-gold transition-transform duration-200",
                                                                    isSelected ? "scale-100" : "scale-0"
                                                                )} />
                                                            </div>
                                                            <span className={cn(
                                                                "text-xs transition-colors",
                                                                isSelected ? "text-foreground font-medium" : "text-muted-foreground group-hover:text-foreground"
                                                            )}>
                                                                {status === 'hasarsiz' && 'Hasarsız'}
                                                                {status === 'degisen' && 'Değişen'}
                                                                {status === 'boyali' && 'Boyalı'}
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* Tramer Record */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-muted-foreground">Tramer Kaydı</label>
                                            <select
                                                value={filters.tramerRecord}
                                                onChange={(e) => setFilters({ ...filters, tramerRecord: e.target.value })}
                                                className="w-full dark-select px-3 py-2 text-xs"
                                            >
                                                <option value="">Tümü</option>
                                                <option value="yes">Var</option>
                                                <option value="no">Yok</option>
                                            </select>
                                        </div>

                                        {/* Damage Zone Selector */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-muted-foreground">Hasarlı Bölgeler</label>
                                            <VehicleDamageZoneSelector
                                                value={filters.damagedZones}
                                                onChange={(zones) => setFilters({ ...filters, damagedZones: zones })}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    }
                </div >

                <Button
                    onClick={handleApplyFilters}
                    className="w-full mt-6 backdrop-blur-md bg-brand-gold/10 border border-brand-gold/30 text-brand-gold hover:bg-brand-gold/20 hover:border-brand-gold/50 transition-all duration-300 font-medium shadow-[0_0_15px_rgba(251,191,36,0.1)] hover:shadow-[0_0_20px_rgba(251,191,36,0.2)]"
                >
                    Uygula
                </Button>
            </div >

            {/* Save Filter Dialog */}
            {
                showSaveDialog && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowSaveDialog(false)}>
                        <div className="glass-card p-6 max-w-md w-full border-white/10" onClick={(e) => e.stopPropagation()}>
                            <h3 className="text-lg font-semibold mb-4 text-brand-gold">Filtreyi Kaydet</h3>
                            <Input
                                type="text"
                                placeholder="Filtre adı (örn: BMW Otomatik 2020+)"
                                value={filterName}
                                onChange={(e) => setFilterName(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSaveFilter()}
                                className="mb-4 bg-white/5 border-white/10 focus:bg-white/10"
                            />
                            <div className="flex gap-2 justify-end">
                                <Button
                                    onClick={() => setShowSaveDialog(false)}
                                    className="bg-white/5 hover:bg-white/10 border border-white/10"
                                >
                                    İptal
                                </Button>
                                <Button
                                    onClick={handleSaveFilter}
                                    disabled={!filterName.trim()}
                                    className="bg-brand-gold text-black hover:bg-brand-gold/90"
                                >
                                    Kaydet
                                </Button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
}
