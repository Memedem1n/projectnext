
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting migration of VehicleData to Categories...');

    // 1. Find the parent "Otomobil" category
    const otomobil = await prisma.category.findFirst({
        where: { slug: 'otomobil' }
    });

    if (!otomobil) {
        console.error('Otomobil category not found! Please ensure initial seed is run.');
        return;
    }

    console.log(`Found Otomobil category: ${otomobil.name} (${otomobil.id})`);

    // 2. Get distinct Brands from VehicleData
    const brands = await prisma.vehicleData.findMany({
        distinct: ['brand'],
        select: { brand: true },
        orderBy: { brand: 'asc' }
    });

    console.log(`Found ${brands.length} brands.`);

    for (const b of brands) {
        const brandName = b.brand;
        const brandSlug = brandName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

        // Check if brand category exists
        let brandCat = await prisma.category.findUnique({
            where: { slug: brandSlug }
        });

        if (!brandCat) {
            console.log(`Creating Brand Category: ${brandName}`);
            brandCat = await prisma.category.create({
                data: {
                    name: brandName,
                    slug: brandSlug,
                    parentId: otomobil.id
                }
            });
        } else {
            // Ensure parent is correct
            if (brandCat.parentId !== otomobil.id) {
                await prisma.category.update({
                    where: { id: brandCat.id },
                    data: { parentId: otomobil.id }
                });
            }
        }

        // 3. Get distinct Models for this Brand
        const models = await prisma.vehicleData.findMany({
            where: { brand: brandName },
            distinct: ['model'],
            select: { model: true },
            orderBy: { model: 'asc' }
        });

        for (const m of models) {
            const modelName = m.model;
            // Model slug needs to be unique globally, so prefix with brand slug
            const modelSlug = `${brandSlug}-${modelName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`;

            let modelCat = await prisma.category.findUnique({
                where: { slug: modelSlug }
            });

            if (!modelCat) {
                // console.log(`Creating Model Category: ${modelName} under ${brandName}`);
                modelCat = await prisma.category.create({
                    data: {
                        name: modelName,
                        slug: modelSlug,
                        parentId: brandCat.id
                    }
                });
            }

            // 4. Get distinct SubModels for this Model
            const subModels = await prisma.vehicleData.findMany({
                where: {
                    brand: brandName,
                    model: modelName
                },
                distinct: ['subModel'],
                select: { subModel: true },
                orderBy: { subModel: 'asc' }
            });

            for (const sm of subModels) {
                if (!sm.subModel) continue;

                const subModelName = sm.subModel;
                const subModelSlug = `${modelSlug}-${subModelName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`;

                let subModelCat = await prisma.category.findUnique({
                    where: { slug: subModelSlug }
                });

                if (!subModelCat) {
                    // console.log(`Creating SubModel Category: ${subModelName} under ${modelName}`);
                    await prisma.category.create({
                        data: {
                            name: subModelName,
                            slug: subModelSlug,
                            parentId: modelCat.id
                        }
                    });
                }
            }
        }
    }

    console.log('Migration completed successfully.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
