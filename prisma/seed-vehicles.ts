import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting vehicle seed...');

    // 1. Get or Create User
    let user = await prisma.user.findFirst({
        where: { email: 'test@example.com' },
    });

    if (!user) {
        user = await prisma.user.create({
            data: {
                email: 'test@example.com',
                name: 'Test User',
                // role removed as it doesn't exist in schema
            },
        });
        console.log('Created test user:', user.id);
    } else {
        console.log('Found existing user:', user.id);
    }

    // 2. Ensure Categories Exist
    // Vasıta -> Otomobil -> BMW -> 3 Serisi
    let vasita = await prisma.category.findUnique({ where: { slug: 'vasita' } });
    if (!vasita) {
        vasita = await prisma.category.create({
            data: { name: 'Vasıta', slug: 'vasita', icon: 'Car' },
        });
    }

    let otomobil = await prisma.category.findUnique({ where: { slug: 'otomobil' } });
    if (!otomobil) {
        otomobil = await prisma.category.create({
            data: { name: 'Otomobil', slug: 'otomobil', parentId: vasita.id },
        });
    }

    let bmw = await prisma.category.findUnique({ where: { slug: 'bmw' } });
    if (!bmw) {
        bmw = await prisma.category.create({
            data: { name: 'BMW', slug: 'bmw', parentId: otomobil.id },
        });
    }

    let audi = await prisma.category.findUnique({ where: { slug: 'audi' } });
    if (!audi) {
        audi = await prisma.category.create({
            data: { name: 'Audi', slug: 'audi', parentId: otomobil.id },
        });
    }

    // 3. Create 10 Distinct Vehicles
    const vehicles = [
        {
            title: 'Sahibinden Temiz BMW 320i',
            price: 1250000,
            km: 120000,
            year: 2015,
            brand: 'BMW',
            model: '320i',
            fuel: 'Benzin',
            gear: 'Otomatik',
            color: 'Beyaz',
            categoryId: bmw.id,
            damage: [], // Hasarsız
        },
        {
            title: 'Hatasız Boyasız BMW 520d',
            price: 2800000,
            km: 45000,
            year: 2021,
            brand: 'BMW',
            model: '520d',
            fuel: 'Dizel',
            gear: 'Otomatik',
            color: 'Siyah',
            categoryId: bmw.id,
            damage: [], // Hasarsız
        },
        {
            title: 'Acil Satılık Audi A3',
            price: 950000,
            km: 180000,
            year: 2014,
            brand: 'Audi',
            model: 'A3',
            fuel: 'Dizel',
            gear: 'Otomatik',
            color: 'Gri',
            categoryId: audi.id,
            damage: [{ part: 'Kaput', status: 'Boyalı' }], // Boyalı
        },
        {
            title: 'Audi A6 Quattro S-Line',
            price: 3500000,
            km: 20000,
            year: 2023,
            brand: 'Audi',
            model: 'A6',
            fuel: 'Hibrit',
            gear: 'Otomatik',
            color: 'Mavi',
            categoryId: audi.id,
            damage: [], // Hasarsız
        },
        {
            title: 'BMW 316i M Sport',
            price: 1100000,
            km: 150000,
            year: 2013,
            brand: 'BMW',
            model: '316i',
            fuel: 'Benzin',
            gear: 'Manuel',
            color: 'Kırmızı',
            categoryId: bmw.id,
            damage: [{ part: 'Sol Çamurluk', status: 'Değişen' }], // Değişen
        },
        {
            title: 'Audi Q7 Prestige',
            price: 5500000,
            km: 80000,
            year: 2020,
            brand: 'Audi',
            model: 'Q7',
            fuel: 'Dizel',
            gear: 'Otomatik',
            color: 'Beyaz',
            categoryId: audi.id,
            damage: [], // Hasarsız
        },
        {
            title: 'Uygun Fiyatlı BMW 116i',
            price: 850000,
            km: 210000,
            year: 2012,
            brand: 'BMW',
            model: '116i',
            fuel: 'Benzin',
            gear: 'Otomatik',
            color: 'Siyah',
            categoryId: bmw.id,
            damage: [{ part: 'Tavan', status: 'Orijinal' }, { part: 'Kaput', status: 'Boyalı' }], // Boyalı
        },
        {
            title: 'Audi A4 Limousine',
            price: 1750000,
            km: 95000,
            year: 2018,
            brand: 'Audi',
            model: 'A4',
            fuel: 'Dizel',
            gear: 'Yarı Otomatik',
            color: 'Gümüş',
            categoryId: audi.id,
            damage: [], // Hasarsız
        },
        {
            title: 'BMW X5 xDrive',
            price: 4200000,
            km: 110000,
            year: 2019,
            brand: 'BMW',
            model: 'X5',
            fuel: 'Dizel',
            gear: 'Otomatik',
            color: 'Lacivert',
            categoryId: bmw.id,
            damage: [{ part: 'Sağ Kapı', status: 'Boyalı' }], // Boyalı
        },
        {
            title: 'Koleksiyonluk BMW M3',
            price: 6000000,
            km: 5000,
            year: 2024,
            brand: 'BMW',
            model: 'M3',
            fuel: 'Benzin',
            gear: 'Otomatik',
            color: 'Yeşil',
            categoryId: bmw.id,
            damage: [], // Hasarsız
        },
    ];

    for (const v of vehicles) {
        const listing = await prisma.listing.create({
            data: {
                title: v.title,
                description: `${v.year} model ${v.brand} ${v.model}. ${v.km} km'de.`,
                price: v.price,
                km: v.km,
                year: v.year,
                brand: v.brand,
                model: v.model,
                fuel: v.fuel,
                gear: v.gear,
                color: v.color,
                categoryId: v.categoryId,
                userId: user.id,
                isActive: true,
                isPremium: v.price > 3000000, // Pahalı araçları premium yapalım
                images: {
                    create: [
                        {
                            url: 'https://images.unsplash.com/photo-1555215695-3004980adade?w=800&q=80',
                            isCover: true,
                        },
                    ],
                },
                damage: {
                    create: v.damage
                }
            },
        });
        console.log(`Created listing: ${listing.title}`);
    }

    console.log('Seed completed successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
