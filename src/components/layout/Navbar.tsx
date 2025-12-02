import { Search, Plus, Bell, Menu } from "lucide-react";
import Link from "next/link";
import { headers } from "next/headers";

import { getSession } from "@/lib/session";
import { UserMenu } from "./UserMenu";
import { HeaderSearch } from "./HeaderSearch";

export async function Navbar() {
    const session = await getSession();
    const headersList = await headers();
    const pathname = headersList.get("x-pathname") || "/";
    const isHomePage = pathname === "/";

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-2 md:px-4 h-18 flex items-center justify-between gap-2 md:gap-4">
                {/* Logo */}
                <div className="flex items-center gap-1 md:gap-2 shrink-0">
                    <button className="lg:hidden p-1.5 hover:bg-white/5 rounded-lg">
                        <Menu className="w-5 h-5" />
                    </button>
                    <Link href="/" className="text-xl md:text-2xl font-bold flex items-center gap-1 group">
                        <span className="text-brand-gold drop-shadow-[0_0_8px_rgba(254,204,128,0.3)] group-hover:drop-shadow-[0_0_12px_rgba(254,204,128,0.5)] transition-all">ProjectNexx</span>
                        <span className="text-brand-gold/60 text-sm font-normal ml-1">next</span>
                    </Link>
                </div>

                {/* Search Bar - Hidden on Homepage */}
                {!isHomePage && <HeaderSearch />}

                {/* Actions */}
                <div className="flex items-center gap-1.5 md:gap-2">
                    <UserMenu user={session} />

                    {session && (
                        <button className="hidden lg:flex items-center gap-1.5 text-xs font-medium hover:bg-white/5 px-3 py-2 rounded-xl transition-colors">
                            <Bell className="w-4 h-4" />
                            <span>Bildirimler</span>
                        </button>
                    )}

                    <Link
                        href="/post-listing"
                        className="flex items-center gap-1.5 bg-brand-gold hover:bg-brand-gold/90 text-[#1c1917] px-4 py-2 rounded-2xl text-[10px] md:text-xs font-bold shadow-lg shadow-brand-gold/20 transition-all hover:scale-105 active:scale-95 whitespace-nowrap shrink-0 h-9"
                    >
                        <Plus className="w-3.5 h-3.5" />
                        <span>İlan Ver</span>
                    </Link>
                </div>
            </div>
        </nav>
    );
}
