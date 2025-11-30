# Project Context: ProjectNexx (formerly Sahibinden.next)

## 1. Project Overview
**ProjectNexx** is a next-generation classifieds platform (similar to Sahibinden.com) built with modern web technologies. It focuses on a premium user experience, security, and performance.

### Tech Stack
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 (Premium Dark/Gold Theme)
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** Custom JWT-based Auth (Edge compatible) + 2FA
- **Testing:** Vitest (Unit), Playwright (E2E)
- **Deployment:** Vercel

## 2. Directory Structure
- `src/app`: App Router pages (Dashboard, Admin, Listings, Auth).
- `src/components`: Reusable UI components.
- `src/lib`: Utilities, Server Actions, Database client.
- `src/middleware.ts`: Edge middleware for Auth, Subdomains (Admin), and IP restriction.
- `prisma/schema.prisma`: Database schema definition.

## 3. Core Systems & Status

### ✅ Active & Stable
- **Authentication:** Login, Register, Email Verification, 2FA.
- **Middleware:** Subdomain routing (`yonetim.projectnexx.com`), IP restriction, Session management.
- **Database:** Core models (`User`, `Listing`, `Category`) defined and migrated.
- **Admin Panel:** Basic routing and security established.

### 🚧 In Development / Active Work
- **Post Listing Flow:** Multi-step form for creating listings (Category -> Details -> Media -> Review).
- **Chat System:** Real-time messaging between buyers and sellers (Unit tests fixed).
- **Favorites:** User favorite listings management.

### 🐛 Known Issues (Recently Fixed)
- **Middleware 500 Error:** Fixed by adding null checks for invalid sessions in `auth-edge.ts`.
- **E2E Test Failures:** Fixed by updating `layout.tsx` title to match rebranding ("ProjectNexx").
- **Prisma Type Errors:** Fixed by regenerating Prisma Client.

## 4. Database Schema Highlights
- **User:** Supports Individual and Corporate types.
- **Listing:** Central model with relations to `Images`, `Equipment`, `DamageReport`.
- **Category:** Hierarchical structure (Parent/Child).
- **VehicleData:** Flat table for Eurotax data (Brand/Model/Year/Package).

## 5. Recent History
- **Rebranding:** Renamed from "Sahibinden.next" to "ProjectNexx".
- **Security:** Added VPN/IP restriction for Admin panel.
- **CI/CD:** Fixed build pipeline and test failures.

## 6. Next Steps
- Complete the "Post Listing Flow".
- Enhance Admin Dashboard features.
- Implement advanced filtering and search.
