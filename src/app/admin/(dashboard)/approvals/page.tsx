import prisma from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import { Building2, CheckCircle, XCircle } from 'lucide-react'
import { approveCorporateAccount, rejectCorporateAccount } from '@/lib/actions/admin-actions'
import Link from 'next/link'

export const revalidate = 0

async function ApproveButton({ userId }: { userId: string }) {
    async function handleApprove() {
        'use server'
        await approveCorporateAccount(userId)
    }

    return (
        <form action={handleApprove}>
            <button
                type="submit"
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
            >
                <CheckCircle className="w-4 h-4" />
                Onayla
            </button>
        </form>
    )
}

async function RejectButton({ userId }: { userId: string }) {
    async function handleReject() {
        'use server'
        await rejectCorporateAccount(userId)
    }

    return (
        <form action={handleReject}>
            <button
                type="submit"
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
            >
                <XCircle className="w-4 h-4" />
                Reddet
            </button>
        </form>
    )
}

export default async function AdminApprovalsPage() {
    const pendingUsers = await prisma.user.findMany({
        where: {
            status: 'PENDING',
            role: {
                in: ['CORPORATE_GALLERY', 'CORPORATE_DEALER']
            }
        },
        include: {
            dealerProfile: true,
            _count: {
                select: { listings: true }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-white">Kurumsal Hesap Onayları</h1>
                <div className="bg-[#2c2c2c] px-4 py-2 rounded-lg border border-white/10 text-sm text-gray-400">
                    Bekleyen: <span className="text-white font-bold">{pendingUsers.length}</span> başvuru
                </div>
            </div>

            {pendingUsers.length === 0 ? (
                <div className="bg-[#1c1c1c] border border-white/10 rounded-xl p-12 text-center">
                    <Building2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg">Şu anda bekleyen kurumsal başvuru bulunmuyor.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {pendingUsers.map((user) => (
                        <div
                            key={user.id}
                            className="bg-[#1c1c1c] border border-white/10 rounded-xl p-6 hover:border-white/20 transition-colors"
                        >
                            <div className="flex items-start justify-between gap-6">
                                <div className="flex-1 space-y-4">
                                    {/* User Info */}
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg">
                                            {user.name?.charAt(0).toUpperCase() || '?'}
                                        </div>
                                        <div>
                                            <div className="font-medium text-white text-lg">{user.name || 'İsimsiz'}</div>
                                            <div className="text-sm text-gray-500">{user.email}</div>
                                            {user.tcIdentityNo && (
                                                <div className="text-xs text-gray-400 mt-1">TC: {user.tcIdentityNo}</div>
                                            )}
                                        </div>
                                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                                            {user.role === 'CORPORATE_GALLERY' ? 'Galeri' : 'Bayi'}
                                        </span>
                                    </div>

                                    {/* Dealer Profile Info */}
                                    {user.dealerProfile && (
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-white/10">
                                            <div>
                                                <div className="text-xs text-gray-500 mb-1">Mağaza Adı</div>
                                                <div className="text-sm text-white font-medium">{user.dealerProfile.storeName}</div>
                                            </div>
                                            <div>
                                                <div className="text-xs text-gray-500 mb-1">Telefon</div>
                                                <div className="text-sm text-white font-medium">{user.dealerProfile.phone}</div>
                                            </div>
                                            <div>
                                                <div className="text-xs text-gray-500 mb-1">Lokasyon</div>
                                                <div className="text-sm text-white font-medium">
                                                    {user.dealerProfile.city} / {user.dealerProfile.district}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-xs text-gray-500 mb-1">Vergi No</div>
                                                <div className="text-sm text-white font-medium">
                                                    {user.dealerProfile.taxNumber || 'Belirtilmemiş'}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Document Link */}
                                    {user.dealerProfile?.taxPlateDoc && (
                                        <div className="flex items-center gap-2 pt-2">
                                            <Building2 className="w-4 h-4 text-gray-500" />
                                            <Link
                                                href={user.dealerProfile.taxPlateDoc}
                                                target="_blank"
                                                className="text-sm text-primary hover:underline"
                                            >
                                                Yetki Belgesi / Vergi Levhası Görüntüle
                                            </Link>
                                        </div>
                                    )}

                                    {/* Registration Date */}
                                    <div className="text-xs text-gray-500">
                                        Kayıt Tarihi: {formatDate(user.createdAt)}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2">
                                    <ApproveButton userId={user.id} />
                                    <RejectButton userId={user.id} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
