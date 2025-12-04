"use client";

import { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft, Upload, Check, AlertTriangle, Car, FileText, Shield, Settings, CreditCard, ShieldCheck, RefreshCw, Loader2, ChevronDown, Eye, Zap } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { PageBackground } from "@/components/layout/PageBackground";
import { CategorySearch } from "@/components/listing/CategorySearch";
import { CATEGORIES } from "@/data/categories";
import { VehicleHierarchySelector } from "@/components/listing/VehicleHierarchySelector";
import { CarDamageSelector } from "@/components/listing/CarDamageSelector";
import { EquipmentSelector } from "@/components/listing/EquipmentSelector";
import { ImageUploadStep } from "@/components/listing/ImageUploadStep";
import { ListingPreview } from "@/components/listing/ListingPreview";
import { ListingPackages, type PackageType } from "@/components/listing/ListingPackages";
import { createListing, getListingById, updateListing } from "@/lib/actions/listings";
import { uploadListingImages } from "@/lib/storage";
import { cn } from "@/lib/utils";
import { DopingSelector, type DopingType } from "@/components/listing/DopingSelector";
import { LocationSelector } from "@/components/listing/LocationSelector";
import { getCurrentUser } from "@/lib/actions/user";

type Step = "category" | "details" | "condition" | "features" | "images" | "doping" | "preview" | "finish" | "success";

const steps = [
    { id: "category", title: "Kategori", icon: Car },
    { id: "details", title: "Detaylar", icon: FileText },
    { id: "condition", title: "Durum", icon: Shield },
    { id: "features", title: "Özellikler", icon: Settings },
    { id: "images", title: "Fotoğraflar", icon: Upload },
    { id: "doping", title: "Doping", icon: Zap },
    { id: "preview", title: "Ön İzleme", icon: Eye },
    { id: "finish", title: "Yayınla", icon: Check },
];

const COLORS = [
    { value: "beyaz", label: "Beyaz", hex: "#ffffff" },
    { value: "siyah", label: "Siyah", hex: "#000000" },
    { value: "gri", label: "Gri", hex: "#808080" },
    { value: "kirmizi", label: "Kırmızı", hex: "#ff0000" },
    { value: "mavi", label: "Mavi", hex: "#0000ff" },
    { value: "yesil", label: "Yeşil", hex: "#008000" },
    { value: "sari", label: "Sarı", hex: "#ffff00" },
    { value: "turuncu", label: "Turuncu", hex: "#ffa500" },
    { value: "kahverengi", label: "Kahverengi", hex: "#a52a2a" },
    { value: "diger", label: "Diğer", hex: "transparent" },
];

