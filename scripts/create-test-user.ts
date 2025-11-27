import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const email = 'browser_test@example.com'
    const password = 'password123'
    const hashedPassword = await bcrypt.hash(password, 10)

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
        console.log('User already exists. Updating password...')
        await prisma.user.update({
            where: { email },
            data: { password: hashedPassword, status: 'ACTIVE' }
        })
    } else {
        console.log('Creating new user...')
        await prisma.user.create({
            data: {
                email,
                name: 'Browser Test User',
                password: hashedPassword,
                role: 'INDIVIDUAL',
                status: 'ACTIVE',
                phone: '5559998877',
                emailVerified: new Date(),
                identityVerified: true
            }
        })
    }
    console.log(`User ready: ${email} / ${password}`)
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
