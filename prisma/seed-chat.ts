import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Starting chat seed...')

    // Clear existing data
    await prisma.message.deleteMany()
    await prisma.conversation.deleteMany()
    await prisma.listing.deleteMany()
    await prisma.user.deleteMany()
    await prisma.category.deleteMany()

    // Create Category
    const vasita = await prisma.category.create({
        data: { name: 'Vasıta', slug: 'vasita', icon: 'car' }
    })
    const otomobil = await prisma.category.create({
        data: { name: 'Otomobil', slug: 'otomobil', parentId: vasita.id }
    })

    const password = await hash('password123', 12)

    // Create Seller
    const seller = await prisma.user.create({
        data: {
            email: 'seller@example.com',
            name: 'Satıcı Ahmet',
            password: password,
            phone: '+905551111111',
            role: 'INDIVIDUAL'
        }
    })

    // Create Buyer
    const buyer = await prisma.user.create({
        data: {
            email: 'buyer@example.com',
            name: 'Alıcı Mehmet',
            password: password,
            phone: '+905552222222',
            role: 'INDIVIDUAL'
        }
    })

    // Create Listing for Seller
    const listing = await prisma.listing.create({
        data: {
            title: 'Temiz Aile Aracı',
            description: 'Doktordan temiz, az kullanılmış.',
            price: 950000,
            km: 120000,
            color: 'Beyaz',
            year: 2018,
            brand: 'Toyota',
            model: 'Corolla',
            fuel: 'Benzin',
            gear: 'Otomatik',
            caseType: 'Sedan',
            city: 'Ankara',
            district: 'Çankaya',
            status: 'ACTIVE',
            isActive: true,
            userId: seller.id,
            categoryId: otomobil.id,
            images: {
                create: [
                    { url: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800&q=80', isCover: true, order: 0 }
                ]
            }
        }
    })

    console.log(`✅ Created seller: ${seller.email}`)
    console.log(`✅ Created buyer: ${buyer.email}`)
    console.log(`✅ Created listing: ${listing.id}`)
    console.log('✅ Chat seed completed successfully!')
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
