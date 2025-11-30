"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, X, Loader2, AlertCircle } from "lucide-react";
import { approveListing, rejectListing } from "@/lib/actions/admin-listings";
import { cn } from "@/lib/utils";

interface AdminActionBarProps {
    listingId: string;
    currentStatus: string;
}

export function AdminActionBar({ listingId, currentStatus }: AdminActionBarProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isRejecting, setIsRejecting] = useState(false);
    const [rejectionReason, setRejectionReason] = useState("");

    const handleApprove = async () => {
        if (!confirm("Bu ilanı onaylamak istediğinize emin misiniz?")) return;

        setIsLoading(true);
        try {
            const result = await approveListing(listingId);
            if (result.success) {
                toast.success(result.message);
                router.push("/admin/listings?status=pending");
            } else {
                toast.error(result.error);
            }
        } catch (error) {
            toast.error("Bir hata oluştu.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleReject = async () => {
        if (!rejectionReason.trim()) {
            toast.error("Lütfen bir ret nedeni belirtin.");
            return;
        }

        setIsLoading(true);
        try {
            const result = await rejectListing(listingId, rejectionReason);
            if (result.success) {
                toast.success(result.message);
                router.push("/admin/listings?status=pending");
            } else {
                toast.error(result.error);
            }
        } catch (error) {
            toast.error("Bir hata oluştu.");
        } finally {
            setIsLoading(false);
        }
    };

    if (currentStatus !== "PENDING") {
        return null;
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-black/80 backdrop-blur-xl border-t border-white/10">
            <div className="container mx-auto max-w-4xl flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                    <span className="font-medium text-white">Bu ilan onay bekliyor</span>
                </div>

                <div className="flex items-center gap-3">
                    {isRejecting ? (
                        <div className="flex items-center gap-2 animate-in slide-in-from-right">
                            <input
                                type="text"
                                placeholder="Ret nedeni..."
                                className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500/50 w-64"
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                autoFocus
                                onKeyDown={(e) => e.key === "Enter" && handleReject()}
                            />
                            <button
                                onClick={handleReject}
                                disabled={isLoading}
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                            >
                                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
                                Reddet
                            </button>
                            <button
                                onClick={() => setIsRejecting(false)}
                                disabled={isLoading}
                                className="bg-white/5 hover:bg-white/10 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                            >
                                İptal
                            </button>
                        </div>
                    ) : (
                        <>
                            <button
                                onClick={() => setIsRejecting(true)}
                                disabled={isLoading}
                                className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2"
                            >
                                <X className="w-4 h-4" />
                                Reddet
                            </button>
                            <button
                                onClick={handleApprove}
                                disabled={isLoading}
                                className="bg-green-500 hover:bg-green-600 text-white px-8 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-lg shadow-green-500/20"
                            >
                                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                Onayla ve Yayınla
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
