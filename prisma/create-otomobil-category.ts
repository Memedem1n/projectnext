import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createOtomobilCategory() {
    console.log('🚗 Creating otomobil category...\n');

    // Find vasita parent category
    const vasita = await prisma.category.findFirst({
        where: { slug: 'vasita' }
    });

    if (!vasita) {
        console.error('❌ Vasita category not found!');
        process.exit(1);
    }

    console.log(`✅ Found vasita category: ${vasita.id}`);

    // Check if otomobil already exists
    const existing = await prisma.category.findFirst({
        where: { slug: 'otomobil' }
    });

    if (existing) {
        console.log(`✅ Otomobil category already exists: ${existing.id}`);
        return existing;
    }

    // Create otomobil category
    const otomobil = await prisma.category.create({
        data: {
            name: 'Otomobil',
            slug: 'otomobil',
            parentId: vasita.id
        }
    });

    console.log(`✅ Created otomobil category: ${otomobil.id}`);
    return otomobil;
}

createOtomobilCategory()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
