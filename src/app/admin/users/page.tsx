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
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-medium text-white">{user.name}</div>
                                                <div className="text-xs text-gray-500">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            {user.role === 'ADMIN' ? (
                                                <Shield className="w-4 h-4 text-red-400" />
                                            ) : user.role === 'CORPORATE_GALLERY' || user.role === 'CORPORATE_DEALER' ? (
                                                <Building2 className="w-4 h-4 text-blue-400" />
                                            ) : (
                                                <User className="w-4 h-4 text-gray-400" />
                                            )}
                                            <span className="text-sm text-gray-300 capitalize">
                                                {user.role.toLowerCase().replace('_', ' ')}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.status === 'ACTIVE'
                                                ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                                                : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                                            }`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-white font-medium">
                                        {user._count.listings}
                                    </td>
                                    <td className="p-4 text-gray-400 text-sm">
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
