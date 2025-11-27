const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Creating test corporate users...');

    // 1. Corporate Gallery User
    const galleryEmail = `test_galeri_${Date.now()}@example.com`;
    const galleryUser = await prisma.user.create({
        data: {
            email: galleryEmail,
            name: 'Test Galeri A.Ş.',
            role: 'CORPORATE_GALLERY',
            status: 'PENDING',
            password: '$2b$10$EpWaTgiFb/H.w.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1', // dummy hash
            dealerProfile: {
                create: {
                    storeName: 'Test Galeri Center',
                    slug: `test-galeri-${Date.now()}`,
                    phone: '05551112233',
                    city: 'İstanbul',
                    district: 'Kadıköy',
                    taxNumber: '1234567890',
                    taxPlateDoc: '/secure-uploads/corporate-docs/1764210200331-Moon_tilt_stars__3440x1440_.jpg' // Existing file
                }
            }
        }
    });
    console.log(`Created Gallery User: ${galleryUser.email}`);

    // 2. Corporate Dealer User
    const dealerEmail = `test_bayi_${Date.now()}@example.com`;
    const dealerUser = await prisma.user.create({
        data: {
            email: dealerEmail,
            name: 'Test Bayi Ltd. Şti.',
            role: 'CORPORATE_DEALER',
            status: 'PENDING',
            password: '$2b$10$EpWaTgiFb/H.w.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1', // dummy hash
            dealerProfile: {
                create: {
                    storeName: 'Test Bayi Plaza',
                    slug: `test-bayi-${Date.now()}`,
                    phone: '05554445566',
                    city: 'Ankara',
                    district: 'Çankaya',
                    taxNumber: '0987654321',
                    taxPlateDoc: '/secure-uploads/corporate-docs/1764210200331-Moon_tilt_stars__3440x1440_.jpg' // Existing file
                }
            }
        }
    });
    console.log(`Created Dealer User: ${dealerUser.email}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
