import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { VerificationCenter } from "@/components/dashboard/VerificationCenter";

export default async function VerificationPage() {
    const session = await getSession();

    if (!session) {
        redirect("/login");
    }

    const user = await prisma.user.findUnique({
        where: { id: session.id as string },
        include: {
            badges: true,
            identityVerification: true,
            badgeRequests: {
                orderBy: { createdAt: 'desc' },
                take: 1
            }
        }
    });

    if (!user) {
        redirect("/login");
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-white">Doğrulama Merkezi</h1>
                <p className="text-white/60">Hesap güvenliğinizi artırın ve Onaylı Satıcı rozeti kazanın.</p>
            </div>

            <VerificationCenter user={{
                id: user.id,
                phone: user.phone,
                phoneVerified: user.phoneVerified,
                identityVerified: user.identityVerified,
                tcIdentityNo: user.tcIdentityNo,
                badges: user.badges,
                identityVerification: user.identityVerification,
                badgeRequests: user.badgeRequests
            }} />
        </div>
    );
}
