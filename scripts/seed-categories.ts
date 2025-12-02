
import prisma from '../src/lib/prisma';
import { CATEGORIES } from '../src/data/categories';

async function main() {
    console.log("Seeding Categories...");

    for (const category of CATEGORIES) {
        console.log(`Processing Main Category: ${category.name}`);

        // 1. Create/Update Main Category
        const mainCat = await prisma.category.upsert({
            where: { slug: category.id },
            update: { name: category.name },
            create: {
                name: category.name,
                slug: category.id
            }
        });

        // 2. Create/Update Subcategories
        if (category.subcategories) {
            console.log(`Found ${category.subcategories.length} subcategories for ${category.name}`);
            for (const sub of category.subcategories) {
                console.log(`  - Processing Subcategory: ${sub.name}`);
                await prisma.category.upsert({
                    where: { slug: sub.id },
                    update: {
                        name: sub.name,
                        parentId: mainCat.id
                    },
                    create: {
                        name: sub.name,
                        slug: sub.id,
                        parentId: mainCat.id
                    }
                });
            }
        }
    }

    console.log("Seeding Completed!");
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
