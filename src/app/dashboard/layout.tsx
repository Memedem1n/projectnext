import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { LayoutDashboard, List, Heart, MessageCircle, Settings, LogOut, BadgeCheck, Bookmark } from "lucide-react";
import Link from "next/link";
import { logout } from "@/lib/actions/auth";

import { PageBackground } from "@/components/layout/PageBackground";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSession();

    if (!session) {
        redirect("/login");
    }

    const menuItems = [
        { icon: LayoutDashboard, label: "Özet", href: "/dashboard" },
        { icon: List, label: "İlanlarım", href: "/dashboard/my-listings" },
        { icon: Heart, label: "Favorilerim", href: "/dashboard/favorites" },
        { icon: Bookmark, label: "Kaydedilen Aramalar", href: "/dashboard/saved-searches" },
        { icon: MessageCircle, label: "Mesajlarım", href: "/dashboard/messages" },
        { icon: BadgeCheck, label: "Doğrulama Merkezi", href: "/dashboard/verification" },
        { icon: Settings, label: "Ayarlar", href: "/profile" },
    ];

    return (
        <div className="min-h-screen pt-20 pb-12">
            <PageBackground />
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
                    {/* Sidebar */}
                    <aside className="space-y-6">
                        {/* User Profile Card */}
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xl">
                                {session.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="overflow-hidden">
                                <div className="font-bold truncate">{session.name}</div>
                                <div className="text-xs text-muted-foreground">
                                    {session.role === "INDIVIDUAL" ? "Bireysel Üye" :
                                        session.role === "CORPORATE_GALLERY" ? "Galeri / Emlak Ofisi" :
                                            session.role === "CORPORATE_DEALER" ? "Yetkili Bayi" : session.role}
                                </div>
                            </div>
                        </div>

                        {/* Navigation Menu */}
                        <nav className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                            {menuItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:text-white hover:bg-white/5 transition-colors"
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span className="font-medium">{item.label}</span>
                                    </Link>
                                );
                            })}

                            <div className="my-2 border-t border-white/5" />

                            <form action={logout}>
                                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-colors text-left">
                                    <LogOut className="w-5 h-5" />
                                    <span className="font-medium">Çıkış Yap</span>
                                </button>
                            </form>
                        </nav>
                    </aside>

                    {/* Main Content */}
                    <main>
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}
