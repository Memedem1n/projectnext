
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const listings = await prisma.listing.findMany({
        select: {
            id: true,
            title: true,
            status: true,
            categoryId: true,
            category: { select: { name: true, slug: true } }
        }
    });
    console.log('Listings:', listings);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
