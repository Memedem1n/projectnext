import locationsData from '@/data/locations.json';

const TURKEY_LOCATIONS = locationsData as any[];

export function getRandomLocation() {
    const city = TURKEY_LOCATIONS[Math.floor(Math.random() * TURKEY_LOCATIONS.length)];
    const district = city.counties[Math.floor(Math.random() * city.counties.length)];

    // Flatten neighborhoods from sub-districts
    const neighborhoods = district.districts.flatMap((sd: any) =>
        sd.neighborhoods.map((n: any) => n.name)
    );
    const neighborhood = neighborhoods[Math.floor(Math.random() * neighborhoods.length)];

    return {
        city: city.name,
        district: district.name,
        neighborhood: neighborhood
    };
}

export function getRandomEmlakData() {
    const roomsOptions = ["1+0", "1+1", "2+1", "3+1", "4+1", "5+1", "Dublex"];
    const floorOptions = ["Zemin", "1", "2", "3", "4", "5", "6-10", "10+"];
    const heatingOptions = ["Kombi", "Merkezi", "Soba", "Yerden Isıtma", "Klima"];
    const buildingAgeOptions = ["0", "1-5", "5-10", "10-15", "15-20", "20+"];
    const deedStatusOptions = ["Kat Mülkiyetli", "Kat İrtifaklı", "Arsa Tapulu"];
    const usageStatusOptions = ["Boş", "Kiracılı", "Mülk Sahibi"];

    const sqm = Math.floor(Math.random() * 200) + 50; // 50-250 m2

    return {
        sqm: sqm,
        sqmGross: Math.floor(sqm * 1.2),
        rooms: roomsOptions[Math.floor(Math.random() * roomsOptions.length)],
        floor: floorOptions[Math.floor(Math.random() * floorOptions.length)],
        totalFloors: Math.floor(Math.random() * 15) + 1,
        heating: heatingOptions[Math.floor(Math.random() * heatingOptions.length)],
        buildingAge: buildingAgeOptions[Math.floor(Math.random() * buildingAgeOptions.length)],
        furnished: Math.random() > 0.5,
        deedStatus: deedStatusOptions[Math.floor(Math.random() * deedStatusOptions.length)],
        usageStatus: usageStatusOptions[Math.floor(Math.random() * usageStatusOptions.length)],
        monthlyDues: Math.floor(Math.random() * 2000),
        creditSuitable: Math.random() > 0.7,
        bathroomCount: Math.floor(Math.random() * 3) + 1,
        balcony: Math.random() > 0.3,
        elevator: Math.random() > 0.3,
        parking: Math.random() > 0.3,
        inComplex: Math.random() > 0.3,
    };
}

export function getRandomVehicleData() {
    const fuelOptions = ["Benzin", "Dizel", "LPG", "Elektrik", "Hibrit"];
    const gearOptions = ["Manuel", "Otomatik", "Yarı Otomatik"];
    const colors = ["Beyaz", "Siyah", "Gri", "Kırmızı", "Mavi"];
    const brands = ["BMW", "Mercedes", "Audi", "Volkswagen", "Toyota", "Honda", "Ford"];
    const models = ["Model X", "Series 3", "Civic", "Corolla", "Focus", "A3", "Golf"];

    return {
        brand: brands[Math.floor(Math.random() * brands.length)],
        model: models[Math.floor(Math.random() * models.length)],
        year: 2000 + Math.floor(Math.random() * 24),
        km: Math.floor(Math.random() * 300000),
        color: colors[Math.floor(Math.random() * colors.length)],
        fuel: fuelOptions[Math.floor(Math.random() * fuelOptions.length)],
        gear: gearOptions[Math.floor(Math.random() * gearOptions.length)],
        caseType: "Sedan",
        warranty: Math.random() > 0.8,
        exchange: Math.random() > 0.5,
        tramer: Math.random() > 0.7 ? null : Math.floor(Math.random() * 50000) + " TL",
    };
}

export function generateListingTitle(categoryName: string, data: any) {
    const adjectives = ["Sahibinden", "Temiz", "Acil", "Fırsat", "Kelepir", "Yatırımlık", "Masrafsız"];
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];

    if (data.brand) {
        return `${adj} ${data.brand} ${data.model} - ${data.year}`;
    } else {
        return `${adj} ${data.rooms || ''} ${categoryName} - ${data.sqm}m2`;
    }
}
