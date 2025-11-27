const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const tokens = await prisma.verificationToken.findMany({
        orderBy: { expires: 'desc' },
        take: 5
    });

    console.log('Last 5 tokens:');
    tokens.forEach(t => {
        console.log(`Email: ${t.email}, Token: ${t.token}, Expires: ${t.expires}`);
    });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
