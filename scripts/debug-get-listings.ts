
import { getListings } from '../src/lib/actions/listings';

async function main() {
    console.log('Fetching listings for category: vasita');
    // We need to find the ID for vasita first, or hardcode it if we know it.
    // From previous steps: Vasita ID = cmim7mqs40000e8uu9ugdzb2l

    const result = await getListings({
        categoryId: 'cmim7mqs40000e8uu9ugdzb2l',
        limit: 10
    });

    console.log('Result Success:', result.success);
    console.log('Total Count:', result.total);
    console.log('Listings Found:', result.data?.length);

    if (result.data && result.data.length > 0) {
        console.log('First Listing:', JSON.stringify(result.data[0], null, 2));
    } else {
        console.log('No listings found via getListings');
    }
}

main();
