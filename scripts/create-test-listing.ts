import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    try {
        // 1. Get User
        const user = await prisma.user.findFirst()
        if (!user) {
            console.error('No user found')
            return
        }
        console.log('User found:', user.email)

        // 2. Get Category
        const category = await prisma.category.findFirst({
            where: { slug: 'otomobil' }
        })

        let targetCategoryId = category?.id;

        if (!targetCategoryId) {
            const anyCat = await prisma.category.findFirst();
            if (!anyCat) {
                console.error('No category found');
                return;
            }
            targetCategoryId = anyCat.id;
            console.log('Using fallback category:', anyCat.name);
        } else {
            console.log('Category found:', category?.name);
        }

        // 3. Create Listing
        const listing = await prisma.listing.create({
            data: {
                title: 'Test İlanı - Manuel Oluşturuldu',
                description: 'Bu ilan script tarafından test amaçlı oluşturulmuştur.',
                price: 1500000, // Int
                // currency: 'TRY', // Removed
                categoryId: targetCategoryId!,
                userId: user.id,
                status: 'PENDING',
                city: 'İstanbul',
                district: 'Kadıköy',

                // Vehicle Details (Flat structure)
                brand: 'BMW',
                model: '3 Serisi',
                year: 2023,
                fuel: 'Benzin',
                gear: 'Otomatik',
                caseType: 'Sedan',
                km: 15000,
                color: 'Beyaz',
                // motorPower: 170, // Removed if not in schema
                // motorVolume: 1600, // Removed if not in schema

                images: {
                    create: [
                        { url: 'https://images.unsplash.com/photo-1503376763036-066120622c74', order: 0 },
                        { url: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888', order: 1 }
                    ]
                },

                contactPreference: 'both',
                expertReports: [],
                warranty: true,
                exchange: false,
                tramer: '0'
            }
        })

        console.log('Listing created successfully:', listing.id)
        console.log('Status:', listing.status)
    } catch (error: any) {
        console.error('Error creating listing:', error.message || error)
    } finally {
        await prisma.$disconnect()
    }
}

main()
