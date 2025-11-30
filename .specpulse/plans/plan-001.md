# Plan: Complete Post Listing Flow

**Plan ID:** PLAN-001
**Linked Spec:** SPEC-001
**Status:** Draft
**Created:** 2025-11-30

## 1. Component Implementation

### 1.1 ListingPreview Component
- **File:** `src/components/listing/ListingPreview.tsx`
- **Purpose:** Display a summary of the listing data before submission.
- **Props:** `formData` (The entire form state).
- **Content:**
    - Image carousel (using `ImageGallery` if possible or simple grid).
    - Title, Price, Location.
    - Key features list.
    - Description preview (truncated).

### 1.2 Success Page
- **File:** `src/app/post-listing/success/page.tsx`
- **Purpose:** Show confirmation after submission.
- **Content:**
    - Checkmark icon.
    - "İlanınız başarıyla oluşturuldu" message.
    - "İlan No: #{listingId}"
    - Buttons to navigate away.

## 2. Page Logic Updates

### 2.1 Update `src/app/post-listing/page.tsx`
- **State:** Add `preview` to `Step` type.
- **Validation:**
    - Uncomment validation logic in `validateImages`.
    - Ensure `validateDetails` is robust.
- **Flow:**
    - Change "Finish" step to "Preview".
    - Add "Preview" -> "Finish" transition.
    - "Finish" step now handles the final submission and redirect to `/post-listing/success`.

## 3. Verification
- **Manual Test:**
    - Go through the flow with valid data -> Should see Preview -> Submit -> Success Page.
    - Go through with missing data -> Should see validation errors.
