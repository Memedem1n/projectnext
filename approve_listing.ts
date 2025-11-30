
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // 1. Approve the pending listing
    const pendingListing = await prisma.listing.findFirst({
        where: { status: 'PENDING' }
    });

    if (pendingListing) {
        await prisma.listing.update({
            where: { id: pendingListing.id },
            data: {
                status: 'ACTIVE',
                isActive: true,
                // Optional: Move it to 'Otomobil' category for better visibility test if desired
                // categoryId: 'cmil7v2yg000211zxhqzgksln' 
            }
        });
        console.log(`Approved listing: ${pendingListing.title}`);
    } else {
        console.log('No pending listings found.');
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
