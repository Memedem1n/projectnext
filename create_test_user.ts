import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const email = 'test@example.com'
    const password = await bcrypt.hash('password123', 10)

    const user = await prisma.user.upsert({
        where: { email },
        update: {
            password,
            status: 'ACTIVE',
            role: 'INDIVIDUAL'
        },
        create: {
            email,
            name: 'Test User',
            password,
            role: 'INDIVIDUAL',
            status: 'ACTIVE',
            emailVerified: new Date(),
            phone: '5551234567',
            phoneVerified: true,
            tcIdentityNo: '11111111110',
            identityVerified: true
        },
    })
    console.log('User created:', user.email)
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
