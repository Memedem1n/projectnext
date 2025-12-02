
import prisma from './src/lib/prisma';

async function main() {
    console.log("Finding listing by title 'Jaguar F-Type'...");

    const listing = await prisma.listing.findFirst({
        where: {
            title: { contains: 'Jaguar', mode: 'insensitive' }
        }
    });

    if (!listing) {
        console.error("Listing not found by title!");
        return;
    }

    console.log(`Found listing: ${listing.id} (${listing.title})`);
    console.log(`Current Status: ${listing.status}`);

    if (listing.status === 'ACTIVE') {
        console.log("Listing is already ACTIVE.");
        return;
    }

    console.log("Approving...");
    const result = await prisma.listing.update({
        where: { id: listing.id },
        data: {
            status: 'ACTIVE',
            isActive: true,
            approvedAt: new Date()
        }
    });

    console.log("Approved!", result);
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
