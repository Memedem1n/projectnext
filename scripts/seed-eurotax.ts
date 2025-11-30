
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

const prisma = new PrismaClient();

async function main() {
    const csvPath = path.join(process.cwd(), 'prisma/data/eurotax-vehicles.csv');
    console.log(`Reading CSV from ${csvPath}...`);

    const fileContent = fs.readFileSync(csvPath, 'utf-8');

    const records = parse(fileContent, {
        columns: true,
        skip_empty_lines: true,
        trim: true
    });

    console.log(`Found ${records.length} records. Starting seed...`);

    // Clear existing data
    await prisma.vehicleData.deleteMany();
    console.log('Cleared existing VehicleData.');

    const batchSize = 100;
    let processed = 0;

    const fixEncoding = (str: string | null | undefined) => {
        if (!str) return str;
        return str
            .replace(/Ä±/g, 'ı')
            .replace(/Ã¼/g, 'ü')
            .replace(/Ã¶/g, 'ö')
            .replace(/ÅŸ/g, 'ş')
            .replace(/Ã§/g, 'ç')
            .replace(/ÄŸ/g, 'ğ')
            .replace(/Ä°/g, 'İ')
            .replace(/Ã–/g, 'Ö')
            .replace(/Ãœ/g, 'Ü')
            .replace(/Åž/g, 'Ş')
            .replace(/Ã‡/g, 'Ç')
            .replace(/Äž/g, 'Ğ');
    };

    for (let i = 0; i < records.length; i += batchSize) {
        const batch = records.slice(i, i + batchSize);

        const data = batch.map((row: any) => ({
            type: fixEncoding(row.path_1)!,
            year: parseInt(row.path_2),
            brand: fixEncoding(row.path_3)!,
            model: fixEncoding(row.path_4)!,
            fuel: fixEncoding(row.path_5),
            bodyType: fixEncoding(row.path_6),
            gear: fixEncoding(row.path_7),
            subModel: fixEncoding(row.path_8),
            package: fixEncoding(row.path_9),

            // Technical Specs
            motorVolume: row['Motor Hacmi'],
            motorPower: row['Motor GÃ¼cÃ¼'] || row['Motor Gücü'],
            version: fixEncoding(row['Alt Model'])
        }));

        await prisma.vehicleData.createMany({
            data: data
        });

        processed += batch.length;
        process.stdout.write(`\rProcessed ${processed}/${records.length}`);
    }

    console.log('\n✅ Seed completed successfully!');
}

main()
    .catch((e) => {
        console.error('\n❌ Seed failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
