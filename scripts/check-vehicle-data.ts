
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        const count = await prisma.vehicleData.count();
        console.log(`Total VehicleData records: ${count}`);

        if (count > 0) {
            const types = await prisma.vehicleData.groupBy({
                by: ['type'],
            });
            console.log('Distinct Types:', types.map(t => t.type));

            const sample = await prisma.vehicleData.findFirst();
            console.log('Sample Record:', sample);
        }
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
