import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        // Reset sequence for listingNo to start from 1,000,000,000
        await prisma.$executeRawUnsafe(`ALTER SEQUENCE "listings_listingNo_seq" RESTART WITH 1000000000;`);
        console.log('Sequence updated successfully.');
    } catch (error) {
        console.error('Error updating sequence:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