export default function PostListingPage() {
    // ... (existing state)
    const [userRole, setUserRole] = useState<string | null>(null);
    const [vehicleStatus, setVehicleStatus] = useState<"second-hand" | "zero">("second-hand");

    useEffect(() => {
        getCurrentUser().then(user => {
            if (user) {
                setUserRole(user.role);
                // If individual, force second-hand
                if (user.role !== "DEALER") {
                    setVehicleStatus("second-hand");
                }
            }
        });
    }, []);

    // ... (existing useEffects)


    // ... (existing renderDetailsStep)


    const router = useRouter();
    const searchParams = useSearchParams();
    const [currentStep, setCurrentStep] = useState<Step>("category");
    const [subStep, setSubStep] = useState<"search" | "hierarchy" | "manual">("search");
    const [isColorOpen, setIsColorOpen] = useState(false);
    const [expertReports, setExpertReports] = useState<File[]>([]);
    const [checkingEligibility, setCheckingEligibility] = useState(false);
    const [isEligibleForFree, setIsEligibleForFree] = useState<boolean | null>(null);
    const [showDraftDialog, setShowDraftDialog] = useState(false);
    const [draftData, setDraftData] = useState<any>(null);
    const [dopingSelection, setDopingSelection] = useState<DopingType>("NONE");

    const [formData, setFormData] = useState({
        // Category & Vehicle
        category: null as string | null,
        subcategory: null as string | null,
        vehicle: {
            brand: null as string | null,
            model: null as string | null,
            year: null as string | null,
            fuel: null as string | null,
            caseType: null as string | null,
            gear: null as string | null,
            version: null as string | null,
            package: null as string | null,
        },

        // Details
        title: "",
        description: "",
        price: "",
        km: "",
        color: "",
        warranty: false,
        exchange: false,
        plate: "",
        trPlate: true,

        city: "",
        district: "",
        neighborhood: "",

        // Condition
        damageReport: {} as Record<string, any>,
        tramer: "",
        expertReport: null as File | null,

        // Features
        equipment: [] as string[],
        images: [] as (File | { url: string; name?: string })[],

        // Finish
        contactPreference: "both" as "call" | "message" | "both",
        listingPackage: "standard" as PackageType,
    });

    const [isLoading, setIsLoading] = useState(false);
    const listingId = searchParams.get("edit");
    const isEditing = !!listingId;
    const [createdListingId, setCreatedListingId] = useState<string | null>(null);

    // Fetch listing data if editing
    useEffect(() => {
        const fetchListing = async () => {
            if (!listingId) return;

            setIsLoading(true);
            try {
                const result = await getListingById(listingId);
                if (result.success && result.data) {
                    const l = result.data;

                    // Map existing data to form
                    setFormData(prev => ({
                        ...prev,
                        category: l.categoryId,
                        subcategory: null, // Can't easily infer without hierarchy traversal, but categoryId is enough for submission

                        vehicle: {
                            brand: l.brand,
                            model: l.model,
                            year: l.year?.toString() || null,
                            fuel: l.fuel,
                            caseType: l.caseType,
                            gear: l.gear,
                            version: l.version,
                            package: l.package,
                        },

                        title: l.title,
                        description: l.description || "",
                        price: l.price.toString(),
                        km: l.km?.toString() || "",
                        color: l.color || "",
                        warranty: l.warranty,
                        exchange: l.exchange,
                        plate: "", // Don't populate plate for privacy/security or if not returned
                        trPlate: true,
                        city: l.city || "",
                        district: l.district || "",
                        neighborhood: "", // Neighborhood not stored in DB yet

                        damageReport: l.damage.reduce((acc: any, curr: any) => ({
                            ...acc,
                            [curr.part]: { status: curr.status, description: curr.description }
                        }), {}),

                        tramer: l.tramer || "",
                        expertReport: null, // Can't populate File object

                        equipment: l.equipment.map((e: any) => e.equipmentId),

                        images: l.images.map((img: any) => ({
                            url: img.url,
                            name: `Resim ${img.order + 1}`
                        })),

                        contactPreference: l.contactPreference as any,
                        listingPackage: (l as any).listingPackage || "standard",
                    }));

                    // Skip to details step if we have data
                    if (currentStep === "category") {
                        setCurrentStep("details");
                    }
                }
            } catch (error) {
                console.error("Error fetching listing:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchListing();
    }, [listingId]);

    const handleResumeDraft = () => {
        if (draftData) {
            setFormData(prev => ({
                ...prev,
                ...draftData.formData,
                // Restore complex objects if needed, but basic spread covers most
                // Images and files are lost as they can't be in localStorage
            }));
            setCurrentStep(draftData.step);
            setShowDraftDialog(false);
        }
    };

    const handleDiscardDraft = () => {
        localStorage.removeItem("listing_draft");
        setShowDraftDialog(false);
        setDraftData(null);
    };

    // Redirect to start if state is lost (e.g. page refresh)
    useEffect(() => {
        if (currentStep !== "category" && !formData.category) {
            router.replace("/post-listing");
        }
    }, [currentStep, formData.category, router]);

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Plate Logic
    const handlePlateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.toUpperCase();
        setFormData(prev => ({ ...prev, plate: val }));

        // TR Plate Regex: 01-81, 1-3 letters, 2-4 digits
        // Simplified: Starts with 2 digits (01-81), then letters, then digits
        const trRegex = /^(0[1-9]|[1-7][0-9]|8[0-1])\s*[A-Z]{1,3}\s*\d{2,4}$/;
        const isTr = trRegex.test(val.replace(/\s/g, ''));

        setFormData(prev => ({
            ...prev,
            plate: val,
            trPlate: isTr,
            plateNationality: isTr ? "Türkiye (TR) Plakalı" : "TR Plakalı Değil"
        }));
    };

    // Draft System Logic
    useEffect(() => {
        // Don't save if editing an existing listing or if submitting
        if (isEditing || isSubmitting) return;

        const saveDraft = () => {
            const draft = {
                step: currentStep,
                formData: {
                    ...formData,
                    // Don't save files directly to localStorage
                    images: [],
                    expertReport: null
                },
                timestamp: new Date().toISOString()
            };
            localStorage.setItem("listing_draft", JSON.stringify(draft));
        };

        // Debounce save
        const timeoutId = setTimeout(saveDraft, 1000);
        return () => clearTimeout(timeoutId);
    }, [formData, currentStep, isEditing, isSubmitting]);

    useEffect(() => {
        // Check for draft on mount
        if (!isEditing) {
            const savedDraft = localStorage.getItem("listing_draft");
            if (savedDraft) {
                try {
                    const parsed = JSON.parse(savedDraft);
                    // Only show if there's meaningful data (e.g. category selected)
                    if (parsed.formData.category) {
                        setDraftData(parsed);
                        setShowDraftDialog(true);
                    }
                } catch (e) {
                    console.error("Error parsing draft:", e);
                }
            }
        }
    }, [isEditing]);

    // Trigger submission when reaching finish step
    useEffect(() => {
        if (currentStep === "finish") {
            handleSubmit();
        }
    }, [currentStep]);

    const validateDetails = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.title.trim()) newErrors.title = "İlan başlığı zorunludur";
        if (!formData.price) newErrors.price = "Fiyat zorunludur";
        if (!formData.km) newErrors.km = "Kilometre zorunludur";
        if (!formData.color) newErrors.color = "Renk seçimi zorunludur";
        if (!formData.city) newErrors.location = "İl seçimi zorunludur";
        if (!formData.district) newErrors.location = "İlçe seçimi zorunludur";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateImages = () => {
        if (formData.images.length === 0) {
            setErrors({ images: "En az 1 fotoğraf yüklemelisiniz" });
            return false;
        }
        return true;
    };

    const handleExpertReportUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            // Validate: Max 10 files, Max 5MB each
            const validFiles = files.filter(file => {
                const isSizeValid = file.size <= 5 * 1024 * 1024; // 5MB
                const isTypeValid = file.type === "application/pdf" || file.name.toLowerCase().endsWith('.pdf') || file.type.startsWith("image/");
                return isSizeValid && isTypeValid;
            });

            if (validFiles.length + expertReports.length > 10) {
                alert("En fazla 10 adet rapor yükleyebilirsiniz.");
                return;
            }

            setExpertReports(prev => [...prev, ...validFiles]);
        }
    };

    const removeExpertReport = (index: number) => {
        setExpertReports(prev => prev.filter((_, i) => i !== index));
    };

    const validateCategory = () => {
        if (!formData.category) {
            alert("Lütfen bir kategori seçiniz.");
            return false;
        }
        if (formData.category === "vasita" && !formData.vehicle.model) {
            alert("Lütfen araç modelini seçiniz.");
            return false;
        }
        return true;
    };

    const handleNext = () => {
        if (currentStep === "category") {
            if (!validateCategory()) {
                return;
            }
            setCurrentStep("details");
        } else if (currentStep === "details") {
            if (!validateDetails()) {
                window.scrollTo(0, 0);
                return;
            }
            setCurrentStep("condition");
        } else if (currentStep === "condition") {
            setCurrentStep("features");
        } else if (currentStep === "features") {
            setCurrentStep("images");
        } else if (currentStep === "images") {
            if (!validateImages()) {
                window.scrollTo(0, 0);
                return;
            }
            setCurrentStep("doping");
        } else if (currentStep === "doping") {
            setCurrentStep("preview");
        } else if (currentStep === "preview") {
            setCurrentStep("finish");
        }

        window.scrollTo(0, 0);
    };

    const handleBack = () => {
        if (currentStep === "details") setCurrentStep("category");
        else if (currentStep === "condition") setCurrentStep("details");
        else if (currentStep === "features") setCurrentStep("condition");
        else if (currentStep === "images") setCurrentStep("features");
        else if (currentStep === "doping") setCurrentStep("images");
        else if (currentStep === "preview") setCurrentStep("doping");
        else if (currentStep === "finish") setCurrentStep("preview");

        window.scrollTo(0, 0);
    };

    const handleCategorySelect = (category: any, subcategory?: any) => {
        const selectedCategory = subcategory || category;

        setFormData(prev => ({
            ...prev,
            category: selectedCategory.id, // Use the real DB ID
            subcategory: subcategory ? subcategory.slug : null
        }));

        // Use slug for UI logic (stable across environments)
        if (selectedCategory.slug === "vasita" || category.slug === "vasita") {
            setSubStep("hierarchy");
        } else {
            alert("Şu an sadece Vasıta kategorisi için detaylı seçim aktiftir. Diğer kategoriler yakında eklenecektir.");
        }
    };

    const handleVehicleComplete = (selection: any) => {
        // Map bodyType to caseType for DB consistency
        const vehicleData = {
            ...selection,
            caseType: selection.bodyType || selection.caseType
        };
        setFormData(prev => ({ ...prev, vehicle: vehicleData }));

        // Automatically move to next step
        setCurrentStep("details");
    };

    const renderCategoryStep = () => (
        <div className="max-w-4xl mx-auto space-y-8">
            {!formData.category ? (
                <div className="space-y-8">
                    <div className="text-center space-y-4">
                        <h2 className="text-3xl font-bold">Ne satmak istiyorsunuz?</h2>
                        <p className="text-muted-foreground">İlanınız için en uygun kategoriyi seçin veya arayın.</p>
                    </div>

                    <CategorySearch onSelect={handleCategorySelect} />

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-white/10" />
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => {
                                setFormData(prev => ({ ...prev, category: null }));
                                setSubStep("search");
                            }}
                            className="p-2 rounded-full hover:bg-white/10 transition-colors"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <div>
                            <h2 className="text-2xl font-bold">Araç Bilgileri</h2>
                            <p className="text-muted-foreground">Aracınızın marka ve modelini seçin</p>
                        </div>
                    </div>

                    {subStep === "hierarchy" && formData.category && (
                        <VehicleHierarchySelector
                            categorySlug={formData.subcategory || "vasita"}
                            onComplete={handleVehicleComplete}
                            onManualEntry={() => setSubStep("manual")}
                        />
                    )}

                    {subStep === "manual" && (
                        <div className="glass-card p-8 max-w-2xl mx-auto space-y-6 text-center">
                            <div className="w-16 h-16 rounded-full bg-yellow-500/20 text-yellow-500 flex items-center justify-center mx-auto">
                                <AlertTriangle className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold">Manuel Giriş Modu</h3>
                            <p className="text-muted-foreground">
                                Aracınızı listemizde bulamadıysanız, bilgileri manuel olarak girebilirsiniz.
                                Bu durumda ilanınız <span className="text-yellow-500 font-medium">editör onayı</span> sürecine tabi olacaktır.
                            </p>
                            <button
                                onClick={handleNext}
                                className="px-8 py-3 bg-primary text-primary-foreground rounded-2xl font-medium hover:bg-primary/90 transition-colors"
                            >
                                Manuel Giriş ile Devam Et
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );

    if (showDraftDialog) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-6">
                    <div className="text-center space-y-2">
                        <div className="w-12 h-12 rounded-full bg-brand-gold/20 text-brand-gold flex items-center justify-center mx-auto">
                            <FileText className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold">Taslak Bulundu</h3>
                        <p className="text-muted-foreground">
                            Daha önce yarım bıraktığınız bir ilan girişi bulundu. Kaldığınız yerden devam etmek ister misiniz?
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={handleDiscardDraft}
                            className="flex-1 py-3 px-4 rounded-xl border border-white/10 hover:bg-white/5 transition-colors font-medium"
                        >
                            Sil ve Yeni Başla
                        </button>
                        <button
                            onClick={handleResumeDraft}
                            className="flex-1 py-3 px-4 rounded-xl bg-brand-gold text-primary-foreground hover:bg-brand-gold/90 transition-colors font-bold"
                        >
                            Devam Et
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const renderDetailsStep = () => (
        <div className="max-w-3xl mx-auto space-y-8">
            <div className="glass-card p-8 space-y-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                    <FileText className="w-5 h-5 text-brand-gold" />
                    Temel Bilgiler
                </h3>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">İlan Başlığı <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            className={cn(
                                "w-full bg-black/20 border rounded-xl p-4 focus:ring-0 transition-colors",
                                errors.title ? "border-red-500 focus:border-red-500" : "border-white/10 focus:border-brand-gold"
                            )}
                            placeholder="Örn: ProjectNexx Temiz 2020 Model BMW 320i"
                            value={formData.title}
                            onChange={e => {
                                const val = e.target.value;
                                setFormData(prev => ({ ...prev, title: val }));
                                if (errors.title) setErrors(prev => ({ ...prev, title: "" }));
                            }}
                        />
                        {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
                        <p className="text-xs text-muted-foreground mt-2">
                            * Başlıkta büyük harf, noktalama işareti kullanımı kurallara uygun olmalıdır.
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Açıklama</label>
                        <textarea
                            rows={6}
                            className="w-full bg-black/20 border border-white/10 rounded-xl p-4 focus:border-brand-gold focus:ring-0"
                            placeholder="Aracınızın detaylarını buraya yazın..."
                            value={formData.description}
                            onChange={e => {
                                const val = e.target.value;
                                setFormData(prev => ({ ...prev, description: val }));
                            }}
                        />
                    </div>

                    {/* Location Selector */}
                    <div className="pt-4 border-t border-white/10">
                        <LocationSelector
                            initialLocation={{
                                city: formData.city,
                                district: formData.district,
                                neighborhood: formData.neighborhood
                            }}
                            onSelect={(loc) => {
                                setFormData(prev => ({
                                    ...prev,
                                    city: loc.city,
                                    district: loc.district,
                                    neighborhood: loc.neighborhood
                                }));
                                if (errors.location) setErrors(prev => ({ ...prev, location: "" }));
                            }}
                        />
                        {errors.location && <p className="text-xs text-red-500 mt-1">{errors.location}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-2">Fiyat (TL) <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                className={cn(
                                    "w-full bg-black/20 border rounded-2xl p-4 focus:ring-0 transition-colors",
                                    errors.price ? "border-red-500 focus:border-red-500" : "border-white/10 focus:border-brand-gold"
                                )}
                                placeholder="0"
                                value={formData.price}
                                onChange={e => {
                                    const rawValue = e.target.value.replace(/\D/g, "");
                                    const formatted = rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                                    setFormData(prev => ({ ...prev, price: formatted }));
                                    if (errors.price) setErrors(prev => ({ ...prev, price: "" }));
                                }}
                            />
                            {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Kilometre <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                className={cn(
                                    "w-full bg-black/20 border rounded-2xl p-4 focus:ring-0 transition-colors",
                                    errors.km ? "border-red-500 focus:border-red-500" : "border-white/10 focus:border-brand-gold"
                                )}
                                placeholder="0"
                                value={formData.km}
                                onChange={e => {
                                    const rawValue = e.target.value.replace(/\D/g, "");
                                    const formatted = rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                                    setFormData(prev => ({ ...prev, km: formatted }));
                                    if (errors.km) setErrors(prev => ({ ...prev, km: "" }));
                                }}
                            />
                            {errors.km && <p className="text-xs text-red-500 mt-1">{errors.km}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end relative z-50">
                        <div className="relative">
                            <label className="block text-sm font-medium mb-2">Renk <span className="text-red-500">*</span></label>
                            <button
                                onClick={() => setIsColorOpen(!isColorOpen)}
                                className={cn(
                                    "w-full bg-black/20 border rounded-2xl p-4 flex items-center justify-between transition-colors",
                                    errors.color ? "border-red-500" : "border-white/10 hover:border-brand-gold",
                                    isColorOpen && "border-brand-gold ring-1 ring-brand-gold"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    {formData.color && (
                                        <div
                                            className="w-4 h-4 rounded-full border border-white/20"
                                            style={{ backgroundColor: COLORS.find(c => c.value === formData.color)?.hex }}
                                        />
                                    )}
                                    <span className={formData.color ? "text-foreground" : "text-muted-foreground"}>
                                        {formData.color ? COLORS.find(c => c.value === formData.color)?.label : "Seçiniz"}
                                    </span>
                                </div>
                                <ChevronDown className={cn("w-4 h-4 transition-transform", isColorOpen && "rotate-180")} />
                            </button>

                            {isColorOpen && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-black/90 border border-white/10 rounded-2xl overflow-hidden z-50 backdrop-blur-xl shadow-xl max-h-60 overflow-y-auto">
                                    {COLORS.map(color => (
                                        <button
                                            key={color.value}
                                            onClick={() => {
                                                setFormData(prev => ({ ...prev, color: color.value }));
                                                if (errors.color) setErrors(prev => ({ ...prev, color: "" }));
                                                setIsColorOpen(false);
                                            }}
                                            className="w-full p-3 flex items-center gap-3 hover:bg-white/10 transition-colors text-left"
                                        >
                                            <div
                                                className="w-4 h-4 rounded-full border border-white/20"
                                                style={{ backgroundColor: color.hex }}
                                            />
                                            <span>{color.label}</span>
                                            {formData.color === color.value && <Check className="w-4 h-4 ml-auto text-brand-gold" />}
                                        </button>
                                    ))}
                                </div>
                            )}
                            {errors.color && <p className="text-xs text-red-500 mt-1">{errors.color}</p>}
                        </div>

                        {/* Plate Input */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Plaka</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    className={cn(
                                        "w-full bg-black/20 border rounded-2xl p-4 focus:ring-0 transition-colors uppercase",
                                        "border-white/10 focus:border-brand-gold"
                                    )}
                                    placeholder="34 ABC 123"
                                    value={formData.plate}
                                    onChange={handlePlateChange}
                                    maxLength={15}
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                    {formData.plate && (
                                        <span className={cn("text-xs font-medium px-2 py-1 rounded", formData.trPlate ? "bg-green-500/20 text-green-500" : "bg-yellow-500/20 text-yellow-500")}>
                                            {formData.trPlate ? "TR" : "Yabancı"}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Vehicle Status (New/Used) */}
                    <div className="pt-4 border-t border-white/10">
                        <label className="block text-sm font-medium mb-4">Araç Durumu <span className="text-red-500">*</span></label>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setVehicleStatus("second-hand")}
                                className={cn(
                                    "flex-1 p-4 rounded-xl border transition-all flex items-center justify-center gap-2",
                                    vehicleStatus === "second-hand"
                                        ? "bg-brand-gold/10 border-brand-gold text-brand-gold"
                                        : "bg-black/20 border-white/10 hover:bg-white/5"
                                )}
                            >
                                <Car className="w-5 h-5" />
                                <span className="font-medium">İkinci El</span>
                            </button>

                            <button
                                onClick={() => {
                                    if (userRole === "DEALER") {
                                        setVehicleStatus("zero");
                                        setFormData(prev => ({ ...prev, km: "0" }));
                                    } else {
                                        alert("Sıfır araç ilanı sadece kurumsal üyeler (Galeriler/Bayiler) tarafından verilebilir.");
                                    }
                                }}
                                className={cn(
                                    "flex-1 p-4 rounded-xl border transition-all flex items-center justify-center gap-2",
                                    vehicleStatus === "zero"
                                        ? "bg-brand-gold/10 border-brand-gold text-brand-gold"
                                        : "bg-black/20 border-white/10 hover:bg-white/5",
                                    userRole !== "DEALER" && "opacity-50 cursor-not-allowed"
                                )}
                            >
                                <Zap className="w-5 h-5" />
                                <span className="font-medium">Sıfır (0 KM)</span>
                            </button>
                        </div>
                        {userRole !== "DEALER" && (
                            <p className="text-xs text-muted-foreground mt-2">
                                * Bireysel satıcılar sadece İkinci El araç ilanı verebilir.
                            </p>
                        )}
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setFormData(prev => ({ ...prev, warranty: !prev.warranty }))}
                            className={cn(
                                "flex-1 p-4 rounded-2xl border transition-all duration-300 flex items-center gap-4 group relative overflow-hidden h-[58px]",
                                formData.warranty
                                    ? "bg-brand-gold/10 border-brand-gold text-brand-gold"
                                    : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                            )}
                        >
                            <div className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center transition-colors shrink-0",
                                formData.warranty ? "bg-brand-gold text-primary-foreground" : "bg-white/10 text-muted-foreground group-hover:bg-white/20"
                            )}>
                                <ShieldCheck className="w-4 h-4" />
                            </div>
                            <div className="text-left leading-tight">
                                <div className="font-bold text-sm">Garantili</div>
                            </div>
                            {formData.warranty && (
                                <div className="absolute top-2 right-2">
                                    <Check className="w-3 h-3 text-brand-gold" />
                                </div>
                            )}
                        </button>

                        <button
                            onClick={() => setFormData(prev => ({ ...prev, exchange: !prev.exchange }))}
                            className={cn(
                                "flex-1 p-4 rounded-2xl border transition-all duration-300 flex items-center gap-4 group relative overflow-hidden h-[58px]",
                                formData.exchange
                                    ? "bg-blue-500/10 border-blue-500 text-blue-500"
                                    : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                            )}
                        >
                            <div className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center transition-colors shrink-0",
                                formData.exchange ? "bg-blue-500 text-white" : "bg-white/10 text-muted-foreground group-hover:bg-white/20"
                            )}>
                                <RefreshCw className="w-4 h-4" />
                            </div>
                            <div className="text-left leading-tight">
                                <div className="font-bold text-sm">Takaslı</div>
                            </div>
                            {formData.exchange && (
                                <div className="absolute top-2 right-2">
                                    <Check className="w-3 h-3 text-blue-500" />
                                </div>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderConditionStep = () => (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="glass-card p-8">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Car className="w-5 h-5 text-brand-gold" />
                    Boya, Değişen ve Ekspertiz Bilgisi
                </h3>
                <CarDamageSelector
                    initialDamage={formData.damageReport}
                    onChange={(report) => setFormData(prev => ({ ...prev, damageReport: report }))}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="glass-card p-8 space-y-4">
                    <h3 className="text-lg font-bold">Tramer Kaydı</h3>
                    <div className="space-y-4">
                        <div className="relative">
                            <span className={cn(
                                "absolute left-4 top-1/2 -translate-y-1/2 transition-colors",
                                formData.tramer === "0" ? "text-muted-foreground/50" : "text-muted-foreground"
                            )}>₺</span>
                            <input
                                type="text"
                                className={cn(
                                    "w-full bg-black/20 border rounded-2xl pl-8 pr-4 py-4 focus:ring-0 transition-colors",
                                    formData.tramer === "0"
                                        ? "border-white/5 text-muted-foreground/50 cursor-not-allowed"
                                        : "border-white/10 focus:border-brand-gold"
                                )}
                                placeholder="0"
                                value={formData.tramer === "0" ? "" : formData.tramer}
                                onChange={e => {
                                    const rawValue = e.target.value.replace(/\D/g, "");
                                    const formatted = rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                                    setFormData(prev => ({ ...prev, tramer: formatted }));
                                }}
                                disabled={formData.tramer === "0"}
                            />
                        </div>
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className={cn(
                                "w-6 h-6 rounded-md border border-white/20 flex items-center justify-center transition-colors",
                                formData.tramer === "0" ? "bg-brand-gold border-brand-gold" : "bg-white/5 group-hover:border-brand-gold/50"
                            )}>
                                {formData.tramer === "0" && <Check className="w-4 h-4 text-primary-foreground" />}
                            </div>
                            <input
                                type="checkbox"
                                className="hidden"
                                checked={formData.tramer === "0"}
                                onChange={(e) => {
                                    const isChecked = e.target.checked;
                                    setFormData(prev => ({ ...prev, tramer: isChecked ? "0" : "" }));
                                }}
                            />
                            <span className="font-medium text-sm">Hasar Kaydı (Tramer) Yok</span>
                        </label>
                    </div>
                </div>

                <div className="glass-card p-8 space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-bold">Ekspertiz Raporu</h3>
                        <span className="text-xs text-muted-foreground">{expertReports.length}/10</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-4">
                        {expertReports.map((file, idx) => (
                            <div key={idx} className="relative group p-2 bg-white/5 rounded-lg border border-white/10 flex items-center gap-2 overflow-hidden">
                                <FileText className="w-4 h-4 text-brand-gold shrink-0" />
                                <span className="text-xs truncate">{file.name}</span>
                                <button
                                    onClick={() => removeExpertReport(idx)}
                                    className="absolute right-1 top-1/2 -translate-y-1/2 p-1 bg-red-500/20 text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <div className="w-3 h-3 flex items-center justify-center">x</div>
                                </button>
                            </div>
                        ))}
                    </div>

                    <label className={cn(
                        "border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer flex flex-col items-center justify-center h-[140px]",
                        "border-white/10 hover:border-brand-gold/50 hover:bg-white/5"
                    )}>
                        <input
                            type="file"
                            multiple
                            accept=".pdf,image/*"
                            className="hidden"
                            onChange={handleExpertReportUpload}
                            onClick={(e) => (e.target as any).value = null}
                        />
                        <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Rapor yüklemek için tıklayın veya sürükleyin</p>
                        <p className="text-xs text-muted-foreground/50 mt-1">PDF veya Resim (Max 5MB)</p>
                    </label>
                </div>
            </div>
        </div>
    );

    const renderFeaturesStep = () => (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                    <Settings className="w-5 h-5 text-brand-gold" />
                    Donanım Özellikleri
                </h3>
                <p className="text-muted-foreground">
                    Aracınızda bulunan donanım özelliklerini işaretleyiniz.
                </p>
            </div>

            <EquipmentSelector
                selectedEquipment={formData.equipment}
                onChange={(features) => setFormData(prev => ({ ...prev, equipment: features }))}
            />
        </div>
    );

    const renderImagesStep = () => (
        <ImageUploadStep
            images={formData.images}
            onChange={(files) => setFormData(prev => ({ ...prev, images: files }))}
        />
    );

    const renderDopingStep = () => (
        <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <DopingSelector
                selectedDoping={dopingSelection}
                onSelect={setDopingSelection}
            />
            <div className="flex justify-between pt-6">
                <button
                    onClick={handleBack}
                    className="px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-colors flex items-center"
                >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Geri Dön
                </button>
                <button
                    onClick={handleNext}
                    className="px-6 py-3 bg-brand-gold text-primary-foreground rounded-xl font-bold hover:bg-brand-gold/90 transition-colors flex items-center"
                >
                    Devam Et
                    <ChevronRight className="w-4 h-4 ml-2" />
                </button>
            </div>
        </div>
    );

    const renderPreviewStep = () => (
        <ListingPreview
            data={{ ...formData, doping: dopingSelection }}
            onBack={handleBack}
            onSubmit={handleNext}
            isLoading={isLoading}
        />
    );

    const renderSuccessStep = () => (
        <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in zoom-in duration-500">
            <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
                <Check className="w-12 h-12 text-green-500" />
            </div>
            <h2 className="text-3xl font-bold mb-4">İlanınız Başarıyla Oluşturuldu! 🚀</h2>
            <p className="text-muted-foreground text-lg max-w-md mb-8">
                İlanınız editörlerimiz tarafından incelendikten sonra yayına alınacaktır. Bu süreç genellikle 1-2 saat sürmektedir.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                <button
                    onClick={() => router.push("/")}
                    className="flex-1 px-6 py-4 rounded-xl border border-white/10 hover:bg-white/5 transition-colors font-medium"
                >
                    Anasayfaya Dön
                </button>
                <button
                    onClick={() => {
                        const targetId = listingId || createdListingId;
                        if (targetId) {
                            router.push(`/listing/${targetId}`);
                        } else {
                            router.push("/dashboard/listings");
                        }
                    }}
                    className="flex-1 px-6 py-4 bg-brand-gold text-primary-foreground rounded-xl font-bold hover:bg-brand-gold/90 transition-colors"
                >
                    İlanlarımı Görüntüle
                </button>
            </div>
        </div>
    );

    const handleSubmit = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            // Upload images first
            const imageFormData = new FormData();
            formData.images.forEach((file) => {
                if (file instanceof File) {
                    imageFormData.append("files", file);
                }
            });
            const uploadResult = await uploadListingImages(imageFormData);

            if (!uploadResult.success || !uploadResult.urls) {
                throw new Error("Resim yükleme başarısız oldu: " + uploadResult.error);
            }

            // Prepare submission data
            const submissionData = {
                ...formData,
                categoryId: formData.category, // Map category ID
                ...formData.vehicle, // Flatten vehicle details
                city: formData.city,
                district: formData.district,
                images: uploadResult.urls.map(url => ({ url })),
                doping: dopingSelection
            };

            // Call server action
            let result;
            try {
                if (isEditing && listingId) {
                    result = await updateListing(listingId, submissionData);
                } else {
                    result = await createListing(submissionData);
                }

                if (result.success && result.data) {
                    // Clear draft
                    localStorage.removeItem("listing_draft");
                    // Redirect to success page or listing
                    setCreatedListingId(result.data.id); // Store the new listing ID
                    setCurrentStep("success");
                } else {
                    alert("İlan oluşturulurken bir hata oluştu: " + (result.error || "Bilinmeyen hata"));
                    setCurrentStep("preview"); // Go back to preview on error
                }
            } catch (error) {
                console.error("Submission error:", error);
                alert("Beklenmeyen bir hata oluştu. Lütfen tekrar deneyiniz.");
                setCurrentStep("preview"); // Go back to preview on error
            }
        } catch (error) {
            console.error("Submission error:", error);
            alert("Beklenmeyen bir hata oluştu.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <PageBackground>
            <div className="pt-24 pb-8 px-4">
                {/* Progress Steps - Hide on success */}
                {currentStep !== "success" && (
                    <div className="max-w-4xl mx-auto mb-12 overflow-x-auto pb-4">
                        <div className="flex items-center justify-between min-w-[600px] px-2">
                            {steps.map((step, index) => {
                                const isActive = currentStep === step.id;
                                const isCompleted = steps.findIndex(s => s.id === currentStep) > index;
                                const Icon = step.icon;

                                return (
                                    <div key={step.id} className="flex flex-col items-center gap-2 bg-[#0f0f11] px-2">
                                        <div className={cn(
                                            "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                                            isActive ? "border-brand-gold bg-brand-gold text-black scale-110 shadow-[0_0_20px_rgba(255,215,0,0.3)]" :
                                                isCompleted ? "border-brand-gold bg-brand-gold/20 text-brand-gold" :
                                                    "border-white/10 bg-black text-muted-foreground"
                                        )}>
                                            {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                                        </div>
                                        <span className={cn(
                                            "text-xs font-medium transition-colors",
                                            isActive ? "text-brand-gold" :
                                                isCompleted ? "text-foreground" :
                                                    "text-muted-foreground"
                                        )}>{step.title}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                <div className="max-w-5xl mx-auto px-4 pb-20">
                    {currentStep === "category" && renderCategoryStep()}
                    {currentStep === "details" && renderDetailsStep()}
                    {currentStep === "condition" && renderConditionStep()}
                    {currentStep === "features" && renderFeaturesStep()}
                    {currentStep === "images" && renderImagesStep()}
                    {currentStep === "doping" && renderDopingStep()}
                    {currentStep === "preview" && renderPreviewStep()}
                    {currentStep === "success" && renderSuccessStep()}

                    {/* Navigation Buttons (Except for specific steps that handle their own nav) */}
                    {currentStep !== "category" && currentStep !== "doping" && currentStep !== "preview" && currentStep !== "finish" && currentStep !== "success" && (
                        <div className="flex justify-between pt-8 border-t border-white/10 mt-8">
                            <button
                                onClick={handleBack}
                                className="px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-colors flex items-center"
                            >
                                <ChevronLeft className="w-4 h-4 mr-2" />
                                Geri Dön
                            </button>
                            <button
                                onClick={handleNext}
                                className="px-6 py-3 bg-brand-gold text-primary-foreground rounded-xl font-bold hover:bg-brand-gold/90 transition-colors flex items-center"
                            >
                                Devam Et
                                <ChevronRight className="w-4 h-4 ml-2" />
                            </button>
                        </div>
                    )}

                    {currentStep === "finish" && (
                        <div className="text-center py-20">
                            <Loader2 className="w-12 h-12 animate-spin mx-auto text-brand-gold mb-4" />
                            <h2 className="text-2xl font-bold mb-2">İlanınız Hazırlanıyor</h2>
                            <p className="text-muted-foreground">Lütfen bekleyiniz, ilanınız oluşturuluyor...</p>
                        </div>
                    )}
                </div>
            </div>
        </PageBackground>
    );
}

