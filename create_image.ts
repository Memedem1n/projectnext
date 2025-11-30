
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const listing = await prisma.listing.findFirst({
        where: { title: 'dsadsadsa' }
    });

    if (listing) {
        // Create an image record linked to the listing
        await prisma.image.create({
            data: {
                url: "https://placehold.co/600x400?text=Test+Image",
                isCover: true,
                order: 0,
                listingId: listing.id
            }
        });
        console.log(`Created image for listing: ${listing.title}`);
    } else {
        console.log('Listing not found.');
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
