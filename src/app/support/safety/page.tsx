import { Shield, Lock, AlertTriangle, CheckCircle, Eye } from "lucide-react";

export default function SafetyPage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Hero */}
            <section className="bg-primary/5 py-20 border-b border-white/5">
                <div className="container mx-auto px-4 text-center">
                    <Shield className="w-20 h-20 text-primary mx-auto mb-6" />
                    <h1 className="text-4xl font-bold mb-4">Güvenli Alışveriş Rehberi</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        İnternet alışverişlerinde güvende kalmanız için bilmeniz gerekenler.
                    </p>
                </div>
            </section>

            {/* Tips */}
            <section className="py-20 container mx-auto px-4">
                <div className="grid md:grid-cols-2 gap-12">
                    <div className="space-y-8">
                        <h2 className="text-2xl font-bold flex items-center gap-3">
                            <Lock className="w-6 h-6 text-primary" />
                            Alıcılar İçin Öneriler
                        </h2>
                        <ul className="space-y-6">
                            {[
                                "Tanımadığınız kişilere kesinlikle kapora veya ön ödeme göndermeyin.",
                                "Ürünü görmeden satın alma işlemi yapmayın.",
                                "Kişisel ve finansal bilgilerinizi (TCKN, Kredi Kartı vb.) paylaşmayın.",
                                "Şüpheli derecede ucuz fiyatlı ilanlara dikkat edin.",
                                "İletişimi platform üzerinden sürdürmeye özen gösterin."
                            ].map((tip, i) => (
                                <li key={i} className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                                    <CheckCircle className="w-6 h-6 text-green-500 shrink-0" />
                                    <span className="text-muted-foreground">{tip}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-8">
                        <h2 className="text-2xl font-bold flex items-center gap-3">
                            <Eye className="w-6 h-6 text-primary" />
                            Satıcılar İçin Öneriler
                        </h2>
                        <ul className="space-y-6">
                            {[
                                "Ürün bedelini hesabınızda görmeden ürünü teslim etmeyin.",
                                "Sahte dekont dolandırıcılığına karşı dikkatli olun.",
                                "Alıcı ile güvenli ve kalabalık noktalarda buluşun.",
                                "Ürününüzün detaylı fotoğraflarını ve doğru bilgilerini paylaşın.",
                                "Yurt dışından gelen şüpheli mesajlara itibar etmeyin."
                            ].map((tip, i) => (
                                <li key={i} className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                                    <CheckCircle className="w-6 h-6 text-blue-500 shrink-0" />
                                    <span className="text-muted-foreground">{tip}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* Alert Box */}
            <section className="pb-20 container mx-auto px-4">
                <div className="glass-card p-8 border-l-4 border-l-yellow-500 flex items-start gap-6">
                    <div className="p-3 rounded-full bg-yellow-500/10 text-yellow-500 shrink-0">
                        <AlertTriangle className="w-8 h-8" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold mb-2">Şüpheli Bir Durum mu Var?</h3>
                        <p className="text-muted-foreground mb-4">
                            Eğer bir ilanın sahte olduğunu düşünüyorsanız veya şüpheli bir mesaj aldıysanız,
                            lütfen hemen bize bildirin. Güvenlik ekibimiz 7/24 hizmetinizdedir.
                        </p>
                        <button className="text-yellow-500 font-bold hover:underline">
                            Şikayet Bildir &rarr;
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}
