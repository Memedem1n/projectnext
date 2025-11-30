# Specification: Initial System State

**Spec ID:** SPEC-000
**Title:** Initial System State & Architecture
**Status:** Approved
**Created:** 2025-11-30

## 1. Executive Summary
This specification documents the existing state of ProjectNexx as of November 30, 2025. It serves as the baseline for all future development using SpecPulse.

## 2. System Architecture

### 2.1 Frontend
- **Next.js 16 App Router** used for routing and rendering.
- **Tailwind CSS v4** used for styling with a custom design system.
- **Components** organized by feature (`components/listing`, `components/auth`, etc.) and shared UI (`components/ui`).

### 2.2 Backend
- **Server Actions** used for API logic (`src/lib/actions`).
- **Prisma ORM** used for database access.
- **PostgreSQL** used as the primary data store.

### 2.3 Authentication & Security
- **Custom JWT Auth** implemented in `src/lib/auth-edge.ts`.
- **Middleware** handles session validation and routing.
- **Role-based Access:**
    - `User`: Standard access.
    - `Admin`: Access via `yonetim` subdomain, restricted by IP.

## 3. Feature Specifications (Current State)

### 3.1 User Accounts
- Users can register, login, and verify email.
- Two-Factor Authentication (2FA) is supported.
- Corporate accounts have separate verification flows.

### 3.2 Listings
- Users can view listings with filtering and sorting.
- Listing creation flow is a multi-step wizard (In Progress).
- Listings have detailed attributes: Images, Equipment, Damage Reports.

### 3.3 Messaging
- Buyers can message sellers via listing pages.
- Conversations are grouped by listing and participants.

## 4. Data Models
Refer to `prisma/schema.prisma` for the authoritative data model definition. Key models include:
- `User`
- `Listing`
- `Category`
- `Conversation`
- `Message`

## 5. Constraints & Standards
- **Performance:** All pages must use Server Components where possible.
- **Type Safety:** Strict TypeScript usage required.
- **Testing:** Unit tests for logic, E2E tests for critical flows.
