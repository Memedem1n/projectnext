const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    // Find the latest PENDING corporate user
    const user = await prisma.user.findFirst({
        where: {
            status: 'PENDING',
            role: 'CORPORATE_GALLERY'
        },
        orderBy: { createdAt: 'desc' }
    })

    if (!user) {
        console.log('No PENDING corporate gallery user found')
        return
    }

    const updated = await prisma.user.update({
        where: { id: user.id },
        data: { status: 'ACTIVE' }
    })
    console.log('User approved:', updated.email, updated.status)
}

main()
