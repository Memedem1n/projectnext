const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkCorporateUsers() {
    const users = await prisma.user.findMany({
        where: {
            role: {
                in: ['CORPORATE_GALLERY', 'CORPORATE_DEALER']
            }
        },
        select: {
            id: true,
            name: true,
            email: true,
            status: true,
            role: true,
            createdAt: true
        }
    });

    console.log('Kurumsal users:', JSON.stringify(users, null, 2));
    await prisma.$disconnect();
}

checkCorporateUsers();
