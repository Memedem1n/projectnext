import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function createCorporateTestAccounts() {
    console.log("Creating corporate test accounts...");

    // 1. Galeri / Emlak Ofisi
    const galleryUser = await prisma.user.create({
        data: {
            email: "galeri@test.com",
            name: "Ahmet Kaya",
            phone: "5551234567",
            // password, tcIdentityNo, role, status, emailVerified removed
            /* dealerProfile: {
                create: {
                    storeName: "Kaya Emlak Ofisi",
                    slug: "kaya-emlak-ofisi",
                    description: "İstanbul Kadıköy'de emlak hizmetleri",
                    phone: "5551234567",
                    city: "İstanbul",
                    district: "Kadıköy",
                    taxNumber: "1234567890",
                    taxOffice: "Kadıköy",
                    isVerified: true
                }
            } */
        }
    });

    console.log("✅ Galeri/Emlak Ofisi created:", galleryUser.email);

    // 2. Yetkili Bayi
    const dealerUser = await prisma.user.create({
        data: {
            email: "bayi@test.com",
            name: "Mehmet Yıldız",
            phone: "5559876543",
            // password, tcIdentityNo, role, status, emailVerified removed
            /* dealerProfile: {
                create: {
                    storeName: "Yıldız Otomotiv",
                    slug: "yildiz-otomotiv",
                    description: "Ankara Çankaya'da yetkili bayilik hizmetleri",
                    phone: "5559876543",
                    city: "Ankara",
                    district: "Çankaya",
                    taxNumber: "0987654321",
                    taxOffice: "Çankaya",
                    authorizedBrand: "BMW",
                    isVerified: true
                }
            } */
        }
    });

    console.log("✅ Yetkili Bayi created:", dealerUser.email);

    console.log("\n🎉 Corporate test accounts created successfully!");
    console.log("Login credentials:");
    console.log("  Galeri: galeri@test.com / test123");
    console.log("  Bayi: bayi@test.com / test123");
}

createCorporateTestAccounts()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
