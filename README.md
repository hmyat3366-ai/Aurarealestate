# Vane & Sterling — Prime Real Estate Agency Platform

A production-grade, editorial real estate agency web platform crafted for **Vane & Sterling**, an independent, partner-led real estate agency specializing in Prime Central London and European residential acquisitions and lettings.

---

## 1. Business Model & Core Philosophy

This platform is strictly **agency-owned and curated**:
- **Buy (Acquisition):** Discover exclusively represented properties for sale across Mayfair, Kensington, Chelsea, Marylebone, Belgravia, and Richmond.
- **Rent (Executive Lettings):** Prime residences to let with transparent monthly (£ PCM) and weekly (£ PW) calculations and verified availability dates.
- **Sell with Us (Private Client Representation):** Property owners requesting valuation or representation must contact the agency private office directly. **Public users cannot self-publish property listings.**
- **Discretion & Fiduciary Duty:** Regulated by RICS and registered with The Property Ombudsman.

---

## 2. Architectural & Research Documentation

Detailed strategic documentation is maintained in the [`docs/`](./docs) directory:
- [`docs/REFERENCE_ANALYSIS.md`](./docs/REFERENCE_ANALYSIS.md): Comprehensive analysis of Knight Frank UK, Savills UK, Sotheby's International Realty, Rightmove, Zoopla, Zillow, and PropertyGuru.
- [`docs/PRODUCT_UX_SPEC.md`](./docs/PRODUCT_UX_SPEC.md): Target user personas, business constraints, search filtering mechanics, and edge case handling.
- [`docs/SITEMAP_AND_FLOWS.md`](./docs/SITEMAP_AND_FLOWS.md): Full information architecture, page hierarchy, and end-to-end user flow diagrams.
- [`docs/DESIGN_SYSTEM.md`](./docs/DESIGN_SYSTEM.md): Design tokens, typography hierarchy, responsive breakpoints, and reusable UI component inventory.

---

## 3. Technology Stack

- **Framework:** Next.js 15 (App Router, Static Site Generation for properties and locations)
- **Language:** TypeScript 5.7 (Strict mode)
- **Styling:** Tailwind CSS 3.4 (Custom design tokens, mineral palette, serif typography)
- **Icons:** Lucide React
- **Testing:** Vitest 3.0, Testing Library React, JSDOM

---

## 4. Getting Started

### Prerequisites
- Node.js `v20.x` or higher
- npm `v10.x` or higher

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Running Test Suite
```bash
npm run test
```
Executes 31 automated tests across property filtering, sorting, pricing formatting, API endpoints, spam honeypots, and component rendering.

### Production Build
```bash
npm run build
npm start
```

---

## 5. Environment Variables & Central Configuration

Centralized agency configuration is located in [`config/agency.ts`](./config/agency.ts). Optional environment variables:

| Variable | Description | Default |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_AGENCY_EMAIL` | Default central agency email | `privateoffice@vaneandsterling.com` |
| `RESEND_API_KEY` | Optional live transactional email API key | *(Unset — uses honest fallback)* |
| `SMTP_HOST` | Optional SMTP server hostname | *(Unset — uses honest fallback)* |

*Note: In accordance with our honest handling policy, when no live transactional mail provider is configured, forms provide explicit acknowledgment and direct pre-formatted `mailto:` fallbacks so client data is never silently dropped.*
