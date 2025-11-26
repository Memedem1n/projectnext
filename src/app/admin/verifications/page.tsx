import prisma from "@/lib/prisma";
import { approveIdentity, rejectIdentity, approveBadge, rejectBadge } from "@/lib/actions/verification";
import { CheckCircle2, XCircle, FileText, User, BadgeCheck, Filter } from "lucide-react";
import Link from "next/link";

export default async function AdminVerificationsPage({
    searchParams,
}: {
    searchParams: { view?: string };
}) {
    const view = searchParams.view || "all"; // all, identity, badges

    // Fetch Identity Verifications
    const identityVerifications = (view === "all" || view === "identity")
        ? await prisma.identityVerification.findMany({
            where: { status: "PENDING" },
            include: {
                user: {
                    include: {
                        dealerProfile: true // Include corporate info
                    }
                }
            },
            orderBy: { createdAt: "desc" }
        })
        : [];

    // Fetch Badge Requests
    const badgeRequests = (view === "all" || view === "badges")
        ? await prisma.badgeRequest.findMany({
            where: { status: "PENDING" },
            include: { user: { include: { identityVerification: true } } },
            orderBy: { createdAt: "desc" }
        })
        : [];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Doğrulama Merkezi</h1>
                <div className="flex items-center gap-2 bg-white/5 p-1 rounded-lg border border-white/10">
                    <Link
                        href="/admin/verifications?view=all"
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${view === "all" ? "bg-brand-gold text-black" : "text-muted-foreground hover:text-white"}`}
                    >
                        Tümü
                    </Link>
                    <Link
                        href="/admin/verifications?view=identity"
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${view === "identity" ? "bg-brand-gold text-black" : "text-muted-foreground hover:text-white"}`}
                    >
                        Kimlik Onayları
                    </Link>
                    <Link
                        href="/admin/verifications?view=badges"
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${view === "badges" ? "bg-brand-gold text-black" : "text-muted-foreground hover:text-white"}`}
                    >
                        Rozet Talepleri
                    </Link>
                </div>
            </div>

            <div className="grid gap-4">
                {identityVerifications.length === 0 && badgeRequests.length === 0 && (
                    <div className="p-12 text-center text-muted-foreground bg-white/5 rounded-xl border border-white/10 flex flex-col items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                            <Filter className="w-8 h-8 opacity-50" />
                        </div>
                        <p>Bekleyen onay işlemi bulunmamaktadır.</p>
                    </div>
                )}

                {/* Identity Verifications List */}
                {identityVerifications.map((item) => (
                    <div key={item.id} className="glass-card p-6 flex items-start justify-between gap-4 border-l-4 border-l-blue-500">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500">
                                <User className="w-6 h-6" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <h3 className="font-bold text-lg">{item.user.name}</h3>
                                    <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20">Kimlik Onayı</span>
                                    {/* User Role Badge */}
                                    {item.user.role === "CORPORATE_GALLERY" && (
                                        <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded border border-purple-500/20">
                                            Kurumsal - Galeri/Emlak
                                        </span>
                                    )}
                                    {item.user.role === "CORPORATE_DEALER" && (
                                        <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded border border-orange-500/20">
                                            Kurumsal - Bayi
                                        </span>
                                    )}
                                    {item.user.role === "INDIVIDUAL" && (
                                        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded border border-green-500/20">
                                            Bireysel
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-muted-foreground">{item.user.email}</p>
                                <p className="text-sm text-muted-foreground">{item.user.phone}</p>

                                <div className="mt-4 p-4 bg-black/40 rounded-lg space-y-2 border border-white/5">
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="text-muted-foreground">TC Kimlik No:</span>
                                        <span className="font-mono font-bold">{item.tcIdentityNo}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="text-muted-foreground">Kimlik Belgesi:</span>
                                        <a href={item.documentUrl} target="_blank" className="text-blue-400 hover:underline flex items-center gap-1">
                                            <FileText className="w-3 h-3" />
                                            Görüntüle
                                        </a>
                                    </div>

                                    {/* Corporate Document Link */}
                                    {item.user.dealerProfile?.taxPlateDoc && (
                                        <div className="flex items-center gap-2 text-sm border-t border-white/5 pt-2">
                                            <span className="text-muted-foreground">Kurumsal Belge:</span>
                                            <a href={item.user.dealerProfile.taxPlateDoc} target="_blank" className="text-purple-400 hover:underline flex items-center gap-1">
                                                <FileText className="w-3 h-3" />
                                                Vergi Levhası/Yetki Belgesi
                                            </a>
                                        </div>
                                    )}

                                    {/* Corporate Info */}
                                    {item.user.dealerProfile && (
                                        <div className="border-t border-white/5 pt-2 space-y-1">
                                            <div className="flex items-center gap-2 text-sm">
                                                <span className="text-muted-foreground">Mağaza:</span>
                                                <span className="font-medium">{item.user.dealerProfile.storeName}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <span className="text-muted-foreground">Lokasyon:</span>
                                                <span>{item.user.dealerProfile.city}, {item.user.dealerProfile.district}</span>
                                            </div>
                                            {item.user.dealerProfile.taxNumber && (
                                                <div className="flex items-center gap-2 text-sm">
                                                    <span className="text-muted-foreground">Vergi No:</span>
                                                    <span className="font-mono">{item.user.dealerProfile.taxNumber}</span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 min-w-[140px]">
                            <form action={async () => {
                                "use server";
                                await approveIdentity(item.id);
                            }}>
                                <button className="w-full px-4 py-2 bg-green-500/20 text-green-500 hover:bg-green-500/30 rounded-lg flex items-center justify-center gap-2 font-medium transition-colors border border-green-500/20">
                                    <CheckCircle2 className="w-4 h-4" />
                                    Onayla
                                </button>
                            </form>

                            <form action={async () => {
                                "use server";
                                await rejectIdentity(item.id, "Belgeler yetersiz veya okunaksız.");
                            }}>
                                <button className="w-full px-4 py-2 bg-red-500/20 text-red-500 hover:bg-red-500/30 rounded-lg flex items-center justify-center gap-2 font-medium transition-colors border border-red-500/20">
                                    <XCircle className="w-4 h-4" />
                                    Reddet
                                </button>
                            </form>
                        </div>
                    </div>
                ))}

                {/* Badge Requests List */}
                {badgeRequests.map((item) => (
                    <div key={item.id} className="glass-card p-6 flex items-start justify-between gap-4 border-l-4 border-l-brand-gold">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-brand-gold/20 flex items-center justify-center text-brand-gold">
                                <BadgeCheck className="w-6 h-6" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="font-bold text-lg">{item.user.name}</h3>
                                    <span className="text-xs bg-brand-gold/20 text-brand-gold px-2 py-0.5 rounded border border-brand-gold/20">Rozet Talebi</span>
                                </div>
                                <p className="text-sm text-muted-foreground">{item.user.email}</p>

                                <div className="flex gap-2 mt-2">
                                    <span className={`text-xs px-2 py-0.5 rounded border ${item.user.phoneVerified ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-red-500/10 text-red-500 border-red-500/20"}`}>
                                        Telefon: {item.user.phoneVerified ? "Onaylı" : "Onaysız"}
                                    </span>
                                    <span className={`text-xs px-2 py-0.5 rounded border ${item.user.identityVerified ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-red-500/10 text-red-500 border-red-500/20"}`}>
                                        Kimlik: {item.user.identityVerified ? "Onaylı" : "Onaysız"}
                                    </span>
                                </div>

                                <div className="mt-4 p-4 bg-black/40 rounded-lg space-y-2 border border-white/5">
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="text-muted-foreground">Talep Tipi:</span>
                                        <span className="font-bold text-brand-gold">{item.type}</span>
                                    </div>
                                    {item.user.identityVerification && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <span className="text-muted-foreground">Kimlik Belgesi:</span>
                                            <a href={item.user.identityVerification.documentUrl} target="_blank" className="text-blue-400 hover:underline flex items-center gap-1">
                                                <FileText className="w-3 h-3" />
                                                Görüntüle
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 min-w-[140px]">
                            <form action={async () => {
                                "use server";
                                await approveBadge(item.id);
                            }}>
                                <button className="w-full px-4 py-2 bg-green-500/20 text-green-500 hover:bg-green-500/30 rounded-lg flex items-center justify-center gap-2 font-medium transition-colors border border-green-500/20">
                                    <CheckCircle2 className="w-4 h-4" />
                                    Onayla
                                </button>
                            </form>

                            <form action={async () => {
                                "use server";
                                await rejectBadge(item.id, "Kriterler sağlanmıyor.");
                            }}>
                                <button className="w-full px-4 py-2 bg-red-500/20 text-red-500 hover:bg-red-500/30 rounded-lg flex items-center justify-center gap-2 font-medium transition-colors border border-red-500/20">
                                    <XCircle className="w-4 h-4" />
                                    Reddet
                                </button>
                            </form>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
