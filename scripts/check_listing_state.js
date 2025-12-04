
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Checking listing states...');

    const camaro = await prisma.listing.findFirst({
        where: { title: { contains: 'Camaro', mode: 'insensitive' } },
        select: { id: true, title: true, isDoping: true, isPremium: true, listingPackage: true, dopingType: true }
    });
    console.log('Camaro:', camaro);

    const jaguar = await prisma.listing.findFirst({
        where: { title: { contains: 'Jaguar', mode: 'insensitive' } },
        select: { id: true, title: true, isDoping: true, isPremium: true, listingPackage: true, dopingType: true }
    });
    console.log('Jaguar:', jaguar);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
