import prisma from '@/lib/prisma'
import { Car, Users, Clock, CheckCircle } from 'lucide-react'

export default async function AdminDashboard() {
    const [totalListings, pendingListings, activeListings, totalUsers] = await Promise.all([
        prisma.listing.count({ where: { status: { not: 'DELETED' } } }),
        prisma.listing.count({ where: { status: 'PENDING' } }),
        prisma.listing.count({ where: { status: 'ACTIVE', isActive: true } }),
        prisma.user.count()
    ])

    const stats = [
        {
            name: 'Toplam İlan',
            value: totalListings,
            icon: Car,
            color: 'text-blue-400',
            bg: 'bg-blue-400/10'
        },
        {
            name: 'Onay Bekleyen',
            value: pendingListings,
            icon: Clock,
            color: 'text-yellow-400',
            bg: 'bg-yellow-400/10'
        },
        {
            name: 'Toplam Kullanıcı',
            value: totalUsers,
            icon: Users,
            color: 'text-green-400',
            bg: 'bg-green-400/10'
        },
        {
            name: 'Aktif İlanlar',
            value: activeListings,
            icon: CheckCircle,
            color: 'text-purple-400',
            bg: 'bg-purple-400/10'
        }
    ]

    return (
        <div>
            <h1 className="text-3xl font-bold text-white mb-8">Panel Özeti</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => {
                    const Icon = stat.icon
                    return (
                        <div key={stat.name} className="bg-[#1c1c1c] border border-white/10 rounded-xl p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 rounded-lg ${stat.bg}`}>
                                    <Icon className={`w-6 h-6 ${stat.color}`} />
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                            <div className="text-sm text-gray-400">{stat.name}</div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
