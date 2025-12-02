
import prisma from './src/lib/prisma';

async function main() {
    const listingId = 'cmins4pnf000llrrcuizc9sea'; // "jaguar tertemiz sahibinden hatasız"
    console.log(`Moving listing ${listingId} to Otomobil...`);

    // 1. Find Otomobil Category ID
    const otomobil = await prisma.category.findUnique({
        where: { slug: 'otomobil' }
    });

    if (!otomobil) {
        console.error("Otomobil category not found!");
        return;
    }

    console.log(`Otomobil ID: ${otomobil.id}`);

    // 2. Update Listing
    const result = await prisma.listing.update({
        where: { id: listingId },
        data: {
            categoryId: otomobil.id
        }
    });

    console.log("Moved!", result);
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
