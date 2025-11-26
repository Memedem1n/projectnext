import { Leaf, Recycle, Sun, Wind, Droplets, TreePine } from "lucide-react";

export default function SustainabilityPage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Hero */}
            <section className="relative py-24 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-green-500/10 to-background z-0" />
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 text-green-500 font-bold mb-6">
                        <Leaf className="w-5 h-5" />
                        <span>Gelecek İçin Dönüşüm</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold mb-6">
                        Sürdürülebilir Bir <span className="text-green-500">Dünya</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Teknolojiyi doğa ile uyumlu hale getiriyoruz. Karbon ayak izimizi azaltıyor, yeşil enerjiyi destekliyoruz.
                    </p>
                </div>
            </section>

            {/* Initiatives */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: Sun, title: "Yeşil Enerji", desc: "Veri merkezlerimizin %100'ü yenilenebilir enerji kaynaklarıyla çalışıyor." },
                            { icon: Recycle, title: "Sıfır Atık", desc: "Ofislerimizde kağıtsız çalışma prensibi ve kapsamlı geri dönüşüm programı uyguluyoruz." },
                            { icon: TreePine, title: "Her İlan Bir Fidan", desc: "Premium ilan gelirlerinin bir kısmıyla her yıl binlerce fidan dikiyoruz." },
                        ].map((item, i) => (
                            <div key={i} className="glass-card p-8 text-center hover:border-green-500/30 transition-colors group">
                                <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                                    <item.icon className="w-8 h-8 text-green-500" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                                <p className="text-muted-foreground">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Goals */}
            <section className="py-20 bg-white/5">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <h2 className="text-3xl font-bold">2030 Hedeflerimiz</h2>
                            <div className="space-y-4">
                                {[
                                    { label: "Karbon Nötr Operasyon", val: "100%" },
                                    { label: "Elektrikli Araç Filosu", val: "100%" },
                                    { label: "Su Tasarrufu", val: "%50" },
                                    { label: "Sosyal Sorumluluk Projeleri", val: "500+" },
                                ].map((goal, i) => (
                                    <div key={i} className="space-y-2">
                                        <div className="flex justify-between text-sm font-medium">
                                            <span>{goal.label}</span>
                                            <span className="text-green-500">{goal.val}</span>
                                        </div>
                                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                            <div className="h-full bg-green-500 w-3/4 rounded-full" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="relative h-[400px] rounded-3xl overflow-hidden glass-card p-2">
                            <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-primary/20 animate-pulse" />
                            <div className="absolute inset-2 rounded-2xl bg-black/40 backdrop-blur-xl flex items-center justify-center border border-white/10">
                                <Wind className="w-32 h-32 text-white/20" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
