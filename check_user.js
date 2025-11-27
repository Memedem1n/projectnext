const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const user = await prisma.user.findFirst({
        orderBy: { createdAt: 'desc' }
    });

    if (user) {
        console.log('Last User:', user.email, user.role);
    } else {
        console.log('No users found.');
    }

    const tokens = await prisma.verificationToken.count();
    console.log('Tokens count:', tokens);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
