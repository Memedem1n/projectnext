import { CATEGORIES } from "./categories";

export type Listing = {
    id: string;
    title: string;
    price: string;
    location: string;
    date: string;
    image: string;
    categoryId: string;
    subcategoryId: string;
    features: string[];
    description?: string;
    seller: {
        name: string;
        type: "individual" | "corporate";
        isVerified: boolean;
        verifiedStatus?: {
            phone: boolean;
            id: boolean;
        };
        score?: number;
        image?: string;
    };
    verifiedReport?: boolean;
    specs?: {
        fuel?: string;
        gear?: string;
        year?: number;
        km?: string;
        roomCount?: string;
        heating?: string;
        enginePower?: string; // HP
        engineDisplacement?: string; // CC
        traction?: string; // 4x2, 4x4
    };
    tags: string[];
    details?: {
        model?: string;
        series?: string;
        color?: string;
        damage?: string;
    };
    damageInfo?: {
        hasDamageRecord: boolean;
        damageAmount?: number; // TL cinsinden
        damagedPartsCount?: number;
        status?: "Hatasız" | "Boyalı" | "Değişen" | "Hasarlı";
        damagedParts?: string[]; // ["Ön Kaput", "Ön Tampon", ...]
    };
};

const LOCATIONS = [
    "İstanbul, Kadıköy", "İstanbul, Beşiktaş", "İstanbul, Şişli", "İstanbul, Ümraniye",
    "Ankara, Çankaya", "Ankara, Keçiören", "Ankara, Yenimahalle",
    "İzmir, Karşıyaka", "İzmir, Bornova", "İzmir, Konak",
    "Antalya, Muratpaşa", "Bursa, Nilüfer", "Adana, Çukurova"
];

const TITLES: Record<string, string[]> = {
    // Emlak
    "konut": ["Satılık 3+1 Lüks Daire", "Merkezi Konumda 2+1", "Deniz Manzaralı Villa", "Site İçi 4+1", "Yatırımlık 1+1", "Bahçeli Müstakil Ev", "Dublex Daire", "Sıfır Bina 3+1", "Kiralık Eşyalı Daire", "Öğrenciye Uygun 1+1"],
    "isyeri": ["Kiralık Ofis Katı", "Devren Satılık Dükkan", "Plaza Katı", "Depolu Dükkan", "Merkezi İş Hanı", "Cadde Üzeri Mağaza"],
    "arsa": ["Yatırımlık Arsa", "Denize Sıfır Arazi", "İmarlı Arsa", "Bağ Bahçe", "Sanayi İmarlı Arsa", "Zeytinlik"],

    // Vasıta
    "otomobil": ["BMW 320i M Sport", "Mercedes C200 AMG", "Audi A4 S-Line", "Volkswagen Passat Highline", "Renault Clio Joy", "Fiat Egea Urban", "Toyota Corolla Hybrid", "Honda Civic Executive", "Ford Focus Titanium", "Hyundai i20 Jump"],
    "arazi-suv-pickup": ["Range Rover Sport", "Toyota Land Cruiser", "Dacia Duster", "Nissan Qashqai", "Peugeot 3008", "Ford Ranger Wildtrak", "Volkswagen Amarok", "Jeep Wrangler"],
    "motosiklet": ["Honda PCX 125", "Yamaha XMAX 250", "Vespa GTS 300", "Ducati Panigale", "Harley Davidson Iron 883", "KTM Duke 390", "Bajaj Pulsar"],

    // İkinci El
    "bilgisayar": ["MacBook Pro M1", "Asus ROG Strix", "Lenovo ThinkPad", "Dell XPS 13", "HP Pavilion Gaming", "MSI Katana", "iPad Pro 12.9", "Samsung Galaxy Tab S8", "Masaüstü Oyun Bilgisayarı", "Nvidia RTX 3060 Ekran Kartı"],
    "cep-telefonu": ["iPhone 14 Pro Max", "Samsung Galaxy S23 Ultra", "Xiaomi 13 Pro", "OnePlus 11", "Google Pixel 7", "iPhone 13", "Samsung Galaxy A54", "Redmi Note 12", "Huawei P60 Pro", "iPhone 11 Temiz"],
    "fotograf-kamera": ["Sony A7 III Body", "Canon EOS R6", "Fujifilm X-T5", "Nikon Z6 II", "DJI Mini 3 Pro Drone", "GoPro Hero 11 Black", "Sigma 24-70mm Lens"],

    // Fallbacks
    "emlak": ["Satılık Gayrimenkul", "Kiralık Gayrimenkul", "Fırsat Daire"],
    "vasita": ["Sahibinden Temiz Araç", "Acil Satılık", "Düşük Kilometre"],
    "ikinci-el": ["Az Kullanılmış", "Sıfır Ayarında", "Kutulu Faturalı"],
    "default": ["Fırsat Ürünü", "Kaçırılmayacak Fiyat", "Acil Satılık", "Temiz Kullanılmış"]
};

