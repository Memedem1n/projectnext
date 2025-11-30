import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('--- USERS ---')
    const users = await prisma.user.findMany()
    users.forEach(u => console.log(`${u.id} | ${u.email} | ${u.name}`))

    console.log('\n--- CATEGORIES ---')
    const categories = await prisma.category.findMany()
    categories.forEach(c => console.log(`${c.id} | ${c.name} | ${c.slug}`))

    if (categories.length === 0) {
        console.log('NO CATEGORIES FOUND!')
    }
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
