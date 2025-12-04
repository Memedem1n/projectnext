'use server'

import { z } from 'zod'
import prisma from '@/lib/prisma'
import { hashPassword, comparePassword } from '@/lib/password'
import { cookies } from 'next/headers'
import { decrypt, encrypt } from '@/lib/auth-edge'
import { revalidatePath } from 'next/cache'

const UpdateProfileSchema = z.object({
    name: z.string().min(2, "İsim en az 2 karakter olmalıdır"),
    phone: z.string().optional(),
    avatar: z.string().optional(),
})

const ChangePasswordSchema = z.object({
    currentPassword: z.string().min(1, "Mevcut şifre gereklidir"),
    newPassword: z.string().min(6, "Yeni şifre en az 6 karakter olmalıdır"),
    confirmPassword: z.string().min(6, "Şifre tekrarı gereklidir"),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Şifreler eşleşmiyor",
    path: ["confirmPassword"],
})

export async function updateProfile(prevState: any, formData: FormData) {
    try {
        const cookieStore = await cookies()
        const sessionCookie = cookieStore.get('session')

        if (!sessionCookie?.value) {
            return { success: false, error: 'Unauthorized' }
        }

        const session = await decrypt(sessionCookie.value)
        if (!session?.id) {
            return { success: false, error: 'Unauthorized' }
        }

        const rawData = {
            name: formData.get('name'),
            phone: formData.get('phone'),
            avatar: formData.get('avatar'),
        }

        const validatedFields = UpdateProfileSchema.safeParse(rawData)

        if (!validatedFields.success) {
            return {
                success: false,
                error: validatedFields.error.flatten().fieldErrors,
            }
        }

        const { name, phone, avatar } = validatedFields.data

        // Fetch current user to check verification status
        const currentUser = await prisma.user.findUnique({
            where: { id: session.id },
            select: { identityVerified: true, phoneVerified: true }
        })

        if (!currentUser) {
            return { success: false, error: 'Kullanıcı bulunamadı' }
        }

        const updateData: any = { avatar }

        // Only allow updating name if not verified
        if (!currentUser.identityVerified) {
            updateData.name = name
        }

        // Only allow updating phone if not verified
        if (!currentUser.phoneVerified) {
            updateData.phone = phone
        }

        const updatedUser = await prisma.user.update({
            where: { id: session.id },
            data: updateData,
        })

        // Update session with new name
        const expires = new Date(Date.now() + 24 * 60 * 60 * 1000)
        const newSession = await encrypt({
            ...session,
            name: updatedUser.name || "",
            expires
        })
        cookieStore.set("session", newSession, { expires, httpOnly: true })

        revalidatePath('/profile')
        return { success: true, message: 'Profil başarıyla güncellendi' }

    } catch (error) {
        console.error('Update profile error:', error)
        return { success: false, error: 'Profil güncellenirken bir hata oluştu' }
    }
}

export async function changePassword(prevState: any, formData: FormData) {
    try {
        const cookieStore = await cookies()
        const sessionCookie = cookieStore.get('session')

        if (!sessionCookie?.value) {
            return { success: false, error: 'Unauthorized' }
        }

        const session = await decrypt(sessionCookie.value)
        if (!session?.id) {
            return { success: false, error: 'Unauthorized' }
        }

        const rawData = Object.fromEntries(formData.entries())
        const validatedFields = ChangePasswordSchema.safeParse(rawData)

        if (!validatedFields.success) {
            return {
                success: false,
                error: validatedFields.error.flatten().fieldErrors,
            }
        }

        const { currentPassword, newPassword } = validatedFields.data

        const user = await prisma.user.findUnique({
            where: { id: session.id },
        })

        if (!user || !user.password) {
            return { success: false, error: 'Kullanıcı bulunamadı' }
        }

        const isPasswordValid = await comparePassword(currentPassword, user.password)

        if (!isPasswordValid) {
            return {
                success: false,
                error: { currentPassword: ['Mevcut şifre hatalı'] }
            }
        }

        const hashedPassword = await hashPassword(newPassword)

        await prisma.user.update({
            where: { id: session.id },
            data: {
                password: hashedPassword,
            },
        })

        return { success: true, message: 'Şifre başarıyla değiştirildi' }

    } catch (error) {
        console.error('Change password error:', error)
        return { success: false, error: 'Şifre değiştirilirken bir hata oluştu' }
    }
}
