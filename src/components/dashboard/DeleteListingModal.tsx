"use client";

import { useState } from "react";
import { X, AlertTriangle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface DeleteListingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (reason: string, details: string) => Promise<void>;
    isDeleting: boolean;
}

const DELETION_REASONS = [
    { id: "SOLD", label: "Ürünü Sahibinden.next üzerinden sattım" },
    { id: "SOLD_ELSEWHERE", label: "Ürünü başka bir platformda sattım" },
    { id: "REMOVED", label: "Satıştan vazgeçtim / İlandan kaldırdım" },
    { id: "FEES_HIGH", label: "İlan ücretlerini yüksek buldum" },
    { id: "OTHER", label: "Diğer" }
];

export function DeleteListingModal({ isOpen, onClose, onConfirm, isDeleting }: DeleteListingModalProps) {
    const [selectedReason, setSelectedReason] = useState<string>("");
    const [details, setDetails] = useState("");

    if (!isOpen) return null;

    const handleConfirm = async () => {
        if (!selectedReason) return;
        await onConfirm(selectedReason, details);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-[#1c1c1c] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
                    <h3 className="text-xl font-bold flex items-center gap-2 text-red-500">
                        <AlertTriangle className="w-5 h-5" />
                        İlanı Sil
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-white/10 transition-colors"
                        disabled={isDeleting}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    <div>
                        <p className="text-lg font-medium mb-2">İlanınızı neden kaldırıyorsunuz?</p>
                        <p className="text-sm text-muted-foreground">
                            Geri bildiriminiz hizmet kalitemizi artırmamıza yardımcı olacaktır.
                        </p>
                    </div>

                    <div className="space-y-3">
                        {DELETION_REASONS.map((reason) => (
                            <label
                                key={reason.id}
                                className={cn(
                                    "flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all",
                                    selectedReason === reason.id
                                        ? "bg-primary/10 border-primary text-primary"
                                        : "bg-white/5 border-white/10 hover:border-white/20"
                                )}
                            >
                                <div className={cn(
                                    "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                                    selectedReason === reason.id ? "border-primary" : "border-muted-foreground"
                                )}>
                                    {selectedReason === reason.id && (
                                        <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                                    )}
                                </div>
                                <input
                                    type="radio"
                                    name="deletion-reason"
                                    value={reason.id}
                                    checked={selectedReason === reason.id}
                                    onChange={(e) => setSelectedReason(e.target.value)}
                                    className="hidden"
                                />
                                <span className="font-medium text-sm">{reason.label}</span>
                            </label>
                        ))}
                    </div>

                    {selectedReason === "OTHER" && (
                        <div className="space-y-2 animate-in slide-in-from-top-2">
                            <label className="text-sm font-medium text-muted-foreground">
                                Detaylar (Opsiyonel)
                            </label>
                            <textarea
                                value={details}
                                onChange={(e) => setDetails(e.target.value)}
                                placeholder="Lütfen sebebini kısaca açıklayınız..."
                                className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-sm focus:border-primary focus:ring-0 min-h-[80px]"
                            />
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/10 bg-white/5 flex gap-3">
                    <button
                        onClick={onClose}
                        disabled={isDeleting}
                        className="flex-1 px-4 py-3 rounded-xl font-medium hover:bg-white/10 transition-colors"
                    >
                        Vazgeç
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={!selectedReason || isDeleting}
                        className={cn(
                            "flex-1 px-4 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all",
                            !selectedReason || isDeleting
                                ? "bg-white/5 text-muted-foreground cursor-not-allowed"
                                : "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20"
                        )}
                    >
                        {isDeleting ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Siliniyor...
                            </>
                        ) : (
                            "İlanı Sil"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
