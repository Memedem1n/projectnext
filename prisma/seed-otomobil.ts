import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const brands = ['BMW', 'Mercedes', 'Audi', 'Volkswagen', 'Toyota', 'Honda', 'Ford', 'Renault', 'Fiat', 'Hyundai'];
const models: Record<string, string[]> = {
    'BMW': ['3 Serisi', '5 Serisi', 'X3', 'X5', '1 Serisi'],
    'Mercedes': ['C Serisi', 'E Serisi', 'GLA', 'GLC', 'A Serisi'],
    'Audi': ['A3', 'A4', 'A6', 'Q3', 'Q5'],
    'Volkswagen': ['Golf', 'Passat', 'Polo', 'Tiguan', 'Jetta'],
    'Toyota': ['Corolla', 'Camry', 'RAV4', 'C-HR', 'Yaris'],
    'Honda': ['Civic', 'Accord', 'CR-V', 'HR-V', 'Jazz'],
    'Ford': ['Focus', 'Fiesta', 'Kuga', 'Puma', 'Mondeo'],
    'Renault': ['Clio', 'Megane', 'Taliant', 'Captur', 'Kadjar'],
    'Fiat': ['Egea', '500', 'Tipo', 'Doblo', 'Panda'],
    'Hyundai': ['i20', 'i30', 'Tucson', 'Kona', 'Elantra']
};

const fuels = ['Benzin', 'Dizel', 'Benzin & LPG', 'Hybrid', 'Elektrik'];
const gears = ['Otomatik', 'Manuel', 'Yarı Otomatik'];
const colors = ['Beyaz', 'Siyah', 'Gri', 'Mavi', 'Kırmızı', 'Gümüş', 'Kahverengi'];
const cities = ['İstanbul', 'Ankara', 'İzmir', 'Antalya', 'Bursa', 'Adana'];
const districts: Record<string, string[]> = {
    'İstanbul': ['Kadıköy', 'Beşiktaş', 'Şişli', 'Ümraniye', 'Maltepe'],
    'Ankara': ['Çankaya', 'Keçiören', 'Yenimahalle', 'Mamak'],
    'İzmir': ['Karşıyaka', 'Bornova', 'Konak', 'Buca'],
    'Antalya': ['Muratpaşa', 'Kepez', 'Konyaaltı'],
    'Bursa': ['Nilüfer', 'Osmangazi', 'Yıldırım'],
    'Adana': ['Çukurova', 'Seyhan', 'Sarıçam']
};

const carImages = [
    'https://images.unsplash.com/photo-1555215695-3004980adade?w=800&q=80',
    'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&q=80',
    'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800&q=80',
    'https://images.unsplash.com/photo-1619405399517-d7fce0f13302?w=800&q=80',
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80'
];

async function main() {
    console.log('🚗 Creating listings for each brand and model...');

    // Find otomobil category
    const otomobilCategory = await prisma.category.findFirst({
        where: { slug: 'otomobil' }
    });

    if (!otomobilCategory) {
        console.error('❌ Otomobil category not found! Please create it first.');
        process.exit(1);
    }

    console.log(`✅ Found otomobil category: ${otomobilCategory.id}\n`);

    // Get or create a test user
    let user = await prisma.user.findFirst({
        where: { email: 'test@sahibinden.com' }
    });

    if (!user) {
        user = await prisma.user.create({
            data: {
                email: 'test@sahibinden.com',
                name: 'Test Kullanıcı',
                // password field removed as it doesn't exist in schema
            }
        });
    }

    let totalCreated = 0;

    // For each brand
    for (const brand of brands) {
        const brandModels = models[brand];

        // For each model
        for (const model of brandModels) {
            console.log(`\n📝 Creating 10 listings for ${brand} ${model}...`);

            // Create 10 listings for this brand-model combination
            for (let i = 0; i < 10; i++) {
                const year = 2015 + Math.floor(Math.random() * 10); // 2015-2024
                const km = Math.floor(Math.random() * 200000); // 0-200,000 km
                const price = 300000 + Math.floor(Math.random() * 2000000); // 300k-2.3M TL
                const fuel = fuels[Math.floor(Math.random() * fuels.length)];
                const gear = gears[Math.floor(Math.random() * gears.length)];
                const color = colors[Math.floor(Math.random() * colors.length)];
                const warranty = Math.random() > 0.7;
                const exchange = Math.random() > 0.6;
                const city = cities[Math.floor(Math.random() * cities.length)];
                const district = districts[city][Math.floor(Math.random() * districts[city].length)];

                await prisma.listing.create({
                    data: {
                        title: `${year} ${brand} ${model}`,
                        description: `Sahibinden temiz ${brand} ${model}. ${year} model, ${km.toLocaleString()} km'de. ${fuel} yakıt, ${gear} vites. ${color} renk. ${warranty ? 'Garantili.' : ''} ${exchange ? 'Takas yapılır.' : ''}`,
                        price: price,
                        categoryId: otomobilCategory.id,
                        userId: user.id,
                        brand: brand,
                        model: model,
                        year: year,
                        km: km,
                        fuel: fuel,
                        gear: gear,
                        color: color,
                        warranty: warranty,
                        exchange: exchange,
                        city: city,
                        district: district,
                        status: 'ACTIVE', // Approval system
                        isActive: true,   // Approval system
                        images: {
                            create: [
                                {
                                    url: carImages[Math.floor(Math.random() * carImages.length)],
                                    order: 0
                                }
                            ]
                        }
                    }
                });

                totalCreated++;
            }

            console.log(`   ✅ Created 10 listings for ${brand} ${model}`);
        }

        console.log(`\n✅ Completed ${brand} - Total: ${totalCreated} listings`);
    }

    console.log(`\n🎉 Successfully created ${totalCreated} otomobil listings!`);
    console.log(`   📊 ${brands.length} brands × ~5 models × 10 listings each`);
}

main()
    .catch((e) => {
        console.error('❌ Error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
