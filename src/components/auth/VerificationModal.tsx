"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Loader2, ArrowRight, Lock, AlertCircle, Mail } from "lucide-react";
import { useRouter } from "next/navigation";

interface VerificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    email: string;
    onSuccess?: (code?: string) => void;
    isPreRegister?: boolean;
}

export function VerificationModal({ isOpen, onClose, email, onSuccess, isPreRegister = false }: VerificationModalProps) {
    const [otpCode, setOtpCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleVerify = async () => {
        if (!otpCode || otpCode.length < 6) return;

        setLoading(true);
        setError("");

        try {
            let result;

            if (isPreRegister) {
                const { verifyPreRegisterOTP } = await import("@/lib/actions/auth");
                result = await verifyPreRegisterOTP(email, otpCode);
            } else {
                const { verifyLogin2FA } = await import("@/lib/actions/auth");
                result = await verifyLogin2FA(email, otpCode);
            }

            if (result.success) {
                if (onSuccess) {
                    onSuccess(otpCode); // Pass the code back for pre-register
                } else {
                    router.push("/dashboard");
                }
                onClose();
            } else {
                setError(result.error || "Doğrulama başarısız.");
            }
        } catch (err) {
            setError("Bir hata oluştu. Lütfen tekrar deneyin.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} showCloseButton={true}>
            <div className="space-y-6 text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-primary" />
                </div>

                <div className="space-y-2">
                    <h2 className="text-2xl font-bold">Email Doğrulama</h2>
                    <p className="text-muted-foreground text-sm">
                        Güvenliğiniz için <strong>{email}</strong> adresine gönderdiğimiz 6 haneli kodu giriniz.
                    </p>
                </div>

                {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-red-500 text-sm text-left">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <p>{error}</p>
                    </div>
                )}

                <div className="space-y-4">
                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            value={otpCode}
                            onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            placeholder="123456"
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all text-center tracking-[0.5em] text-xl font-mono"
                            maxLength={6}
                        />
                    </div>

                    <button
                        onClick={handleVerify}
                        disabled={loading || otpCode.length < 6}
                        className="w-full py-3.5 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Doğrulanıyor...
                            </>
                        ) : (
                            <>
                                Doğrula ve Devam Et
                                <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>
                </div>

                <p className="text-xs text-muted-foreground">
                    Kod gelmedi mi? <button className="text-primary hover:underline">Tekrar Gönder</button>
                </p>
            </div>
        </Modal>
    );
}
