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
            // Diğer vasıta kategorileri yakında gelecek
            // { id: "arazi-suv-pickup", name: "Arazi, SUV & Pickup" },
            // { id: "elektrikli-araclar", name: "Elektrikli Araçlar" },
            // { id: "motosiklet", name: "Motosiklet" },
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
