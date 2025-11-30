
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Check distinct brands
    const brands = await prisma.vehicleData.findMany({
        distinct: ['brand'],
        select: {
            brand: true
        },
        orderBy: {
            brand: 'asc'
        },
        take: 10
    });

    console.log('Top 10 Brands:', brands);

    // Check models for a specific brand (e.g., first one found)
    if (brands.length > 0) {
        const firstBrand = brands[0].brand;
        const models = await prisma.vehicleData.findMany({
            where: {
                brand: firstBrand
            },
            distinct: ['model'],
            select: {
                model: true
            },
            orderBy: {
                model: 'asc'
            },
            take: 10
        });
        console.log(`Models for ${firstBrand}:`, models);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
