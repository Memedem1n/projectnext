"use client";

import { useState, useEffect } from "react";
import { ChevronRight, Search, AlertCircle, Loader2, AlertTriangle, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    getVehicleBrands,
    getVehicleModels,
    getVehicleYears,
    getVehicleBodyTypes,
    getVehicleFuels,
    getVehicleGears,
    getVehicleVersions
} from "@/lib/actions/vehicle";
import { createVehicleFeedback } from "@/lib/actions/feedback";

type SelectionState = {
    brand: string | null;
    model: string | null;
    year: string | null;
    fuel: string | null;
    bodyType: string | null;
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
    // Eurotax Hierarchy: Brand -> Model -> Year -> BodyType -> Fuel -> Gear -> Package
    const steps: (keyof SelectionState)[] = ["brand", "model", "year", "bodyType", "fuel", "gear", "package"];

    const [step, setStep] = useState<keyof SelectionState>("brand");
    const [selection, setSelection] = useState<SelectionState>({
        brand: null,
        model: null,
        year: null,
        fuel: null,
        bodyType: null,
        gear: null,
        version: null,
        package: null,
    });
    const [searchQuery, setSearchQuery] = useState("");
    const [options, setOptions] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [versions, setVersions] = useState<any[]>([]); // For final step details
    const [error, setError] = useState<string | null>(null);

    const [feedbackModal, setFeedbackModal] = useState<{ isOpen: boolean, type: "ERROR_REPORT" | "MISSING_VEHICLE" | null }>({ isOpen: false, type: null });
    const [feedbackDetails, setFeedbackDetails] = useState("");
    const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

    // Load initial brands
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            setOptions([]);
            setError(null);
            const type = "Otomobil"; // TODO: Map categorySlug to Type (Vasita -> Otomobil etc.)

            try {
                let data: string[] = [];

                if (step === "brand") {
                    data = await getVehicleBrands(type);
                } else if (step === "model" && selection.brand) {
                    data = await getVehicleModels(type, selection.brand);
                } else if (step === "year" && selection.brand && selection.model) {
                    const years = await getVehicleYears(type, selection.brand, selection.model);
                    data = years.map(String);
                } else if (step === "bodyType" && selection.brand && selection.model && selection.year) {
                    data = await getVehicleBodyTypes(type, selection.brand, selection.model, parseInt(selection.year));
                } else if (step === "fuel" && selection.brand && selection.model && selection.year && selection.bodyType) {
                    data = await getVehicleFuels(type, selection.brand, selection.model, parseInt(selection.year), selection.bodyType);
                } else if (step === "gear" && selection.brand && selection.model && selection.year && selection.bodyType && selection.fuel) {
                    data = await getVehicleGears(type, selection.brand, selection.model, parseInt(selection.year), selection.bodyType, selection.fuel);
                } else if (step === "package" && selection.brand && selection.model && selection.year && selection.bodyType && selection.fuel && selection.gear) {
                    const vs = await getVehicleVersions(type, selection.brand, selection.model, parseInt(selection.year), selection.bodyType, selection.fuel, selection.gear);
                    setVersions(vs); // Store full objects
                    data = vs.map(v => v.package || v.subModel || "Standart"); // Display names
                }

                if (data.length === 0) {
                    // setError("Veri bulunamadı (Liste boş).");
                }
                setOptions(data);
            } catch (e: any) {
                console.error(e);
                setError(e.message || "Bir hata oluştu");
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [step, selection.brand, selection.model, selection.year, selection.bodyType, selection.fuel, selection.gear]);


    const handleSelect = (value: string) => {
        const newSelection = { ...selection, [step]: value };

        // If selecting package (final step), we might need to store extra details
        if (step === "package") {
            const selectedVersion = versions.find(v => (v.package || v.subModel || "Standart") === value);
            if (selectedVersion) {
                // We could store motor info here if needed
                // newSelection.motorPower = selectedVersion.motorPower;
            }
        }

        setSelection(newSelection);
        setSearchQuery("");

        const currentIndex = steps.indexOf(step);
        if (currentIndex < steps.length - 1) {
            setStep(steps[currentIndex + 1]);
        } else {
            onComplete(newSelection);
        }
    };

    const handleBack = (targetStep: keyof SelectionState) => {
        // Reset subsequent selections
        const targetIndex = steps.indexOf(targetStep);
        const newSelection = { ...selection };

        for (let i = targetIndex + 1; i < steps.length; i++) {
            newSelection[steps[i]] = null;
        }

        setSelection(newSelection);
        setStep(targetStep);
    };

    const handleFeedbackSubmit = async () => {
        if (!feedbackDetails.trim()) return;
        setIsSubmittingFeedback(true);
        try {
            const result = await createVehicleFeedback({
                type: feedbackModal.type!,
                brand: selection.brand || undefined,
                model: selection.model || undefined,
                year: selection.year ? parseInt(selection.year) : undefined,
                details: feedbackDetails
            });

            if (result.success) {
                alert("Geri bildiriminiz alındı. En geç 24 saat içinde incelenip dönüş yapılacaktır.");
                setFeedbackModal({ isOpen: false, type: null });
                setFeedbackDetails("");
            } else {
                alert(result.error || "Bir hata oluştu.");
            }
        } catch (e) {
            alert("Bir hata oluştu.");
        } finally {
            setIsSubmittingFeedback(false);
        }
    };

    const filteredOptions = options.filter(opt =>
        opt.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderBreadcrumbs = () => (
        <div className="flex flex-wrap items-center gap-2 text-sm mb-6 p-4 bg-white/5 rounded-xl border border-white/10">
            {steps.map((s, index) => {
                const val = selection[s];
                const isCurrent = s === step;
                const isPast = steps.indexOf(s) < steps.indexOf(step);

                if (!val && !isCurrent) return null;

                return (
                    <div key={s} className="flex items-center">
                        {index > 0 && <ChevronRight className="w-4 h-4 text-muted-foreground mx-2" />}
                        <button
                            onClick={() => isPast && handleBack(s)}
                            disabled={!isPast}
                            className={cn(
                                "px-3 py-1 rounded-full transition-colors whitespace-nowrap",
                                isCurrent ? "bg-primary text-primary-foreground font-medium" :
                                    isPast ? "bg-white/10 hover:bg-white/20 text-muted-foreground" : "text-muted-foreground"
                            )}
                        >
                            {val || (
                                s === "brand" ? "Marka" :
                                    s === "model" ? "Model" :
                                        s === "year" ? "Yıl" :
                                            s === "bodyType" ? "Kasa" :
                                                s === "fuel" ? "Yakıt" :
                                                    s === "gear" ? "Vites" : "Paket"
                            )}
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

                {error && (
                    <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-brand-gold" />
                    </div>
                ) : (
                    <div className={cn(
                        "grid gap-3 max-h-[500px] overflow-y-auto custom-scrollbar pr-2",
                        step === "package" ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                    )}>
                        {step === "package" ? (
                            // Detailed view for final step
                            versions.filter(v => {
                                const searchTerm = searchQuery.toLowerCase();
                                const name = (v.version || `${v.subModel || ''} ${v.package || ''}`).toLowerCase();
                                return name.includes(searchTerm);
                            }).map((v, idx) => (
                                <button
                                    key={v.id || idx}
                                    onClick={() => handleSelect(v.version || v.package || v.subModel || "Standart")}
                                    className="flex flex-col items-start p-6 rounded-xl border border-white/5 bg-white/5 hover:bg-primary/10 hover:border-primary/30 transition-all group text-left space-y-3"
                                >
                                    <div className="flex items-center justify-between w-full">
                                        <span className="text-lg font-bold text-primary group-hover:text-primary-foreground transition-colors">
                                            {v.version || `${v.subModel} ${v.package}`}
                                        </span>
                                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                    </div>

                                    <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                                        <span className="px-2 py-1 rounded bg-black/20 border border-white/5">{v.fuel}</span>
                                        <span className="px-2 py-1 rounded bg-black/20 border border-white/5">{v.motorPower}</span>
                                        <span className="px-2 py-1 rounded bg-black/20 border border-white/5">{v.motorVolume}</span>
                                        <span className="px-2 py-1 rounded bg-black/20 border border-white/5">{v.year}</span>
                                        <span className="px-2 py-1 rounded bg-black/20 border border-white/5">{v.gear}</span>
                                        <span className="px-2 py-1 rounded bg-black/20 border border-white/5">{v.bodyType}</span>
                                    </div>

                                    <div className="text-xs text-muted-foreground/50 w-full border-t border-white/5 pt-2 mt-1">
                                        {v.type} {'>'} {v.year} {'>'} {v.brand} {'>'} {v.model} {'>'} {v.subModel} {'>'} {v.package}
                                    </div>
                                </button>
                            ))
                        ) : (
                            // Standard list for other steps
                            filteredOptions.map((opt, idx) => (
                                <button
                                    key={`${opt}-${idx}`}
                                    onClick={() => handleSelect(opt)}
                                    className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-primary/10 hover:border-primary/30 transition-all group text-left"
                                >
                                    <span className="font-medium group-hover:text-primary transition-colors">{opt}</span>
                                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                </button>
                            ))
                        )}

                        {((step === "package" && versions.length === 0) || (step !== "package" && filteredOptions.length === 0)) && (
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

            {/* Feedback Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-white/10 mt-8">
                <button
                    onClick={() => setFeedbackModal({ isOpen: true, type: "ERROR_REPORT" })}
                    className="text-xs text-red-400 hover:text-red-300 flex items-center gap-2 transition-colors"
                >
                    <AlertTriangle className="w-3 h-3" />
                    Hata Bildir
                </button>
                <button
                    onClick={() => setFeedbackModal({ isOpen: true, type: "MISSING_VEHICLE" })}
                    className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors"
                >
                    <HelpCircle className="w-3 h-3" />
                    Aracım Listede Yok
                </button>
            </div>

            {/* Feedback Modal */}
            {feedbackModal.isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            {feedbackModal.type === "ERROR_REPORT" ? <AlertTriangle className="w-5 h-5 text-red-500" /> : <HelpCircle className="w-5 h-5 text-brand-gold" />}
                            {feedbackModal.type === "ERROR_REPORT" ? "Hata Bildir" : "Aracım Listede Yok"}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            {feedbackModal.type === "ERROR_REPORT"
                                ? "Araç bilgilerinde fark ettiğiniz hatayı lütfen detaylıca açıklayın."
                                : "Listede bulamadığınız aracın marka, model ve yıl bilgilerini yazın. Talebiniz incelendikten sonra eklenecektir."}
                        </p>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Açıklama <span className="text-red-500">*</span></label>
                            <textarea
                                className="w-full bg-black/20 border border-white/10 rounded-xl p-3 min-h-[100px] focus:border-brand-gold focus:ring-0 transition-colors resize-none"
                                placeholder={feedbackModal.type === "ERROR_REPORT" ? "Örn: Model yılı yanlış..." : "Örn: 2024 Model Togg T10X..."}
                                value={feedbackDetails}
                                onChange={e => setFeedbackDetails(e.target.value)}
                            />
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                onClick={() => {
                                    setFeedbackModal({ isOpen: false, type: null });
                                    setFeedbackDetails("");
                                }}
                                className="px-4 py-2 rounded-xl hover:bg-white/5 transition-colors text-sm font-medium"
                            >
                                İptal
                            </button>
                            <button
                                onClick={handleFeedbackSubmit}
                                disabled={isSubmittingFeedback || !feedbackDetails.trim()}
                                className="px-4 py-2 bg-brand-gold text-primary-foreground rounded-xl font-medium disabled:opacity-50 transition-all hover:bg-brand-gold/90 text-sm"
                            >
                                {isSubmittingFeedback ? (
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="w-3 h-3 animate-spin" />
                                        <span>Gönderiliyor...</span>
                                    </div>
                                ) : "Gönder"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
