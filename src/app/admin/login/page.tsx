'use client'

import { useState } from 'react'
import { adminLogin } from '@/lib/actions/admin-auth'
import { useRouter } from 'next/navigation'

import { PageBackground } from '@/components/layout/PageBackground'

export default function AdminLoginPage() {
    const [error, setError] = useState('')
    const router = useRouter()

    async function handleSubmit(formData: FormData) {
        const result = await adminLogin(null, formData)
        if (result.success) {
            router.push('/') // Redirect to root, which maps to /admin on subdomain
        } else {
            setError(result.error || 'Giriş başarısız')
        }
    }

    return (
        <div className="min-h-screen flex flex-col">
            <PageBackground />

            <main className="flex-1 flex items-center justify-center px-4">
                <div className="glass-card p-8 max-w-md w-full border-white/10">
                    <h1 className="text-2xl font-bold text-white mb-6 text-center">Yönetim Girişi</h1>

                    {error && (
                        <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-lg mb-4 text-sm">
                            {error}
                        </div>
                    )}

                    <form action={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-1">Kullanıcı Adı</label>
                            <input
                                type="text"
                                name="username"
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
                                placeholder="Kullanıcı adı"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-1">Şifre</label>
                            <input
                                type="password"
                                name="password"
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                        >
                            Giriş Yap
                        </button>
                    </form>
                </div>
            </main>
        </div>
    )
}
