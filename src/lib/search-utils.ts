import { Car, Home, Monitor, Briefcase, Wrench, Tractor, Search } from "lucide-react";

export type SuggestionType = 'category' | 'brand' | 'model' | 'specific';

export interface SearchSuggestion {
    id: string;
    type: SuggestionType;
    title: string;
    subtitle: string;
    url: string;
    icon: any;
    score: number;
}

// Kategori Eş anlamlıları ve Anahtar Kelimeler
const CATEGORY_KEYWORDS: Record<string, { id: string, title: string, keywords: string[], url: string, icon: any }> = {
    'vasita': {
        id: 'vasita',
        title: 'Vasıta',
        keywords: ['araba', 'araç', 'otomobil', 'taşıt', 'vasıta', 'oto', 'car', 'vehicle'],
        url: '/category/vasita',
        icon: Car
    },
    'otomobil': {
        id: 'otomobil',
        title: 'Otomobil',
        keywords: ['araba', 'binek', 'sedan', 'hatchback', 'suv', 'station', 'cabrio', 'coupe'],
        url: '/category/vasita/otomobil',
        icon: Car
    },
    'emlak': {
        id: 'emlak',
        title: 'Emlak',
        keywords: ['ev', 'konut', 'daire', 'villa', 'arsa', 'bina', 'işyeri', 'ofis', 'devren', 'satılık', 'kiralık'],
        url: '/category/emlak',
        icon: Home
    },
    'ikinci-el': {
        id: 'ikinci-el',
        title: 'İkinci El ve Sıfır Alışveriş',
        keywords: ['telefon', 'bilgisayar', 'elektronik', 'beyaz eşya', 'mobilya', 'giyim', 'saat', 'tablet', 'laptop'],
        url: '/category/ikinci-el',
        icon: Monitor
    }
};

