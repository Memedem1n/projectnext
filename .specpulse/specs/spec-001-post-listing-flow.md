# Specification: Complete Post Listing Flow

**Spec ID:** SPEC-001
**Title:** Complete Post Listing Flow
**Status:** Draft
**Created:** 2025-11-30

## 1. Overview
The current "Post Listing" process is functional but lacks critical user experience steps. This specification outlines the requirements to add a Preview step, a Success/Thank You page, and enforce data validation rules.

## 2. User Stories
- **As a User**, I want to see a preview of my listing before publishing so I can catch mistakes.
- **As a User**, I want to see a clear confirmation page after submission so I know my listing is being processed.
- **As a Platform**, we want to ensure all listings have at least one image and valid price data to maintain quality.

## 3. Functional Requirements

### 3.1 Step 6: Preview Mode (New)
- **Location:** Between "Images" and "Finish" steps (or integrated into Finish).
- **UI:** Display a read-only version of the `ListingCard` or `ListingDetail` component populated with the form data.
- **Actions:** "Edit" button to go back, "Confirm" button to proceed to package selection.

### 3.2 Step 7: Success Page (New)
- **Route:** `/post-listing/success?id={listingId}`
- **Content:**
    - Success icon/animation.
    - Message: "İlanınız onaya gönderildi."
    - Buttons: "İlanı Görüntüle", "Anasayfaya Dön", "Yeni İlan Ver".
- **Confetti:** Optional visual celebration.

### 3.3 Validation Rules
- **Images:** Minimum 1 image required. Max 20 images.
- **Price:** Must be greater than 0.
- **Title:** Minimum 10 characters.
- **Description:** Minimum 20 characters.
- **Rules:** Uncomment/Enable existing validation logic in `page.tsx`.

### 3.4 Mock Payment UI
- **Package Selection:** User selects Standard, Gold, or Premium.
- **Payment Form:** Show a mock credit card form (Card Number, Expiry, CVC).
- **Behavior:** No real API call. Simulate 1-second processing delay then succeed.

## 4. Technical Implementation
- **File:** `src/app/post-listing/page.tsx`
- **Components:**
    - Create `src/components/listing/ListingPreview.tsx`
    - Create `src/app/post-listing/success/page.tsx`
- **State:** Manage `isSubmitting` and `isSuccess` states.

## 5. Acceptance Criteria
- [ ] User cannot proceed past "Images" step without uploading at least 1 file.
- [ ] "Preview" button shows the listing data correctly.
- [ ] Submitting the form redirects to the Success page.
- [ ] Success page has a working link to the new listing.
