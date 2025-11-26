export default function TermsPage() {
    return (
        <div className="min-h-screen bg-background py-20">
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="text-4xl font-bold mb-8">Kullanıcı Sözleşmesi ve Gizlilik Politikası</h1>

                <div className="glass-card p-8 md:p-12 space-y-8 text-muted-foreground leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-bold text-foreground mb-4">1. Taraflar</h2>
                        <p>
                            İşbu sözleşme, sahibindennext (bundan böyle "Platform" olarak anılacaktır) ile Platform'a üye olan kullanıcı (bundan böyle "Üye" olarak anılacaktır) arasında akdedilmiştir.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-foreground mb-4">2. Konu</h2>
                        <p>
                            İşbu sözleşmenin konusu, Üye'nin Platform'dan faydalanma şartlarının belirlenmesidir. Platform, kullanıcıların ürün ve hizmet ilanlarını yayınladığı bir pazaryeridir.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-foreground mb-4">3. Üyelik Şartları</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Üye, kayıt formunda verdiği bilgilerin doğru olduğunu beyan eder.</li>
                            <li>18 yaşından küçükler Platform'a üye olamaz.</li>
                            <li>Üye, hesabının güvenliğinden kendisi sorumludur.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-foreground mb-4">4. Gizlilik</h2>
                        <p>
                            Platform, kullanıcı verilerini 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında işler ve saklar. Verileriniz, yasal zorunluluklar haricinde üçüncü kişilerle paylaşılmaz.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-foreground mb-4">5. Fikri Mülkiyet</h2>
                        <p>
                            Platform'da yer alan tüm tasarımlar, yazılımlar ve içerikler sahibindennext'e aittir. İzinsiz kopyalanamaz ve kullanılamaz.
                        </p>
                    </section>

                    <div className="pt-8 border-t border-white/10 text-sm">
                        <p>Son Güncelleme: 20 Kasım 2025</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