// Marka ve Model Veritabanı (Örnek)
const BRAND_MODELS: Record<string, { brand: string, models: string[], categoryId: string, parentId: string }> = {
    'bmw': { brand: 'BMW', models: ['3 Serisi', '5 Serisi', '1 Serisi', 'X3', 'X5', 'iX', 'i4', 'M3', 'M4', 'M5'], categoryId: 'otomobil', parentId: 'vasita' },
    'mercedes': { brand: 'Mercedes-Benz', models: ['C Serisi', 'E Serisi', 'A Serisi', 'S Serisi', 'CLA', 'GLA', 'GLC', 'G Serisi', 'Vito', 'Sprinter'], categoryId: 'otomobil', parentId: 'vasita' },
    'audi': { brand: 'Audi', models: ['A3', 'A4', 'A6', 'A5', 'Q3', 'Q5', 'Q7', 'Q8', 'e-tron', 'RS'], categoryId: 'otomobil', parentId: 'vasita' },
    'volkswagen': { brand: 'Volkswagen', models: ['Golf', 'Passat', 'Polo', 'Tiguan', 'T-Roc', 'Caddy', 'Transporter', 'Amarok', 'Arteon', 'Jetta'], categoryId: 'otomobil', parentId: 'vasita' },
    'toyota': { brand: 'Toyota', models: ['Corolla', 'Yaris', 'C-HR', 'RAV4', 'Hilux', 'Auris', 'Camry', 'Land Cruiser', 'Proace'], categoryId: 'otomobil', parentId: 'vasita' },
    'honda': { brand: 'Honda', models: ['Civic', 'City', 'Jazz', 'CR-V', 'HR-V', 'Accord', 'Type-R'], categoryId: 'otomobil', parentId: 'vasita' },
    'ford': { brand: 'Ford', models: ['Focus', 'Fiesta', 'Puma', 'Kuga', 'Ranger', 'Transit', 'Tourneo', 'Mondeo', 'Mustang'], categoryId: 'otomobil', parentId: 'vasita' },
    'renault': { brand: 'Renault', models: ['Clio', 'Megane', 'Captur', 'Kadjar', 'Austral', 'Taliant', 'Zoe', 'Kangoo', 'Master', 'Trafic'], categoryId: 'otomobil', parentId: 'vasita' },
    'fiat': { brand: 'Fiat', models: ['Egea', '500', 'Panda', 'Doblo', 'Fiorino', 'Ducato', 'Linea', 'Punto'], categoryId: 'otomobil', parentId: 'vasita' },
    'hyundai': { brand: 'Hyundai', models: ['i20', 'i10', 'i30', 'Tucson', 'Bayon', 'Kona', 'Elantra', 'Santa Fe', 'Staria'], categoryId: 'otomobil', parentId: 'vasita' },
    'peugeot': { brand: 'Peugeot', models: ['208', '308', '2008', '3008', '408', '508', '5008', 'Rifter', 'Partner'], categoryId: 'otomobil', parentId: 'vasita' },
    'opel': { brand: 'Opel', models: ['Corsa', 'Astra', 'Mokka', 'Crossland', 'Grandland', 'Insignia', 'Combo', 'Vivaro'], categoryId: 'otomobil', parentId: 'vasita' },
    'citroen': { brand: 'Citroën', models: ['C3', 'C4', 'C5 Aircross', 'C-Elysee', 'Berlingo', 'Jumpy', 'Ami'], categoryId: 'otomobil', parentId: 'vasita' },
    'skoda': { brand: 'Skoda', models: ['Octavia', 'Superb', 'Fabia', 'Kamiq', 'Karoq', 'Kodiaq', 'Scala'], categoryId: 'otomobil', parentId: 'vasita' },
    'seat': { brand: 'Seat', models: ['Leon', 'Ibiza', 'Arona', 'Ateca', 'Tarraco'], categoryId: 'otomobil', parentId: 'vasita' },
    'dacia': { brand: 'Dacia', models: ['Duster', 'Sandero', 'Jogger', 'Spring', 'Lodgy', 'Dokker'], categoryId: 'otomobil', parentId: 'vasita' },
    'nissan': { brand: 'Nissan', models: ['Qashqai', 'Juke', 'X-Trail', 'Micra', 'Navara'], categoryId: 'otomobil', parentId: 'vasita' },
    'kia': { brand: 'Kia', models: ['Sportage', 'Stonic', 'Picanto', 'Rio', 'Ceed', 'Xceed', 'Sorento', 'EV6'], categoryId: 'otomobil', parentId: 'vasita' },
    'volvo': { brand: 'Volvo', models: ['XC90', 'XC60', 'XC40', 'S90', 'S60', 'V90', 'V60'], categoryId: 'otomobil', parentId: 'vasita' },
    'land rover': { brand: 'Land Rover', models: ['Range Rover', 'Sport', 'Velar', 'Evoque', 'Discovery', 'Defender'], categoryId: 'otomobil', parentId: 'vasita' },
    'porsche': { brand: 'Porsche', models: ['Taycan', 'Panamera', 'Cayenne', 'Macan', '911', '718'], categoryId: 'otomobil', parentId: 'vasita' },
    'tesla': { brand: 'Tesla', models: ['Model Y', 'Model 3', 'Model S', 'Model X'], categoryId: 'otomobil', parentId: 'vasita' },
    'togg': { brand: 'Togg', models: ['T10X'], categoryId: 'otomobil', parentId: 'vasita' }
};

// Model Takma Adları (Örn: 320 -> 3 Serisi)
const MODEL_ALIASES: Record<string, { brand: string, model: string }> = {
    '320': { brand: 'bmw', model: '3 Serisi' },
    '520': { brand: 'bmw', model: '5 Serisi' },
    '118': { brand: 'bmw', model: '1 Serisi' },
    'c180': { brand: 'mercedes', model: 'C Serisi' },
    'c200': { brand: 'mercedes', model: 'C Serisi' },
    'e180': { brand: 'mercedes', model: 'E Serisi' },
    'e250': { brand: 'mercedes', model: 'E Serisi' },
    'a180': { brand: 'mercedes', model: 'A Serisi' },
    'passat': { brand: 'volkswagen', model: 'Passat' },
    'golf': { brand: 'volkswagen', model: 'Golf' },
    'corolla': { brand: 'toyota', model: 'Corolla' },
    'civic': { brand: 'honda', model: 'Civic' },
    'megane': { brand: 'renault', model: 'Megane' },
    'clio': { brand: 'renault', model: 'Clio' },
    'egea': { brand: 'fiat', model: 'Egea' },
    'focus': { brand: 'ford', model: 'Focus' }
};

