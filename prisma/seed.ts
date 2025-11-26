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
