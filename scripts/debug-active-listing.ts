
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const activeListing = await prisma.listing.findFirst({
        where: { status: 'ACTIVE' },
        include: {
            category: true
        }
    });

    if (!activeListing) {
        console.log('No ACTIVE listing found.');
        return;
    }

    console.log('Active Listing:', JSON.stringify(activeListing, null, 2));

    // Check if category hierarchy matches
    // We assume the user is looking at the root or parent category
    if (activeListing.categoryId) {
        const category = await prisma.category.findUnique({
            where: { id: activeListing.categoryId },
            include: { parent: true }
        });
        console.log('Listing Category Hierarchy:', JSON.stringify(category, null, 2));
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
