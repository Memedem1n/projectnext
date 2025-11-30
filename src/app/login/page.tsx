"use client";

import { useState, useEffect, useActionState } from "react";
import { useFormStatus } from "react-dom";
import { login } from "@/lib/actions/auth";
import { PageBackground } from "@/components/layout/PageBackground";
import { Mail, Lock, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { VerificationModal } from "@/components/auth/VerificationModal";

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-bold text-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {pending ? (
                <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Giriş Yapılıyor...
                </>
            ) : (
                <>
                    Giriş Yap
                    <ArrowRight className="w-5 h-5" />
                </>
            )}
        </button>
    );
}

export default function LoginPage() {
    const [state, formAction] = useActionState(login, null);
    const [otpCode, setOtpCode] = useState("");
    const [otpError, setOtpError] = useState("");
    const [otpLoading, setOtpLoading] = useState(false);
    const router = useRouter();

    // Handle 2FA Verification
    const handleVerify2FA = async () => {
        if (!state?.email || !otpCode) return;

        setOtpLoading(true);
        setOtpError("");

        try {
            const { verifyLogin2FA } = await import("@/lib/actions/auth");
            const result = await verifyLogin2FA(state.email, otpCode);

            if (result.success) {
                router.push("/dashboard");
            } else {
                setOtpError(result.error || "Doğrulama başarısız.");
            }
        } catch (error) {
            setOtpError("Bir hata oluştu.");
        } finally {
            setOtpLoading(false);
        }
    };

    useEffect(() => {
        if (state?.success && !state.requires2FA) {
            router.push("/dashboard");
        }
    }, [state, router]);

    // 2FA Form is now handled by VerificationModal
    // if (state?.requires2FA) { ... } removed

    // 2FA Form is now handled by VerificationModal
    // if (state?.requires2FA) { ... } removed

    // ... inside LoginPage ...

    return (
        <div className="min-h-screen flex flex-col">
            <PageBackground />

            <VerificationModal
                isOpen={!!state?.requires2FA}
                onClose={() => {
                    // Handle close
                }}
                email={state?.email || ""}
                onSuccess={() => {
                    router.push("/dashboard");
                }}
            />

            <main className="flex-1 flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-md space-y-8">
                    {/* Header */}
                    <div className="text-center space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight">Tekrar Hoşgeldiniz</h1>
                        <p className="text-muted-foreground">
                            Hesabınıza giriş yaparak ilanlarınızı yönetin
                        </p>
                    </div>

                    {/* Form Card */}
                    <div className="glass-card p-8 border-white/10 bg-black/40 backdrop-blur-xl">
                        <form action={formAction} className="space-y-6">
                            {state?.error && (
                                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500 text-sm">
                                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                    <p>{state.error as string}</p>
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground ml-1">Email Adresi</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                    <input
                                        name="email"
                                        type="email"
                                        placeholder="ornek@email.com"
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between ml-1">
                                    <label className="text-sm font-medium text-muted-foreground">Şifre</label>
                                    <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                                        Şifremi Unuttum?
                                    </Link>
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                    <input
                                        name="password"
                                        type="password"
                                        placeholder="••••••••"
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center space-x-2 ml-1">
                                <input
                                    type="checkbox"
                                    name="rememberMe"
                                    id="rememberMe"
                                    className="w-4 h-4 rounded border-white/10 bg-white/5 text-primary focus:ring-primary focus:ring-offset-0"
                                />
                                <label
                                    htmlFor="rememberMe"
                                    className="text-sm font-medium text-muted-foreground cursor-pointer select-none"
                                >
                                    Beni Hatırla
                                </label>
                            </div>

                            <SubmitButton />
                        </form>

                        <div className="mt-6 text-center text-sm text-muted-foreground">
                            Hesabınız yok mu?{" "}
                            <Link href="/register" className="text-primary font-medium hover:underline">
                                Hemen Kayıt Olun
                            </Link>
                        </div>
                    </div>
                </div >
            </main >
        </div >
    );
}
