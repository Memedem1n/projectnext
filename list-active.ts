
import prisma from './src/lib/prisma';
import { getAllChildCategoryIds } from './src/lib/actions/categories';

async function main() {
    console.log("Listing ALL ACTIVE listings in Otomobil...");

    const otomobil = await prisma.category.findUnique({ where: { slug: 'otomobil' } });
    if (!otomobil) return;

    const childIds = await getAllChildCategoryIds(otomobil.id);

    const listings = await prisma.listing.findMany({
        where: {
            categoryId: { in: childIds },
            status: 'ACTIVE',
            isActive: true
        },
        select: { id: true, title: true, brand: true, model: true, createdAt: true }
    });

    console.log(`Total Active: ${listings.length}`);
    listings.forEach(l => console.log(`- ${l.title} (${l.brand} ${l.model}) [${l.id}]`));
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
