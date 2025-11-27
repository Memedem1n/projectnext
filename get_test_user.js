const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const user = await prisma.user.findFirst({
        where: {
            role: 'INDIVIDUAL',
            status: 'ACTIVE'
        }
    })

    if (user) {
        console.log(`Email: ${user.email}`)
        console.log(`Name: ${user.name}`)
        console.log(`Role: ${user.role}`)
    } else {
        console.log('No active individual user found.')
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
