"use client"

import { useState } from "react"
import { updateUserProfile } from "@/lib/actions/user"
import { User, Phone, Save, AlertCircle, Check } from "lucide-react"
import { cn } from "@/lib/utils"

export function SettingsTab() {
    const [formData, setFormData] = useState({
        name: "",
        phone: ""
    })
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setSuccess(false)

        const result = await updateUserProfile(formData)

        if (result.success) {
            setSuccess(true)
            setTimeout(() => setSuccess(false), 3000)
        } else {
            setError(result.error || "Profil güncellenemedi")
        }

        setLoading(false)
    }

    return (
        <div className="max-w-2xl">
            <div className="glass-card p-8">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <User className="w-6 h-6 text-brand-gold" />
                    Profil Bilgileri
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Ad Soyad</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-black/20 border border-white/10 rounded-xl p-4 focus:border-brand-gold focus:ring-0 transition-colors"
                            placeholder="Ad Soyad"
                        />
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Telefon</label>
                        <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full bg-black/20 border border-white/10 rounded-xl pl-12 pr-4 py-4 focus:border-brand-gold focus:ring-0 transition-colors"
                                placeholder="5XX XXX XX XX"
                            />
                        </div>
                    </div>

                    {/* Error/Success Messages */}
                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-red-500">
                            <AlertCircle className="w-5 h-5" />
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-2 text-green-500">
                            <Check className="w-5 h-5" />
                            Profil başarıyla güncellendi
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={cn(
                            "w-full py-3 px-6 bg-brand-gold text-primary-foreground rounded-xl font-medium transition-all flex items-center justify-center gap-2",
                            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-brand-gold/90"
                        )}
                    >
                        <Save className="w-5 h-5" />
                        {loading ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
                    </button>
                </form>
            </div>

            {/* Password Change Section */}
            <div className="glass-card p-8 mt-6">
                <h2 className="text-xl font-bold mb-4">Şifre Değiştir</h2>
                <p className="text-muted-foreground mb-4">
                    Şifrenizi değiştirmek için lütfen destek ekibi ile iletişime geçin.
                </p>
                <button className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-medium transition-colors">
                    Destek Talebi Oluştur
                </button>
            </div>
        </div>
    )
}
