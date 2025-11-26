import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Heart } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-background border-t border-white/10 pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand Section */}
                    <div className="space-y-4">
                        <Link href="/" className="text-2xl font-bold flex items-center gap-1">
                            <span className="text-foreground">ProjectNexx</span>
                            <span className="text-brand-gold text-sm font-normal opacity-80 ml-1">next</span>
                        </Link>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            Türkiye'nin en gelişmiş yeni nesil ilan platformu. Güvenli alışveriş ve hızlı satışın tek adresi.
                        </p>
                        <div className="flex items-center gap-4 pt-2">
                            <Link href="#" className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center hover:bg-brand-gold/20 hover:text-brand-gold transition-all">
                                <Instagram className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center hover:bg-brand-gold/20 hover:text-brand-gold transition-all">
                                <Twitter className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center hover:bg-brand-gold/20 hover:text-brand-gold transition-all">
                                <Linkedin className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center hover:bg-brand-gold/20 hover:text-brand-gold transition-all">
                                <Facebook className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold text-lg mb-6">Kurumsal</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/corporate/about" className="text-muted-foreground hover:text-brand-gold transition-colors text-sm">Hakkımızda</Link>
                            </li>
                            <li>
                                <Link href="/corporate/careers" className="text-muted-foreground hover:text-brand-gold transition-colors text-sm">Kariyer</Link>
                            </li>
                            <li>
                                <Link href="/corporate/press" className="text-muted-foreground hover:text-brand-gold transition-colors text-sm">Basın Odası</Link>
                            </li>
                            <li>
                                <Link href="/corporate/sustainability" className="text-muted-foreground hover:text-brand-gold transition-colors text-sm">Sürdürülebilirlik</Link>
                            </li>
                            <li>
                                <Link href="/corporate/contact" className="text-muted-foreground hover:text-brand-gold transition-colors text-sm">İletişim</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="font-semibold text-lg mb-6">Destek & Yardım</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/support/safety" className="text-muted-foreground hover:text-brand-gold transition-colors text-sm">Güvenli Alışveriş</Link>
                            </li>
                            <li>
                                <Link href="/support/how-to" className="text-muted-foreground hover:text-brand-gold transition-colors text-sm">Nasıl İlan Verilir?</Link>
                            </li>
                            <li>
                                <Link href="/support/advertise" className="text-muted-foreground hover:text-brand-gold transition-colors text-sm">Reklam Verin</Link>
                            </li>
                            <li>
                                <Link href="/support/help" className="text-muted-foreground hover:text-brand-gold transition-colors text-sm">Yardım Merkezi</Link>
                            </li>
                            <li>
                                <Link href="/support/terms" className="text-muted-foreground hover:text-brand-gold transition-colors text-sm">Kullanıcı Sözleşmesi</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="font-semibold text-lg mb-6">İletişim</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-sm text-muted-foreground">
                                <MapPin className="w-5 h-5 text-brand-gold shrink-0" />
                                <span>İstanbul Kayaşehir Şehit Semih Balaban Caddesi<br />Başakşehir / İstanbul</span>
                            </li>
                            <li className="flex items-center gap-3 text-sm text-muted-foreground">
                                <Phone className="w-5 h-5 text-brand-gold shrink-0" />
                                <span>0850 123 45 67</span>
                            </li>
                            <li className="flex items-center gap-3 text-sm text-muted-foreground">
                                <Mail className="w-5 h-5 text-brand-gold shrink-0" />
                                <span>iletisim@projectnexx.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-muted-foreground text-center md:text-left">
                        &copy; {new Date().getFullYear()} ProjectNexx. Tüm hakları saklıdır.
                    </p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <span>Made with</span>
                        <Heart className="w-3 h-3 text-red-500 fill-red-500" />
                        <span>for better experience</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
