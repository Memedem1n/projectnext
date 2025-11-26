"use client";

import { useState, useRef, useEffect } from "react";
import { User as UserIcon, LogOut, ChevronDown, LayoutDashboard, UserCircle } from "lucide-react";
import Link from "next/link";
import { logout } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";

interface UserMenuProps {
    user: {
        name: string;
        email: string;
        role: string;
    } | null;
}

export function UserMenu({ user }: UserMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (!user) {
        return (
            <Link
                href="/login"
                className="flex items-center gap-1.5 text-[10px] md:text-sm font-medium hover:bg-white/5 px-1.5 md:px-3 py-1.5 md:py-2 rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
                <UserIcon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                <span>Giriş</span>
            </Link>
        );
    }

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "flex items-center gap-2 text-sm font-medium hover:bg-white/5 px-3 py-2 rounded-lg transition-all border border-transparent cursor-pointer",
                    isOpen && "bg-white/5 border-white/10"
                )}
            >
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                    {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden md:block max-w-[100px] truncate">{user.name}</span>
                <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform", isOpen && "rotate-180")} />
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-[#1c1c1c] border border-white/10 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-50">
                    <div className="p-4 border-b border-white/10 bg-white/5">
                        <p className="font-medium truncate">{user.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                        <p className="text-[10px] uppercase tracking-wider text-primary mt-1 font-semibold">
                            {user.role === "INDIVIDUAL" ? "Bireysel Üye" :
                                user.role === "CORPORATE_GALLERY" ? "Galeri / Emlak Ofisi" :
                                    user.role === "CORPORATE_DEALER" ? "Yetkili Bayi" : user.role}
                        </p>
                    </div>

                    <div className="p-1">

                        <Link
                            href="/dashboard"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-lg transition-colors"
                        >
                            <LayoutDashboard className="w-4 h-4" />
                            Dashboard
                        </Link>
                        <Link
                            href="/profile"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-lg transition-colors"
                        >
                            <UserCircle className="w-4 h-4" />
                            Profilim
                        </Link>
                    </div>

                    <div className="h-px bg-white/10 mx-1" />

                    <div className="p-1">
                        <form action={logout}>
                            <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors text-left">
                                <LogOut className="w-4 h-4" />
                                Çıkış Yap
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
