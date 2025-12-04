
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Searching for listings...');

    // 1. Update Camaro to Premium
    const camaro = await prisma.listing.findFirst({
        where: {
            title: { contains: 'Camaro', mode: 'insensitive' }
        }
    });

    if (camaro) {
        console.log(`Found Camaro listing: ${camaro.title} (${camaro.id})`);
        await prisma.listing.update({
            where: { id: camaro.id },
            data: {
                listingPackage: 'premium',
                isPremium: true,
                isDoping: true,
                dopingType: 'FULL',
                expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
                dopingStartDate: new Date(),
                dopingEndDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
                status: 'ACTIVE', // Ensure it's active for viewing
                isActive: true
            }
        });
        console.log('Updated Camaro to Premium package.');
    } else {
        console.log('Camaro listing not found.');
    }

    // 2. Update Jaguar to Gold (Middle)
    const jaguar = await prisma.listing.findFirst({
        where: {
            title: { contains: 'Jaguar', mode: 'insensitive' }
        }
    });

    if (jaguar) {
        console.log(`Found Jaguar listing: ${jaguar.title} (${jaguar.id})`);
        await prisma.listing.update({
            where: { id: jaguar.id },
            data: {
                listingPackage: 'gold',
                isPremium: false, // Gold is not "Premium" in the sense of showcase, but has doping
                isDoping: true,
                dopingType: 'VISUAL',
                expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
                dopingStartDate: new Date(),
                dopingEndDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
                status: 'ACTIVE',
                isActive: true
            }
        });
        console.log('Updated Jaguar to Gold package.');
    } else {
        console.log('Jaguar listing not found.');
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
