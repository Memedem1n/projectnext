import { Megaphone, TrendingUp, Target, BarChart } from "lucide-react";

export default function AdvertisePage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Hero */}
            <section className="relative py-24 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-30" />
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <h1 className="text-5xl md:text-7xl font-bold mb-6">
                        İşinizi <span className="text-purple-500">Büyütün</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
                        Milyonlarca potansiyel müşteriye ulaşın. sahibindennext reklam çözümleriyle satışlarınızı katlayın.
                    </p>
                    <button className="bg-purple-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-purple-600 transition-transform hover:scale-105 shadow-lg shadow-purple-500/25">
                        Hemen Reklam Ver
                    </button>
                </div>
            </section>

            {/* Features */}
            <section className="py-20 container mx-auto px-4">
                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        { icon: Target, title: "Hedefleme", desc: "Reklamlarınızı sadece ilgilenen kitleye gösterin. Kategori, konum ve ilgi alanı bazlı hedefleme." },
                        { icon: TrendingUp, title: "Yüksek Dönüşüm", desc: "Doğru zamanda doğru kişiye ulaşarak reklam bütçenizden maksimum verim alın." },
                        { icon: BarChart, title: "Detaylı Raporlama", desc: "Reklam performansınızı anlık olarak takip edin. Tıklama, görüntülenme ve dönüşüm analizleri." },
                    ].map((feat, i) => (
                        <div key={i} className="glass-card p-8 text-center hover:border-purple-500/30 transition-colors">
                            <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center mx-auto mb-6">
                                <feat.icon className="w-8 h-8 text-purple-500" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">{feat.title}</h3>
                            <p className="text-muted-foreground">{feat.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Ad Types */}
            <section className="py-20 bg-white/5">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">Reklam Modelleri</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="glass-card p-8 flex flex-col justify-between">
                            <div>
                                <div className="inline-block px-3 py-1 rounded bg-purple-500/20 text-purple-400 text-xs font-bold mb-4">POPÜLER</div>
                                <h3 className="text-2xl font-bold mb-2">Vitrin İlanları</h3>
                                <p className="text-muted-foreground mb-6">
                                    Ana sayfada ve kategori sayfalarında en üstte yer alın. Görünürlüğünüzü 10 kata kadar artırın.
                                </p>
                                <ul className="space-y-2 mb-8 text-sm text-muted-foreground">
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-purple-500" /> Ana Sayfa Vitrini</li>
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-purple-500" /> Kategori Vitrini</li>
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-purple-500" /> Acil Acil Vitrini</li>
                                </ul>
                            </div>
                            <div className="text-3xl font-bold text-purple-400">
                                ₺150 <span className="text-sm font-normal text-muted-foreground">/ haftalık</span>
                            </div>
                        </div>

                        <div className="glass-card p-8 flex flex-col justify-between">
                            <div>
                                <div className="inline-block px-3 py-1 rounded bg-blue-500/20 text-blue-400 text-xs font-bold mb-4">KURUMSAL</div>
                                <h3 className="text-2xl font-bold mb-2">Mağaza Üyeliği</h3>
                                <p className="text-muted-foreground mb-6">
                                    Kendi sanal mağazanızı açın. Sınırsız ilan, özel profil sayfası ve toplu yönetim araçları.
                                </p>
                                <ul className="space-y-2 mb-8 text-sm text-muted-foreground">
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Özel Mağaza Sayfası</li>
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Toplu İlan Girişi</li>
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Danışman Desteği</li>
                                </ul>
                            </div>
                            <div className="text-3xl font-bold text-blue-400">
                                ₺1.250 <span className="text-sm font-normal text-muted-foreground">/ yıllık</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
