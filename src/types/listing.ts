// Common type definitions used across the application

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
