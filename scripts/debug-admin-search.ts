
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const query = 'ferr';
    console.log(`Testing search for: "${query}"`);

    const where: any = {
        status: { not: 'DELETED' } // Default status filter
    };

    if (query) {
        where.OR = [
            { title: { contains: query, mode: 'insensitive' } },
            { id: { contains: query, mode: 'insensitive' } }
        ];
    }

    console.log('Constructed Where:', JSON.stringify(where, null, 2));

    const listings = await prisma.listing.findMany({
        where,
        select: { id: true, title: true, status: true }
    });

    console.log(`Found ${listings.length} listings:`);
    listings.forEach(l => console.log(`- ${l.title} (${l.id}) [${l.status}]`));
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
