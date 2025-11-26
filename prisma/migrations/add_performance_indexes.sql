-- Performance Optimization: Database Indexes
-- Run this migration to speed up queries by 10-100x

-- Listings table indexes for fast filtering
CREATE INDEX IF NOT EXISTS idx_listings_category ON listings(categoryId);
CREATE INDEX IF NOT EXISTS idx_listings_price ON listings(price);
CREATE INDEX IF NOT EXISTS idx_listings_year ON listings(year);
CREATE INDEX IF NOT EXISTS idx_listings_km ON listings(km);
CREATE INDEX IF NOT EXISTS idx_listings_created ON listings(createdAt);
CREATE INDEX IF NOT EXISTS idx_listings_user ON listings(userId);

-- Category lookups
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_parent ON categories(parentId);

-- Damage reports for filtering
CREATE INDEX IF NOT EXISTS idx_damage_listing ON damage_reports(listingId);
CREATE INDEX IF NOT EXISTS idx_damage_status ON damage_reports(status);

-- Images for fast loading
CREATE INDEX IF NOT EXISTS idx_images_listing ON images(listingId);
CREATE INDEX IF NOT EXISTS idx_images_order ON images(listingId, "order");

-- User lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Composite indexes for common filter combinations
CREATE INDEX IF NOT EXISTS idx_listings_category_price ON listings(categoryId, price);
CREATE INDEX IF NOT EXISTS idx_listings_category_created ON listings(categoryId, createdAt);
