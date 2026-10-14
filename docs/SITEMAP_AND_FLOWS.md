# Sitemap & User Flow Diagrams

## 1. Information Architecture & Sitemap

```
Vane & Sterling (Root)
│
├── / (Home)
│   ├── Editorial Hero & Quick Search (Buy / Rent)
│   ├── Featured Sales Portfolio
│   ├── Prime Lettings Collection
│   ├── Prime London & Regional Neighborhoods
│   ├── The Agency Difference & Advisory Philosophy
│   ├── "Sell with Us" Private Representation CTA
│   └── Editorial Curations & Inquiries Footer
│
├── /buy (Properties for Sale)
│   ├── Active Filters Bar (Location, Type, Price Range, Beds, Baths, Sort)
│   ├── Active Filter Chips & Result Counter
│   ├── Grid / Editorial Listing of Sale Properties
│   └── Empty State & Reset Triggers
│
├── /rent (Properties for Rent)
│   ├── Rental-Specific Filter Bar (Monthly / Weekly budgets, Furnishing, Availability)
│   ├── Distinct PCM / PW Price Presentation
│   ├── Lettings Grid & Availability Badges
│   └── Rental Guide / Advisory Callout
│
├── /properties/[slug] (Dedicated Property Details)
│   ├── Mosaic Photo Gallery with Fullscreen Lightbox
│   ├── Key Statistics Bar (Price, Beds, Baths, Area, Ref, Availability)
│   ├── Rich Editorial Description & Architectural Highlights
│   ├── Specifications Table (Tenure, Council Tax, EPC Rating, Service Charge)
│   ├── Location Details & Neighborhood Highlights
│   ├── Interactive Viewing Request Modal / Drawer
│   ├── General Agency Inquiry Form
│   └── Curated Related Properties
│
├── /sell (Sell with Us — Private Representation)
│   ├── The Selling Process (Valuation, Presentation, Global Marketing, Closing)
│   ├── Why Sellers Entrust Vane & Sterling
│   ├── Required Details Preparation Guide
│   ├── Private Representation Contact Form (with Honeypot & Mailto Fallback)
│   └── Confidentiality Guarantee
│
├── /locations (Curated Neighborhoods)
│   ├── Overview of Prime Districts (Mayfair, Kensington, Chelsea, Marylebone, etc.)
│   ├── Local Lifestyle, Architectural Pedigree, Transport Connections
│   └── Direct Link to Available Buy / Rent Listings in each Area
│
├── /about (About the Agency)
│   ├── Founding Heritage & Ethical Principles
│   ├── Senior Leadership & Advisory Partners
│   ├── Global Network & Affiliations
│   └── Client Privacy & Fiduciary Commitment
│
├── /contact (Contact & Office Locations)
│   ├── Flagship Office Address, Telephone, Hours
│   ├── General Inquiry Form
│   ├── Department Directory (Sales, Lettings, Press, Advisory)
│   └── Interactive Location Guidance
│
├── /saved (Saved Properties / Shortlist)
│   ├── Local Storage Stored Properties
│   ├── Comparison Overview
│   └── Consolidated Viewing Request Trigger
│
└── /privacy & /terms (Legal & Regulatory Disclosures)
```

---

## 2. Detailed End-to-End User Flow Diagrams

### Flow 1: Buyer Discovery & Private Viewing Request
```
[User on Homepage]
       │
       ▼
[Selects "Buy" tab & filters by "Mayfair" + £2m+]
       │
       ▼
[Results displayed on /buy with active filter chips]
       │
       ▼
[Clicks property card: "The Grosvenor Penthouse"]
       │
       ▼
[Views high-res photo gallery, floorplan, EPC rating, tenure]
       │
       ▼
[Clicks "Request a Private Viewing"]
       │
       ▼
[Selects preferred date & time window (e.g. Tomorrow Afternoon)]
       │
       ▼
[Enters Name, Email, Phone, Note]
       │
       ▼
[Submits form -> Backend validates & records inquiry]
       │
       ▼
[Accurate Success Feedback: "Viewing Request Received. Associate will confirm within 2 hours."]
```

### Flow 2: Tenant Rental Journey
```
[User navigates to /rent]
       │
       ▼
[Filters: 2+ Bedrooms, Max £6,000 pcm, Furnished]
       │
       ▼
[Views rental cards showing £ pcm and £ pw equivalents]
       │
       ▼
[Opens Property Detail -> checks availability date ("Available Immediately")]
       │
       ▼
[Submits Lettings Inquiry or saves to Shortlist]
```

### Flow 3: Property Owner Seeking Representation (Sell with Us)
```
[Property owner arrives at /sell]
       │
       ▼
[Reviews valuation process & marketing reach]
       │
       ▼
[Fills out Private Representation Form: Address, Property Type, Approx Value, Contact info]
       │
       ▼
[Strict Guardrail: Form routes to Agency Sales Director, DOES NOT publish public listing]
       │
       ▼
[API routes data -> Confirms receipt or falls back to structured mailto link]
```
