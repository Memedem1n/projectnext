
import { PrismaClient } from '@prisma/client';
import { getListings } from '../src/lib/actions/listings';

const prisma = new PrismaClient();

async function main() {
    console.log('Verifying Vehicle Filters (HP, CC, Drive Type)...');

    // Test 1: Filter by HP
    console.log('\nTest 1: Filter by HP (Min: 150)');
    const hpListings = await getListings({
        minHp: 150
    });
    if (!hpListings.success || !hpListings.data) {
        console.error('Error fetching HP listings:', hpListings);
        return;
    }
    console.log(`Found ${hpListings.data.length} listings with > 150 HP`);
    hpListings.data.forEach(l => {
        console.log(`- ${l.title}: ${l.motorPower} HP`);
    });

    // Test 2: Filter by CC
    console.log('\nTest 2: Filter by CC (Min: 1800)');
    const ccListings = await getListings({
        minCc: 1800
    });
    console.log(`Found ${ccListings.data?.length} listings with > 1800 CC`);
    ccListings.data?.forEach(l => {
        console.log(`- ${l.title}: ${l.engineVolume} CC`);
    });

    // Test 3: Filter by Drive Type (Traction)
    console.log('\nTest 3: Filter by Drive Type (4WD)');
    const fwdListings = await getListings({
        driveType: '4wd'
    });
    console.log(`Found ${fwdListings.data?.length} 4WD listings`);
    fwdListings.data?.forEach(l => {
        console.log(`- ${l.title}: ${l.traction}`);
    });

    // Test 4: Combined Filter (HP + Drive Type)
    console.log('\nTest 4: Combined Filter (HP > 150 + 4WD)');
    const combinedListings = await getListings({
        minHp: 150,
        driveType: '4wd'
    });
    console.log(`Found ${combinedListings.data?.length} listings`);
    combinedListings.data?.forEach(l => {
        console.log(`- ${l.title}: ${l.motorPower} HP, ${l.traction}`);
    });
    // Test 5: Filter Camaro by HP/CC
    console.log('\nTest 5: Filter Camaro (HP > 600)');
    const camaroListings = await getListings({
        minHp: 600
    });
    console.log(`Found ${camaroListings.data?.length} listings with > 600 HP`);
    camaroListings.data?.forEach(l => {
        console.log(`- ${l.title}: ${l.motorPower} HP`);
    });
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
