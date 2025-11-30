import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const email = 'test@example.com';
    console.log(`🔄 Updating role for ${email}...`);

    const user = await prisma.user.update({
        where: { email },
        data: { role: 'CORPORATE' }
    });

    console.log(`✅ User ${user.email} role updated to: ${user.role}`);
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
