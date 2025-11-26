import { ListingWithRelations } from '@/lib/actions/listings'
import { Listing as MockListing } from '@/data/mock-data'

/**
 * Helper function to adapt database listing to mock listing format
 * This ensures backward compatibility with existing components
 */
export function adaptListingToMockFormat(dbListing: ListingWithRelations): MockListing {
    const coverImage = dbListing.images.find(img => img.isCover) || dbListing.images[0]

    return {
        id: dbListing.id,
        title: dbListing.title,
        price: new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(dbListing.price),
        location: `${dbListing.city || 'İstanbul'}, ${dbListing.district || 'Kadıköy'}`,
        date: getRelativeTime(dbListing.createdAt),
        image: coverImage?.url || '/placeholder-car.jpg',
        categoryId: dbListing.category.slug,
        subcategoryId: dbListing.category.slug,
        features: dbListing.equipment.map(eq => eq.equipment.name),
        description: dbListing.description || undefined,
        seller: {
            name: dbListing.user.name || 'Anonim',
            type: 'individual',
            isVerified: false,
        },
        verifiedReport: Boolean(dbListing.tramer),
        specs: {
            fuel: dbListing.fuel || undefined,
            gear: dbListing.gear || undefined,
            year: dbListing.year || undefined,
            km: dbListing.km ? `${dbListing.km.toLocaleString('tr-TR')} km` : undefined,
        },
        tags: [
            ...(dbListing.warranty ? ['Garantili'] : []),
            ...(dbListing.exchange ? ['Takaslı'] : []),
            ...(dbListing.isPremium ? ['Premium'] : []),
        ],
        details: {
            model: dbListing.model || undefined,
            series: dbListing.brand || undefined,
            color: dbListing.color || undefined,
            damage: dbListing.damage.length > 0 ? 'Hasarlı' : 'Hatasız',
        },
        damageInfo: dbListing.damage.length > 0 ? {
            hasDamageRecord: true,
            damagedPartsCount: dbListing.damage.length,
            status: 'Hasarlı',
            damagedParts: dbListing.damage.map(dr => dr.part),
        } : {
            hasDamageRecord: false,
            status: 'Hatasız',
        }
    }
}

/**
 * Get relative time string (e.g., "2 saat önce")
 */
function getRelativeTime(date: Date): string {
    const now = new Date()
    const diffMs = now.getTime() - new Date(date).getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Az önce'
    if (diffMins < 60) return `${diffMins} dakika önce`
    if (diffHours < 24) return `${diffHours} saat önce`
    if (diffDays < 30) return `${diffDays} gün önce`

    return new Date(date).toLocaleDateString('tr-TR')
}
