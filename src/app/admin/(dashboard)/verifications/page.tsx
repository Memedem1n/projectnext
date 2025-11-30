import prisma from '@/lib/prisma'
import { VerificationTabs } from '@/components/admin/VerificationTabs'

export const revalidate = 0

export default async function AdminVerificationsPage() {
    // Fetch users with pending identity verification
    const identityRequests = await prisma.user.findMany({
        where: {
            identityVerificationStatus: 'PENDING',
            identityDoc: { not: null }
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    // Fetch users with pending corporate verification
    const corporateRequests = await prisma.user.findMany({
        where: {
            corporateVerificationStatus: 'PENDING',
            taxPlateDoc: { not: null }
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-white">Doğrulama Yönetimi</h1>
                <div className="flex gap-4">
                    <div className="bg-[#2c2c2c] px-4 py-2 rounded-lg border border-white/10 text-sm text-gray-400">
                        Kimlik: <span className="text-white font-bold">{identityRequests.length}</span>
                    </div>
                    <div className="bg-[#2c2c2c] px-4 py-2 rounded-lg border border-white/10 text-sm text-gray-400">
                        Kurumsal: <span className="text-white font-bold">{corporateRequests.length}</span>
                    </div>
                </div>
            </div>

            <VerificationTabs
                identityRequests={identityRequests}
                corporateRequests={corporateRequests}
            />
        </div>
    )
}
