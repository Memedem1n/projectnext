"use client";

import { useState, useEffect } from "react";
import { verifyEmailOTP } from "@/lib/actions/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function VerifyEmailPage() {
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const emailFromQuery = searchParams.get("email");

    const handleChange = (element: HTMLInputElement, index: number) => {
        if (isNaN(Number(element.value))) return false;

        setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

        // Focus next input
        if (element.nextSibling && element.value !== "") {
            (element.nextSibling as HTMLInputElement).focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").slice(0, 6);
        if (!/^\d+$/.test(pastedData)) return;

        const newOtp = [...otp];
        pastedData.split("").forEach((char, index) => {
            if (index < 6) newOtp[index] = char;
        });
        setOtp(newOtp);

        // Focus last filled input or the next empty one
        const nextIndex = Math.min(pastedData.length, 5);
        const inputs = document.querySelectorAll('input[name^="otp-"]');
        if (inputs[nextIndex]) {
            (inputs[nextIndex] as HTMLInputElement).focus();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const code = otp.join("");
        if (code.length !== 6) {
            setError("Lütfen 6 haneli kodu eksiksiz giriniz.");
            setLoading(false);
            return;
        }

        if (!emailFromQuery) {
            setError("Email adresi bulunamadı. Lütfen tekrar giriş yapın.");
            setLoading(false);
            return;
        }

        try {
            const result = await verifyEmailOTP(emailFromQuery, code);
            if (result.success) {
                setSuccess(true);
                setTimeout(() => {
                    router.push("/dashboard");
                }, 2000);
            } else {
                setError(result.error || "Doğrulama başarısız.");
            }
        } catch (err) {
            setError("Bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-4">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 max-w-md w-full text-center">
                {success ? (
                    <div className="space-y-4">
                        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
                        <h1 className="text-2xl font-bold text-white">Doğrulama Başarılı!</h1>
                        <p className="text-white/60">Yönlendiriliyorsunuz...</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <h1 className="text-2xl font-bold text-white">Email Doğrulama</h1>
                            <p className="text-white/60 text-sm">
                                {emailFromQuery ? `${emailFromQuery} adresine` : "Email adresinize"} gönderilen 6 haneli kodu giriniz.
                            </p>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-red-500 text-sm text-left">
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                <p>{error}</p>
                            </div>
                        )}

                        <div className="flex justify-center gap-2">
                            {otp.map((data, index) => (
                                <input
                                    key={index}
                                    name={`otp-${index}`}
                                    type="text"
                                    maxLength={1}
                                    value={data}
                                    onChange={(e) => handleChange(e.target, index)}
                                    onPaste={index === 0 ? handlePaste : undefined}
                                    onKeyDown={(e) => {
                                        if (e.key === "Backspace" && !otp[index] && index > 0) {
                                            // Focus previous input on backspace if current is empty
                                            const inputs = document.querySelectorAll('input[name^="otp-"]');
                                            if (inputs[index - 1]) {
                                                (inputs[index - 1] as HTMLInputElement).focus();
                                            }
                                        }
                                    }}
                                    className="w-10 h-12 text-center text-xl font-bold bg-white/5 border border-white/10 rounded-lg text-white focus:border-primary focus:bg-white/10 focus:outline-none transition-all"
                                />
                            ))}
                        </div>

                        <button
                            type="submit"
                            disabled={loading || otp.join("").length !== 6}
                            className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Doğrulanıyor...
                                </>
                            ) : (
                                "Doğrula"
                            )}
                        </button>

                        <div className="text-sm text-muted-foreground">
                            Kod gelmedi mi?{" "}
                            <button type="button" className="text-primary hover:underline">
                                Tekrar Gönder
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
