
import { PrismaClient } from '@prisma/client';
import { findEurotaxData } from '../src/lib/eurotax';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting Eurotax Data Sync...');

    // Fetch all listings that are likely vehicles (have brand/model)
    // or belong to vehicle category.
    const listings = await prisma.listing.findMany({
        where: {
            OR: [
                { category: { slug: { startsWith: 'vasita' } } },
                { brand: { not: null } }
            ]
        },
        select: {
            id: true,
            title: true,
            brand: true,
            model: true,
            year: true,
            fuel: true,
            gear: true,
            caseType: true,
            motorPower: true,
            engineVolume: true,
            traction: true,
            series: true,
            version: true
        }
    });

    console.log(`Found ${listings.length} potential vehicle listings.`);

    let updatedCount = 0;
    let skippedCount = 0;
    let failedCount = 0;

    for (const listing of listings) {
        // Skip if already has data (optional, but good for speed if re-running)
        // But here we want to force update to fix missing/incorrect data

        const eurotaxData = findEurotaxData({
            brand: listing.brand,
            model: listing.model,
            year: listing.year,
            fuel: listing.fuel,
            gear: listing.gear,
            caseType: listing.caseType
        });

        if (eurotaxData) {
            const motorPower = eurotaxData["Motor Gücü"] ? parseInt(eurotaxData["Motor Gücü"].replace(/\D/g, '')) : null;
            // Fix: Remove 'cm3' or 'cc' before parsing to avoid including the '3' from 'cm3'
            const engineVolumeStr = eurotaxData["Motor Hacmi"]?.replace(/cm3|cc/gi, '').trim();
            const engineVolume = engineVolumeStr ? parseInt(engineVolumeStr.replace(/\D/g, '')) : null;

            // Simple inference for traction if not explicit in data (Eurotax CSV might not have a dedicated column, checking Alt Model)
            const traction = eurotaxData["Alt Model"]?.includes("Quattro") ||
                eurotaxData["Alt Model"]?.includes("4Matic") ||
                eurotaxData["Alt Model"]?.includes("xDrive") ||
                eurotaxData["Alt Model"]?.includes("4x4")
                ? "4x4" : "Önden Çekiş";

            const series = eurotaxData.path_8; // Submodel/Series
            const version = eurotaxData["Alt Model"]; // Full version name

            try {
                await prisma.listing.update({
                    where: { id: listing.id },
                    data: {
                        motorPower,
                        engineVolume,
                        traction,
                        series,
                        version
                    }
                });
                console.log(`[UPDATED] ${listing.title} (${listing.brand} ${listing.model}) -> HP: ${motorPower}, CC: ${engineVolume}, Series: ${series}`);
                updatedCount++;
            } catch (err) {
                console.error(`[ERROR] Failed to update ${listing.id}:`, err);
                failedCount++;
            }
        } else {
            console.log(`[SKIPPED] No Eurotax match for ${listing.title} (${listing.brand} ${listing.model} ${listing.year})`);
            skippedCount++;
        }
    }

    console.log('\nSync Complete.');
    console.log(`Updated: ${updatedCount}`);
    console.log(`Skipped (No Match): ${skippedCount}`);
    console.log(`Failed (DB Error): ${failedCount}`);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
