'use client'

import { Trash2, ExternalLink } from 'lucide-react'
import { deleteListing } from '@/lib/actions/listings'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export function AdminListingActions({ id, slug }: { id: string, slug: string }) {
    const router = useRouter()

    async function handleDelete() {
        if (confirm('Bu ilanı silmek istediğinize emin misiniz?')) {
            await deleteListing(id)
            router.refresh()
        }
    }

    return (
        <div className="flex items-center gap-2">
            <Link
                href={`/listing/${id}`}
                target="_blank"
                className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                title="Görüntüle"
            >
                <ExternalLink className="w-4 h-4" />
            </Link>
            <button
                onClick={handleDelete}
                className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                title="Sil"
            >
                <Trash2 className="w-4 h-4" />
            </button>
        </div>
    )
}
