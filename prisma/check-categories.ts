import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkCategories() {
    console.log('🔍 Checking categories in database...\n');

    const categories = await prisma.category.findMany({
        select: {
            id: true,
            name: true,
            slug: true
        }
    });

    console.log(`Found ${categories.length} categories:\n`);
    categories.forEach(cat => {
        console.log(`  - ID: "${cat.id}" | Name: "${cat.name}" | Slug: "${cat.slug}"`);
    });

    const otomobil = await prisma.category.findUnique({
        where: { id: 'otomobil' }
    });

    console.log('\n🚗 Otomobil category:');
    if (otomobil) {
        console.log(`  ✅ Found: ${JSON.stringify(otomobil, null, 2)}`);
    } else {
        console.log('  ❌ NOT FOUND - needs to be created');
    }
}

checkCategories()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
