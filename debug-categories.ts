
import prisma from './src/lib/prisma';
import { getAllChildCategoryIds } from './src/lib/actions/categories';

async function main() {
    console.log("Debugging Categories and Listings...");

    // 1. Get 'otomobil' category
    const otomobil = await prisma.category.findUnique({
        where: { slug: 'otomobil' }
    });

    if (!otomobil) {
        console.error("Category 'otomobil' not found!");
        return;
    }

    console.log(`Category 'otomobil': ID=${otomobil.id}, Slug=${otomobil.slug}`);

    // 2. Get all child category IDs
    const childIds = await getAllChildCategoryIds(otomobil.id);
    console.log(`Child Category IDs (${childIds.length}):`, childIds);

    // 3. Count listings in these categories
    const count = await prisma.listing.count({
        where: {
            categoryId: { in: childIds },
            status: 'ACTIVE',
            isActive: true
        }
    });

    console.log(`Total ACTIVE listings in 'otomobil' and children: ${count}`);

    // 4. Check PENDING listings
    const pendingCount = await prisma.listing.count({
        where: {
            categoryId: { in: childIds },
            status: 'PENDING'
        }
    });
    console.log(`Total PENDING listings: ${pendingCount}`);

    // 5. List some active listings to see their data
    const listings = await prisma.listing.findMany({
        where: {
            categoryId: { in: childIds },
            status: 'ACTIVE',
            isActive: true
        },
        take: 5,
        select: { id: true, title: true, categoryId: true, brand: true, model: true }
    });

    console.log("Sample Listings:", listings);
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
