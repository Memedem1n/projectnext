import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Vasıta Alt Kategorileri
const VASITA_SUBCATEGORIES = [
    { name: 'Otomobil', count: 401077 },
    { name: 'Arazi, SUV & Pickup', count: 105704 },
    { name: 'Elektrikli Araçlar', count: 8839 },
    { name: 'Motosiklet', count: 126599 },
    { name: 'Minivan & Panelvan', count: 83621 },
    { name: 'Ticari Araçlar', count: 53137 },
    { name: 'Kiralık Araçlar', count: 10582 },
    { name: 'Deniz Araçları', count: 9365 },
    { name: 'Hasarlı Araçlar', count: 4608 },
    { name: 'Karavan', count: 4850 },
    { name: 'Klasik Araçlar', count: 1681 },
    { name: 'Hava Araçları', count: 26 },
    { name: 'ATV', count: 3084 },
    { name: 'UTV', count: 488 },
    { name: 'Engelli Plakalı Araçlar', count: 147 }
];

// Otomobil Markaları
const OTOMOBIL_BRANDS = [
    'Abarth', 'Aion', 'Alfa Romeo', 'Alpine', 'Anadol', 'Arora', 'Aston Martin', 'Audi',
    'Bentley', 'BMW', 'Buick', 'BYD', 'Cadillac', 'Cenntro', 'Chery', 'Chevrolet',
    'Chrysler', 'Citroen', 'Cupra', 'Dacia', 'Daewoo', 'Daihatsu', 'Dodge', 'DS Automobiles',
    'Eagle', 'Ferrari', 'Fiat', 'Ford', 'Geely', 'Honda', 'Hyundai', 'I-GO',
    'Ikco', 'Infiniti', 'Jaguar', 'Jiayuan', 'Joyce', 'Kia', 'Kral', 'Kuba',
    'Lada', 'Lamborghini', 'Lancia', 'Leapmotor', 'Lexus', 'Lincoln', 'Lotus', 'Luqi',
    'Marcos', 'Maserati', 'Mazda', 'McLaren', 'Mercedes-Benz', 'MG', 'Micro', 'Mini',
    'Mitsubishi', 'Morgan', 'Nieve', 'Niğmer', 'Nissan', 'Oldsmobile', 'Opel', 'Orti',
    'Peugeot', 'Plymouth', 'Polestar', 'Pontiac', 'Porsche', 'Proton', 'Rainwoll', 'Reeder',
    'Regal Raptor', 'Relive', 'Renault', 'RKS', 'Rolls-Royce', 'Rover', 'Saab', 'Seat',
    'Skoda', 'Smart', 'Subaru', 'Suzuki', 'Tata', 'Tesla', 'The London Taxi', 'Tofaş',
    'TOGG', 'Toyota', 'Vanderhall', 'Volkswagen', 'Volta', 'Volvo', 'XEV', 'Yuki'
];

// Arazi Markaları
const ARAZI_BRANDS = [
    'Acura', 'Alfa Romeo', 'Aston Martin', 'Audi', 'Bentley', 'BMW', 'BYD', 'Cadillac',
    'Chery', 'Chevrolet', 'Chrysler', 'Citroen', 'Cupra', 'Dacia', 'Daewoo', 'Daihatsu',
    'DFM', 'DFSK', 'Dodge', 'DS Automobiles', 'Ferrari', 'Fiat', 'Ford', 'Forthing',
    'Foton', 'GMC', 'Honda', 'Hongqi', 'Hummer', 'Hyundai', 'Infiniti', 'Isuzu',
    'Jaecoo', 'Jaguar', 'Jeep', 'Kia', 'Lada', 'Lamborghini', 'Land Rover', 'Lexus',
    'Lincoln', 'Lotus', 'Lynk & Co', 'Mahindra', 'Maserati', 'Mazda', 'Mercedes-Benz', 'Mercury',
    'MG', 'Mini', 'Mitsubishi', 'Nissan', 'Oldsmobile', 'Opel', 'Peugeot', 'Porsche',
    'Poyraz', 'Renault', 'Rolls-Royce', 'Seat', 'Seres', 'Skoda', 'Skywell', 'SsangYong',
    'Subaru', 'Suzuki', 'SWM', 'Tata', 'TOGG', 'Toyota', 'Volkswagen', 'Volvo', 'Voyah'
];