const IMAGES: Record<string, string[]> = {
    // Emlak
    "konut": [
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
        "https://images.unsplash.com/photo-1600596542815-2495db98dada?w=800&q=80",
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80"
    ],
    "isyeri": [
        "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
        "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80"
    ],

    // Vasıta
    "otomobil": [
        "https://images.unsplash.com/photo-1555215695-3004980adade?w=800&q=80",
        "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&q=80",
        "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800&q=80",
        "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&q=80"
    ],
    "arazi-suv-pickup": [
        "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80",
        "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&q=80"
    ],
    "motosiklet": [
        "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&q=80",
        "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800&q=80"
    ],

    // İkinci El
    "bilgisayar": [
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca4?w=800&q=80",
        "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&q=80"
    ],
    "cep-telefonu": [
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80",
        "https://images.unsplash.com/photo-1598327105666-5b89351aff23?w=800&q=80"
    ],

    // Fallbacks
    "emlak": ["https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80"],
    "vasita": ["https://images.unsplash.com/photo-1503376763036-066120622c74?w=800&q=80"],
    "ikinci-el": ["https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&q=80"],
    "default": ["https://images.unsplash.com/photo-1555215695-3004980adade?w=800&q=80"]
};

function getRandomItem<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

function formatPrice(amount: number): string {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount);
}

