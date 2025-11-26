import { MapPin, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const listings = [
    {
        id: 1,
        title: "2023 BMW 320i M Sport - Hatasız Boyasız",
        price: "3.250.000 TL",
        location: "İstanbul, Kadıköy",
        image: "https://images.unsplash.com/photo-1555215695-3004980adade?auto=format&fit=crop&w=800&q=80",
        category: "Vasıta",
        date: "Bugün"
    },
    {
        id: 2,
        title: "Boğaz Manzaralı 3+1 Lüks Daire",
        price: "15.000.000 TL",
        location: "İstanbul, Beşiktaş",
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
        category: "Emlak",
        date: "Dün"
    },
    {
        id: 3,
        title: "MacBook Pro M3 Max - 16 inç - Sıfır Kapalı Kutu",
        price: "120.000 TL",
        location: "Ankara, Çankaya",
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca4?auto=format&fit=crop&w=800&q=80",
        category: "İkinci El",
        date: "Bugün"
    },
    {
        id: 4,
        title: "ProjectNexx Temiz iPhone 15 Pro Max",
        price: "85.000 TL",
        location: "İzmir, Karşıyaka",
        image: "https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&w=800&q=80",
        category: "İkinci El",
        date: "2 saat önce"
    },
    {
        id: 5,
        title: "2020 model Honda Civic Eco Elegance",
        price: "1.150.000 TL",
        location: "Bursa, Nilüfer",
        image: "https://images.unsplash.com/photo-1606152421811-99de95bd5b58?auto=format&fit=crop&w=800&q=80",
        category: "Vasıta",
        date: "3 gün önce"
    },
    {
        id: 6,
        title: "Özel Yapım Gaming Bilgisayar RTX 4090",
        price: "145.000 TL",
        location: "Antalya, Muratpaşa",
        image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80",
        category: "İkinci El",
        date: "Bugün"
    }
];

export function Showcase() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Vitrindekiler</h2>
                <button className="text-sm text-primary hover:underline">Tümünü Gör</button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {listings.map((listing) => (
                    <Link href={`/listing/${listing.id}`} key={listing.id} className="group glass-card !p-0 overflow-hidden hover:shadow-primary/10 cursor-pointer block">
                        {/* Image */}
                        <div className="relative aspect-[4/3] overflow-hidden">
                            <Image
                                src={listing.image}
                                alt={listing.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <button className="absolute top-3 right-3 p-2 bg-black/50 backdrop-blur-md rounded-full text-white/70 hover:text-red-500 hover:bg-black/70 transition-all opacity-0 group-hover:opacity-100">
                                <Heart className="w-4 h-4" />
                            </button>
                            <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded text-xs font-medium text-white">
                                {listing.category}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-4 space-y-3">
                            <h3 className="font-medium line-clamp-2 text-sm group-hover:text-primary transition-colors">
                                {listing.title}
                            </h3>

                            <div className="flex items-end justify-between">
                                <span className="text-lg font-bold text-brand-gold">
                                    {listing.price}
                                </span>
                            </div>

                            <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-white/5">
                                <div className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    <span>{listing.location}</span>
                                </div>
                                <span>{listing.date}</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
