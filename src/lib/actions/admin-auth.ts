'use server'

import { cookies } from 'next/headers'
import { encrypt } from '@/lib/auth-edge'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import { hashPassword } from '@/lib/password'

const ADMIN_USERNAME = 'Emin'
const ADMIN_PASSWORD = '417677Meb.'

export async function adminLogin(prevState: any, formData: FormData) {
    const username = formData.get('username') as string
    const password = formData.get('password') as string

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        // Create session
        const expires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
        const session = await encrypt({ user: 'admin', role: 'admin', expires })

        const cookieStore = await cookies()
        cookieStore.set('admin_session', session, {
            expires,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
        })

        return { success: true }
    }

    return { success: false, error: 'Hatalı kullanıcı adı veya şifre' }
}

export async function adminLogout() {
    const cookieStore = await cookies()
    cookieStore.delete('admin_session')
    redirect('/')
}

export async function createTestUserAndLogin() {
    const email = "test@example.com";
    const password = "password123";

    // Check if user exists
    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        user = await prisma.user.create({
            data: {
                name: "Test User",
                email,
            }
        });
    }

    // Login
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const sessionPayload = {
        id: user.id,
        userId: user.id,
        email: user.email,
        name: user.name,
        expires
    };

    const sessionToken = await encrypt(sessionPayload);

    (await cookies()).set("session", sessionToken, { expires, httpOnly: true });

    return { success: true };
}
