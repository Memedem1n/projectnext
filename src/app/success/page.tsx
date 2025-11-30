


import { CheckCircle, Home, Search } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { PageBackground } from "@/components/layout/PageBackground";

export default function SuccessPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <PageBackground />

            <main className="flex-1 flex items-center justify-center p-4 relative z-10">
                <div className="glass-card max-w-lg w-full p-8 text-center space-y-6">
                    <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10" />
                    </div>

                    <h1 className="text-3xl font-bold">İlanınız Başarıyla Oluşturuldu!</h1>

                    <p className="text-muted-foreground text-lg">
                        İlanınız editör onayına gönderilmiştir. Onay sürecinden sonra yayına alınacaktır.
                    </p>

                    <div className="flex flex-col gap-3 pt-4">
                        <Link
                            href="/"
                            className="w-full py-4 bg-brand-gold text-primary-foreground rounded-xl font-bold hover:bg-brand-gold/90 transition-colors flex items-center justify-center gap-2"
                        >
                            <Home className="w-5 h-5" />
                            Ana Sayfaya Dön
                        </Link>

                        <Link
                            href="/search"
                            className="w-full py-4 bg-white/5 border border-white/10 rounded-xl font-medium hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
                        >
                            <Search className="w-5 h-5" />
                            Diğer İlanlara Göz At
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
