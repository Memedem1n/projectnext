import prisma from "@/lib/prisma";

export const generateVerificationToken = async (email: string) => {
    // Generate 6 digit random code
    const token = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(new Date().getTime() + 15 * 60 * 1000); // 15 minutes expiration for OTP

    // Check if a token already exists for this email
    const existingToken = await prisma.verificationToken.findFirst({
        where: { email }
    });

    if (existingToken) {
        await prisma.verificationToken.delete({
            where: {
                id: existingToken.id
            }
        });
    }

    const verificationToken = await prisma.verificationToken.create({
        data: {
            email,
            token,
            expires
        }
    });

    return verificationToken;
};

export const generatePhoneVerificationToken = async (phone: string) => {
    // Generate 6 digit random code
    const token = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(new Date().getTime() + 5 * 60 * 1000); // 5 minutes expiration for SMS

    // Check if a token already exists for this phone
    const existingToken = await prisma.phoneVerificationToken.findFirst({
        where: { phone }
    });

    if (existingToken) {
        await prisma.phoneVerificationToken.delete({
            where: {
                id: existingToken.id
            }
        });
    }

    const verificationToken = await prisma.phoneVerificationToken.create({
        data: {
            phone,
            token,
            expires
        }
    });

    return verificationToken;
};
