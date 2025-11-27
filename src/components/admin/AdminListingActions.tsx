'use client'

import { ExternalLink } from 'lucide-react'
import Link from 'next/link'

export function AdminListingActions({ id, slug }: { id: string, slug: string }) {
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
        </div>
    )
}
