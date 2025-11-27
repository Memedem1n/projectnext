const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const token = await prisma.verificationToken.findFirst({
        where: { email: 'test_verification@example.com' },
        orderBy: { createdAt: 'desc' },
    });
    console.log(token ? token.token : 'NO_TOKEN_FOUND');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
