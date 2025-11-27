const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const prisma = new PrismaClient()

async function main() {
    const email = 'test@example.com'
    const newPassword = 'password123'
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    try {
        const user = await prisma.user.update({
            where: { email: email },
            data: { password: hashedPassword }
        })
        console.log(`User ${user.email} password reset to: ${newPassword}`)
    } catch (error) {
        console.error('Error updating password:', error)
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
