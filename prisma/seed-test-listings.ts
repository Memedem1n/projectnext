import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    // Get the first user (or create one if needed)
    let user = await prisma.user.findFirst()

    if (!user) {
        user = await prisma.user.create({
            data: {
                email: 'test@example.com',
                name: 'Test Kullanıcı',
                phone: '0532 555 44 33',
                // role and isVerified removed as they don't exist in schema
            }
        })
    }

    // Get category IDs
    const categories = await prisma.category.findMany({
        where: {
            slug: {
                in: ['otomobil-audi-a6', 'otomobil-bmw-3-serisi', 'otomobil-mercedes-c-serisi']
            }
        }
    })

    if (categories.length === 0) {
        console.log('No categories found. Please ensure categories exist in the database.')
        return
    }

    // Create test listings
    const testListings = [
        {
            title: '2020 Audi A6 2.0 TDI Quattro',
            description: 'Tertemiz, bakımlı, garaj arabası. Tüm bakımları zamanında yapılmıştır.',
            price: 1250000,
            categoryId: categories[0].id,
            userId: user.id,
            brand: 'Audi',
            model: 'A6',
            year: 2020,
            km: 45000,
            fuel: 'Dizel',
            gear: 'Otomatik',
            color: 'Siyah',
            warranty: true,
            exchange: false,
            city: 'İstanbul',
            district: 'Beşiktaş',
            // views removed as it might not exist in schema or needs default
        },
        {
            title: '2019 BMW 3.20i M Sport',
            description: 'M Sport paket, full full, hasarsız.',
            price: 980000,
            categoryId: categories[1]?.id || categories[0].id,
            userId: user.id,
            brand: 'BMW',
            model: '3 Serisi',
            year: 2019,
            km: 62000,
            fuel: 'Benzin',
            gear: 'Otomatik',
            color: 'Beyaz',
            warranty: false,
            exchange: true,
            city: 'Ankara',
            district: 'Çankaya',
        },
        {
            title: '2021 Mercedes C200 AMG',
            description: 'Sıfır ayarında, tek elden, garaj arabası.',
            price: 1450000,
            categoryId: categories[2]?.id || categories[0].id,
            userId: user.id,
            brand: 'Mercedes',
            model: 'C Serisi',
            year: 2021,
            km: 28000,
            fuel: 'Benzin',
            gear: 'Otomatik',
            color: 'Gri',
            warranty: true,
            exchange: true,
            city: 'İzmir',
            district: 'Bornova',
        },
    ]

    for (const listing of testListings) {
        await prisma.listing.create({
            data: {
                ...listing,
                status: 'ACTIVE',
                isActive: true,
                images: {
                    create: [
                        {
                            url: 'https://picsum.photos/800/600?random=' + Math.random(),
                            order: 0,
                            isCover: true,
                        }
                    ]
                }
            }
        })
    }

    console.log('✅ Test listings created successfully!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
