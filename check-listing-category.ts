
import prisma from './src/lib/prisma';

async function main() {
    const listingId = 'cmins4pnf000llrrcuizc9sea';
    console.log(`Checking category for listing: ${listingId}`);

    const listing = await prisma.listing.findUnique({
        where: { id: listingId },
        include: { category: true }
    });

    if (!listing) {
        console.error("Listing not found!");
        return;
    }

    console.log(`Listing Title: ${listing.title}`);
    console.log(`Category: ${listing.category.name} (${listing.category.slug}) [${listing.category.id}]`);
    console.log(`Parent ID: ${listing.category.parentId}`);
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
