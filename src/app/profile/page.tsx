import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { decrypt } from '@/lib/auth-edge'
import prisma from '@/lib/prisma'
import ProfileClient from '@/components/profile/ProfileClient'

export default async function ProfilePage() {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('session')

    if (!sessionCookie?.value) {
        redirect('/login')
    }

    const session = await decrypt(sessionCookie.value)
    if (!session?.id) {
        redirect('/login')
    }

    const user = await prisma.user.findUnique({
        where: { id: session.id },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatar: true,
            role: true,
            createdAt: true,
            identityVerified: true,
            phoneVerified: true,
        }
    })

    if (!user) {
        redirect('/login')
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <ProfileClient user={user} />
        </div>
    )
}
