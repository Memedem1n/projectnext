# Spec 005: Doping (Paid Listing Features)

## 1. Overview
"Doping" refers to paid enhancements that allow sellers to increase the visibility and attractiveness of their listings. This spec covers the implementation of "Visual Doping" (Shiny Silver) and "Search Doping" (Promoted Suggestions).

## 2. User Stories
- As a seller, I want to purchase a "Doping" package to make my listing stand out.
- As a seller, I want my listing to have a premium look (Shiny Silver border) to attract more clicks.
- As a seller, I want my listing to appear at the top of search results/suggestions to get more views.
- As a buyer, I want to see "Featured" or "Premium" listings clearly distinguished from standard listings.

## 3. Proposed Features

### 3.1. Visual Doping (Shiny Silver)
- **Design**: A premium, shiny silver border effect around the listing card.
- **Animation**: A subtle "shine" animation (CSS gradient sweep) to catch the eye.
- **Placement**: Applied to `ListingCard` component when `isDoping` is true.

### 3.2. Search Doping (Promoted Suggestions)
- **Placement**: Top of the search dropdown in `HeroSearch` and `HeaderSearch`.
- **Section Title**: "Öne Çıkanlar" (Featured).
- **Design**: Compact but premium cards with the silver effect.
- **Logic**: Fetch listings with `isDoping: true` and display them before organic search results.

## 4. Technical Implementation

### 4.1. Database Schema
- **Model**: `Listing`
- **New Fields**:
    - `isDoping`: Boolean (default false)
    - `dopingType`: String (e.g., 'SILVER')
    - `dopingStartDate`: DateTime
    - `dopingEndDate`: DateTime

### 4.2. Components
- `DopingBorder`: A wrapper component for the silver effect.
- `ListingCard`: Updated to use `DopingBorder`.
- `HeroSearch` / `HeaderSearch`: Updated to fetch and display promoted listings.

### 4.3. Actions
- `getPromotedListings()`: Fetch random or relevant promoted listings for the search dropdown.

## 5. Monetization Strategy
- Initially, this feature will be manually assigned or randomly enabled for testing.
- Future: Integration with a payment gateway to purchase these features.
