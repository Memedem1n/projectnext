import prisma from '@/lib/prisma'
import { Car, Users, Clock, CheckCircle } from 'lucide-react'

async function getStats() {
    const [totalListings, totalUsers] = await Promise.all([
        prisma.listing.count(),
        prisma.user.count()
    ])

    return {
        totalListings,
        pendingListings: 0, // Placeholder as we don't have status field yet
        totalUsers
    }
}

export default async function AdminDashboard() {
    // We might need to handle the case where 'status' field doesn't exist yet on Listing model
    // For now, let's assume it doesn't and just show total counts
    const totalListings = await prisma.listing.count()
    const totalUsers = await prisma.user.count()

    // Placeholder for pending until we add status field
    const pendingListings = 0

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
            value: totalListings - pendingListings,
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
