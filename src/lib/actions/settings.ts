'use server';

import { getSession } from '@/lib/session';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { hashPassword, comparePassword } from '@/lib/password';

export async function updateProfile(formData: FormData) {
    try {
        const session = await getSession();
        if (!session?.id) {
            return { success: false, error: 'Unauthorized' };
        }

        const name = formData.get('name') as string;
        const phone = formData.get('phone') as string;
        const bio = formData.get('bio') as string;
        const avatar = formData.get('avatar') as string;

        await prisma.user.update({
            where: { id: session.id },
            data: {
                name,
                phone,
                bio,
                avatar: avatar || undefined, // Only update if provided
            },
        });

        revalidatePath('/dashboard/settings');
        return { success: true };
    } catch (error) {
        console.error('Error updating profile:', error);
        return { success: false, error: 'Failed to update profile' };
    }
}

import { verifyOtpInternal } from '@/lib/actions/auth-otp';

// ...

export async function changePassword(prevState: any, formData: FormData) {
    try {
        const session = await getSession();
        if (!session?.id || !session?.email) {
            return { success: false, error: 'Unauthorized' };
        }

        const currentPassword = formData.get('currentPassword') as string;
        const newPassword = formData.get('newPassword') as string;
        const confirmPassword = formData.get('confirmPassword') as string;
        const otp = formData.get('otp') as string;

        if (!otp) {
            return { success: false, error: 'Verification code is required' };
        }

        // Verify OTP
        const isOtpValid = await verifyOtpInternal(session.email, otp);
        if (!isOtpValid) {
            return { success: false, error: 'Invalid or expired verification code' };
        }

        if (newPassword !== confirmPassword) {
            return { success: false, error: 'Passwords do not match' };
        }

        if (newPassword.length < 6) {
            return { success: false, error: 'Password must be at least 6 characters' };
        }

        const user = await prisma.user.findUnique({
            where: { id: session.id },
        });

        if (!user || !user.password) {
            return { success: false, error: 'User not found' };
        }

        const isValid = await comparePassword(currentPassword, user.password);
        if (!isValid) {
            return { success: false, error: 'Incorrect current password' };
        }

        const hashedPassword = await hashPassword(newPassword);

        await prisma.user.update({
            where: { id: session.id },
            data: {
                password: hashedPassword,
            },
        });

        return { success: true };
    } catch (error) {
        console.error('Error changing password:', error);
        return { success: false, error: 'Failed to change password' };
    }
}

export async function updateNotifications(preferences: any) {
    try {
        const session = await getSession();
        if (!session?.id) {
            return { success: false, error: 'Unauthorized' };
        }

        await prisma.user.update({
            where: { id: session.id },
            data: {
                notificationPreferences: preferences,
            },
        });

        revalidatePath('/dashboard/settings');
        return { success: true };
    } catch (error) {
        console.error('Error updating notifications:', error);
        return { success: false, error: 'Failed to update notifications' };
    }
}