export function generateMockListings(countPerCategory: number = 100): Listing[] {
    const listings: Listing[] = [];
    let idCounter = 1;

    CATEGORIES.forEach(category => {
        const subcategories = category.subcategories || [{ id: "general", name: "Genel" }];

        subcategories.forEach(sub => {
            for (let i = 0; i < countPerCategory; i++) {
                const isCar = category.id === "vasita";
                const isRealEstate = category.id === "emlak";

                let price = 0;
                if (isCar) price = Math.floor(Math.random() * 4000000) + 500000;
                else if (isRealEstate) price = Math.floor(Math.random() * 20000000) + 2000000;
                else price = Math.floor(Math.random() * 50000) + 1000;

                const titleOptions = TITLES[sub.id] || TITLES[category.id] || TITLES["default"];
                const title = getRandomItem(titleOptions);

                const imageOptions = IMAGES[sub.id] || IMAGES[category.id] || IMAGES["default"];
                const image = getRandomItem(imageOptions);

                // Seller Logic
                const isCorporate = Math.random() > 0.6;
                const isVerified = Math.random() > 0.5;
                const sellerName = isCorporate
                    ? getRandomItem(["Oto Galeri", "Emlak Ofisi", "Premium Motors", "Güven İnşaat"])
                    : getRandomItem(["Ahmet Y.", "Mehmet K.", "Ayşe S.", "Fatma D."]);

                // Tags Logic
                const tags = [];
                if (Math.random() > 0.7) tags.push("Garantili");
                if (Math.random() > 0.6) tags.push("Takaslı");
                if (Math.random() > 0.8) tags.push("Videolu");
                // Simulate "Suitable Price" logic (mock)
                if (Math.random() > 0.85) tags.push("Uygun Fiyat");

                listings.push({
                    id: idCounter.toString(),
                    title: `${title} #${i + 1}`,
                    price: formatPrice(price),
                    location: getRandomItem(LOCATIONS),
                    date: `${Math.floor(Math.random() * 24)} saat önce`,
                    image: image,
                    categoryId: category.id,
                    subcategoryId: sub.id,
                    features: [],
                    description: "Aracımız temiz kullanılmış olup, tüm bakımları yetkili serviste yapılmıştır. Yedek anahtarı ve kitapçıkları mevcuttur. Alıcısına şimdiden hayırlı olsun.",
                    seller: {
                        name: sellerName,
                        type: isCorporate ? "corporate" : "individual",
                        isVerified: isVerified,
                        verifiedStatus: isVerified ? {
                            phone: Math.random() > 0.3,
                            id: Math.random() > 0.5
                        } : undefined,
                        score: isCorporate ? Number((4 + Math.random()).toFixed(1)) : undefined,
                        image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${idCounter}`
                    },
                    verifiedReport: isCar ? Math.random() > 0.6 : undefined,
                    specs: isCar ? {
                        fuel: getRandomItem(["Benzin", "Dizel", "Hibrit"]),
                        gear: getRandomItem(["Otomatik", "Manuel"]),
                        year: 2020 + Math.floor(Math.random() * 4),
                        km: `${Math.floor(Math.random() * 100) * 1000} km`,
                        enginePower: `${getRandomItem([136, 150, 170, 190, 245])} HP`,
                        engineDisplacement: `${getRandomItem([1499, 1598, 1995, 2993])} cc`,
                        traction: getRandomItem(["Arkadan İtiş", "Önden Çekiş", "4x4"])
                    } : isRealEstate ? {
                        roomCount: getRandomItem(["2+1", "3+1", "4+1"]),
                        heating: getRandomItem(["Kombi", "Merkezi", "Yerden Isıtma"]),
                        year: 2023
                    } : undefined,
                    tags: tags,
                    details: isCar ? {
                        model: "BMW",
                        series: "3 Serisi",
                        color: getRandomItem(["Beyaz", "Siyah", "Gri", "Mavi", "Kırmızı"]),
                        damage: getRandomItem(["Hatasız", "Boyalı", "Değişenli", "Hasar Kayıtlı"]),
                    } : undefined,
                    damageInfo: isCar ? (() => {
                        const hasDamageRecord = Math.random() > 0.4;
                        const status = getRandomItem(["Hatasız", "Boyalı", "Değişen", "Hasarlı"]) as "Hatasız" | "Boyalı" | "Değişen" | "Hasarlı";
                        const damagedParts = status !== "Hatasız"
                            ? getRandomItem([
                                ["Ön Kaput"],
                                ["Ön Tampon", "Ön Kaput"],
                                ["Bagaj"],
                                ["Ön Sol Çamurluk", "Ön Kapı Sol"],
                                ["Arka Tampon"],
                            ])
                            : [];

                        return {
                            hasDamageRecord,
                            damageAmount: hasDamageRecord ? Math.floor(Math.random() * 50000) : 0,
                            damagedPartsCount: damagedParts.length,
                            status,
                            damagedParts,
                        };
                    })() : undefined
                });
                idCounter++;
            }
        });
    });

    return listings;
}

// Singleton-like access to mock data
export const MOCK_LISTINGS = generateMockListings(100);

// Generate 200 car listings for category pages
export function generateCarListings(count: number = 200) {
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

    const listings: any[] = [];

    for (let i = 0; i < count; i++) {
        const brand = brands[Math.floor(Math.random() * brands.length)];
        const model = models[brand][Math.floor(Math.random() * models[brand].length)];
        const year = 2015 + Math.floor(Math.random() * 10); // 2015-2024
        const km = Math.floor(Math.random() * 200000); // 0-200,000 km
        const price = 300000 + Math.floor(Math.random() * 2000000); // 300k-2.3M TL
        const fuel = fuels[Math.floor(Math.random() * fuels.length)];
        const gear = gears[Math.floor(Math.random() * gears.length)];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const warranty = Math.random() > 0.7;
        const exchange = Math.random() > 0.6;

        const location = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
        const [city, district] = location.split(', ');

        listings.push({
            id: `mock-car-${i + 1}`,
            title: `${year} ${brand} ${model}`,
            price: price,
            image: IMAGES.otomobil[Math.floor(Math.random() * IMAGES.otomobil.length)],
            images: [{ url: IMAGES.otomobil[Math.floor(Math.random() * IMAGES.otomobil.length)] }],
            date: `${Math.floor(Math.random() * 30) + 1} gün önce`,
            city: city,
            district: district,
            location: location,
            categoryId: 'otomobil',
            brand: brand,
            model: model,
            year: year,
            km: km,
            fuel: fuel,
            gear: gear,
            color: color,
            warranty: warranty,
            exchange: exchange,
            user: {
                name: `Satıcı ${i + 1}`,
                role: Math.random() > 0.8 ? 'DEALER' : 'USER',
                isVerified: Math.random() > 0.5
            },
            specs: {
                year: year,
                km: `${km.toLocaleString()} km`,
                fuel: fuel,
                gear: gear
            }
        });
    }

    return listings;
}

export const MOCK_CAR_LISTINGS = generateCarListings(200);

