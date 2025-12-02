import prisma from '@/lib/prisma'
import Image from 'next/image'
import { AdminListingActions } from '@/components/admin/AdminListingActions'
import { AdminSearch } from '@/components/admin/AdminSearch'
import { formatDate } from '@/lib/utils'
import { approveListing, rejectListing } from '@/lib/actions/admin-listings'
import Link from 'next/link'
import { DeleteListingButton } from '@/components/admin/DeleteListingButton'

export const revalidate = 0

interface AdminListingsPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function AdminListingsPage({ searchParams }: AdminListingsPageProps) {
    const params = await searchParams;
    const query = params.q as string;
    const statusFilter = params.status as string; // "pending", "active", "all"

    // Build where clause
    const where: any = {};

    // Status filter
    if (statusFilter === "pending") {
        where.status = "PENDING";
    } else if (statusFilter === "active") {
        where.status = "ACTIVE";
    } else if (statusFilter === "deleted") {
        where.status = "DELETED";
    } else {
        // Default: Don't show deleted listings unless explicitly asked OR searching
        if (!query) {
            where.status = { not: "DELETED" };
        }
    }

    if (query) {
        where.OR = [
            { title: { contains: query, mode: 'insensitive' } },
            { id: { contains: query, mode: 'insensitive' } }
        ];
    }

    console.log('AdminListingsPage Params:', params);
    console.log('Constructed Where:', JSON.stringify(where, null, 2));

    const listings = await prisma.listing.findMany({
        where,
        include: {
            user: true,
            images: {
                orderBy: {
                    order: 'asc'
                },
                take: 1
            },
            category: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-white">İlan Yönetimi</h1>
                <div className="flex items-center gap-4">
                    <AdminSearch />
                    <div className="bg-[#2c2c2c] px-4 py-2 rounded-lg border border-white/10 text-sm text-gray-400">
                        Toplam: <span className="text-white font-bold">{listings.length}</span> ilan
                    </div>
                </div>
            </div>

            {/* Status Filter Tabs */}
            <div className="flex items-center gap-2 mb-6 bg-white/5 p-1 rounded-lg border border-white/10 w-fit">
                <Link
                    href="/admin/listings"
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${!statusFilter ? "bg-brand-gold text-black" : "text-muted-foreground hover:text-white"}`}
                >
                    Tümü
                </Link>
                <Link
                    href="/admin/listings?status=pending"
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${statusFilter === "pending" ? "bg-yellow-500 text-black" : "text-muted-foreground hover:text-white"}`}
                >
                    Onay Bekleyenler
                </Link>
                <Link
                    href="/admin/listings?status=active"
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${statusFilter === "active" ? "bg-green-500 text-black" : "text-muted-foreground hover:text-white"}`}
                >
                    Yayında
                </Link>
                <Link
                    href="/admin/listings?status=deleted"
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${statusFilter === "deleted" ? "bg-red-500 text-black" : "text-muted-foreground hover:text-white"}`}
                >
                    Silinenler
                </Link>
            </div>

            <div className="bg-[#1c1c1c] border border-white/10 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/10">
                                <th className="p-4 text-sm font-medium text-gray-400">Görsel</th>
                                <th className="p-4 text-sm font-medium text-gray-400">Başlık</th>
                                <th className="p-4 text-sm font-medium text-gray-400">Fiyat</th>
                                <th className="p-4 text-sm font-medium text-gray-400">Kategori</th>
                                <th className="p-4 text-sm font-medium text-gray-400">Satıcı</th>
                                <th className="p-4 text-sm font-medium text-gray-400">Durum</th>
                                <th className="p-4 text-sm font-medium text-gray-400">Tarih</th>
                                <th className="p-4 text-sm font-medium text-gray-400 text-right">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {listings.length > 0 ? (
                                listings.map((listing: any) => (
                                    <tr key={listing.id} className="hover:bg-white/5 transition-colors">
                                        <td className="p-4">
                                            <div className="relative w-16 h-12 rounded-lg overflow-hidden bg-white/5">
                                                {listing.images[0] ? (
                                                    <Image
                                                        src={listing.images[0].url}
                                                        alt={listing.title}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">
                                                        No Img
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="font-medium text-white line-clamp-1 max-w-[200px]" title={listing.title}>
                                                {listing.title}
                                            </div>
                                            <div className="text-xs text-gray-500 mt-1">
                                                No: {listing.id.slice(0, 8)}
                                            </div>
                                        </td>
                                        <td className="p-4 text-brand-gold font-medium">
                                            {listing.price.toLocaleString()} TL
                                        </td>
                                        <td className="p-4 text-gray-300">
                                            {listing.category.name}
                                        </td>
                                        <td className="p-4">
                                            <div className="text-white text-sm">{listing.user.name}</div>
                                            <div className="text-xs text-gray-500">{listing.user.email}</div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 text-xs rounded border ${listing.status === "ACTIVE" ? "bg-green-500/20 text-green-500 border-green-500/20" :
                                                listing.status === "PENDING" ? "bg-yellow-500/20 text-yellow-500 border-yellow-500/20" :
                                                    listing.status === "DELETED" ? "bg-gray-500/20 text-gray-500 border-gray-500/20" :
                                                        "bg-red-500/20 text-red-500 border-red-500/20"
                                                }`}>
                                                {listing.status === "ACTIVE" && "Yayında"}
                                                {listing.status === "PENDING" && "Onay Bekliyor"}
                                                {listing.status === "REJECTED" && "Reddedildi"}
                                                {listing.status === "DELETED" && "Silindi"}
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-400 text-sm">
                                            {formatDate(listing.createdAt)}
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                {listing.status === "PENDING" && (
                                                    <>
                                                        <form action={async () => {
                                                            "use server";
                                                            await approveListing(listing.id);
                                                        }}>
                                                            <button className="px-3 py-1.5 bg-green-500/20 text-green-500 hover:bg-green-500/30 rounded text-xs font-medium transition-colors border border-green-500/20">
                                                                Onayla
                                                            </button>
                                                        </form>
                                                        <form action={async () => {
                                                            "use server";
                                                            await rejectListing(listing.id, "Uygunsuz içerik");
                                                        }}>
                                                            <button className="px-3 py-1.5 bg-red-500/20 text-red-500 hover:bg-red-500/30 rounded text-xs font-medium transition-colors border border-red-500/20">
                                                                Reddet
                                                            </button>
                                                        </form>
                                                    </>
                                                )}
                                                {listing.status !== "DELETED" && (
                                                    <DeleteListingButton listingId={listing.id} />
                                                )}
                                                <AdminListingActions id={listing.id} slug={listing.category.slug} />
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-gray-500">
                                        İlan bulunamadı.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
