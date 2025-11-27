'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Car, Users, LogOut, ShieldCheck, CheckCircle } from 'lucide-react'
import { adminLogout } from '@/lib/actions/admin-auth'
import { cn } from '@/lib/utils'

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()

    const navigation = [
        { name: 'Panel', href: '/', icon: LayoutDashboard },
        { name: 'İlanlar', href: '/listings', icon: Car },
        { name: 'Kullanıcılar', href: '/users', icon: Users },
        { name: 'Doğrulamalar', href: '/verifications', icon: ShieldCheck },
        { name: 'Kurumsal Onaylar', href: '/approvals', icon: CheckCircle },
    ]

    return (
        <div className="min-h-screen bg-[#121212] flex">
            {/* Sidebar */}
            <div className="w-64 bg-[#1c1c1c] border-r border-white/10 flex flex-col">
                <div className="p-6 border-b border-white/10">
                    <h1 className="text-xl font-bold text-brand-gold">Admin Panel</h1>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {navigation.map((item) => {
                        const Icon = item.icon
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                                    isActive
                                        ? "bg-brand-gold/20 text-brand-gold"
                                        : "text-gray-400 hover:bg-white/5 hover:text-white"
                                )}
                            >
                                <Icon className="w-5 h-5" />
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-4 border-t border-white/10">
                    <button
                        onClick={() => adminLogout()}
                        className="flex items-center gap-3 px-4 py-3 w-full text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Çıkış Yap</span>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                <div className="p-8">
                    {children}
                </div>
            </div>
        </div>
    )
}
