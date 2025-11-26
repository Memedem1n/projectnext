import { Briefcase, Coffee, Laptop, Zap, Users, Globe } from "lucide-react";
import Link from "next/link";

export default function CareersPage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Hero */}
            <section className="relative py-24 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 opacity-30" />
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <h1 className="text-5xl md:text-7xl font-bold mb-6">
                        Geleceği <span className="text-primary">Birlikte</span> İnşa Edelim
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
                        ProjectNexx ekibine katılın, milyonlarca kullanıcının hayatına dokunan teknolojiler geliştirin.
                    </p>
                    <button className="bg-primary text-primary-foreground px-8 py-4 rounded-full font-bold text-lg hover:bg-primary/90 transition-transform hover:scale-105">
                        Açık Pozisyonları Gör
                    </button>
                </div>
            </section>

            {/* Perks */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-16">Neden ProjectNexx?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: Laptop, title: "Hibrit Çalışma", desc: "Ofis veya ev, nerede üretkensen orada çalış." },
                            { icon: Coffee, title: "Sosyal İmkanlar", desc: "Özel sağlık sigortası, yemek kartı ve spor üyeliği." },
                            { icon: Zap, title: "Sürekli Gelişim", desc: "Eğitim bütçesi ve konferans katılımları." },
                            { icon: Users, title: "Harika Ekip", desc: "Alanında uzman, yardımsever ve eğlenceli çalışma arkadaşları." },
                            { icon: Globe, title: "Global Vizyon", desc: "Dünya standartlarında teknolojiler geliştirme fırsatı." },
                            { icon: Briefcase, title: "Kariyer Yolu", desc: "Net kariyer haritası ve yükselme fırsatları." },
                        ].map((perk, i) => (
                            <div key={i} className="glass-card p-6 flex items-start gap-4">
                                <div className="p-3 rounded-lg bg-primary/10 text-primary shrink-0">
                                    <perk.icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold mb-2">{perk.title}</h3>
                                    <p className="text-sm text-muted-foreground">{perk.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Open Positions */}
            <section className="py-20 bg-white/5">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-12">Açık Pozisyonlar</h2>
                    <div className="space-y-4">
                        {[
                            { title: "Senior Frontend Developer", dept: "Engineering", loc: "İstanbul / Remote", type: "Tam Zamanlı" },
                            { title: "Product Manager", dept: "Product", loc: "İstanbul", type: "Tam Zamanlı" },
                            { title: "UX/UI Designer", dept: "Design", loc: "Remote", type: "Tam Zamanlı" },
                            { title: "Backend Developer (Go)", dept: "Engineering", loc: "İstanbul / Remote", type: "Tam Zamanlı" },
                            { title: "Data Scientist", dept: "Data", loc: "İstanbul", type: "Tam Zamanlı" },
                        ].map((job, i) => (
                            <div key={i} className="glass-card p-6 flex flex-col md:flex-row items-center justify-between gap-4 hover:border-primary/50 transition-colors cursor-pointer group">
                                <div>
                                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{job.title}</h3>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                                        <span>{job.dept}</span>
                                        <span>•</span>
                                        <span>{job.loc}</span>
                                        <span>•</span>
                                        <span>{job.type}</span>
                                    </div>
                                </div>
                                <button className="px-6 py-2 rounded-full border border-white/10 hover:bg-white/10 transition-colors">
                                    Başvur
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
