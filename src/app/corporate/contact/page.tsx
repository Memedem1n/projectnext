import { MapPin, Phone, Mail, Send } from "lucide-react";

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-background">
            <section className="py-20 container mx-auto px-4">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold mb-4">İletişime Geçin</h1>
                    <p className="text-xl text-muted-foreground">
                        Sorularınız, önerileriniz veya iş birlikleri için bize ulaşın.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Contact Info */}
                    <div className="space-y-8">
                        <div className="glass-card p-8 space-y-6">
                            <h2 className="text-2xl font-bold">Merkez Ofis</h2>
                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                                        <MapPin className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold mb-1">Adres</h3>
                                        <p className="text-muted-foreground">
                                            Maslak Mah. Büyükdere Cad. No:123<br />
                                            Sarıyer / İstanbul
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                                        <Phone className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold mb-1">Telefon</h3>
                                        <p className="text-muted-foreground">0850 123 45 67</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                                        <Mail className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold mb-1">E-posta</h3>
                                        <p className="text-muted-foreground">barutcumehmetemin34@gmail.com</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Map Placeholder */}
                        <div className="h-[300px] rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground">
                            Harita Alanı (Google Maps Entegrasyonu)
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="glass-card p-8">
                        <h2 className="text-2xl font-bold mb-6">Bize Yazın</h2>
                        <form className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Adınız</label>
                                    <input type="text" className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors" placeholder="Adınız" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Soyadınız</label>
                                    <input type="text" className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors" placeholder="Soyadınız" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">E-posta Adresi</label>
                                <input type="email" className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors" placeholder="ornek@email.com" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Konu</label>
                                <select className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors">
                                    <option>Genel Bilgi</option>
                                    <option>Destek</option>
                                    <option>İş Birliği</option>
                                    <option>Basın</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Mesajınız</label>
                                <textarea rows={5} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors resize-none" placeholder="Mesajınızı buraya yazın..." />
                            </div>
                            <button type="button" className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                                <Send className="w-5 h-5" />
                                Gönder
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
}
