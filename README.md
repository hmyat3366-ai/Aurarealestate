# AURA Real Estate — Prime & Super-Prime International Real Estate Agency

A luxury, editorial, and architectural real estate platform built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Vitest**.

Combining the property discovery information architecture of Compass and Knight Frank with refined editorial typography and modern architectural art direction.

---

## 🏛️ Features

- **Cinematic Discovery & Navigation**:
  - Knight Frank-inspired tabbed floating search console (Buy, Rent, Commercial, Valuation).
  - Multi-attribute real estate filtering with URL query parameter persistence.
  - Interactive property cards with independent image carousel navigation and favorite heart toggle.
- **Exclusive Services & Advisory**:
  - Dedicated advisory pillars: Residential Sales, Lettings & Management, Private Office & Acquisitions, and Development Advisory.
  - Direct inquiry workflows with realistic validation and email fallbacks.
- **Market Intelligence & Research**:
  - The Wealth Report & Research Insights publication engine with dedicated editorial articles.
- **Passwordless Authentication & Security**:
  - Email OTP passwordless authentication.
  - Server-side verified sessions with HttpOnly cookies.
  - Protected personal account dashboard (`/account`), Saved Properties (`/account/saved`), and Viewing Request History (`/account/viewings`).
- **Design System & Typography**:
  - Luxury editorial palette: Warm Alabaster (`#FBFBF9`), Obsidian Ink (`#121312`), Heritage Bronze (`#78542E`), Hairline Borders (`#E6E4DE`).
  - Strict typographic hierarchy and WCAG 2.2 AA accessibility standards.
- **Robust Quality Engineering**:
  - Comprehensive automated test suites (41 test files, 400+ unit and integration tests).

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router, Server & Client Components)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS
- **Testing**: Vitest, React Testing Library, jsdom
- **Icons**: Lucide React / Custom SVG Monograms & Brand Marks

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18.17+ or v20+)
- npm or pnpm

### Installation

```bash
# Clone repository
git clone https://github.com/hmyat3366-ai/Aurarealestate.git
cd Aurarealestate

# Install dependencies
npm install
```

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing & Verification

Run the comprehensive test suite and verify the build:

```bash
# Run unit & integration tests
npm test

# Run full project verification (TypeScript, Lint, Tests, Production Build)
npm run verify
```

---

## 📁 Project Structure

```
├── data/                    # Seed and persistent mock datasets
├── public/                  # Static assets and brand logos
├── src/
│   ├── app/                 # Next.js App Router pages and API routes
│   │   ├── (auth)/          # Authentication flows (/auth, /login, /signup)
│   │   ├── account/         # Protected account dashboard and history
│   │   ├── buy/             # For sale property discovery
│   │   ├── rent/            # Lettings & rental property discovery
│   │   ├── services/        # Services & advisory pages
│   │   ├── insights/        # The Wealth Report editorial articles
│   │   └── properties/[id]/ # Property detail pages
│   ├── components/          # Reusable UI & layout components
│   ├── context/             # Auth and Favorites React contexts
│   ├── data/                # Property listings and metadata
│   └── lib/                 # Utility functions and auth helpers
└── tests/                   # Vitest unit and integration test suites
```

---

## 📜 License

Private proprietary project for AURA Real Estate. All rights reserved.
