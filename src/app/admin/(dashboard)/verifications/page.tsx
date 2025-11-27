import prisma from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import { ShieldCheck, CheckCircle, XCircle, User as UserIcon } from 'lucide-react'
import { verifyUserIdentity, rejectUserIdentity } from '@/lib/actions/admin-actions'
import Link from 'next/link'

export const revalidate = 0

async function VerifyButton({ userId }: { userId: string }) {
    async function handleVerify() {
        'use server'
        await verifyUserIdentity(userId)
    }

    return (
        <form action={handleVerify}>
            <button
                type="submit"
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
            >
                <CheckCircle className="w-4 h-4" />
                Doğrula
            </button>
        </form>
    )
}

async function RejectButton({ userId }: { userId: string }) {
    async function handleReject() {
        'use server'
        await rejectUserIdentity(userId)
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

export default async function AdminVerificationsPage() {
    // Fetch users with pending identity verification (has doc but not verified)
    const pendingUsers = await prisma.user.findMany({
        where: {
            identityDoc: { not: null },
            identityVerified: false,
            role: 'INDIVIDUAL'
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-white">Kimlik Doğrulama Yönetimi</h1>
                <div className="bg-[#2c2c2c] px-4 py-2 rounded-lg border border-white/10 text-sm text-gray-400">
                    Bekleyen: <span className="text-white font-bold">{pendingUsers.length}</span> kişi
                </div>
            </div>

            {pendingUsers.length === 0 ? (
                <div className="bg-[#1c1c1c] border border-white/10 rounded-xl p-12 text-center">
                    <ShieldCheck className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg">Şu anda bekleyen kimlik doğrulama talebi bulunmuyor.</p>
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
                                        <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500 font-bold text-lg">
                                            <UserIcon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-white text-lg">{user.name || 'İsimsiz'}</div>
                                            <div className="text-sm text-gray-500">{user.email}</div>
                                            {user.tcIdentityNo && (
                                                <div className="text-xs text-gray-400 mt-1">TC: {user.tcIdentityNo}</div>
                                            )}
                                        </div>
                                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                            Bireysel
                                        </span>
                                    </div>

                                    {/* Document Link */}
                                    {user.identityDoc && (
                                        <div className="flex items-center gap-2 pt-2 border-t border-white/10 mt-4">
                                            <ShieldCheck className="w-4 h-4 text-gray-500" />
                                            <Link
                                                href={user.identityDoc}
                                                target="_blank"
                                                className="text-sm text-primary hover:underline"
                                            >
                                                Kimlik Fotoğrafını Görüntüle
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
                                    <VerifyButton userId={user.id} />
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
