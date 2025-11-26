"use client";

import { useState } from "react";
import { Edit2, Eye, Trash2, MoreVertical, Clock, CheckCircle, XCircle, List, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

type Tab = "active" | "pending" | "passive";

interface MyListingsClientProps {
    listings: any[];
}

export function MyListingsClient({ listings }: MyListingsClientProps) {
    const [activeTab, setActiveTab] = useState<Tab>("active");
    const [searchTerm, setSearchTerm] = useState("");

    const filteredListings = listings.filter(item => {
        // Tab filtering
        let matchesTab = false;
        if (activeTab === "active") matchesTab = item.isActive === true;
        else if (activeTab === "passive") matchesTab = item.isActive === false;
        else matchesTab = false; // Pending logic placeholder

        // Search filtering
        const matchesSearch =
            item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.id.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesTab && matchesSearch;
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">İlanlarım</h1>
                <Link href="/post-listing" className="px-4 py-2 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors">
                    Yeni İlan Ver
                </Link>
            </div>

            <div className="flex items-center justify-between gap-4 bg-white/5 p-2 rounded-xl">
                {/* Tabs */}
                <div className="flex gap-2">
                    {[
                        { id: "active", label: "Yayında", icon: CheckCircle },
                        { id: "passive", label: "Pasif", icon: XCircle },
                    ].map(tab => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as Tab)}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                                    activeTab === tab.id
                                        ? "bg-primary text-primary-foreground shadow-lg"
                                        : "text-muted-foreground hover:text-white hover:bg-white/5"
                                )}
                            >
                                <Icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="İlan No veya Başlık..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 pr-4 py-2 bg-black/20 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-primary w-64"
                    />
                </div>
            </div>

            {/* Listings List */}
            <div className="space-y-4">
                {filteredListings.length > 0 ? (
                    filteredListings.map((item) => (
                        <div key={item.id} className="group flex flex-col md:flex-row gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/20 transition-colors">
                            {/* Image */}
                            <div className="w-full md:w-48 aspect-video rounded-lg overflow-hidden bg-black/20">
                                {item.images?.[0]?.url ? (
                                    <img src={item.images[0].url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                        Resim Yok
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 flex flex-col justify-between py-1">
                                <div>
                                    <div className="flex items-start justify-between">
                                        <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                                            {item.title}
                                            <span className="ml-2 text-xs font-normal text-muted-foreground">#{item.id.slice(0, 8)}</span>
                                        </h3>
                                        <button className="p-2 rounded-full hover:bg-white/10 text-muted-foreground">
                                            <MoreVertical className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <div className="text-primary font-bold text-xl mt-1">
                                        {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(item.price)}
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 text-sm text-muted-foreground mt-4">
                                    <div className="flex items-center gap-1">
                                        <Eye className="w-4 h-4" />
                                        {item.views} Görüntülenme
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        {new Date(item.createdAt).toLocaleDateString('tr-TR')}
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex md:flex-col gap-2 justify-center border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-4">
                                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-sm font-medium">
                                    <Edit2 className="w-4 h-4" />
                                    Düzenle
                                </button>
                                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors text-sm font-medium">
                                    <Trash2 className="w-4 h-4" />
                                    Sil
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-20 rounded-2xl bg-white/5 border border-white/5 border-dashed">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 text-muted-foreground">
                            <List className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">İlan Bulunamadı</h3>
                        <p className="text-muted-foreground">Bu kategoride henüz bir ilanınız bulunmuyor.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
