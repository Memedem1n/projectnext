import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { CATEGORIES } from "@/data/categories";
import { LiveStats } from "@/components/home/LiveStats";
import { RecentListings } from "@/components/home/RecentListings";
import { TrendingSection } from "@/components/home/TrendingSection";
import { DealOfTheDay } from "@/components/home/DealOfTheDay";
import { HotDeals } from "@/components/home/HotDeals";
import { PremiumShowcase } from "@/components/home/PremiumShowcase";
import { NearbyListings } from "@/components/home/NearbyListings";
import { TopSellers } from "@/components/home/TopSellers";
import { PopularSearches } from "@/components/home/PopularSearches";
import { Testimonials } from "@/components/home/Testimonials";
import { MobileAppBanner } from "@/components/home/MobileAppBanner";
import { CategoryBadges } from "@/components/home/CategoryBadges";
import { HeroSearch } from "@/components/home/HeroSearch";
import { ScrollIndicator } from "@/components/home/ScrollIndicator";
import { HeroBackground } from "@/components/home/HeroBackground";
import { PageBackground } from "@/components/layout/PageBackground";
import { getListings } from "@/lib/actions/listings";
import { MOCK_LISTINGS, type Listing } from "@/data/mock-data";

// Static generation for instant loading
export const revalidate = 43200; // Revalidate every 12 hours

// Singleton number formatter for better performance
const priceFormatter = new Intl.NumberFormat('tr-TR', {
  style: 'currency',
  currency: 'TRY'
});

export default async function Home() {
  // Fetch real listings from database
  const result = await getListings({
    limit: 10,
    sortOrder: 'desc'
  });

  const recentListings = (result.success && result.data ? result.data : []).map((l: any) => ({
    id: l.id,
    title: l.title,
    price: priceFormatter.format(l.price),
    location: `${l.city}, ${l.district}`,
    date: 'Yeni',
    image: l.images?.[0]?.url || 'https://picsum.photos/800/600',
    categoryId: l.categoryId,
    subcategoryId: l.categoryId,
    features: [],
    seller: {
      name: l.user?.name || 'Satıcı',
      type: 'individual' as const,
      isVerified: false
    },
    tags: [],
    description: l.description
  }));

  // Generate mock category stats (can be updated to real stats later)
  const categoryStats: Record<string, number> = {};
  CATEGORIES.forEach(cat => {
    categoryStats[cat.id] = Math.floor(Math.random() * 5000) + 100;
  });

  return (
    <div className="min-h-screen">
      {/* Background Elements */}
      <PageBackground />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Floating Category Icons */}
        <HeroBackground />

        <div className="container mx-auto px-4 py-12 md:py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-12">
            {/* Headline */}
            <div className="space-y-6">
              <h1 className="text-4xl md:text-7xl lg:text-8xl font-bold text-white leading-tight tracking-tight">
                Hayalindeki Her Şey
                <span className="block text-brand-gold">Burada</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground/80 max-w-2xl mx-auto font-light">
                Güvenli alışveriş için doğru adres
              </p>
            </div>
            {/* Search and Categories */}
            <HeroSearch />
          </div>
        </div>

        {/* Decorative gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent pointer-events-none" />

        {/* Scroll indicator */}
        <ScrollIndicator />
      </section>



      {/* Category Badges */}
      <CategoryBadges categoryStats={categoryStats} />

      {/* 1. Live Stats */}
      <LiveStats />

      {/* 2. Recent Listings Timeline */}
      <RecentListings listings={recentListings} />

      {/* 3. Trending This Week */}
      <TrendingSection />

      {/* 4. Deal of the Day */}
      <DealOfTheDay />

      {/* 5. Hot Deals */}
      <HotDeals />

      {/* 6. Premium Showcase */}
      <PremiumShowcase />

      {/* 7. Nearby Listings */}
      <NearbyListings />

      {/* 9. Top Sellers */}
      <TopSellers />

      {/* 10. Popular Searches */}
      <PopularSearches />

      {/* 11. Testimonials */}
      <Testimonials />

      {/* 12. Mobile App Banner */}
      <MobileAppBanner />

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="glass-card p-8 md:p-12 bg-gradient-to-br from-brand-gold/10 via-white/5 to-brand-gold/5 border-brand-gold/20 text-center relative overflow-hidden">
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-gold/10 to-transparent animate-pulse opacity-50" />

            <div className="max-w-2xl mx-auto space-y-6 relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-brand-gold to-white bg-clip-text text-transparent">
                Hemen İlan Ver
              </h2>
              <p className="text-base md:text-lg text-muted-foreground/90">
                Satmak istediğiniz ürünü hemen listeleyin. Ücretsiz, hızlı ve kolay!
              </p>
              <Link
                href="/post-listing"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 backdrop-blur-xl border-2 border-brand-gold/40 hover:border-brand-gold/60 text-white px-6 md:px-8 py-3 md:py-4 rounded-full text-base md:text-lg font-semibold shadow-[0_8px_32px_rgba(254,204,128,0.15)] hover:shadow-[0_12px_40px_rgba(254,204,128,0.25)] transition-all duration-300 hover:scale-105 active:scale-95 group relative overflow-hidden"
              >
                {/* Shine effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

                <span className="relative z-10 flex items-center gap-2">
                  Ücretsiz İlan Ver
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