// Motosiklet Markaları
const MOTOSIKLET_BRANDS = [
    'Abush', 'Altai', 'Apachi', 'Apec', 'Aprilia', 'Ariic', 'Arora', 'Asya',
    'Bajaj', 'Banhe', 'Baotian', 'Barossa', 'Belderia', 'Benda Motor', 'Benelli', 'Beta',
    'Better', 'Bianchi', 'Bisan', 'BMW', 'Boom', 'Borelli Ledow', 'Brixton', 'BSA',
    'BuMoto/Jinling', 'Cagiva', 'Can-Am', 'Caza', 'CFmoto', 'CRN', 'CSN Motor', 'Çelik Motor',
    'Daelim', 'Dayun', 'Delta Motorcycle', 'Derbi', 'Dofern', 'Doohan', 'Dorado', 'Ducati',
    'Enbest', 'Falcon', 'Fantic', 'FCM', 'Fosti', 'GasGas', 'Gilera', 'Haojin',
    'Haojue', 'Harley-Davidson', 'Hero', 'Heroway', 'Honda', 'Husqvarna', 'Hyosung', 'Hyundai',
    'Indian', 'Italjet', 'IZH', 'Jawa', 'Jaxin', 'Jiajue', 'Jinlun', 'Jonway',
    'JPN Motor', 'Kadırga', 'Kamax', 'Kangda', 'Kanuni', 'Kawasaki', 'Kayo Moto', 'Keeway',
    'Kimmi', 'Kinetic', 'Kove', 'Kral Motor', 'KTM', 'Kuba', 'Kymco', 'Lambretta',
    'Leksas', 'Lifan', 'LML', 'Malaguti', 'Maranta', 'Megelli', 'Meka Motor', 'Memnun',
    'Minsk', 'Mobylette', 'Modenas', 'Mondial', 'Monero', 'Moto Guzzi', 'Motolux', 'Moto Morini',
    'Motoran', 'Motozeus', 'Musatti', 'Mutt', 'MV Agusta', 'MZ', 'Nanok', 'Ningbo Longjia',
    'Ohvale', 'Peugeot', 'PGO', 'Piaggio', 'Pioneer', 'Puch', 'QJ', 'Qooder',
    'Ramzey', 'Regal Raptor', 'Renda', 'Revolt', 'Rewaco', 'Rieju', 'RKN', 'RKS',
    'RMG Moto Gusto', 'Royal Alloy', 'Royal Enfield', 'Rutec', 'Salcano', 'Sam Motor', 'Seger', 'SFM',
    'Shenke', 'Sherco', 'Shinari', 'Ski-doo', 'Skygo', 'Skyjet', 'Skyteam', 'Spada',
    'Stmax', 'Sukida', 'Suzuki', 'SWM', 'SYM', 'Taktas Motor', 'Telstar', 'TGB',
    'TM Racing', 'Togo', 'Triumph', 'Truva', 'TT', 'TVS', 'UğurSam', 'UM',
    'Ural', 'Vespa', 'Victory', 'Vitello', 'Voge', 'Volta', 'Voskhod', 'Wuxi',
    'Xingyue', 'Xintian', 'Yamaha', 'Yiben', 'Yiying', 'Yuan', 'Yuki', 'Zealsun',
    'Zelsun', 'Zongshen', 'Zontes', 'Zorro'
];

async function seedVehicleCategories() {
    console.log('🚗 Seeding Vehicle Categories & Brands...');

    // Find Vasıta root category
    const vasitaCategory = await prisma.category.findFirst({
        where: { slug: 'vasita' }
    });

    if (!vasitaCategory) {
        console.error('❌ Vasıta category not found!');
        return;
    }

    console.log(`✅ Found Vasıta category: ${vasitaCategory.id}`);

    // Create subcategories and brands
    for (const subcat of VASITA_SUBCATEGORIES) {
        const slug = subcat.name.toLowerCase()
            .replace(/ı/g, 'i').replace(/ğ/g, 'g').replace(/ü/g, 'u')
            .replace(/ş/g, 's').replace(/ö/g, 'o').replace(/ç/g, 'c')
            .replace(/[&,]/g, '').replace(/\s+/g, '-');

        let subcategory = await prisma.category.findFirst({
            where: { slug }
        });

        if (!subcategory) {
            subcategory = await prisma.category.create({
                data: {
                    name: subcat.name,
                    slug,
                    parentId: vasitaCategory.id,
                    icon: 'Car'
                }
            });
            console.log(`  ✅ Created: ${subcat.name}`);
        } else {
            console.log(`  ⏭️  Exists: ${subcat.name}`);
        }

        // Add brands for Otomobil, Arazi, Motosiklet
        let brands: string[] = [];
        if (subcat.name === 'Otomobil') {
            brands = OTOMOBIL_BRANDS;
        } else if (subcat.name.includes('Arazi')) {
            brands = ARAZI_BRANDS;
        } else if (subcat.name === 'Motosiklet') {
            brands = MOTOSIKLET_BRANDS;
        }

        if (brands.length > 0) {
            console.log(`    📁 Adding ${brands.length} brands to ${subcat.name}...`);
            let added = 0;
            for (const brandName of brands) {
                const brandSlug = `${slug}-${brandName.toLowerCase().replace(/\s+/g, '-').replace(/[&\/]/g, '')}`;

                const existingBrand = await prisma.category.findFirst({
                    where: { slug: brandSlug }
                });

                if (!existingBrand) {
                    await prisma.category.create({
                        data: {
                            name: brandName,
                            slug: brandSlug,
                            parentId: subcategory.id,
                            icon: 'Car'
                        }
                    });
                    added++;
                }
            }
            console.log(`    ✅ Added ${added}/${brands.length} brands`);
        }
    }

    console.log('✅ Vehicle categories seeded successfully!');
}

seedVehicleCategories()
    .catch((e) => {
        console.error('❌ Error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
