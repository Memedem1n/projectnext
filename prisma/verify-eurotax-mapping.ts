
import { PrismaClient } from '@prisma/client';
import { getListingById } from '../src/lib/actions/listings';

const prisma = new PrismaClient();

async function main() {
    console.log('Verifying Eurotax Mapping...');

    // Find a listing that matches the Eurotax data (e.g., Chevrolet Camaro)
    // If not found, create a dummy one or just rely on finding ANY vehicle listing to check the structure

    // For this test, we'll try to find an existing listing or create a temporary one
    // But since we can't easily create a full listing with relations in a simple script without auth context,
    // we will try to find one.

    const listing = await prisma.listing.findFirst({
        where: {
            brand: 'Chevrolet',
            model: 'Camaro'
        }
    });

    if (!listing) {
        console.log('No Chevrolet Camaro listing found. Please create one manually or update the seed.');
        // Fallback to finding any vehicle listing to check if fields are present
        const anyListing = await prisma.listing.findFirst({
            where: { category: { slug: { startsWith: 'vasita' } } }
        });

        if (anyListing) {
            console.log(`Checking listing: ${anyListing.brand} ${anyListing.model}`);
            const result = await getListingById(anyListing.id);
            if (result.success && result.data) {
                console.log('Enriched Listing Data:');
                console.log(`- Brand: ${result.data.brand}`);
                console.log(`- Model: ${result.data.model}`);
                console.log(`- Series: ${result.data.series}`);
                console.log(`- Version: ${result.data.version}`);
                console.log(`- HP: ${result.data.motorPower}`);
                console.log(`- CC: ${result.data.engineVolume}`);
                console.log(`- Traction: ${result.data.traction}`);
            }
        }
        return;
    }

    console.log(`Found listing: ${listing.title}`);
    console.log('Listing Details:', {
        brand: listing.brand,
        model: listing.model,
        year: listing.year,
        fuel: listing.fuel,
        gear: listing.gear,
        caseType: listing.caseType
    });
    const result = await getListingById(listing.id);

    if (result.success && result.data) {
        console.log('Enriched Listing Data:');
        console.log(`- Brand: ${result.data.brand}`);
        console.log(`- Model: ${result.data.model}`);
        console.log(`- Series: ${result.data.series}`); // Should be ZL1 if data matches
        console.log(`- Version: ${result.data.version}`);
        console.log(`- HP: ${result.data.motorPower}`);
        console.log(`- CC: ${result.data.engineVolume}`);
        console.log(`- Traction: ${result.data.traction}`);
    } else {
        console.error('Failed to get listing details');
    }
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
