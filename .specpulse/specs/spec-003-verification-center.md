# Spec 003: Verification Center

## 1. Overview
The Verification Center (`/dashboard/verification`) is a dedicated section where users can verify their identity to gain trust badges and unlock higher limits. This builds trust between buyers and sellers.

## 2. User Stories
- As a user, I want to verify my phone number so I can post listings.
- As a user, I want to verify my identity (TC Identity No) to get a "Verified User" badge.
- As a dealer, I want to upload my tax plate to get a "Corporate Dealer" badge.

## 3. Proposed Features

### 3.1. Phone Verification
- **Status Display**: Show "Verified" or "Unverified".
- **Action**: "Verify Now" button triggers SMS OTP flow.
- **Implementation**: Reuse existing OTP logic but adapted for SMS (mocked for now).

### 3.2. Identity Verification
- **TC Identity No**: Input field for 11-digit number.
- **Document Upload**: Upload photo of ID card (Front/Back).
- **Validation**:
    - TC No algorithm check (mod 10).
    - Manual admin review for documents.

### 3.3. Corporate Verification (Dealers Only)
- **Tax Info**: Tax Number, Tax Office.
- **Document Upload**: Tax Plate (Vergi Levhası).
- **Status**: Pending Review, Verified, Rejected.

## 4. Technical Implementation
- **Route**: `src/app/dashboard/verification/page.tsx`
- **Database**:
    - `User` model already has `phoneVerified`, `identityVerified`, `identityDoc`.
    - Need to ensure `VehicleFeedback` or a new `VerificationRequest` model tracks the status of document reviews.
- **Components**:
    - `VerificationCard`: Reusable card for each verification type.
    - `PhoneVerificationModal`: OTP input.
    - `IdentityVerificationForm`: TC Input + File Upload.
- **Server Actions**:
    - `verifyPhone(token)`
    - `submitIdentityVerification(formData)`

## 5. Design
- Grid layout with cards for each verification type.
- Progress bar showing "Trust Score" or "% Verified".
