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
    path_1: string; // Type (Otomobil)
    path_2: string; // Year (2025)
    path_3: string; // Brand (Audi)
    path_4: string; // Model (A3)
    path_5: string; // Fuel (Benzin)
    path_6: string; // BodyType (Hatchback 5 kapı)
    path_7: string; // Gear (Otomatik)
    path_8: string; // SubModel (A3 Sportback)
    path_9: string; // Package (35 TFSI)
    'Motor Hacmi': string;
    'Motor Gücü': string;
    'Alt Model': string;
}

async function seedEurotaxVehicles() {
    console.log('🚗 Eurotax Vehicle Data Import Starting...');

    // CSV dosyasının kök dizinde olduğunu varsayıyoruz (önceki analizden)
    // Ancak script prisma klasöründe olduğu için ../sahibinden_eurotax.csv yolunu deneyeceğiz
    // Veya proje kök dizinindeki dosyayı okuyacağız.
    // Kullanıcı analizinde dosya yolu: c:\Users\barut\OneDrive\Desktop\Sahibinden.next\sahibinden_eurotax.csv

    // Proje kök dizinini bulmaya çalışalım (prisma klasörünün bir üstü)
    const projectRoot = path.resolve(__dirname, '..');
    const csvPath = path.join(projectRoot, 'sahibinden_eurotax.csv');

    if (!fs.existsSync(csvPath)) {
        console.error(`❌ CSV file not found at: ${csvPath}`);
        // Fallback to prisma/data if exists
        const altPath = path.join(__dirname, 'data/eurotax-vehicles.csv');
        if (fs.existsSync(altPath)) {
            console.log(`⚠️ Using alternative path: ${altPath}`);
            // Logic for alt path if needed, but let's stick to the requested file
        }
        return;
    }

    console.log(`📂 Reading CSV from: ${csvPath}`);
    const fileContent = fs.readFileSync(csvPath, 'utf-8');

    const records: EurotaxRow[] = parse(fileContent, {
        columns: true,
        skip_empty_lines: true,
        trim: true
    });

    console.log(`📊 Found ${records.length} vehicle records. Clearing existing data...`);

    // Clear existing data
    await prisma.vehicleData.deleteMany({});
    console.log('🗑️  Cleared existing VehicleData records.');

    console.log('💾 Inserting new records...');

    // Batch insert for performance
    const batchSize = 1000;
    for (let i = 0; i < records.length; i += batchSize) {
        const batch = records.slice(i, i + batchSize);

        const dataToInsert = batch.map(record => ({
            type: record.path_1,
            year: parseInt(record.path_2) || 0,
            brand: record.path_3,
            model: record.path_4,
            fuel: record.path_5,
            bodyType: record.path_6,
            gear: record.path_7,
            subModel: record.path_8,
            package: record.path_9,
            motorVolume: record['Motor Hacmi'],
            motorPower: record['Motor Gücü'],
            version: record['Alt Model']
        }));

        await prisma.vehicleData.createMany({
            data: dataToInsert
        });

        console.log(`   Processed ${Math.min(i + batchSize, records.length)} / ${records.length}`);
    }

    console.log('✅ Eurotax vehicle data imported successfully into VehicleData table!');
}

seedEurotaxVehicles()
    .catch((e) => {
        console.error('❌ Error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
