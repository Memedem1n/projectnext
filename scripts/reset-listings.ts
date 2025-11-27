
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    try {
        const deleted = await prisma.listing.deleteMany({});
        console.log(`Deleted ${deleted.count} listings. Free listing rights should be reset.`);
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
