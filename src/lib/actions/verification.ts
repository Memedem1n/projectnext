'use server';

import { getSession } from '@/lib/session';
import prisma from '@/lib/prisma';
import { randomInt } from 'crypto';
import { revalidatePath } from 'next/cache';

// --- Phone Verification ---

export async function sendPhoneOtp(phone: string) {
    try {
        const session = await getSession();
        if (!session?.id) {
            return { success: false, error: 'Unauthorized' };
        }

        // Basic phone validation
        const cleanPhone = phone.replace(/\D/g, '');
        if (cleanPhone.length < 10) {
            return { success: false, error: 'Geçersiz telefon numarası' };
        }

        // Generate 6-digit OTP
        const otp = randomInt(100000, 999999).toString();
        const expires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

        // Store in PhoneVerificationToken
        await prisma.phoneVerificationToken.deleteMany({
            where: { phone: cleanPhone }
        });

        await prisma.phoneVerificationToken.create({
            data: {
                phone: cleanPhone,
                token: otp,
                expires,
            }
        });

        // MOCK SMS SENDING
        console.log('------------------------------------------------');
        console.log(`[MOCK SMS] To: ${cleanPhone}`);
        console.log(`[MOCK SMS] Code: ${otp}`);
        console.log('------------------------------------------------');

        const fs = require('fs');
        try {
            fs.appendFileSync('debug_log.txt', `[SMS OTP] ${cleanPhone}: ${otp}\n`);
        } catch (e) {
            // Ignore file write errors in production
        }

        return { success: true };
    } catch (error) {
        console.error('Error sending SMS OTP:', error);
        return { success: false, error: 'SMS gönderilemedi' };
    }
}

export async function verifyPhoneOtp(phone: string, code: string) {
    try {
        const session = await getSession();
        if (!session?.id) {
            return { success: false, error: 'Unauthorized' };
        }

        const cleanPhone = phone.replace(/\D/g, '');

        const token = await prisma.phoneVerificationToken.findFirst({
            where: {
                phone: cleanPhone,
                token: code,
                expires: { gt: new Date() }
            }
        });

        if (!token) {
            return { success: false, error: 'Geçersiz veya süresi dolmuş kod' };
        }

        // Update User
        await prisma.user.update({
            where: { id: session.id },
            data: {
                phone: cleanPhone,
                phoneVerified: true,
                phoneVerifiedAt: new Date(),
            }
        });

        // Delete used token
        await prisma.phoneVerificationToken.delete({
            where: { id: token.id }
        });

        revalidatePath('/dashboard/verification');
        return { success: true };
    } catch (error) {
        console.error('Error verifying phone:', error);
        return { success: false, error: 'Doğrulama başarısız' };
    }
}

// --- Identity Verification ---

export async function submitIdentityVerification(formData: FormData) {
    try {
        const session = await getSession();
        if (!session?.id) {
            return { success: false, error: 'Unauthorized' };
        }

        const tcNo = formData.get('tcNo') as string;
        const docUrl = formData.get('docUrl') as string;

        if (!tcNo || tcNo.length !== 11) {
            return { success: false, error: 'Geçersiz TC Kimlik No' };
        }

        if (!docUrl) {
            return { success: false, error: 'Kimlik fotoğrafı yüklenmelidir' };
        }

        // Update User
        await prisma.user.update({
            where: { id: session.id },
            data: {
                tcIdentityNo: tcNo,
                identityDoc: docUrl,
                identityVerificationStatus: 'PENDING', // Waiting for admin
            }
        });

        revalidatePath('/dashboard/verification');
        return { success: true };
    } catch (error) {
        console.error('Error submitting identity:', error);
        return { success: false, error: 'Başvuru gönderilemedi' };
    }
}

// --- Corporate Verification ---

export async function submitCorporateVerification(formData: FormData) {
    try {
        const session = await getSession();
        if (!session?.id) {
            return { success: false, error: 'Unauthorized' };
        }

        const taxNumber = formData.get('taxNumber') as string;
        const taxOffice = formData.get('taxOffice') as string;
        const taxPlateDoc = formData.get('taxPlateDoc') as string;
        const companyRegistryNo = formData.get('companyRegistryNo') as string;
        const companyEstablishmentDoc = formData.get('companyEstablishmentDoc') as string;

        if (!taxNumber || !taxOffice || !taxPlateDoc || !companyRegistryNo || !companyEstablishmentDoc) {
            return { success: false, error: 'Tüm alanlar zorunludur' };
        }

        // Update User
        await prisma.user.update({
            where: { id: session.id },
            data: {
                taxNumber,
                taxOffice,
                taxPlateDoc,
                companyRegistryNo,
                companyEstablishmentDoc,
                corporateVerificationStatus: 'PENDING',
            }
        });

        revalidatePath('/dashboard/verification');
        return { success: true };
    } catch (error) {
        console.error('Error submitting corporate:', error);
        return { success: false, error: 'Başvuru gönderilemedi' };
    }
}
