"use client"

import { useEffect, useState } from "react"
import { getSavedFilters, deleteSavedFilter } from "@/lib/actions/filters"
import { Bookmark, Trash2, AlertCircle, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"

type SavedFilter = any // TODO: Add proper type

export function SavedFiltersTab() {
    const router = useRouter()
    const [filters, setFilters] = useState<SavedFilter[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        loadFilters()
    }, [])

    const loadFilters = async () => {
        setLoading(true)
        const result = await getSavedFilters()
        if (result.success && result.data) {
            setFilters(result.data)
        } else {
            setError(result.error || "Kaydedilmiş aramalar yüklenemedi")
        }
        setLoading(false)
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Bu aramayı silmek istediğinizden emin misiniz?")) return

        const result = await deleteSavedFilter(id)
        if (result.success) {
            setFilters(filters.filter(f => f.id !== id))
        } else {
            alert(result.error || "Arama silinemedi")
        }
    }

    const handleApplyFilter = (filter: SavedFilter) => {
        const config = filter.filterConfig as any
        const params = new URLSearchParams()

        Object.entries(config).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== "") {
                params.set(key, String(value))
            }
        })

        const categorySlug = filter.categorySlug || "vasita"
        router.push(`/category/${categorySlug}?${params.toString()}`)
    }

    if (loading) {
        return (
            <div className="glass-card p-8 text-center">
                <div className="animate-spin w-8 h-8 border-2 border-brand-gold border-t-transparent rounded-full mx-auto"></div>
                <p className="text-muted-foreground mt-4">Aramalar yükleniyor...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="glass-card p-8 text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">Hata Oluştu</p>
                <p className="text-muted-foreground">{error}</p>
            </div>
        )
    }

    if (filters.length === 0) {
        return (
            <div className="glass-card p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                    <Bookmark className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-2">Kaydedilmiş Arama Yok</h3>
                <p className="text-muted-foreground">Filtrelediğiniz aramaları kaydedin ve hızlıca erişin</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filters.map((filter) => {
                const config = filter.filterConfig as any
                const filterCount = Object.keys(config).filter(k => config[k] !== null && config[k] !== "").length

                return (
                    <div key={filter.id} className="glass-card p-6 group hover:bg-white/10 transition-all">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-10 h-10 rounded-full bg-brand-gold/20 flex items-center justify-center">
                                <Bookmark className="w-5 h-5 text-brand-gold" />
                            </div>
                            <button
                                onClick={() => handleDelete(filter.id)}
                                className="p-2 hover:bg-red-500/10 text-muted-foreground hover:text-red-500 rounded-lg transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>

                        <h3 className="font-bold text-lg mb-2">{filter.name}</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            {filterCount} filtre • {new Date(filter.createdAt).toLocaleDateString('tr-TR')}
                        </p>

                        <button
                            onClick={() => handleApplyFilter(filter)}
                            className="w-full py-2 px-4 bg-brand-gold/10 hover:bg-brand-gold/20 border border-brand-gold/20 text-brand-gold rounded-xl flex items-center justify-center gap-2 font-medium transition-colors"
                        >
                            Aramayı Uygula
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                )
            })}
        </div>
    )
}
