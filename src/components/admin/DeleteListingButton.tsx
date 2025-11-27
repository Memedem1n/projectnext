'use client'

import { useState } from 'react'
import { Trash2, X, Check } from 'lucide-react'
import { softDeleteListing } from '@/lib/actions/admin-listings'
import { useRouter } from 'next/navigation'

export function DeleteListingButton({ listingId }: { listingId: string }) {
    const router = useRouter()
    const [isConfirming, setIsConfirming] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    async function handleDelete(e: React.MouseEvent) {
        e.preventDefault()
        e.stopPropagation()

        if (!isConfirming) {
            setIsConfirming(true)
            return
        }

        setIsLoading(true)
        try {
            await softDeleteListing(listingId)
            router.refresh()
        } catch (error) {
            console.error(error)
            setIsLoading(false)
            setIsConfirming(false)
        }
    }

    function handleCancel(e: React.MouseEvent) {
        e.preventDefault()
        e.stopPropagation()
        setIsConfirming(false)
    }

    if (isConfirming) {
        return (
            <div className="flex items-center gap-1 animate-in fade-in zoom-in duration-200">
                <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isLoading}
                    className="relative z-20 px-2 py-1.5 bg-red-600 text-white hover:bg-red-700 rounded text-xs font-bold transition-colors flex items-center gap-1 shadow-lg"
                    title="Silmeyi Onayla"
                >
                    {isLoading ? '...' : <Check className="w-3 h-3" />}
                    Onayla
                </button>
                <button
                    type="button"
                    onClick={handleCancel}
                    disabled={isLoading}
                    className="relative z-20 px-2 py-1.5 bg-gray-600 text-white hover:bg-gray-700 rounded text-xs font-medium transition-colors shadow-lg"
                    title="İptal"
                >
                    <X className="w-3 h-3" />
                </button>
            </div>
        )
    }

    return (
        <button
            type="button"
            onClick={handleDelete}
            className="relative z-10 cursor-pointer px-3 py-1.5 bg-red-500/20 text-red-500 hover:bg-red-500/30 rounded text-xs font-medium transition-colors border border-red-500/20 flex items-center gap-1"
            title="İlanı Sil"
        >
            <Trash2 className="w-3 h-3" />
            Sil
        </button>
    )
}
