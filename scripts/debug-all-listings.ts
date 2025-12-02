
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('--- Checking All Listings ---');
    const allListings = await prisma.listing.findMany({
        select: {
            id: true,
            title: true,
            status: true,
            isActive: true,
            categoryId: true,
            category: { select: { name: true, slug: true } },
            user: { select: { email: true } }
        }
    });

    console.log(`Total Listings in DB: ${allListings.length}`);
    allListings.forEach(l => {
        console.log(`- [${l.status}] (Active: ${l.isActive}) ${l.title} | Cat: ${l.category.name} | User: ${l.user.email}`);
    });
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
