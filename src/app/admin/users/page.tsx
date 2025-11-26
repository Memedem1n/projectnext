import prisma from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import { User, Shield, Building2 } from 'lucide-react'

export const revalidate = 0

export default async function AdminUsersPage() {
    const users = await prisma.user.findMany({
        orderBy: {
            createdAt: 'desc'
        },
        include: {
            _count: {
                select: { listings: true }
            }
        }
    })

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-white">Kullanıcı Yönetimi</h1>
                <div className="bg-[#2c2c2c] px-4 py-2 rounded-lg border border-white/10 text-sm text-gray-400">
                    Toplam: <span className="text-white font-bold">{users.length}</span> kullanıcı
                </div>
            </div>

            <div className="bg-[#1c1c1c] border border-white/10 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/10">
                                <th className="p-4 text-sm font-medium text-gray-400">Kullanıcı</th>
                                <th className="p-4 text-sm font-medium text-gray-400">Rol</th>
                                <th className="p-4 text-sm font-medium text-gray-400">Durum</th>
                                <th className="p-4 text-sm font-medium text-gray-400">İlan Sayısı</th>
                                <th className="p-4 text-sm font-medium text-gray-400">Kayıt Tarihi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white font-bold">
                                                {user.name?.charAt(0).toUpperCase() || '?'}
                                            </div>
                                            <div>
                                                <div className="font-medium text-white">{user.name}</div>
                                                {formatDate(user.createdAt)}
                                            </td>
                                        </tr>
                            ))}
                                    </tbody>
                                </table>
                </div>
                </div>
            </div>
            )
}
