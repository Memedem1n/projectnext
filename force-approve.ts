
import prisma from './src/lib/prisma';

async function main() {
    const listingId = 'cmim7mqs40000e8uu9ugdzb2l';
    console.log(`Force approving listing: ${listingId}`);

    try {
        const result = await prisma.listing.update({
            where: { id: listingId },
            data: {
                status: 'ACTIVE',
                isActive: true,
                approvedAt: new Date()
            }
        });
        console.log("Update Success:", result);
    } catch (error) {
        console.error("Update Failed:", error);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
