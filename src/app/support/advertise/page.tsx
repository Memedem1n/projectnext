import { Megaphone, TrendingUp, Target, BarChart, Store, User } from "lucide-react";

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
                        Milyonlarca potansiyel müşteriye ulaşın. ProjectNexx reklam çözümleriyle satışlarınızı katlayın.
                    </p>
                    <button className="bg-purple-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-purple-600 transition-transform hover:scale-105 shadow-lg shadow-purple-500/25">
                        Hemen Reklam Ver
                    </button>
                </div>
            </section>

            {/* Pricing Models */}
            <section className="py-20 container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-16">İlan Paketleri ve Fiyatlandırma</h2>

                <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {/* Individual Seller */}
                    <div className="glass-card p-8 relative overflow-hidden group hover:border-brand-gold/50 transition-colors">
                        <div className="absolute top-0 right-0 bg-brand-gold/20 text-brand-gold px-4 py-1 rounded-bl-xl font-bold text-sm">
                            BİREYSEL
                        </div>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-xl bg-brand-gold/10 flex items-center justify-center">
                                <User className="w-6 h-6 text-brand-gold" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold">Bireysel Satıcı</h3>
                                <p className="text-muted-foreground">Kişisel satışlarınız için ideal</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                <h4 className="font-bold mb-2 text-green-400">Ücretsiz Başlangıç</h4>
                                <p className="text-sm text-muted-foreground">
                                    Her kategoriden ayda <span className="text-foreground font-bold">1 adet ücretsiz ilan</span> verme hakkı.
                                    İlan süresi 1 aydır.
                                </p>
                            </div>

                            <div className="space-y-3">
                                <h4 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">Ek İlan Fiyatları (Kategori Bazlı)</h4>
                                <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                                    <span>İş Makineleri & Sanayi</span>
                                    <span className="font-bold">500 TL <span className="text-xs font-normal text-muted-foreground">/ ilan</span></span>
                                </div>
                                <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                                    <span>Emlak Kategorisi</span>
                                    <span className="font-bold">300 TL <span className="text-xs font-normal text-muted-foreground">/ ilan</span></span>
                                </div>
                                <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                                    <span>Otomobil Kategorisi</span>
                                    <span className="font-bold">250 TL <span className="text-xs font-normal text-muted-foreground">/ ilan</span></span>
                                </div>
                                <div className="flex justify-between items-center p-3 rounded-lg bg-white/5 opacity-60">
                                    <span>Diğer Kategoriler</span>
                                    <span className="font-bold text-xs">Yakında Belirlenecek</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Corporate Seller */}
                    <div className="glass-card p-8 relative overflow-hidden border-purple-500/30 group hover:border-purple-500 transition-colors">
                        <div className="absolute top-0 right-0 bg-purple-500 text-white px-4 py-1 rounded-bl-xl font-bold text-sm">
                            KURUMSAL
                        </div>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                                <Store className="w-6 h-6 text-purple-500" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold">Mağaza Üyeliği</h3>
                                <p className="text-muted-foreground">Profesyonel işletmeler için</p>
                            </div>
                        </div>

                        <div className="mb-8">
                            <div className="text-4xl font-bold text-purple-400 mb-2">
                                10.000 TL <span className="text-lg font-normal text-muted-foreground">/ ay</span>
                            </div>
                            <p className="text-sm text-muted-foreground">Yıllık ödemelerde %20 indirim fırsatı</p>
                        </div>

                        <ul className="space-y-4 mb-8">
                            <li className="flex items-center gap-3">
                                <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0">
                                    <Target className="w-3 h-3 text-purple-500" />
                                </div>
                                <span>Aylık <span className="font-bold text-foreground">100 Adet</span> Ücretsiz İlan</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0">
                                    <TrendingUp className="w-3 h-3 text-purple-500" />
                                </div>
                                <span>Aylık <span className="font-bold text-foreground">10 Adet</span> Doping Hediye</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0">
                                    <Store className="w-3 h-3 text-purple-500" />
                                </div>
                                <span>Özel Mağaza Sayfası & Danışman</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0">
                                    <BarChart className="w-3 h-3 text-purple-500" />
                                </div>
                                <span>Gelişmiş İstatistik Paneli</span>
                            </li>
                        </ul>

                        <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/10">
                            <p className="text-sm text-center">
                                Paket aşımı durumunda her ek ilan için sabit fiyat: <span className="font-bold text-purple-400">100 TL</span>
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Special Campaigns */}
            <section className="py-20 bg-gradient-to-b from-transparent to-purple-500/5">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">Özel Destek Kampanyaları</h2>
                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        <div className="glass-card p-8 flex items-center gap-6 hover:bg-white/5 transition-colors">
                            <div className="w-16 h-16 rounded-full bg-pink-500/20 flex items-center justify-center shrink-0">
                                <User className="w-8 h-8 text-pink-500" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-2">Kadın Girişimci Desteği</h3>
                                <p className="text-muted-foreground text-sm mb-4">
                                    Kadın girişimcilerimize özel mağaza üyeliklerinde <span className="text-foreground font-bold">%50 indirim</span> ve ilk ay ücretsiz doping fırsatı.
                                </p>
                                <button className="text-pink-500 text-sm font-bold hover:underline">Detaylı Bilgi &rarr;</button>
                            </div>
                        </div>

                        <div className="glass-card p-8 flex items-center gap-6 hover:bg-white/5 transition-colors">
                            <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                                <TrendingUp className="w-8 h-8 text-blue-500" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-2">Genç Girişimci Desteği</h3>
                                <p className="text-muted-foreground text-sm mb-4">
                                    29 yaş altı girişimcilerimiz için ilk yıl mağaza üyeliği <span className="text-foreground font-bold">%30 indirimli</span>. Geleceği birlikte inşa ediyoruz.
                                </p>
                                <button className="text-blue-500 text-sm font-bold hover:underline">Başvuru Yap &rarr;</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-20 bg-white/5">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">Neden ProjectNexx Reklam?</h2>
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
                </div>
            </section>
        </div>
    );
}
