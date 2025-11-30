"use client";

import { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft, Upload, Check, AlertTriangle, Car, FileText, Shield, Settings, CreditCard, ShieldCheck, RefreshCw, Loader2, ChevronDown, Eye } from "lucide-react";
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

type Step = "category" | "details" | "condition" | "features" | "images" | "preview" | "finish";

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

    useEffect(() => {
        const step = searchParams.get("step") as Step;
        if (step && steps.some(s => s.id === step)) {
            setCurrentStep(step);
        }
    }, [searchParams]);



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
        location: "",

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
                        location: "", // City/District logic needed if stored separately

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

    const steps = [
        { id: "category", title: "Kategori", icon: Car },
        { id: "details", title: "Detaylar", icon: FileText },
        { id: "condition", title: "Durum", icon: Shield },
        { id: "features", title: "Özellikler", icon: Settings },
        { id: "images", title: "Fotoğraflar", icon: Upload },
        { id: "preview", title: "Önizleme", icon: Eye },
        { id: "finish", title: "Yayınla", icon: CreditCard },
    ];

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    const validateDetails = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.title.trim()) newErrors.title = "İlan başlığı zorunludur";
        if (!formData.price) newErrors.price = "Fiyat zorunludur";
        if (!formData.km) newErrors.km = "Kilometre zorunludur";
        if (!formData.color) newErrors.color = "Renk seçimi zorunludur";

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
        }

        if (currentStep === "details") {
            if (!validateDetails()) {
                window.scrollTo(0, 0);
                return;
            }
        }

        if (currentStep === "images") {
            if (!validateImages()) {
                window.scrollTo(0, 0);
                return;
            }
        }

        const currentIndex = steps.findIndex(s => s.id === currentStep);
        if (currentIndex < steps.length - 1) {
            const nextStep = steps[currentIndex + 1].id;
            router.push(`/post-listing?step=${nextStep}`);
            window.scrollTo(0, 0);
        }
    };

    const handleBack = () => {
        const currentIndex = steps.findIndex(s => s.id === currentStep);
        if (currentIndex > 0) {
            const prevStep = steps[currentIndex - 1].id;
            router.push(`/post-listing?step=${prevStep}`);
            window.scrollTo(0, 0);
        }
    };

    const handleCategorySelect = (catId: string, subId?: string) => {
        // Map slug to ID if needed (Temporary fix for seed data mismatch)
        const finalCatId = catId === "vasita" ? "cmil7v27a000011zxd9oy9y5p" : catId;

        setFormData(prev => ({ ...prev, category: finalCatId, subcategory: subId || null }));
        if (catId === "vasita") {
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
        const currentIndex = steps.findIndex(s => s.id === "category");
        const nextStep = steps[currentIndex + 1].id;
        router.push(`/post-listing?step=${nextStep}`);
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

                    {subStep === "hierarchy" && (formData.subcategory || formData.category === "vasita") && (
                        <VehicleHierarchySelector
                            categorySlug={formData.subcategory || formData.category!}
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

    const renderPreviewStep = () => (
        <ListingPreview
            formData={formData}
            onEdit={(step) => {
                const targetStep = step as Step;
                if (steps.some(s => s.id === targetStep)) {
                    setCurrentStep(targetStep);
                    router.push(`/post-listing?step=${targetStep}`);
                }
            }}
        />
    );

    const renderFinishStep = () => (
        <div className="max-w-4xl mx-auto space-y-12">
            <div className="glass-card p-8 space-y-6">
                <h3 className="text-xl font-bold">İletişim Tercihleri</h3>
                <p className="text-sm text-muted-foreground">Müşteriler size nasıl ulaşsın?</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                        { id: "both", label: "Arama ve Mesaj" },
                        { id: "call", label: "Sadece Arama" },
                        { id: "message", label: "Sadece Mesaj" }
                    ].map(opt => (
                        <button
                            key={opt.id}
                            onClick={() => setFormData(prev => ({ ...prev, contactPreference: opt.id as any }))}
                            className={cn(
                                "p-4 rounded-2xl border transition-all font-medium",
                                formData.contactPreference === opt.id
                                    ? "bg-brand-gold/20 border-brand-gold text-brand-gold"
                                    : "bg-white/5 border-white/10 hover:bg-white/10"
                            )}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-6">
                <h3 className="text-xl font-bold">İlan Paketi Seçimi</h3>
                {checkingEligibility ? (
                    <div className="text-center py-8">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto text-brand-gold" />
                        <p className="text-muted-foreground mt-2">Paket uygunluğu kontrol ediliyor...</p>
                    </div>
                ) : (
                    <ListingPackages
                        selectedPackage={formData.listingPackage}
                        onChange={(pkg) => setFormData(prev => ({ ...prev, listingPackage: pkg }))}
                        isFreeEligible={isEligibleForFree ?? false}
                    />
                )}
            </div>

            <div className="glass-card p-8 bg-brand-gold/10 border-brand-gold/20">
                <h3 className="text-xl font-bold mb-4">Özet ve Onay</h3>
                <p className="text-muted-foreground mb-6">
                    İlanınız yayınlanmadan önce editör onayına gönderilecektir.
                    Onay veya ret durumunda size bildirim yapılacaktır.
                </p>
                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || checkingEligibility}
                    className={cn(
                        "w-full py-4 bg-brand-gold text-primary-foreground rounded-2xl font-bold text-lg transition-all shadow-lg shadow-brand-gold/20",
                        (isSubmitting || checkingEligibility)
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:bg-brand-gold/90 hover:scale-[1.02] active:scale-[0.98]"
                    )}
                >
                    {isSubmitting ? "İlan Oluşturuluyor..." : "İlanı Onaya Gönder"}
                </button>
                {errors.submit && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm text-center">
                        {errors.submit}
                    </div>
                )}
            </div>
        </div>
    );

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setErrors({});

        try {
            console.log('[DEBUG] Submitting formData:', JSON.stringify(formData, null, 2));
            console.log('[DEBUG] Category ID being sent:', formData.category);

            // Detailed validation check
            const missingFields = [];
            if (!formData.title) missingFields.push("Başlık");
            if (!formData.price) missingFields.push("Fiyat");
            if (!formData.category) missingFields.push("Kategori");

            if (missingFields.length > 0) {
                console.error('[DEBUG] Missing fields:', missingFields);
                setErrors({ submit: `Lütfen şu alanları doldurunuz: ${missingFields.join(", ")}` });
                setIsSubmitting(false);
                return;
            }

            // 1. Upload Listing Images
            let imageUrls: { url: string; order: number }[] = [];

            // Separate new files and existing URLs
            const newFiles = formData.images.filter(f => f instanceof File) as File[];
            const existingImages = formData.images.filter(f => !(f instanceof File)) as { url: string }[];

            // Upload new files
            if (newFiles.length > 0) {
                const imageFormData = new FormData();
                newFiles.forEach((file) => imageFormData.append('files', file));
                const uploadResult = await uploadListingImages(imageFormData);
                if (!uploadResult.success || !uploadResult.urls) {
                    throw new Error(uploadResult.error || 'İlan resimleri yüklenemedi');
                }

                // Add new URLs
                uploadResult.urls.forEach(url => {
                    imageUrls.push({ url, order: 0 }); // Order will be fixed below
                });
            }

            // Combine with existing images and assign order
            // We need to maintain the order as they appear in formData.images
            const finalImages = formData.images.map((img, index) => {
                if (img instanceof File) {
                    // This was a new file, shift from the uploaded list
                    return { url: imageUrls.shift()!.url, order: index };
                } else {
                    // Existing image
                    return { url: img.url, order: index };
                }
            });

            const submissionData = {
                ...formData,
                images: finalImages,
                // Ensure numeric values
                price: parseInt(formData.price.replace(/\./g, "")),
                km: formData.km ? parseInt(formData.km.replace(/\./g, "")) : null,
                year: formData.vehicle.year ? parseInt(formData.vehicle.year) : null,
                // Map nested objects
                brand: formData.vehicle.brand,
                model: formData.vehicle.model,
                fuel: formData.vehicle.fuel,
                gear: formData.vehicle.gear,
                caseType: formData.vehicle.caseType,
                version: formData.vehicle.version,
                package: formData.vehicle.package,
                // Map equipment
                equipmentIds: formData.equipment,
                // Map damage report
                damageReports: Object.entries(formData.damageReport).map(([part, data]: [string, any]) => ({
                    part,
                    status: data.status,
                    description: data.description
                })),
                categoryId: formData.category === "vasita" ? "cmil7v27a000011zxd9oy9y5p" : formData.category
            };

            let result;
            if (isEditing && listingId) {
                result = await updateListing(listingId, submissionData);
            } else {
                result = await createListing(submissionData);
            }

            if (result.success) {
                localStorage.removeItem("listing_draft"); // Clear draft on success
                router.push("/success");
            } else {
                setErrors({ submit: result.error || "Bir hata oluştu" });
                setIsSubmitting(false);
            }
        } catch (error) {
            console.error("Submit error:", error);
            setErrors({ submit: "İlan oluşturulurken bir hata oluştu." });
            setIsSubmitting(false);
        }
    };


    return (
        <div className="min-h-screen flex flex-col">
            <PageBackground />
            <main className="flex-1 pt-12 pb-12 px-4 relative z-10">
                {/* Progress Bar */}
                <div className="max-w-4xl mx-auto mb-12">
                    <div className="flex items-center justify-between relative">
                        <div className="absolute left-0 top-5 -translate-y-1/2 w-full h-1 bg-white/10 -z-10" />
                        {steps.map((step, index) => {
                            const Icon = step.icon;
                            const isActive = step.id === currentStep;
                            const isCompleted = steps.findIndex(s => s.id === currentStep) > index;

                            return (
                                <div key={step.id} className="flex flex-col items-center gap-2 px-4">
                                    <div className={cn(
                                        "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                                        isActive ? "border-brand-gold bg-brand-gold text-primary-foreground scale-110" :
                                            isCompleted ? "border-brand-gold bg-brand-gold/20 text-brand-gold" :
                                                "border-white/20 bg-black/40 backdrop-blur-md text-muted-foreground"
                                    )}>
                                        {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                                    </div>
                                    <span className={cn(
                                        "text-xs font-medium transition-colors",
                                        isActive ? "text-brand-gold" :
                                            isCompleted ? "text-foreground" : "text-muted-foreground"
                                    )}>
                                        {step.title}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
                {/* Step Content */}
                <div className="transition-all duration-300 ease-in-out">
                    {currentStep === "category" && renderCategoryStep()}
                    {currentStep === "details" && renderDetailsStep()}
                    {currentStep === "condition" && renderConditionStep()}
                    {currentStep === "features" && renderFeaturesStep()}
                    {currentStep === "images" && renderImagesStep()}
                    {currentStep === "preview" && renderPreviewStep()}
                    {currentStep === "finish" && renderFinishStep()}
                </div>

                {/* Navigation Buttons */}
                {currentStep !== "category" && (
                    <div className="max-w-4xl mx-auto mt-12 flex justify-between">
                        <button
                            onClick={handleBack}
                            className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex items-center gap-2"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Geri
                        </button>

                        {currentStep !== "finish" && (
                            <button
                                onClick={handleNext}
                                className="px-8 py-3 rounded-xl bg-brand-gold text-primary-foreground hover:bg-brand-gold/90 transition-colors flex items-center gap-2 font-medium"
                            >
                                Devam Et
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
