const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const types = await prisma.vehicleData.groupBy({
        by: ['type'],
        _count: true
    })
    console.log('Vehicle Types in DB:', types)
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
