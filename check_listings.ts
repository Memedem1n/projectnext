
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const listings = await prisma.listing.findMany({
        include: {
            category: true
        }
    });
    console.log('Current Listings in DB:');
    listings.forEach(l => {
        console.log(`- ID: ${l.id}`);
        console.log(`  Title: ${l.title}`);
        console.log(`  Status: ${l.status}`);
        console.log(`  IsActive: ${l.isActive}`);
        console.log(`  Category ID: ${l.categoryId}`);
        console.log(`  Category Name: ${l.category?.name}`);
        console.log(`  Category Slug: ${l.category?.slug}`);
        console.log('---');
    });
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
