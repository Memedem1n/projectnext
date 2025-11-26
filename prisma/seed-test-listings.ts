import { PrismaClient } from '@prisma/client'

district: 'Çankaya',
    views: 230,
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
                                                                    views: 320,
        },
    ]

for (const listing of testListings) {
    await prisma.listing.create({
        data: {
            ...listing,
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
