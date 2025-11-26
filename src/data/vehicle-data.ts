export const VEHICLE_DATA = {
    brands: [
        { id: "bmw", name: "BMW" },
        { id: "mercedes", name: "Mercedes-Benz" },
        { id: "audi", name: "Audi" },
        { id: "vw", name: "Volkswagen" },
        { id: "ford", name: "Ford" },
        { id: "honda", name: "Honda" },
        { id: "toyota", name: "Toyota" },
        { id: "fiat", name: "Fiat" },
        { id: "renault", name: "Renault" },
    ],
    models: {
        "bmw": [
            { id: "1-series", name: "1 Serisi" },
            { id: "3-series", name: "3 Serisi" },
            { id: "5-series", name: "5 Serisi" },
            { id: "x1", name: "X1" },
            { id: "x3", name: "X3" },
            { id: "x5", name: "X5" },
        ],
        "mercedes": [
            { id: "a-class", name: "A Serisi" },
            { id: "c-class", name: "C Serisi" },
            { id: "e-class", name: "E Serisi" },
            { id: "gla", name: "GLA" },
        ],
        "audi": [
            { id: "a3", name: "A3" },
            { id: "a4", name: "A4" },
            { id: "a6", name: "A6" },
            { id: "q3", name: "Q3" },
        ],
        "vw": [
            { id: "golf", name: "Golf" },
            { id: "passat", name: "Passat" },
            { id: "polo", name: "Polo" },
            { id: "tiguan", name: "Tiguan" },
        ],
        // Generic fallback for others
        "default": [
            { id: "model-1", name: "Model 1" },
            { id: "model-2", name: "Model 2" },
        ]
    },
    years: Array.from({ length: 20 }, (_, i) => (2024 - i).toString()),
    fuels: ["Benzin", "Dizel", "Hibrit", "Elektrik", "LPG & Benzin"],
    gears: ["Otomatik", "Yarı Otomatik", "Manuel"],
    caseTypes: ["Sedan", "Hatchback", "Station Wagon", "Cabrio", "Coupe", "SUV", "MPV"],
    versions: {
        "3-series": ["320i ed", "320d", "318i", "330i", "M3"],
        "c-class": ["C 180", "C 200 d", "C 220 d", "AMG C 63"],
        "default": ["1.0 TSI", "1.6 TDI", "1.5 dCi", "1.4 TFSI", "1.6 i-VTEC"]
    },
    packages: ["M Sport", "Luxury Line", "Sport Line", "Techno Plus", "AMG", "Avantgarde", "Exclusive", "Titanium", "Trend", "Joy", "Touch", "Icon"],

    // Constraints for dynamic filtering
    modelFuelConstraints: {
        "3-series": ["Benzin", "Dizel", "Hibrit"],
        "1-series": ["Benzin", "Dizel"],
        "i3": ["Elektrik", "Hibrit"],
        "iX": ["Elektrik"],
        "default": ["Benzin", "Dizel", "Hibrit", "Elektrik", "LPG & Benzin"]
    } as Record<string, string[]>,

    fuelGearConstraints: {
        "Elektrik": ["Otomatik"],
        "Hibrit": ["Otomatik", "Yarı Otomatik"],
        "Benzin": ["Otomatik", "Yarı Otomatik", "Manuel"],
        "Dizel": ["Otomatik", "Yarı Otomatik", "Manuel"],
        "LPG & Benzin": ["Manuel", "Yarı Otomatik"]
    } as Record<string, string[]>
};

export const EQUIPMENT_DATA = [
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
