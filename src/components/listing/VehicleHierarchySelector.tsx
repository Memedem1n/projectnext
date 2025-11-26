"use client";

import { useState, useEffect } from "react";
import { VEHICLE_DATA } from "@/data/vehicle-data";
import { ChevronRight, Search, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { getVehicleBrands, getVehicleModels, type VehicleOption } from "@/lib/actions/vehicle-actions";

type SelectionState = {
    brand: string | null;
    model: string | null;
    year: string | null;
    fuel: string | null;
    caseType: string | null;
    gear: string | null;
    version: string | null;
    package: string | null;
};

interface VehicleHierarchySelectorProps {
    categorySlug: string;
    onComplete: (selection: SelectionState) => void;
    onManualEntry: () => void;
}

export function VehicleHierarchySelector({ categorySlug, onComplete, onManualEntry }: VehicleHierarchySelectorProps) {
    const [step, setStep] = useState<keyof SelectionState>("brand");
    const [selection, setSelection] = useState<SelectionState>({
        brand: null,
        model: null,
        year: null,
        fuel: null,
        caseType: null,
        gear: null,
        version: null,
        package: null,
    });
    const [searchQuery, setSearchQuery] = useState("");

    // Dynamic Data States
    const [brands, setBrands] = useState<VehicleOption[]>([]);
    const [models, setModels] = useState<VehicleOption[]>([]);
    const [loading, setLoading] = useState(false);

    const steps: (keyof SelectionState)[] = ["brand", "model", "year", "fuel", "gear", "caseType", "version", "package"];

    // Fetch Brands on Mount / Category Change
    useEffect(() => {
        const fetchBrands = async () => {
            setLoading(true);
            const data = await getVehicleBrands(categorySlug);
            setBrands(data);
            setLoading(false);
        };
        if (categorySlug) {
            fetchBrands();
        }
    }, [categorySlug]);

    // Fetch Models when Brand Changes
    useEffect(() => {
        const fetchModels = async () => {
            if (!selection.brand) {
                setModels([]);
                return;
            }
            setLoading(true);
            const data = await getVehicleModels(selection.brand);
            setModels(data);
            setLoading(false);
        };
        fetchModels();
    }, [selection.brand]);

    const handleSelect = (key: keyof SelectionState, value: string) => {
        const newSelection = { ...selection, [key]: value };

        // Reset subsequent selections if a parent changes
        if (key === 'brand') {
            newSelection.model = null;
            newSelection.year = null;
            // ... reset others
        }

        setSelection(newSelection);
        setSearchQuery("");

        const currentIndex = steps.indexOf(key);
        if (currentIndex < steps.length - 1) {
            setStep(steps[currentIndex + 1]);
        } else {
            onComplete(newSelection);
        }
    };

    const getOptions = () => {
        switch (step) {
            case "brand": return brands;
            case "model": return models;
            case "year": return VEHICLE_DATA.years.map(y => ({ id: y, name: y, slug: y }));
            case "fuel":
                // Fallback to static data for now, or implement dynamic if needed
                // For now, using static logic but adapted
                return VEHICLE_DATA.fuels.map(f => ({ id: f, name: f, slug: f }));
            case "gear":
                return VEHICLE_DATA.gears.map(g => ({ id: g, name: g, slug: g }));
            case "caseType": return VEHICLE_DATA.caseTypes.map(c => ({ id: c, name: c, slug: c }));
            case "version":
                // If we had versions in DB we would fetch them. For now static mock.
                return VEHICLE_DATA.versions["default"].map(v => ({ id: v, name: v, slug: v }));
            case "package": return VEHICLE_DATA.packages.map(p => ({ id: p, name: p, slug: p }));
            default: return [];
        }
    };

    const filteredOptions = getOptions().filter(opt =>
        opt.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderBreadcrumbs = () => (
        <div className="flex flex-wrap items-center gap-2 text-sm mb-6 p-4 bg-white/5 rounded-xl border border-white/10">
            {steps.map((s, index) => {
                const val = selection[s];
                const isCurrent = s === step;
                const isPast = steps.indexOf(s) < steps.indexOf(step);

                if (!val && !isCurrent) return null;

                // Helper to find name from ID
                const getName = (key: keyof SelectionState, id: string) => {
                    if (key === 'brand') return brands.find(b => b.id === id)?.name || id;
                    if (key === 'model') return models.find(m => m.id === id)?.name || id;
                    return id;
                };

                return (
                    <div key={s} className="flex items-center">
                        {index > 0 && <ChevronRight className="w-4 h-4 text-muted-foreground mx-2" />}
                        <button
                            onClick={() => isPast && setStep(s)}
                            disabled={!isPast}
                            className={cn(
                                "px-3 py-1 rounded-full transition-colors whitespace-nowrap",
                                isCurrent ? "bg-primary text-primary-foreground font-medium" :
                                    isPast ? "bg-white/10 hover:bg-white/20 text-muted-foreground" : "text-muted-foreground"
                            )}
                        >
                            {val ? getName(s, val) :
                                s === "brand" ? "Marka" :
                                    s === "model" ? "Model" :
                                        s === "year" ? "Yıl" :
                                            s === "fuel" ? "Yakıt" :
                                                s === "gear" ? "Vites" :
                                                    s === "caseType" ? "Kasa" :
                                                        s === "version" ? "Versiyon" : "Paket"}
                        </button>
                    </div>
                );
            })}
        </div>
    );

    return (
        <div className="w-full max-w-4xl mx-auto">
            {renderBreadcrumbs()}

            <div className="glass-card p-6">
                <div className="relative mb-6">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder={`${step === "brand" ? "Marka" : step === "model" ? "Model" : "Seçenek"} ara...`}
                        className="w-full bg-black/20 border border-white/10 rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:border-primary transition-colors text-lg"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        autoFocus
                    />
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-brand-gold" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                        {filteredOptions.map((opt) => (
                            <button
                                key={opt.id}
                                onClick={() => handleSelect(step, opt.id)}
                                className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-primary/10 hover:border-primary/30 transition-all group text-left"
                            >
                                <span className="font-medium group-hover:text-primary transition-colors">{opt.name}</span>
                                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                            </button>
                        ))}
                        {filteredOptions.length === 0 && (
                            <div className="col-span-full text-center py-8 text-muted-foreground">
                                Sonuç bulunamadı.
                            </div>
                        )}
                    </div>
                )}

                <div className="mt-6 pt-6 border-t border-white/10 flex justify-center">
                    <button
                        onClick={onManualEntry}
                        className="text-sm text-muted-foreground hover:text-primary flex items-center gap-2 transition-colors"
                    >
                        <AlertCircle className="w-4 h-4" />
                        Aradığım araç listede yok, manuel girmek istiyorum
                    </button>
                </div>
            </div>
        </div>
    );
}
