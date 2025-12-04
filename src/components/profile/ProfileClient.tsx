'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { User, Shield, Bell, Camera, Loader2, ChevronRight, Mail, Phone, Lock, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { updateProfile, changePassword } from '@/lib/actions/profile'
import { logout } from '@/lib/actions/auth'

interface ProfileClientProps {
    user: {
        id: string
        name: string | null
        email: string
        phone: string | null
        avatar: string | null
        role: string | null
        createdAt: Date
        identityVerified: boolean
        phoneVerified: boolean
    }
}

type Tab = 'general' | 'security' | 'notifications'

export default function ProfileClient({ user }: ProfileClientProps) {
    const router = useRouter()
    const [activeTab, setActiveTab] = useState<Tab>('general')
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    async function handleUpdateProfile(formData: FormData) {
        setIsLoading(true)
        setMessage(null)

        const result = await updateProfile(null, formData)

        if (result.success) {
            setMessage({ type: 'success', text: result.message || 'Profil başarıyla güncellendi' })
            router.refresh()
        } else {
            setMessage({ type: 'error', text: typeof result.error === 'string' ? result.error : 'Bir hata oluştu' })
        }

        setIsLoading(false)
    }

    async function handleChangePassword(formData: FormData) {
        setIsLoading(true)
        setMessage(null)

        const result = await changePassword(null, formData)

        if (result.success) {
            setMessage({ type: 'success', text: result.message || 'Şifre başarıyla değiştirildi' })
            const form = document.getElementById('password-form') as HTMLFormElement
            form?.reset()
        } else {
            const errorText = typeof result.error === 'string'
                ? result.error
                : Object.values(result.error || {}).flat().join(', ') || 'Bir hata oluştu'
            setMessage({ type: 'error', text: errorText })
        }

        setIsLoading(false)
    }

    async function handleAvatarChange(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0]
        if (!file) return

        setIsLoading(true)
        setMessage(null)

        try {
            const formData = new FormData()
            formData.append('file', file)

            const uploadRes = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            })

            if (!uploadRes.ok) throw new Error('Fotoğraf yüklenemedi')

            const { url } = await uploadRes.json()

            // Update profile with new avatar URL
            const profileFormData = new FormData()
            profileFormData.append('avatar', url)
            // Include name and phone to satisfy Zod schema validation
            if (user.name) profileFormData.append('name', user.name)
            if (user.phone) profileFormData.append('phone', user.phone)

            const result = await updateProfile(null, profileFormData)

            if (result.success) {
                setMessage({ type: 'success', text: 'Profil fotoğrafı güncellendi' })
                router.refresh()
            } else {
                throw new Error(typeof result.error === 'string' ? result.error : 'Profil güncellenemedi')
            }
        } catch (error) {
            setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Bir hata oluştu' })
        } finally {
            setIsLoading(false)
        }
    }

    const tabs = [
        { id: 'general', label: 'Genel Bilgiler', icon: User, description: 'Kişisel bilgilerinizi yönetin' },
        { id: 'security', label: 'Güvenlik', icon: Shield, description: 'Şifre ve güvenlik ayarları' },
        { id: 'notifications', label: 'Bildirimler', icon: Bell, description: 'Bildirim tercihlerinizi yapılandırın' },
    ]

    return (
        <div className="max-w-6xl mx-auto pb-12">
            {/* Header Section */}
            <div className="relative mb-8 rounded-3xl overflow-hidden bg-gradient-to-r from-orange-900/40 to-black border border-white/10 p-8 md:p-12">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                    <div className="relative group">
                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white/10 overflow-hidden bg-black/40 shadow-2xl relative">
                            {user.avatar ? (
                                <img src={user.avatar} alt={user.name || ''} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-brand-gold/20 text-brand-gold text-4xl font-bold">
                                    {user.name?.charAt(0).toUpperCase()}
                                </div>
                            )}
                            {isLoading && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                    <Loader2 className="w-8 h-8 text-brand-gold animate-spin" />
                                </div>
                            )}
                        </div>
                        <label className="absolute bottom-2 right-2 p-2 bg-brand-gold text-black rounded-full shadow-lg hover:bg-white transition-colors cursor-pointer">
                            <Camera className="w-4 h-4" />
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={handleAvatarChange}
                                disabled={isLoading}
                            />
                        </label>
                    </div>

                    <div className="text-center md:text-left space-y-2">
                        <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">{user.name}</h1>
                        <div className="flex items-center justify-center md:justify-start gap-3 text-muted-foreground">
                            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium uppercase tracking-wider">
                                {user.role === 'INDIVIDUAL' ? 'Bireysel Üye' : 'Kurumsal Üye'}
                            </span>
                            <span className="text-sm">
                                Üyelik Tarihi: {new Date(user.createdAt).toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Sidebar Navigation */}
                <div className="lg:col-span-3 space-y-4">
                    <div className="glass-card p-2 space-y-1">
                        {tabs.map((tab) => {
                            const Icon = tab.icon
                            const isActive = activeTab === tab.id
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as Tab)}
                                    className={cn(
                                        "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative overflow-hidden",
                                        isActive
                                            ? "bg-brand-gold text-black shadow-lg shadow-brand-gold/20"
                                            : "hover:bg-white/5 text-muted-foreground hover:text-white"
                                    )}
                                >
                                    <Icon className={cn("w-5 h-5", isActive ? "text-black" : "text-muted-foreground group-hover:text-white")} />
                                    <span className="flex-1 text-left">{tab.label}</span>
                                    {isActive && <ChevronRight className="w-4 h-4 opacity-50" />}
                                </button>
                            )
                        })}
                    </div>

                    <form action={logout}>
                        <button className="w-full flex items-center gap-3 px-6 py-4 rounded-2xl border border-red-500/20 bg-red-500/5 text-red-500 hover:bg-red-500/10 transition-colors font-medium text-sm group">
                            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            Çıkış Yap
                        </button>
                    </form>
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-9">
                    <div className="glass-card p-8 min-h-[500px]">
                        <div className="mb-8 pb-6 border-b border-white/10">
                            <h2 className="text-2xl font-bold text-white mb-2">
                                {tabs.find(t => t.id === activeTab)?.label}
                            </h2>
                            <p className="text-muted-foreground">
                                {tabs.find(t => t.id === activeTab)?.description}
                            </p>
                        </div>

                        {message && (
                            <div className={cn(
                                "mb-8 p-4 rounded-xl text-sm font-medium flex items-center gap-3 animate-in fade-in slide-in-from-top-2",
                                message.type === 'success'
                                    ? "bg-green-500/10 text-green-400 border border-green-500/20"
                                    : "bg-red-500/10 text-red-400 border border-red-500/20"
                            )}>
                                {message.type === 'success' ? <Shield className="w-5 h-5" /> : <Loader2 className="w-5 h-5" />}
                                {message.text}
                            </div>
                        )}

                        {activeTab === 'general' && (
                            <form action={handleUpdateProfile} className="space-y-8 max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-muted-foreground ml-1">Ad Soyad</label>
                                        <div className="relative group">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-brand-gold transition-colors" />
                                            <input
                                                type="text"
                                                name="name"
                                                defaultValue={user.name || ''}
                                                disabled={user.identityVerified}
                                                className={cn(
                                                    "w-full pl-12 pr-4 py-3 bg-black/20 border border-white/10 rounded-xl focus:outline-none focus:border-brand-gold/50 focus:bg-black/40 transition-all text-white placeholder:text-white/20",
                                                    user.identityVerified && "opacity-50 cursor-not-allowed bg-white/5"
                                                )}
                                                placeholder="Adınız Soyadınız"
                                            />
                                            {user.identityVerified && (
                                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-green-500 bg-green-500/10 px-2 py-1 rounded-full flex items-center gap-1">
                                                    <Shield className="w-3 h-3" />
                                                    Doğrulanmış
                                                </span>
                                            )}
                                        </div>
                                        {user.identityVerified && (
                                            <p className="text-xs text-muted-foreground ml-1">Kimlik doğrulandığı için isim değiştirilemez.</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-muted-foreground ml-1">Telefon</label>
                                        <div className="relative group">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-brand-gold transition-colors" />
                                            <input
                                                type="tel"
                                                name="phone"
                                                defaultValue={user.phone || ''}
                                                disabled={user.phoneVerified}
                                                className={cn(
                                                    "w-full pl-12 pr-4 py-3 bg-black/20 border border-white/10 rounded-xl focus:outline-none focus:border-brand-gold/50 focus:bg-black/40 transition-all text-white placeholder:text-white/20",
                                                    user.phoneVerified && "opacity-50 cursor-not-allowed bg-white/5"
                                                )}
                                                placeholder="05XX XXX XX XX"
                                            />
                                            {user.phoneVerified && (
                                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-green-500 bg-green-500/10 px-2 py-1 rounded-full flex items-center gap-1">
                                                    <Shield className="w-3 h-3" />
                                                    Doğrulanmış
                                                </span>
                                            )}
                                        </div>
                                        {user.phoneVerified && (
                                            <p className="text-xs text-muted-foreground ml-1">Telefon doğrulandığı için değiştirilemez.</p>
                                        )}
                                    </div>

                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-sm font-medium text-muted-foreground ml-1">E-posta Adresi</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                            <input
                                                type="email"
                                                defaultValue={user.email}
                                                disabled
                                                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/5 rounded-xl text-muted-foreground cursor-not-allowed"
                                            />
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-green-500 bg-green-500/10 px-2 py-1 rounded-full flex items-center gap-1">
                                                <Shield className="w-3 h-3" />
                                                Doğrulanmış
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="px-8 py-3 bg-brand-gold text-black rounded-xl font-bold hover:bg-white hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center gap-2 shadow-lg shadow-brand-gold/20"
                                    >
                                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Değişiklikleri Kaydet'}
                                    </button>
                                </div>
                            </form>
                        )}

                        {activeTab === 'security' && (
                            <form id="password-form" action={handleChangePassword} className="space-y-8 max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-muted-foreground ml-1">Mevcut Şifre</label>
                                        <div className="relative group">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-brand-gold transition-colors" />
                                            <input
                                                type="password"
                                                name="currentPassword"
                                                className="w-full pl-12 pr-4 py-3 bg-black/20 border border-white/10 rounded-xl focus:outline-none focus:border-brand-gold/50 focus:bg-black/40 transition-all text-white"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-muted-foreground ml-1">Yeni Şifre</label>
                                            <div className="relative group">
                                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-brand-gold transition-colors" />
                                                <input
                                                    type="password"
                                                    name="newPassword"
                                                    className="w-full pl-12 pr-4 py-3 bg-black/20 border border-white/10 rounded-xl focus:outline-none focus:border-brand-gold/50 focus:bg-black/40 transition-all text-white"
                                                    placeholder="En az 6 karakter"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-muted-foreground ml-1">Yeni Şifre (Tekrar)</label>
                                            <div className="relative group">
                                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-brand-gold transition-colors" />
                                                <input
                                                    type="password"
                                                    name="confirmPassword"
                                                    className="w-full pl-12 pr-4 py-3 bg-black/20 border border-white/10 rounded-xl focus:outline-none focus:border-brand-gold/50 focus:bg-black/40 transition-all text-white"
                                                    placeholder="Şifrenizi doğrulayın"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="px-8 py-3 bg-white/10 text-white border border-white/10 rounded-xl font-bold hover:bg-brand-gold hover:text-black hover:border-brand-gold transition-all disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Şifreyi Güncelle'}
                                    </button>
                                </div>
                            </form>
                        )}

                        {activeTab === 'notifications' && (
                            <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in-95 duration-500">
                                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                                    <Bell className="w-10 h-10 text-muted-foreground" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Bildirim Ayarları</h3>
                                <p className="text-muted-foreground max-w-md">
                                    Çok yakında e-posta ve SMS bildirimlerinizi buradan yönetebileceksiniz.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
