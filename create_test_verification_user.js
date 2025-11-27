const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Creating test individual user for verification...');

    const email = `test_bireysel_${Date.now()}@example.com`;

    try {
        const user = await prisma.user.create({
            data: {
                email: email,
                name: 'Test Bireysel Kullanıcı',
                role: 'INDIVIDUAL',
                status: 'ACTIVE', // Individuals are active by default, but verification is separate
                tcIdentityNo: '11111111111',
                identityVerified: false,
                // identityDoc field might not be available in types yet if generate failed, 
                // but if DB push worked, it exists in DB. 
                // Prisma Client might strip unknown fields if not generated.
                // Let's try to pass it.
                identityDoc: '/secure-uploads/corporate-docs/1764210200331-Moon_tilt_stars__3440x1440_.jpg'
            }
        });
        console.log(`Created Individual User: ${user.email}`);
    } catch (e) {
        console.error("Error creating user:", e);
        console.log("If error is about unknown field 'identityDoc', please run 'npx prisma generate' again.");
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
