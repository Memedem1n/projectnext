
import prisma from './src/lib/prisma';

async function main() {
    console.log("Checking Latest Listings...");

    const listings = await prisma.listing.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            title: true,
            status: true,
            isActive: true,
            categoryId: true,
            brand: true,
            createdAt: true
        }
    });

    console.log("Latest 5 Listings:", listings);
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
