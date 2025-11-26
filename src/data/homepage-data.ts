import { MOCK_LISTINGS, Listing } from "./mock-data";

// Helper to get random items
function getRandomItems<T>(arr: T[], count: number): T[] {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

export const getRecentListings = (count: number = 10) => {
    // Mock sorting by date (assuming mock data has random "X saat önce" strings)
    // For now just return the first few as they are generated sequentially
    return MOCK_LISTINGS.slice(0, count);
};

export const getTrendingListings = (count: number = 8) => {
    // Mock trending logic
    return getRandomItems(MOCK_LISTINGS, count);
};

export const getHotDeals = (count: number = 6) => {
    return MOCK_LISTINGS.filter(l => l.tags.includes("Uygun Fiyat")).slice(0, count);
};

export const getNearbyListings = (count: number = 4) => {
    // Mock location logic - just return random ones
    return getRandomItems(MOCK_LISTINGS, count);
};

export const getPremiumListings = (count: number = 5) => {
    // High price or specific criteria
    return MOCK_LISTINGS.filter(l => l.seller.type === "corporate").slice(0, count);
};

export const getTopSellers = (count: number = 5) => {
    // Group by seller and count listings, or just return unique sellers
    const sellers = new Map();
    MOCK_LISTINGS.forEach(l => {
        if (!sellers.has(l.seller.name)) {
            sellers.set(l.seller.name, l.seller);
        }
    });
    return Array.from(sellers.values()).slice(0, count);
};

export const POPULAR_SEARCHES = [
    { term: "BMW 320i", count: 1250, trend: "up" },
    { term: "Kiralık Daire Kadıköy", count: 980, trend: "up" },
    { term: "iPhone 14 Pro", count: 850, trend: "stable" },
    { term: "PlayStation 5", count: 720, trend: "down" },
    { term: "Toyota Corolla", count: 650, trend: "up" },
    { term: "Yazlık Villa", count: 500, trend: "up" },
    { term: "Gaming Laptop", count: 450, trend: "stable" },
    { term: "Elektrikli Bisiklet", count: 400, trend: "up" },
];

export const LIVE_STATS = {
    activeUsers: 12543,
    newListingsToday: 842,
    soldToday: 156,
    totalListings: 45230
};

export const TESTIMONIALS = [
    {
        id: 1,
        name: "Ahmet Yılmaz",
        role: "Oto Galeri Sahibi",
        content: "Sparse Ride sayesinde satışlarım %40 arttı. Kullanımı çok kolay ve müşteri kitlesi çok kaliteli.",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmet"
    },
    {
        id: 2,
        name: "Ayşe Demir",
        role: "Bireysel Satıcı",
        content: "Aracımı ilana koyduğum gün sattım. Güvenli ödeme sistemi sayesinde hiç endişe etmedim.",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ayse"
    },
    {
        id: 3,
        name: "Mehmet Kaya",
        role: "Emlak Danışmanı",
        content: "Portföyümü yönetmek için harika bir platform. İstatistikler ve raporlar işimi çok kolaylaştırıyor.",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mehmet"
    }
];

export const PRICE_TRENDS = [
    { label: "Ocak", value: 100 },
    { label: "Şubat", value: 105 },
    { label: "Mart", value: 108 },
    { label: "Nisan", value: 115 },
    { label: "Mayıs", value: 120 },
    { label: "Haziran", value: 125 },
];
