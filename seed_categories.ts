import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding categories...')

    // 1. Delete Messages (depend on Conversations)
    await prisma.message.deleteMany({})
    console.log('Deleted all messages.')

    // 2. Delete Conversations (depend on Listings)
    await prisma.conversation.deleteMany({})
    console.log('Deleted all conversations.')

    // 3. Delete Listings (depend on Categories)
    await prisma.listing.deleteMany({})
    console.log('Deleted all listings.')

    // 4. Delete existing categories with conflicting slugs
    await prisma.category.deleteMany({
        where: {
            slug: { in: ['vasita', 'otomobil'] }
        }
    })
    console.log('Deleted conflicting categories.')

    // 5. Upsert Vasıta
    await prisma.category.upsert({
        where: { id: 'vasita' },
        update: { name: 'Vasıta', slug: 'vasita' },
        create: {
            id: 'vasita',
            name: 'Vasıta',
            slug: 'vasita',
            icon: 'Car'
        }
    })

    // 6. Upsert Otomobil
    await prisma.category.upsert({
        where: { id: 'otomobil' },
        update: { name: 'Otomobil', slug: 'otomobil', parentId: 'vasita' },
        create: {
            id: 'otomobil',
            name: 'Otomobil',
            slug: 'otomobil',
            parentId: 'vasita'
        }
    })

    console.log('Categories seeded successfully!')
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
