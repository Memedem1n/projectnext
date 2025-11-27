import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    try {
        // Sequence name for "listings" table and "listingNumber" column
        const seqName = 'listings_listingNumber_seq';

        console.log(`Resetting sequence ${seqName} to 100000000...`);

        // Use executeRawUnsafe because sequence name is dynamic/string
        await prisma.$executeRawUnsafe(`ALTER SEQUENCE "${seqName}" RESTART WITH 100000000;`);

        console.log('Sequence updated successfully.');

    } catch (error: any) {
        console.error('Error updating sequence:', error.message || error);
    } finally {
        await prisma.$disconnect();
    }
}

main()
