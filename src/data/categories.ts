import { Home, Car, Monitor, Shirt, Briefcase, Dog, Book, Wrench, Hammer, Bike, Ship, Tractor } from "lucide-react";

export type Category = {
    id: string;
    name: string;
    icon?: any;
    subcategories?: Category[];
};

export const CATEGORIES: Category[] = [
    // {
    //     id: "emlak",
    //     name: "Emlak",
    //     icon: Home,
    //     subcategories: [...]
    // },
    {
        id: "vasita",
        name: "Vasıta",
        icon: Car,
        subcategories: [
            { id: "otomobil", name: "Otomobil" },
            { id: "arazi-suv-pickup", name: "Arazi, SUV & Pickup" },
            { id: "elektrikli-araclar", name: "Elektrikli Araçlar" },
            { id: "motosiklet", name: "Motosiklet" },
            { id: "minivan-panelvan", name: "Minivan & Panelvan" },
            { id: "ticari-araclar", name: "Ticari Araçlar" },
            { id: "kiralik-araclar", name: "Kiralık Araçlar" },
            { id: "deniz-araclari", name: "Deniz Araçları" },
            { id: "hasarli-araclar", name: "Hasarlı Araçlar" },
            { id: "karavan", name: "Karavan" },
            { id: "klasik-araclar", name: "Klasik Araçlar" },
            { id: "hava-araclari", name: "Hava Araçları" },
            { id: "atv", name: "ATV" },
            { id: "utv", name: "UTV" },
            { id: "engelli-plakali-araclar", name: "Engelli Plakalı Araçlar" },
        ]
    },
    // Diğer kategoriler yakında gelecek
    // {
    //     id: "yedek-parca",
    //     name: "Yedek Parça, Aksesuar",
    //     icon: Wrench,
    // },
    // {
    //     id: "ikinci-el",
    //     name: "İkinci El ve Sıfır Alışveriş",
    //     icon: Monitor,
    // },
];
