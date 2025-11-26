"use client";

import { useEffect, useState } from "react";
import { PageBackground } from "@/components/layout/PageBackground";
import { Users, Clock, Plus } from "lucide-react";
import Link from "next/link";
import { getUserStats } from "@/lib/actions/dashboard";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
    const router = useRouter();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadStats() {
            const result = await getUserStats();
            if (!result.success) {
                router.push("/login");
                return;
            }
            setStats(result.data);
            setLoading(false);
        }
        loadStats();
    }, [router]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col">
                <PageBackground />
                <main className="flex-1 container mx-auto px-4 py-8">
                    <div className="space-y-6 animate-pulse">
                        <div className="h-8 bg-white/10 rounded w-48" />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="glass-card p-6 h-32" />
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    const { isPending, isCorporate, activeListingsCount, totalViews, totalFavorites } = stats || {};

    return (
        <div className="min-h-screen flex flex-col">
            <PageBackground />

            <main className="flex-1 container mx-auto px-4 py-8">
                <div className="space-y-6">
                    {isPending ? (
                        <div className="glass-card p-8 text-center space-y-4 border-yellow-500/20 bg-yellow-500/5">
                            <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto">
                                <Clock className="w-8 h-8 text-yellow-500" />
                            </div>
                            <h2 className="text-2xl font-bold">Başvurunuz İnceleniyor</h2>
                            <p className="text-muted-foreground max-w-lg mx-auto">
                                Kurumsal üyelik başvurunuz şu anda yönetici onayı beklemektedir.
                                Bu süreçte ilan veremezsiniz ancak diğer özellikleri kullanabilirsiniz.
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="glass-card p-6 space-y-2">
                                    <p className="text-sm text-muted-foreground">Yayındaki İlanlar</p>
                                    <p className="text-3xl font-bold">{activeListingsCount}</p>
                                </div>
                                <div className="glass-card p-6 space-y-2">
                                    <p className="text-sm text-muted-foreground">Toplam Görüntülenme</p>
                                    <p className="text-3xl font-bold">{totalViews}</p>
                                </div>
                                <div className="glass-card p-6 space-y-2">
                                    <p className="text-sm text-muted-foreground">Favoriye Eklenme</p>
                                    <p className="text-3xl font-bold">{totalFavorites}</p>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Link href="/post-listing" className="glass-card p-6 flex items-center gap-4 hover:bg-white/5 transition-colors group">
                                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <Plus className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">Yeni İlan Ver</h3>
                                        <p className="text-sm text-muted-foreground">Hemen satışa başla</p>
                                    </div>
                                </Link>

                                {isCorporate && (
                                    <Link href="/dashboard/consultants" className="glass-card p-6 flex items-center gap-4 hover:bg-white/5 transition-colors group">
                                        <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <Users className="w-6 h-6 text-purple-500" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg">Danışman Ekle</h3>
                                            <p className="text-sm text-muted-foreground">Ekibini büyüt</p>
                                        </div>
                                    </Link>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}
