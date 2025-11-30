import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🔄 Resetting listing rights for test user...')

    const user = await prisma.user.findUnique({
        where: { email: 'test@example.com' }
    })

    if (!user) {
        console.error('❌ Test user not found!')
        return
    }

    // Delete all listings for this user to reset the count
    const deleted = await prisma.listing.deleteMany({
        where: { userId: user.id }
    })

    console.log(`✅ Deleted ${deleted.count} listings for user ${user.email}`)
    console.log('✅ Standard listing right has been reset.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
