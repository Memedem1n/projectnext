'use server';

import { getSession } from '@/lib/session';
import prisma from '@/lib/prisma';
import { randomInt } from 'crypto';

export async function sendPasswordChangeOtp() {
    try {
        const session = await getSession();
        if (!session?.id || !session?.email) {
            return { success: false, error: 'Unauthorized' };
        }

        // Generate 6-digit OTP
        const otp = randomInt(100000, 999999).toString();
        const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

        // Store in VerificationToken
        // Delete existing tokens for this email first
        await prisma.verificationToken.deleteMany({
            where: { email: session.email }
        });

        await prisma.verificationToken.create({
            data: {
                email: session.email,
                token: otp,
                expires,
            }
        });

        // MOCK EMAIL SENDING
        console.log('------------------------------------------------');
        console.log(`[MOCK EMAIL] To: ${session.email}`);
        console.log(`[MOCK EMAIL] Subject: Şifre Değiştirme Doğrulama Kodu`);
        console.log(`[MOCK EMAIL] Code: ${otp}`);
        console.log('------------------------------------------------');

        // Also log to file for easier access during dev
        const fs = require('fs');
        fs.appendFileSync('debug_log.txt', `[OTP] ${session.email}: ${otp}\n`);

        return { success: true };
    } catch (error) {
        console.error('Error sending OTP:', error);
        return { success: false, error: 'Failed to send verification code' };
    }
}

export async function verifyOtpInternal(email: string, code: string) {
    const token = await prisma.verificationToken.findFirst({
        where: {
            email: email,
            token: code,
            expires: { gt: new Date() }
        }
    });

    if (!token) return false;

    // Optional: Delete token after use
    await prisma.verificationToken.delete({
        where: {
            email_token: {
                email: email,
                token: code
            }
        }
    });

    return true;
}
