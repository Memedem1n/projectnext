
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const latestListing = await prisma.listing.findFirst({
        orderBy: { createdAt: 'desc' },
        include: {
            category: true,
            images: true
        }
    });

    if (!latestListing) {
        console.log('No listings found.');
        return;
    }

    console.log('--- Listing Details ---');
    console.log('ID:', latestListing.id);
    console.log('Title:', latestListing.title);
    console.log('Category ID:', latestListing.categoryId);
    console.log('Category Name:', latestListing.category.name);
    console.log('Brand:', latestListing.brand);
    console.log('Model:', latestListing.model);
    console.log('Status:', latestListing.status);
    console.log('Is Active:', latestListing.isActive);
    console.log('Images Count:', latestListing.images.length);
    if (latestListing.images.length > 0) {
        console.log('First Image URL:', latestListing.images[0].url);
        console.log('All Images:', JSON.stringify(latestListing.images.map(i => ({ url: i.url, isCover: i.isCover })), null, 2));
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
