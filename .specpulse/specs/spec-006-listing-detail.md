# Spec 006: Listing Detail Page Redesign

## 1. Overview
Revamp the listing detail page (`/listing/[id]`) to provide a premium, data-rich, and user-friendly experience. The new design should showcase all available listing details, including seller information, technical specs, and features, using a modern "glassmorphism" aesthetic.

## 2. User Stories
- As a buyer, I want to see all critical vehicle/property details (e.g., KM, Year, Rooms) at a glance.
- As a buyer, I want to view high-quality images in a modern gallery.
- As a buyer, I want to easily contact the seller via call or message.
- As a seller, I want my listing to look professional and trustworthy.

## 3. Proposed Features

### 3.1. Layout Structure
- **Container:** Centered, max-width (container-xl).
- **Header:** Breadcrumbs, Title, Action Buttons (Share, Favorite, Report).
- **Main Grid:** 
  - **Left Column (66%):** Gallery, Overview, Specs, Features, Description, Map.
  - **Right Column (33%):** Sticky Price Card, Seller Card, Safety Tips.

### 3.2. Key Components
- **ListingHeader:** Clean title and breadcrumbs.
- **ListingGallery:** Large main image with thumbnails.
- **ListingSpecs:** Comprehensive table matching the reference image (Brand, Series, Model, Year, Fuel, Gear, KM, Case, HP, CC, Traction, Color, Warranty, Heavy Damage, From Whom, Exchange).
- **DamageReportsSection:** Visual representation of damage + Tramer record + Expert Report.
- **EquipmentSection:** Visual grid of selected features (Safety, Multimedia, etc.) with icons.
- **SellerCard:** Premium profile with stats and "Call/Message" actions.
- **PriceCard:** Sticky sidebar component.
- **PromotedListings:** Carousel of paid/doped listings (below main content).
- **SimilarListings:** Carousel of similar listings (bottom of page).

## 4. Technical Implementation

### 4.1. Database Schema
- **Model:** `Listing`
- **Fields:** Use `contactPreference` for phone visibility logic.
- **New Fields Needed:** `motorPower` (hp), `engineVolume` (cc), `traction`, `heavyDamage` (boolean). *If schema update is not possible immediately, use mock data or existing fields where possible.*

### 4.2. Components
- `src/components/listing-detail/PromotedListings.tsx`: New component for "Dopingli İlanlar".
- `src/components/listing-detail/ListingSpecs.tsx`: Update with full list of attributes.
- `src/components/listing-detail/EquipmentSection.tsx`: Enhance visual style.
- `src/app/listing/[id]/page.tsx`: Add PromotedListings section.

### 4.3. Actions
- `getPromotedListings()`: Fetch listings with `isDoping: true`.
