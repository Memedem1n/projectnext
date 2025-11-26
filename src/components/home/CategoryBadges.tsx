"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, Car, Monitor, Briefcase, Dog, Book, Wrench, Hammer, Tractor } from "lucide-react";
import { cn } from "@/lib/utils";

interface CategoryBadgesProps {
    categoryStats?: Record<string, number>;
}

const categories = [
    { id: "emlak", name: "Emlak", icon: Home, active: true, comingSoon: false },
    { id: "vasita", name: "Vasıta", icon: Car, active: true, comingSoon: false },
    { id: "yedek-parca", name: "Yedek Parça", icon: Wrench, active: false, comingSoon: true },
    { id: "ikinci-el", name: "İkinci El", icon: Monitor, active: false, comingSoon: true },
    { id: "is-makineleri", name: "İş Makineleri", icon: Tractor, active: false, comingSoon: true },
    { id: "ustalar", name: "Ustalar", icon: Hammer, active: false, comingSoon: true },
    { id: "ozel-ders", name: "Özel Ders", icon: Book, active: false, comingSoon: true },
    { id: "is-ilanlari", name: "İş İlanları", icon: Briefcase, active: false, comingSoon: true },
    { id: "hayvanlar", name: "Hayvanlar", icon: Dog, active: false, comingSoon: true },
];

export function CategoryBadges({ categoryStats }: CategoryBadgesProps) {
    return (
        <section className="py-12 relative overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-gold/5 to-transparent pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-white via-brand-gold to-white bg-clip-text text-transparent">
                        Kategoriler
                    </h2>
                    <p className="text-muted-foreground/80">İhtiyacınıza uygun kategoriyi seçin</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {categories.map((category, index) => {
                        const Icon = category.icon;
                        const count = categoryStats?.[category.id] || 0;

                        const CardContent = (
                            <div className="relative z-10 h-full flex flex-col items-center justify-center text-center gap-3 py-2">
                                <div className={cn(
                                    "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300",
                                    category.active
                                        ? "bg-brand-gold/10 group-hover:bg-brand-gold/20 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(254,204,128,0.3)]"
                                        : "bg-white/5"
                                )}>
                                    <Icon className={cn(
                                        "w-6 h-6 transition-colors duration-300",
                                        category.active ? "text-brand-gold" : "text-muted-foreground/50"
                                    )} />
                                </div>

                                <div>
                                    <h3 className={cn(
                                        "font-semibold mb-1 transition-colors duration-300",
                                        category.active ? "text-white group-hover:text-brand-gold" : "text-muted-foreground"
                                    )}>{category.name}</h3>

                                    {category.active && count > 0 && (
                                        <p className="text-xs text-brand-gold/80 font-medium">{count.toLocaleString('tr-TR')} ilan</p>
                                    )}

                                    {category.comingSoon && (
                                        <div className="inline-block px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 rounded-full text-[10px] text-amber-500 font-medium mt-1">
                                            Yakında
                                        </div>
                                    )}
                                </div>
                            </div>
                        );

                        return (
                            <motion.div
                                key={category.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                {category.active ? (
                                    <Link
                                        href={`/category/${category.id}`}
                                        className={cn(
                                            "group block relative overflow-hidden rounded-2xl p-6 transition-all duration-300 h-full",
                                            "bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-brand-gold/30",
                                            "hover:shadow-lg hover:shadow-brand-gold/5 hover:-translate-y-1"
                                        )}
                                    >
                                        {CardContent}
                                        {/* Hover Glow */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/0 via-brand-gold/5 to-brand-gold/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                                    </Link>
                                ) : (
                                    <div
                                        className={cn(
                                            "relative overflow-hidden rounded-2xl p-6 h-full",
                                            "bg-white/[0.02] border border-white/5",
                                            "opacity-60 cursor-not-allowed grayscale-[0.5]"
                                        )}
                                    >
                                        {CardContent}
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

