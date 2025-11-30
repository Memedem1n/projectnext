import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { VerificationContainer } from '@/components/dashboard/verification/VerificationContainer';

export default async function VerificationPage() {
    const session = await getSession();
    if (!session?.id) {
        redirect('/login');
    }

    const user = await prisma.user.findUnique({
        where: { id: session.id },
        select: {
            id: true,
            role: true,
            phone: true,
            phoneVerified: true,
            identityVerified: true,
            identityVerificationStatus: true,
            corporateVerified: true,
            corporateVerificationStatus: true,
        }
    });

    if (!user) {
        redirect('/login');
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                    Doğrulama Merkezi
                </h1>
                <p className="text-gray-400 mt-2">
                    Hesabınızı doğrulayarak güvenilirliğinizi artırın ve daha fazla özelliğe erişin.
                </p>
            </div>

            <VerificationContainer user={user} />
        </div>
    );
}
