import { Newspaper, Download, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function PressPage() {
    return (
        <div className="min-h-screen bg-background">
            <section className="py-20 container mx-auto px-4">
                <h1 className="text-4xl font-bold mb-4">Basın Odası</h1>
                <p className="text-xl text-muted-foreground mb-12">
                    sahibindennext ile ilgili en güncel haberler, basın bültenleri ve medya materyalleri.
                </p>

                <div className="grid lg:grid-cols-3 gap-12">
                    {/* News Feed */}
                    <div className="lg:col-span-2 space-y-8">
                        <h2 className="text-2xl font-bold mb-6">Son Haberler</h2>
                        {[
                            { date: "20 Kasım 2025", title: "sahibindennext 10 Milyon Kullanıcıya Ulaştı", desc: "Türkiye'nin en hızlı büyüyen ilan platformu yeni bir rekora imza attı." },
                            { date: "15 Ekim 2025", title: "Yapay Zeka Destekli Ekspertiz Hizmeti Başladı", desc: "Artık araç alım satımlarında yapay zeka destekli ön ekspertiz raporu saniyeler içinde hazır." },
                            { date: "1 Eylül 2025", title: "Sürdürülebilirlik Raporu 2025 Yayınlandı", desc: "Karbon ayak izimizi %40 azalttık. Yeşil ofis sertifikamızı aldık." },
                        ].map((news, i) => (
                            <div key={i} className="glass-card p-8 hover:bg-white/5 transition-colors">
                                <span className="text-sm text-primary font-medium">{news.date}</span>
                                <h3 className="text-2xl font-bold mt-2 mb-3 hover:text-primary cursor-pointer transition-colors">{news.title}</h3>
                                <p className="text-muted-foreground mb-4">{news.desc}</p>
                                <Link href="#" className="inline-flex items-center gap-2 text-sm font-bold hover:underline">
                                    Devamını Oku <ExternalLink className="w-4 h-4" />
                                </Link>
                            </div>
                        ))}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        {/* Media Kit */}
                        <div className="glass-card p-6">
                            <h3 className="text-xl font-bold mb-4">Medya Kiti</h3>
                            <p className="text-sm text-muted-foreground mb-6">
                                Logo, kurumsal kimlik rehberi ve yönetici fotoğraflarını buradan indirebilirsiniz.
                            </p>
                            <div className="space-y-3">
                                <button className="w-full flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                                    <span className="text-sm font-medium">Logo Paketi (.zip)</span>
                                    <Download className="w-4 h-4" />
                                </button>
                                <button className="w-full flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                                    <span className="text-sm font-medium">Kurumsal Kimlik (.pdf)</span>
                                    <Download className="w-4 h-4" />
                                </button>
                                <button className="w-full flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                                    <span className="text-sm font-medium">Basın Görselleri (.zip)</span>
                                    <Download className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Press Contact */}
                        <div className="glass-card p-6 bg-primary/10 border-primary/20">
                            <h3 className="text-xl font-bold mb-4">Basın İletişimi</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                Röportaj talepleri ve basın sorularınız için:
                            </p>
                            <a href="mailto:basin@sahibindennext.com" className="text-primary font-bold hover:underline">
                                basin@sahibindennext.com
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
