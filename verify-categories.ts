
import prisma from './src/lib/prisma';

async function main() {
    console.log("Verifying Vasıta Subcategories...");

    const vasita = await prisma.category.findUnique({
        where: { slug: 'vasita' },
        include: { children: true }
    });

    if (!vasita) {
        console.error("Vasıta not found!");
        return;
    }

    console.log(`Vasıta Children (${vasita.children.length}):`);
    vasita.children.forEach(c => console.log(`- ${c.name} (${c.slug})`));
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
