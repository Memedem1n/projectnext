import { ShoppingBag, Tag, Camera, CheckCircle, Search, MessageCircle, CreditCard } from "lucide-react";

export default function HowToPage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Hero */}
            <section className="py-20 text-center container mx-auto px-4">
                <h1 className="text-4xl md:text-6xl font-bold mb-6">Nasıl Çalışır?</h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    ProjectNexx ile ilan vermek de alışveriş yapmak da çok kolay. İşte adım adım rehberiniz.
                </p>
            </section>

            {/* Steps */}
            <section className="py-12 container mx-auto px-4">
                <div className="grid md:grid-cols-2 gap-16">
                    {/* Selling */}
                    <div className="space-y-12">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
                                <Tag className="w-8 h-8 text-primary" />
                            </div>
                            <h2 className="text-3xl font-bold">Nasıl İlan Verilir?</h2>
                        </div>
                        <div className="space-y-8 relative">
                            <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-white/10" />
                            {[
                                { icon: Camera, title: "Fotoğraf Çekin", desc: "Ürününüzün net ve aydınlık fotoğraflarını çekin. Farklı açılardan detayları gösterin." },
                                { icon: Tag, title: "Detayları Girin", desc: "Doğru kategori seçimi yapın, başlık ve açıklama kısımlarını detaylıca doldurun." },
                                { icon: CheckCircle, title: "Yayınlayın", desc: "İlanınızı önizleyin ve onaylayın. İlanınız saniyeler içinde yayında!" }
                            ].map((step, i) => (
                                <div key={i} className="relative flex items-start gap-6">
                                    <div className="w-16 h-16 rounded-full bg-background border-4 border-primary/20 flex items-center justify-center shrink-0 z-10">
                                        <step.icon className="w-6 h-6 text-primary" />
                                    </div>
                                    <div className="pt-3">
                                        <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                                        <p className="text-muted-foreground">{step.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Buying */}
                    <div className="space-y-12">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 rounded-2xl bg-accent/20 flex items-center justify-center mx-auto mb-4">
                                <ShoppingBag className="w-8 h-8 text-accent" />
                            </div>
                            <h2 className="text-3xl font-bold">Nasıl Satın Alınır?</h2>
                        </div>
                        <div className="space-y-8 relative">
                            <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-white/10" />
                            {[
                                { icon: Search, title: "Arama Yapın", desc: "Gelişmiş filtreleme seçeneklerini kullanarak aradığınız ürünü kolayca bulun." },
                                { icon: MessageCircle, title: "İletişime Geçin", desc: "Satıcıya mesaj atın veya arayın. Ürün hakkında detaylı bilgi alın." },
                                { icon: CreditCard, title: "Güvenle Alın", desc: "Güvenli Ödeme Sistemi ile paranız ürün elinize geçene kadar güvende." }
                            ].map((step, i) => (
                                <div key={i} className="relative flex items-start gap-6">
                                    <div className="w-16 h-16 rounded-full bg-background border-4 border-accent/20 flex items-center justify-center shrink-0 z-10">
                                        <step.icon className="w-6 h-6 text-accent" />
                                    </div>
                                    <div className="pt-3">
                                        <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                                        <p className="text-muted-foreground">{step.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
