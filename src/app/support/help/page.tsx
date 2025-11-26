import { Search, HelpCircle, FileText, Settings, User, Shield } from "lucide-react";

export default function HelpPage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Search Hero */}
            <section className="py-20 bg-primary/5 border-b border-white/5">
                <div className="container mx-auto px-4 text-center max-w-3xl">
                    <h1 className="text-4xl font-bold mb-6">Size Nasıl Yardımcı Olabiliriz?</h1>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Sorunuzu buraya yazın (örn: şifremi unuttum, ilan verme...)"
                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-background border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all shadow-lg"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section className="py-20 container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[
                        { icon: User, title: "Hesap İşlemleri", desc: "Üyelik, giriş, şifre" },
                        { icon: FileText, title: "İlan Yönetimi", desc: "İlan verme, düzenleme" },
                        { icon: Shield, title: "Güvenlik", desc: "Dolandırıcılık, şikayet" },
                        { icon: Settings, title: "Teknik Destek", desc: "Hata bildirimi, mobil" },
                    ].map((cat, i) => (
                        <div key={i} className="glass-card p-6 text-center hover:bg-white/5 transition-colors cursor-pointer group">
                            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                                <cat.icon className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold mb-1">{cat.title}</h3>
                            <p className="text-xs text-muted-foreground">{cat.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* FAQ */}
            <section className="pb-20 container mx-auto px-4 max-w-3xl">
                <h2 className="text-2xl font-bold mb-8">Sıkça Sorulan Sorular</h2>
                <div className="space-y-4">
                    {[
                        { q: "İlan vermek ücretli mi?", a: "Bireysel kullanıcılarımız için yılda 3 adete kadar ilan vermek tamamen ücretsizdir. Kurumsal üyeliklerimiz ücretlidir." },
                        { q: "Güvenli Ödeme Sistemi nedir?", a: "Alıcı ve satıcıyı koruyan bir sistemdir. Para havuz hesapta tutulur, ürün teslim alınıp onaylanınca satıcıya aktarılır." },
                        { q: "Şifremi unuttum, ne yapmalıyım?", a: "Giriş sayfasındaki 'Şifremi Unuttum' bağlantısına tıklayarak e-posta adresinize şifre sıfırlama linki gönderebilirsiniz." },
                        { q: "İlanım neden onaylanmadı?", a: "İlan kurallarımıza uymayan (yanıltıcı bilgi, yasaklı ürün vb.) ilanlar editörlerimiz tarafından reddedilebilir." },
                    ].map((faq, i) => (
                        <div key={i} className="glass-card p-6">
                            <h3 className="font-bold mb-2 flex items-start gap-3">
                                <HelpCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                {faq.q}
                            </h3>
                            <p className="text-muted-foreground pl-8 text-sm leading-relaxed">
                                {faq.a}
                            </p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
