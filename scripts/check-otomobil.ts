
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const category = await prisma.category.findFirst({
        where: { slug: 'otomobil' },
        include: { parent: true }
    });
    console.log('Otomobil Category:', category);

    const vasita = await prisma.category.findFirst({
        where: { slug: 'vasita' },
        include: { children: true }
    });
    console.log('Vasita Category:', vasita);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
