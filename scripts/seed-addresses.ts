import { PrismaClient } from "@prisma/client";
import locations from "../src/data/locations.json";

const prisma = new PrismaClient();

async function main() {
    console.log("Starting address seeding...");

    // Fetch listings with missing location data
    // We want to update ALL listings to ensure they have valid addresses, 
    // or at least the ones that are missing it. 
    // The user asked "database de oluşturudğum ilanlara random addresler verir misin"
    // which implies giving addresses to existing listings. 
    // I will target ones with missing data first, but maybe I should just update all?
    // "random addresler verir misin" -> "can you give random addresses".
    // I'll stick to updating those with missing/empty city or district to avoid overwriting good data if any exists.
    // Actually, if the user just added the feature, most likely all existing listings have empty city/district.

    const listings = await prisma.listing.findMany({
        where: {
            OR: [
                { city: null },
                { city: "" },
                { district: null },
                { district: "" }
            ]
        }
    });

    console.log(`Found ${listings.length} listings to update.`);

    for (const listing of listings) {
        // Pick random city
        const randomCity = locations[Math.floor(Math.random() * locations.length)];

        if (!randomCity.counties || randomCity.counties.length === 0) {
            console.warn(`City ${randomCity.name} has no districts, skipping.`);
            continue;
        }

        // Pick random district from that city
        const randomDistrict = randomCity.counties[Math.floor(Math.random() * randomCity.counties.length)];

        await prisma.listing.update({
            where: { id: listing.id },
            data: {
                city: randomCity.name,
                district: randomDistrict.name
            }
        });

        console.log(`Updated listing ${listing.id}: ${randomCity.name} / ${randomDistrict.name}`);
    }

    console.log("Address seeding completed.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
