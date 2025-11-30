
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const listing = await prisma.listing.findFirst({
        where: { title: 'dsadsadsa' }
    });

    if (listing) {
        await prisma.listing.update({
            where: { id: listing.id },
            data: {
                images: [
                    {
                        url: "https://placehold.co/600x400?text=Test+Image",
                        order: 0
                    }
                ] as any
            }
        });
        console.log(`Updated images for listing: ${listing.title}`);
    } else {
        console.log('Listing not found.');
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
