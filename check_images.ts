
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const listing = await prisma.listing.findFirst({
        where: { title: 'dsadsadsa' }, // The listing we just approved
        select: { id: true, title: true, images: true }
    });

    console.log('Listing Images Debug:');
    if (listing) {
        console.log(`- ID: ${listing.id}`);
        console.log(`- Title: ${listing.title}`);
        console.log(`- Images (Raw):`, JSON.stringify(listing.images, null, 2));
    } else {
        console.log('Listing not found.');
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
