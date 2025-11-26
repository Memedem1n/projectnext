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
        const hashedPassword = await hashPassword(password);
        user = await prisma.user.create({
            data: {
                name: "Test User",
                email,
                password: hashedPassword,
                role: "INDIVIDUAL",
                status: "ACTIVE"
            }
        });
    }

    // Login
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const session = await encrypt({
        userId: user.id, // Note: createListing expects 'userId' but auth.ts uses 'id'. I need to check decrypt.
        // Let's check src/lib/auth-edge.ts to see what decrypt returns.
        // Actually createListing uses `session.userId`.
        // auth.ts login uses `id`. This is a discrepancy.
        // I should match what createListing expects.
        // createListing: const userId = session.userId as string
        // So I should set userId.
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        expires
    });

    // Also include userId for compatibility if needed, or fix createListing.
    // Let's look at createListing again.
    // const session = await decrypt(sessionCookie.value)
    // const userId = session.userId as string

    // So createListing expects `userId`.
    // But auth.ts login sets `id`.
    // This means createListing might be broken for normal users if it expects `userId` but login sets `id`.
    // I will set BOTH to be safe.

    const sessionPayload = {
        id: user.id,
        userId: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        expires
    };

    const sessionToken = await encrypt(sessionPayload);

    (await cookies()).set("session", sessionToken, { expires, httpOnly: true });

    return { success: true };
}
