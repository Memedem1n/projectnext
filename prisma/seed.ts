import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Starting database seed...')

    // Clear existing data
    await prisma.listing.deleteMany()
    await prisma.category.deleteMany()
    await prisma.user.deleteMany()

    // Create Vasıta category
    const vasita = await prisma.category.create({
        data: { name: 'Vasıta', slug: 'vasita', icon: 'car' }
    })

    // Create Otomobil category
    const otomobil = await prisma.category.create({
        data: { name: 'Otomobil', slug: 'otomobil', parentId: vasita.id }
    })

    // Create test user
    const user = await prisma.user.create({
        data: {
            email: 'test@example.com',
            name: 'Test Kullanıcı',
            phone: '+905551234567',
        }
    })

    // Create a test listing
    const listing = await prisma.listing.create({
        data: {
            title: 'Test BMW 320i',
            description: 'Test için oluşturulmuş ilan.',
            price: 1500000,
            km: 50000,
            color: 'Mavi',
            year: 2021,
            brand: 'BMW',
            model: '320i',
            fuel: 'Benzin',
            gear: 'Otomatik',
            caseType: 'Sedan',
            city: 'İstanbul',
            district: 'Kadıköy',
            status: 'ACTIVE',
            isActive: true,
            userId: user.id,
            categoryId: otomobil.id,
            images: {
                create: [
                    { url: 'https://images.unsplash.com/photo-1555215695-3004980adade?w=800&q=80', isCover: true, order: 0 }
                ]
            }
        }
    })

    // Create Equipment
    const equipmentData = [
        {
            id: "safety",
            title: "Güvenlik",
            items: [
                "ABS", "ESP", "ASR", "EBD", "Yokuş Kalkış Desteği",
                "Hava Yastığı (Sürücü)", "Hava Yastığı (Yolcu)", "Hava Yastığı (Yan)", "Hava Yastığı (Perde)",
                "Lastik Basınç Sensörü", "Merkezi Kilit", "Çocuk Kilidi", "İsofix"
            ]
        },
        {
            id: "interior",
            title: "İç Donanım",
            items: [
                "Deri Koltuk", "Kumaş Koltuk", "Elektrikli Camlar", "Klima (Analog)", "Klima (Dijital)",
                "Hız Sabitleyici", "Yol Bilgisayarı", "Start / Stop", "Anahtarsız Giriş ve Çalıştırma",
                "Deri Direksiyon", "Isıtmalı Koltuklar", "Sunroof", "Panoramik Cam Tavan"
            ]
        },
        {
            id: "exterior",
            title: "Dış Donanım",
            items: [
                "Alaşımlı Jant", "Çelik Jant", "Sis Farı", "LED Farlar", "Xenon Farlar",
                "Park Sensörü (Arka)", "Park Sensörü (Ön)", "Geri Görüş Kamerası",
                "Otomatik Katlanır Aynalar", "Yağmur Sensörü", "Far Sensörü"
            ]
        },
        {
            id: "multimedia",
            title: "Multimedya",
            items: [
                "Radyo - CD Çalar", "Bluetooth", "USB / AUX", "Navigasyon",
                "Apple CarPlay", "Android Auto", "Ses Sistemi", "Dokunmatik Ekran"
            ]
        }
    ];

    console.log('🌱 Seeding equipment...');
    for (const section of equipmentData) {
        for (const item of section.items) {
            // Check if exists first to avoid duplicates if re-running without delete
            const exists = await prisma.equipment.findUnique({ where: { name: item } });
            if (!exists) {
                await prisma.equipment.create({
                    data: {
                        id: item, // Use name as ID for simplicity with frontend
                        name: item,
                        category: section.title
                    }
                });
            }
        }
    }

    console.log(`✅ Created listing: ${listing.id}`)
    console.log('✅ Seed completed successfully!')
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
