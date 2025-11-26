'use client'

import { useState } from 'react'
import { adminLogin } from '@/lib/actions/admin-auth'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
    const [error, setError] = useState('')
    const router = useRouter()

    async function handleSubmit(formData: FormData) {
        const result = await adminLogin(null, formData)
        if (result.success) {
            router.push('/admin')
        } else {
            setError(result.error || 'Giriş başarısız')
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#1c1c1c]">
            <div className="w-full max-w-md p-8 bg-[#2c2c2c] rounded-xl shadow-2xl border border-white/10">
                <h1 className="text-2xl font-bold text-white mb-6 text-center">Yönetim Girişi</h1>

                {error && (
                    <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-lg mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form action={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Kullanıcı Adı</label>
                        <input
                            type="text"
                            name="username"
                            className="w-full bg-[#1c1c1c] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-gold transition-colors"
                            placeholder="Kullanıcı adı"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Şifre</label>
                        <input
                            type="password"
                            name="password"
                            className="w-full bg-[#1c1c1c] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-gold transition-colors"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-brand-gold hover:bg-brand-gold/90 text-[#1c1917] font-bold py-3 rounded-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                        Giriş Yap
                    </button>
                </form>
            </div>
        </div>
    )
}
