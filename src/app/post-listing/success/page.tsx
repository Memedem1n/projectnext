"use client";

import Link from "next/link";
import { CheckCircle2, ArrowRight, Home, Plus } from "lucide-react";
import { PageBackground } from "@/components/layout/PageBackground";
import { useSearchParams } from "next/navigation";

export default function ListingSuccessPage() {
    const searchParams = useSearchParams();
    // In a real app, we might pass the ID to show a link
    // const listingId = searchParams.get("id");

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            <PageBackground />

            <div className="relative z-10 max-w-lg w-full text-center space-y-8">
                <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto ring-4 ring-green-500/10 animate-in zoom-in duration-500">
                    <CheckCircle2 className="w-12 h-12 text-green-500" />
                </div>

                <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-700 delay-200">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-brand-gold to-white bg-clip-text text-transparent">
                        Tebrikler!
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        İlanınız başarıyla oluşturuldu ve onaya gönderildi.
                    </p>
                    <p className="text-sm text-muted-foreground/60">
                        Editörlerimiz ilanınızı en kısa sürede inceleyip yayına alacaktır.
                        Onay durumunu panelinizden takip edebilirsiniz.
                    </p>
                </div>

                <div className="grid gap-4 pt-8 animate-in slide-in-from-bottom-8 duration-700 delay-300">
                    <Link
                        href="/dashboard/my-listings"
                        className="w-full py-4 bg-brand-gold text-primary-foreground rounded-2xl font-bold text-lg hover:bg-brand-gold/90 transition-all flex items-center justify-center gap-2 group"
                    >
                        İlanlarımı Görüntüle
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <div className="grid grid-cols-2 gap-4">
                        <Link
                            href="/"
                            className="py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-medium transition-colors flex items-center justify-center gap-2"
                        >
                            <Home className="w-4 h-4" />
                            Anasayfa
                        </Link>
                        <Link
                            href="/post-listing"
                            className="py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-medium transition-colors flex items-center justify-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Yeni İlan
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
