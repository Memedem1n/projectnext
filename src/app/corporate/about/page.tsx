import { Building2, Users, Trophy, Target, Rocket, Heart } from "lucide-react";
import Image from "next/image";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative py-20 md:py-32 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-background z-0" />
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-3xl mx-auto text-center space-y-6">
                        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                            Geleceğin İlan Platformu
                        </h1>
                        <p className="text-xl text-muted-foreground leading-relaxed">
                            ProjectNexx, Türkiye'nin en köklü ilan kültürünü modern teknolojiyle buluşturuyor.
                            Amacımız, alıcı ve satıcıları güvenli, hızlı ve yenilikçi bir ortamda bir araya getirmek.
                        </p>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-12 border-y border-white/5 bg-white/5 backdrop-blur-sm">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="text-center space-y-2">
                            <div className="text-4xl font-bold text-primary">10M+</div>
                            <div className="text-sm text-muted-foreground">Aylık Ziyaretçi</div>
                        </div>
                        <div className="text-center space-y-2">
                            <div className="text-4xl font-bold text-primary">500K+</div>
                            <div className="text-sm text-muted-foreground">Aktif İlan</div>
                        </div>
                        <div className="text-center space-y-2">
                            <div className="text-4xl font-bold text-primary">81</div>
                            <div className="text-sm text-muted-foreground">İlde Hizmet</div>
                        </div>
                        <div className="text-center space-y-2">
                            <div className="text-4xl font-bold text-primary">%99</div>
                            <div className="text-sm text-muted-foreground">Müşteri Memnuniyeti</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                                    <Target className="w-6 h-6 text-primary" />
                                </div>
                                <h2 className="text-3xl font-bold">Misyonumuz</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    Kullanıcılarımıza en güvenli, en hızlı ve en kolay ilan deneyimini sunmak.
                                    Yapay zeka destekli teknolojilerimizle doğru alıcıyı doğru satıcıyla en kısa sürede buluşturmak.
                                </p>
                            </div>
                            <div className="space-y-4">
                                <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                                    <Rocket className="w-6 h-6 text-accent" />
                                </div>
                                <h2 className="text-3xl font-bold">Vizyonumuz</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    Sadece Türkiye'nin değil, bölgenin en büyük ve en teknolojik ilan pazaryeri olmak.
                                    Sürdürülebilir ve değer yaratan bir ekosistem kurmak.
                                </p>
                            </div>
                        </div>
                        <div className="relative h-[400px] rounded-3xl overflow-hidden glass-card p-2">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 animate-pulse" />
                            <div className="absolute inset-2 rounded-2xl bg-black/40 backdrop-blur-xl flex items-center justify-center border border-white/10">
                                <Building2 className="w-32 h-32 text-white/20" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-20 bg-white/5">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">Değerlerimiz</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Bizi biz yapan ve her kararımızda bize yol gösteren temel prensiplerimiz.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Users,
                                title: "İnsan Odaklılık",
                                desc: "Her şeyin merkezine insanı koyarız. Kullanıcılarımızın ve çalışanlarımızın mutluluğu önceliğimizdir."
                            },
                            {
                                icon: Trophy,
                                title: "Mükemmeliyetçilik",
                                desc: "İşimizi en iyi şekilde yapmak için sürekli çalışır, detaylara önem veririz."
                            },
                            {
                                icon: Heart,
                                title: "Güven ve Şeffaflık",
                                desc: "Dürüstlükten ödün vermeyiz. Açık iletişim kurar ve verdiğimiz sözleri tutarız."
                            }
                        ].map((value, i) => (
                            <div key={i} className="glass-card p-8 hover:bg-white/10 transition-all group">
                                <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <value.icon className="w-7 h-7 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    {value.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
