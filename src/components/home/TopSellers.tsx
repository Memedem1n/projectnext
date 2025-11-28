/* eslint-disable */
import { getTopSellers } from "@/data/homepage-data";
import { UserCheck } from "lucide-react";

export function TopSellers() {
    const sellers = getTopSellers(5);

    return (
        <section className="py-8 bg-white/5">
            <div className="container mx-auto">
                <div className="flex items-center gap-2 mb-6 px-4 md:px-0">
                    <UserCheck className="w-6 h-6 text-blue-500" />
                    <h2 className="text-xl md:text-2xl font-bold tracking-tight">En Çok Satanlar</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 px-4 md:px-0">
                    {sellers.map((seller, index) => (
                        <div key={index} className="glass-card p-4 flex flex-col items-center text-center gap-3 hover:bg-white/10 transition-colors cursor-pointer">
                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
                                {seller.name.charAt(0)}
                            </div>
                            <div>
                                <h3 className="font-bold">{seller.name}</h3>
                                <p className="text-xs text-muted-foreground">{seller.type === 'corporate' ? 'Kurumsal' : 'Bireysel'}</p>
                            </div>
                            <div className="text-xs font-medium bg-green-500/10 text-green-500 px-2 py-1 rounded-full">
                                {Math.floor(Math.random() * 200) + 50} Sattığı İlan
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
