export default function TermsPage() {
    return (
        <div className="min-h-screen bg-background py-20">
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="text-4xl font-bold mb-8">Kullanıcı Sözleşmesi ve Gizlilik Politikası</h1>

                <div className="glass-card p-8 md:p-12 space-y-8 text-muted-foreground leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-bold text-foreground mb-4">1. Taraflar</h2>
                        <p>
                            İşbu sözleşme, ProjectNexx (bundan böyle "Platform" olarak anılacaktır) ile Platform'a üye olan kullanıcı (bundan böyle "Üye" olarak anılacaktır) arasında akdedilmiştir.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-foreground mb-4">2. Üyelik ve Hizmet Kullanımı</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Platform, üyeliği herhangi bir sebep göstermeksizin reddetme veya askıya alma hakkını saklı tutar.</li>
                            <li>Üye, Platform üzerinde gerçekleştirdiği tüm işlemlerden ve paylaştığı içeriklerden şahsen ve münhasıran sorumludur.</li>
                            <li>Platform, sunulan hizmetlerin sürekliliğini veya hatasızlığını garanti etmez. Bakım, onarım veya zorunlu hallerde hizmet kesintiye uğrayabilir.</li>
                            <li>Üye, Platform'un belirlediği ilan verme limitlerine ve ücretlendirme politikalarına uymayı kabul eder.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-foreground mb-4">3. İlan ve İçerik Politikası</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Yayınlanan ilanların hukuka, ahlaka ve üçüncü kişilerin haklarına uygunluğu Üye'nin sorumluluğundadır.</li>
                            <li>Platform, uygun görmediği ilanları önceden bildirimde bulunmaksızın yayından kaldırma hakkına sahiptir. Bu durumda ücret iadesi yapılmaz.</li>
                            <li>Üye, ilan içeriklerinin (fotoğraf, açıklama vb.) Platform tarafından reklam ve tanıtım amacıyla kullanılabileceğini kabul eder.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-foreground mb-4">4. Ücretlendirme ve Ödeme</h2>
                        <p>
                            Platform, sunduğu hizmetlerin fiyatlarını ve paket içeriklerini dilediği zaman değiştirme hakkını saklı tutar. Değişiklikler, yayınlandığı tarihten itibaren geçerli olur. Satın alınan paketlerin iadesi mümkün değildir.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-foreground mb-4">5. Gizlilik ve Veri Güvenliği</h2>
                        <p>
                            Platform, kullanıcı verilerini 6698 sayılı KVKK kapsamında işler. Ancak, siber saldırı, veri sızıntısı gibi mücbir sebeplerden kaynaklanan zararlardan Platform sorumlu tutulamaz. Üye, hesabının güvenliğini sağlamakla yükümlüdür.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-foreground mb-4">6. Fikri Mülkiyet</h2>
                        <p>
                            Platform'da yer alan tüm tasarımlar, yazılımlar, veritabanı ve içerikler ProjectNexx'e aittir. İzinsiz kopyalanması, çoğaltılması veya tersine mühendislik yapılması yasaktır.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-foreground mb-4">7. Sözleşme Değişiklikleri</h2>
                        <p>
                            Platform, işbu sözleşme hükümlerini tek taraflı olarak değiştirme hakkına sahiptir. Güncel sözleşme Platform'da yayınlandığı andan itibaren yürürlüğe girer.
                        </p>
                    </section>

                    <div className="pt-8 border-t border-white/10 text-sm">
                        <p>Son Güncelleme: 27 Kasım 2025</p>
                        <p className="mt-2 text-xs opacity-70">ProjectNexx Yönetimi</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
