# Spec 004: Admin Verification Panel

## 1. Overview
The Admin Verification Panel (`/admin/verifications`) allows administrators to review and approve/reject user verification requests (Identity and Corporate).

## 2. User Stories
- As an admin, I want to see a list of pending verification requests.
- As an admin, I want to view the documents uploaded by the user (ID card, Tax Plate, etc.).
- As an admin, I want to approve a request so the user gets the "Verified" badge.
- As an admin, I want to reject a request with a reason so the user can correct it.

## 3. Proposed Features

### 3.1. Verification List
- **Tabs**: Identity Requests, Corporate Requests.
- **Columns**: User Name, Email, Status (Pending/Verified/Rejected), Date.
- **Actions**: View Details.

### 3.2. Request Detail View
- **User Info**: Name, Email, Phone.
- **Submitted Data**:
    - Identity: TC No, ID Document Image.
    - Corporate: Tax No, Tax Office, Registry No, Tax Plate Image, Establishment Doc Image.
- **Action Buttons**:
    - **Approve**: Updates status to `VERIFIED`.
    - **Reject**: Updates status to `REJECTED` (optional: reason).

## 4. Technical Implementation
- **Route**: `src/app/admin/verifications/page.tsx`
- **Components**:
    - `VerificationTable`: List view.
    - `VerificationDetailModal`: Modal to view docs and take action.
- **Server Actions**:
    - `getPendingVerifications()`
    - `approveVerification(userId, type)`
    - `rejectVerification(userId, type)`

## 5. Security
- Route must be protected by `admin` middleware (already exists).
- Only users with `role: ADMIN` can access.
