"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { register } from "@/lib/actions/auth";
import { PageBackground } from "@/components/layout/PageBackground";
import { Mail, Lock, User, Building2, Store, Phone, MapPin, ArrowRight, Loader2, AlertCircle, CheckCircle2, Calendar } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

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
                    Kayıt Yapılıyor...
                </>
            ) : (
                <>
                    Kayıt Ol
                    <ArrowRight className="w-5 h-5" />
                </>
            )}
        </button>
    );
}

export default function RegisterPage() {
    const [state, formAction] = useFormState(register, null);
    const [accountType, setAccountType] = useState<"individual" | "corporate">("individual");
    const [corporateType, setCorporateType] = useState<"gallery" | "dealer">("gallery");
    const router = useRouter();

    if (state?.success) {
        if (state.isCorporate) {
            // Show success message for corporate (pending approval)
            return (
                <div className="min-h-screen flex flex-col">
                    <PageBackground />
                    <main className="flex-1 flex items-center justify-center px-4">
                        <div className="glass-card p-8 max-w-md w-full text-center space-y-6">
                            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                                <CheckCircle2 className="w-10 h-10 text-green-500" />
                            </div>
                            <h2 className="text-2xl font-bold">Başvurunuz Alındı!</h2>
                            <p className="text-muted-foreground">
                                Kurumsal üyelik başvurunuz başarıyla alınmıştır. Belgeleriniz incelendikten sonra hesabınız aktif edilecektir.
                            </p>
                            <Link href="/login" className="block w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl font-medium transition-colors">
                                Giriş Ekranına Dön
                            </Link>
                        </div>
                    </main>
                </div>
            );
        } else {
            router.push("/dashboard");
        }
    }

    return (
        <div className="min-h-screen flex flex-col">
            <PageBackground />

            <main className="flex-1 flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-2xl space-y-8">
                    {/* Header */}
                    <div className="text-center space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight">Aramıza Katılın</h1>
                        <p className="text-muted-foreground">
                            Binlerce ilan arasında yerinizi alın
                        </p>
                    </div>

                    {/* Account Type Toggle */}
                    <div className="grid grid-cols-2 gap-4 p-1 bg-white/5 rounded-2xl border border-white/10">
                        <button
                            onClick={() => setAccountType("individual")}
                            className={cn(
                                "py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2",
                                accountType === "individual"
                                    ? "bg-primary text-primary-foreground shadow-lg"
                                    : "hover:bg-white/5 text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <User className="w-5 h-5" />
                            Bireysel Üyelik
                        </button>
                        <button
                            onClick={() => setAccountType("corporate")}
                            className={cn(
                                "py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2",
                                accountType === "corporate"
                                    ? "bg-primary text-primary-foreground shadow-lg"
                                    : "hover:bg-white/5 text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <Building2 className="w-5 h-5" />
                            Kurumsal Üyelik
                        </button>
                    </div>

                    {/* Form Card */}
                    <div className="glass-card p-8 border-white/10 bg-black/40 backdrop-blur-xl">
                        <form action={formAction} className="space-y-6">
                            {state?.error && typeof state.error === 'string' && (
                                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500 text-sm">
                                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                    <p>{state.error}</p>
                                </div>
                            )}

                            {/* Hidden Role Field */}
                            <input
                                type="hidden"
                                name="role"
                                value={accountType === "individual" ? "INDIVIDUAL" : (corporateType === "gallery" ? "CORPORATE_GALLERY" : "CORPORATE_DEALER")}
                            />

                            {/* Corporate Type Selection */}
                            {accountType === "corporate" && (
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <label className={cn(
                                        "cursor-pointer border rounded-xl p-4 flex flex-col items-center gap-2 transition-all",
                                        corporateType === "gallery"
                                            ? "border-primary bg-primary/10 text-primary"
                                            : "border-white/10 hover:bg-white/5 text-muted-foreground"
                                    )}>
                                        <input type="radio" name="corporateType" value="gallery" className="hidden" onChange={() => setCorporateType("gallery")} checked={corporateType === "gallery"} />
                                        <Store className="w-6 h-6" />
                                        <span className="font-medium">Galeri / Emlak Ofisi</span>
                                    </label>
                                    <label className={cn(
                                        "cursor-pointer border rounded-xl p-4 flex flex-col items-center gap-2 transition-all",
                                        corporateType === "dealer"
                                            ? "border-primary bg-primary/10 text-primary"
                                            : "border-white/10 hover:bg-white/5 text-muted-foreground"
                                    )}>
                                        <input type="radio" name="corporateType" value="dealer" className="hidden" onChange={() => setCorporateType("dealer")} checked={corporateType === "dealer"} />
                                        <Building2 className="w-6 h-6" />
                                        <span className="font-medium">Yetkili Bayi</span>
                                    </label>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Common Fields */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground ml-1">Ad Soyad</label>
                                    <div className="relative group">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                        <input
                                            name="name"
                                            type="text"
                                            placeholder="Adınız Soyadınız"
                                            required
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
                                        />
                                    </div>
                                </div>

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
                                    <label className="text-sm font-medium text-muted-foreground ml-1">Şifre</label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                        <input
                                            name="password"
                                            type="password"
                                            placeholder="••••••••"
                                            required
                                            minLength={6}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground ml-1">Telefon</label>
                                    <div className="relative group">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                        <input
                                            name="phone"
                                            type="tel"
                                            placeholder="555 555 55 55"
                                            required
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground ml-1">TC Kimlik No</label>
                                    <div className="relative group">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                        <input
                                            name="tcIdentityNo"
                                            type="text"
                                            placeholder="11 haneli TC Kimlik No"
                                            maxLength={11}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground ml-1">Kimlik doğrulama için gereklidir.</p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground ml-1">Doğum Yılı</label>
                                    <div className="relative group">
                                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                        <input
                                            name="birthYear"
                                            type="number"
                                            placeholder="1990"
                                            min="1900"
                                            max={new Date().getFullYear() - 18}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground ml-1">Kimlik doğrulama için gereklidir.</p>
                                </div>
                            </div>

                            {/* Corporate Specific Fields */}
                            {accountType === "corporate" && (
                                <div className="space-y-6 pt-6 border-t border-white/10">
                                    <h3 className="text-lg font-bold flex items-center gap-2">
                                        <Store className="w-5 h-5 text-primary" />
                                        Mağaza Bilgileri
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-muted-foreground ml-1">Mağaza Adı</label>
                                            <input
                                                name="storeName"
                                                type="text"
                                                placeholder="Örn: Barut Otomotiv"
                                                required
                                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-muted-foreground ml-1">Vergi Numarası</label>
                                            <input
                                                name="taxNumber"
                                                type="text"
                                                placeholder="Vergi No"
                                                required
                                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-muted-foreground ml-1">Şehir</label>
                                            <div className="relative group">
                                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                                <input
                                                    name="city"
                                                    type="text"
                                                    placeholder="İstanbul"
                                                    required
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-muted-foreground ml-1">İlçe</label>
                                            <input
                                                name="district"
                                                type="text"
                                                placeholder="Kadıköy"
                                                required
                                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
                                            />
                                        </div>
                                    </div>

                                    {/* Document Upload */}
                                    <div className="space-y-2 pt-4 border-t border-white/10">
                                        <label className="text-sm font-medium text-muted-foreground ml-1">Yetki Belgesi / Vergi Levhası</label>
                                        <label htmlFor="document-upload" className="block border-2 border-dashed border-white/10 rounded-xl p-6 text-center hover:bg-white/5 transition-colors cursor-pointer">
                                            <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                                <Building2 className="w-8 h-8 opacity-50" />
                                                <span className="text-sm">Belge yüklemek için tıklayın veya sürükleyin</span>
                                                <span className="text-xs opacity-50">(PDF, JPG, PNG - Max 5MB)</span>
                                            </div>
                                        </label>
                                        <input
                                            type="file"
                                            id="document-upload"
                                            name="document"
                                            className="hidden"
                                            accept=".pdf,.jpg,.jpeg,.png"
                                        />
                                        <p className="text-xs text-muted-foreground ml-1">Kurumsal üyelik onayı için gerekli belgeleri yükleyiniz.</p>
                                    </div>
                                </div>
                            )}

                            <SubmitButton />
                        </form>

                        <div className="mt-6 text-center text-sm text-muted-foreground">
                            Zaten hesabınız var mı?{" "}
                            <Link href="/login" className="text-primary font-medium hover:underline">
                                Giriş Yapın
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
