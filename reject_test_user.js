const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    // Find the latest PENDING corporate user
    const user = await prisma.user.findFirst({
        where: {
            status: 'PENDING',
            role: 'CORPORATE_DEALER'
        },
        orderBy: { createdAt: 'desc' }
    })

    if (!user) {
        console.log('No PENDING corporate dealer user found')
        return
    }

    const updated = await prisma.user.update({
        where: { id: user.id },
        data: { status: 'REJECTED' }
    })
    console.log('User rejected:', updated.email, updated.status)
}

main()
