# Spec 002: Dashboard Settings Page

## 1. Overview
The settings page (`/dashboard/settings`) allows users to manage their account details, security preferences, and notification settings. Currently, this page returns a 404 because it has not been implemented.

## 2. User Stories
- As a user, I want to update my profile information (name, avatar, phone) so that my listings look professional.
- As a user, I want to change my password to keep my account secure.
- As a user, I want to manage my notification preferences to control what emails/SMS I receive.

## 3. Proposed Features

### 3.1. Profile Settings (Tab 1)
- **Avatar Upload**: Allow users to upload/change their profile picture.
- **Personal Info**:
    - Full Name
    - Phone Number (Verified status)
    - Location (City/District)
- **Bio/About**: Short description for seller profile.

### 3.2. Security (Tab 2)
- **Change Password**: Current password, New password, Confirm new password.
- **Two-Factor Auth (2FA)**: Toggle to enable/disable (Future scope).
- **Active Sessions**: List of devices currently logged in (Future scope).

### 3.3. Notifications (Tab 3)
- **Email Notifications**:
    - New messages
    - Listing status updates (Approved/Rejected)
    - Marketing emails
- **SMS Notifications**:
    - *Not available in this version*

## 4. Technical Implementation
- **Route**: `src/app/dashboard/settings/page.tsx`
- **Layout**: Use existing Dashboard layout.
- **Components**:
    - `SettingsTabs`: Navigation between sections.
    - `ProfileForm`: Server action `updateProfile`.
    - `SecurityForm`: Server action `changePassword`.
    - `NotificationForm`: Server action `updateNotifications`.
- **Database**:
    - Update `User` model if necessary (e.g., adding `bio`, `notificationPreferences`).

## 5. Design
- Clean, split-view or tabbed interface.
- Consistent with the new "Master-Detail" look of the dashboard.
