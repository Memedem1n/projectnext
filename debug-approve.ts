
import prisma from './src/lib/prisma';
import { approveListing } from './src/lib/actions/admin-listings';

async function main() {
    console.log("Fetching latest PENDING listing...");

    // 1. Get latest pending listing
    const listing = await prisma.listing.findFirst({
        where: { status: 'PENDING' },
        orderBy: { createdAt: 'desc' },
        select: { id: true, title: true, status: true }
    });

    if (!listing) {
        console.log("No PENDING listings found.");
        return;
    }

    console.log("Found Listing:", listing);

    // 2. Call approve action
    console.log(`Approving listing ${listing.id}...`);
    const result = await approveListing(listing.id);
    console.log("Approve Result:", result);

    // 3. Check status after
    const after = await prisma.listing.findUnique({
        where: { id: listing.id },
        select: { id: true, status: true, isActive: true }
    });
    console.log("Status AFTER:", after);
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