export function getSearchSuggestions(query: string): SearchSuggestion[] {
    if (!query || query.trim().length < 2) return [];

    const normalizedQuery = query.toLowerCase().trim();
    const suggestions: SearchSuggestion[] = [];

    // 1. Kategori Eşleşmeleri
    Object.values(CATEGORY_KEYWORDS).forEach(cat => {
        if (cat.title.toLowerCase().includes(normalizedQuery) ||
            cat.keywords.some(k => k.includes(normalizedQuery))) {
            suggestions.push({
                id: `cat-${cat.id}`,
                type: 'category',
                title: cat.title,
                subtitle: 'Kategori',
                url: cat.url,
                icon: cat.icon,
                score: 100
            });
        }
    });

    // 2. Marka Eşleşmeleri
    Object.entries(BRAND_MODELS).forEach(([key, data]) => {
        if (key.includes(normalizedQuery) || data.brand.toLowerCase().includes(normalizedQuery)) {
            suggestions.push({
                id: `brand-${key}`,
                type: 'brand',
                title: data.brand,
                subtitle: `${CATEGORY_KEYWORDS[data.parentId]?.title || 'Vasıta'} > ${CATEGORY_KEYWORDS[data.categoryId]?.title || 'Otomobil'}`,
                url: `/category/${data.parentId}/${data.categoryId}?brand=${encodeURIComponent(data.brand)}`,
                icon: CATEGORY_KEYWORDS[data.categoryId]?.icon || Car,
                score: 90
            });
        }
    });

    // 3. Model Eşleşmeleri
    Object.entries(BRAND_MODELS).forEach(([key, data]) => {
        data.models.forEach(model => {
            if (model.toLowerCase().includes(normalizedQuery)) {
                suggestions.push({
                    id: `model-${key}-${model}`,
                    type: 'model',
                    title: `${data.brand} ${model}`,
                    subtitle: `${CATEGORY_KEYWORDS[data.parentId]?.title || 'Vasıta'} > ${CATEGORY_KEYWORDS[data.categoryId]?.title || 'Otomobil'} > ${data.brand}`,
                    url: `/category/${data.parentId}/${data.categoryId}?brand=${encodeURIComponent(data.brand)}&model=${encodeURIComponent(model)}`,
                    icon: CATEGORY_KEYWORDS[data.categoryId]?.icon || Car,
                    score: 80
                });
            }
        });
    });

    // 4. Model Takma Adı Eşleşmeleri (Örn: 320)
    Object.entries(MODEL_ALIASES).forEach(([alias, data]) => {
        if (alias.includes(normalizedQuery)) {
            const brandData = BRAND_MODELS[data.brand];
            if (brandData) {
                suggestions.push({
                    id: `alias-${alias}`,
                    type: 'specific',
                    title: `${brandData.brand} ${data.model} (${alias})`,
                    subtitle: `${CATEGORY_KEYWORDS[brandData.parentId]?.title || 'Vasıta'} > ${CATEGORY_KEYWORDS[brandData.categoryId]?.title || 'Otomobil'} > ${brandData.brand}`,
                    url: `/category/${brandData.parentId}/${brandData.categoryId}?brand=${encodeURIComponent(brandData.brand)}&model=${encodeURIComponent(data.model)}&q=${alias}`,
                    icon: CATEGORY_KEYWORDS[brandData.categoryId]?.icon || Car,
                    score: 95
                });
            }
        }
    });

    // 5. Genel Arama (Fallback)
    if (suggestions.length === 0) {
        suggestions.push({
            id: 'search-general',
            type: 'specific',
            title: `"${query}" ara`,
            subtitle: 'Tüm ilanlarda ara',
            url: `/search?q=${encodeURIComponent(query)}`,
            icon: Search,
            score: 10
        });
    }

    // Skora göre sırala ve ilk 8 sonucu döndür
    return suggestions.sort((a, b) => b.score - a.score).slice(0, 8);
}
