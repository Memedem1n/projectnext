'use server'

import { cookies } from 'next/headers'
import { decrypt } from '@/lib/auth-edge'
import { prisma } from '@/lib/prisma'

export async function getCurrentUser() {
    try {
        const cookieStore = await cookies()
        const sessionCookie = cookieStore.get('session')

        if (!sessionCookie) return null

        const session = await decrypt(sessionCookie.value)
        if (!session?.id) return null

        const user = await prisma.user.findUnique({
            where: { id: session.id as string },
            select: {
                id: true,
                role: true,
                name: true,
                email: true,
                phone: true
            }
        })

        return user
    } catch (error) {
        console.error('Error getting current user:', error)
        return null
    }
}
