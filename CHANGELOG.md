# Changelog

All notable changes to this project will be documented in this file.

## [0.2.0] - 2025-11-27

### 🚀 Rebranding (Sahibinden.next -> ProjectNexx)
- **Global:** Replaced all instances of "Sahibinden" with "**ProjectNexx**" across the application.
- **UI:** Updated `Navbar`, `Footer`, and other components with the new brand identity.
- **Content:** Updated all support and corporate pages (`About`, `Contact`, `Terms`, etc.).
- **Backend:** Updated email templates (`mail.ts`) and SMS notifications (`verification.ts`) to use "ProjectNexx".
- **Note:** Kept "Sahibinden" filter option in `FilterSidebar` for "From Owner" context as requested.

### 🛡️ Admin Security
- **Subdomain Routing:** Implemented `yonetim.projectnexx.com` (and `admin.localhost`) for admin panel access via `middleware.ts`.
- **IP Restriction:** Added VPN/IP restriction logic. Admin panel is now only accessible from allowed IPs defined in `.env` (`ALLOWED_ADMIN_IPS`).
- **Access Control:** Direct access to `/admin` on the main domain is now blocked (404).

### 💼 Business Logic & Content
- **Advertise Page (`/support/advertise`):**
    - Implemented dynamic pricing models:
        - 🏗️ **Heavy Machinery:** 500 TL/listing
        - 🏠 **Real Estate:** 300 TL/listing
        - 🚗 **Automotive:** 250 TL/listing
    - Added **Corporate Packages** (10.000 TL/month).
    - Launched **Special Campaigns**:
        - 👩‍💼 **Women Entrepreneurs:** 50% discount on store membership.
        - 🚀 **Young Entrepreneurs:** 30% discount for under 29s.
- **Terms of Service:** Updated `/support/terms` with more detailed, platform-favoring clauses.
- **Contact Info:** Updated address and contact email in Footer.

### 🐛 Bug Fixes
- **Navbar:** Fixed a syntax error (invalid nesting) in `Navbar.tsx`.
- **Middleware:** Fixed `Property 'ip' does not exist on type 'NextRequest'` build error by using headers.

---

## [0.1.0] - Initial Release & Core Features

### 🔐 Authentication & Security
- **Email 2FA:** Implemented Two-Factor Authentication for login and settings.
- **Email Verification:** Added post-registration email verification flow using Resend.
- **Identity Verification:** Implemented identity verification flows (TCKN encryption considerations).
- **Corporate Verification:** Added document upload and verification for corporate accounts.

### 🏪 Listing & Marketplace
- **Post Listing Flow:** Created multi-step listing creation process.
- **Listing Approval:** Implemented admin approval workflow for new listings.
- **Corporate Documents:** Added infrastructure for uploading and managing corporate documents.
- **Category System:**
    - Restored category badges on the homepage.
    - Created category hierarchy diagrams.

### 🔍 Search & Discovery
- **Smart Search:** Implemented intelligent search with category suggestions.
- **Filters:** Added comprehensive filtering options (including "From Owner").

### 🏗️ Infrastructure & DevOps
- **Database:** Configured Prisma ORM with PostgreSQL.
- **Deployment:** Verified deployment on Vercel.
- **Docker:** Created `docker-compose.yml` for containerized development (Ports & Env vars configured).
- **Monitoring:** Setup Sentry and RUM (Real User Monitoring) for error tracking and performance.
- **Mail & SMS:** Integrated Resend for emails and mock services for SMS.

### 🔧 Fixes & Improvements
- **Mock Data:** Removed initial mock data in favor of real database connections.
- **Type Safety:** Fixed various TypeScript errors (`VerificationCenter`, `PhoneVerificationToken`).
- **Build Issues:** Resolved `PrismaClientInitializationError` and `SavedFilter` build errors.
