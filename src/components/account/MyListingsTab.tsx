
useEffect(() => {
    loadListings()
}, [])

const loadListings = async () => {
    setLoading(true)
    const result = await getUserListings()
    if (result.success && result.data) {
        setListings(result.data)
    } else {
        setError(result.error || "İlanlar yüklenemedi")
    }
    setLoading(false)
}

const handleDelete = async (id: string) => {
    if (!confirm("Bu ilanı silmek istediğinizden emin misiniz?")) return

    const result = await deleteUserListing(id)
    if (result.success) {
        setListings(listings.filter(l => l.id !== id))
    } else {
        alert(result.error || "İlan silinemedi")
    }
}

if (loading) {
    return (
        <div className="glass-card p-8 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-brand-gold border-t-transparent rounded-full mx-auto"></div>
            <p className="text-muted-foreground mt-4">İlanlar yükleniyor...</p>
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

if (listings.length === 0) {
    return (
        <div className="glass-card p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                <Eye className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-2">Henüz İlanınız Yok</h3>
            <p className="text-muted-foreground mb-6">İlk ilanınızı oluşturun ve satışa başlayın!</p>
            <Link
                href="/post-listing"
                className="inline-flex items-center gap-2 px-6 py-3 bg-brand-gold text-primary-foreground rounded-xl font-medium hover:bg-brand-gold/90 transition-colors"
            >
                İlan Ver
            </Link>
        </div>
    )
}

return (
    <div className="space-y-4">
        {listings.map((listing) => (
            <div key={listing.id} className="glass-card p-6 flex gap-6 group hover:bg-white/10 transition-all">
                {/* Image */}
                {listing.images?.[0] && (
                    <div className="relative w-48 h-32 flex-shrink-0 rounded-xl overflow-hidden">
                        <img
                            src={listing.images[0].url}
                            alt={listing.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <Link href={`/listing/${listing.id}`} className="hover:text-brand-gold transition-colors">
                                <h3 className="text-lg font-bold mb-1 line-clamp-1">{listing.title}</h3>
                            </Link>
                            <p className="text-sm text-muted-foreground mb-2">{listing.category?.name}</p>
                        </div>
                        <div className="text-brand-gold font-bold text-xl whitespace-nowrap">
                            {listing.price.toLocaleString('tr-TR')} ₺
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {listing.views} görüntülenme
                        </div>
                        <div>•</div>
                        <div>{new Date(listing.createdAt).toLocaleDateString('tr-TR')}</div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        <Link
                            href={`/listing/${listing.id}/edit`}
                            className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl flex items-center gap-2 text-sm font-medium transition-colors"
                        >
                            <Edit className="w-4 h-4" />
                            Düzenle
                        </Link>
                        <button
                            onClick={() => handleDelete(listing.id)}
                            className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl flex items-center gap-2 text-sm font-medium transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                            Sil
                        </button>
                    </div>
                </div>
            </div>
        ))}
    </div>
)
}
