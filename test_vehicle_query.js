const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const type = "Otomobil"
    console.log(`Querying brands for type: ${type}`)

    const brands = await prisma.vehicleData.groupBy({
        by: ['brand'],
        where: { type },
        orderBy: { brand: 'asc' }
    })

    console.log(`Found ${brands.length} brands.`)
    if (brands.length > 0) {
        console.log('First 5 brands:', brands.map(b => b.brand).slice(0, 5))
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
