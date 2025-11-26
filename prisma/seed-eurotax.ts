import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const prisma = new PrismaClient();

interface EurotaxRow {
    full_path: string;
    path_1: string;
    path_2: string;
    path_3: string;
    path_4: string;
    path_5: string;
    path_6: string;
    path_7: string;
    path_8: string;
}

async function seedEurotaxVehicles() {
    console.log('🚗 Eurotax Vehicle Data Import Starting...');

    const csvPath = path.join(__dirname, 'data/eurotax-vehicles.csv');
    const fileContent = fs.readFileSync(csvPath, 'utf-8');

    const records: EurotaxRow[] = parse(fileContent, {
        columns: true,
        skip_empty_lines: true,
        trim: true
    });

    console.log(`📊 Found ${records.length} vehicle records`);

    const vehicleTypes = new Map<string, any>();

    for (const record of records) {
        const vehicleType = record.path_1;
        const brand = record.path_3;
        const model = record.path_4;

        if (!vehicleType || !brand || !model) continue;

        if (!vehicleTypes.has(vehicleType)) {
            vehicleTypes.set(vehicleType, new Map());
        }

        const brands = vehicleTypes.get(vehicleType)!;
        if (!brands.has(brand)) {
            brands.set(brand, new Set());
        }

        brands.get(brand)!.add(model);
    }

    console.log(`✅ Processed ${vehicleTypes.size} vehicle types`);

    let vasitaCategory = await prisma.category.findFirst({
        where: { slug: 'vasita' }
    });

    if (!vasitaCategory) {
        vasitaCategory = await prisma.category.create({
            data: {
                name: 'Vasıta',
                slug: 'vasita',
                icon: 'Car'
            }
        });
        console.log('✅ Created Vasıta root category');
    } else {
        console.log(`✅ Using existing Vasıta category: ${vasitaCategory.id}`);
    }

    for (const [typeName, brands] of vehicleTypes) {
        const typeSlug = typeName.toLowerCase()
            .replace(/ı/g, 'i').replace(/ğ/g, 'g').replace(/ü/g, 'u')
            .replace(/ş/g, 's').replace(/ö/g, 'o').replace(/ç/g, 'c')
            .replace(/\s+/g, '-');

        let vehicleTypeCategory = await prisma.category.findFirst({
            where: { slug: typeSlug }
        });

        if (!vehicleTypeCategory) {
            vehicleTypeCategory = await prisma.category.create({
                data: {
                    name: typeName,
                    slug: typeSlug,
                    parentId: vasitaCategory.id,
                    icon: 'Car'
                }
            });
        }

        console.log(`  📁 ${typeName}: ${brands.size} brands`);

        for (const [brandName, models] of brands) {
            const brandSlug = `${typeSlug}-${brandName.toLowerCase().replace(/\s+/g, '-')}`;

            let brandCategory = await prisma.category.findFirst({
                where: { slug: brandSlug }
            });

            if (!brandCategory) {
                brandCategory = await prisma.category.create({
                    data: {
                        name: brandName,
                        slug: brandSlug,
                        parentId: vehicleTypeCategory.id,
                        icon: 'Car'
                    }
                });
            }

            for (const modelName of models) {
                const modelSlug = `${brandSlug}-${String(modelName).toLowerCase().replace(/\s+/g, '-')}`;

                const existingModel = await prisma.category.findFirst({
                    where: { slug: modelSlug }
                });

                if (!existingModel) {
                    await prisma.category.create({
                        data: {
                            name: String(modelName),
                            slug: modelSlug,
                            parentId: brandCategory.id,
                            icon: 'Car'
                        }
                    });
                }
            }
        }
    }

    console.log('✅ Eurotax vehicle data imported successfully!');
}

seedEurotaxVehicles()
    .catch((e) => {
        console.error('❌ Error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
