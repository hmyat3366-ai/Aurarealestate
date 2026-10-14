# Product and UX Specification

## 1. Product Positioning & Business Model
**Vane & Sterling** is an independent, premium real estate agency operating in London and prime European metropolitan markets.
The platform functions strictly as an **agency-owned catalog** where every property is exclusively managed, vetted, and represented by the agency.

### Core Business Pillars
1. **Buy (Sales):** High-net-worth individuals, investors, and homeowners discovering prime properties.
2. **Rent (Lettings):** Tenants seeking premium executive residences, townhouses, and penthouses.
3. **Sell with Us (Agency Advisory):** Private sellers requesting bespoke valuation and representation. No public listing upload exists.

---

## 2. Key User Personas & Scenarios

### Persona 1: Eleanor (The International Buyer)
- **Goal:** Discovers a 3-bedroom penthouse in Mayfair or Marylebone.
- **Pain Points:** Too many noisy portal ads; misleading price tags; slow response times.
- **Journey:** Lands on homepage → Selects "Buy" → Enters "Mayfair" or filters by "Penthouse" → Sorts by price → Browses high-resolution gallery → Reviews floor plan, tenure, EPC rating → Submits private viewing request with preferred time window.

### Persona 2: Marcus (The Relocating Executive Tenant)
- **Goal:** Finds a fully-furnished townhouse with immediate or next-month availability.
- **Pain Points:** Mixing rental and sale prices; outdated availability statuses.
- **Journey:** Lands on "Rent" page → Filters by Furnished status and max £8,000 pcm → Inspects availability date → Submits tenancy inquiry directly with move-in timeline.

### Persona 3: Diana (The Property Owner / Seller)
- **Goal:** Requests private valuation and representation without self-publishing.
- **Pain Points:** Complex forms demanding login credentials; fears of unauthorized public posting.
- **Journey:** Visits "Sell with Us" → Reviews agency track record, marketing reach, and advisory process → Submits private representation form → Receives honest confirmation with prompt personal outreach from the senior partner.

---

## 3. Core UX Mechanics & Interactions

### 3.1 Search & Discovery Hierarchy
- **Primary Mode Switch:** Distinct Buy / Rent toggle dynamically updates:
  - Price filter ranges:
    - *Buy:* £500,000 to £15,000,000+
    - *Rent:* £1,500/month to £25,000/month
  - Pricing badges: Total purchase price vs. £ PCM / £ PW.
  - Query parameters: `?purpose=sale` vs `?purpose=rent`.
- **Filters:**
  - Location (City / Neighborhood: Mayfair, Kensington, Marylebone, Chelsea, Richmond, Belgravia)
  - Property Type (Apartment, Penthouse, Townhouse, Villa, Mews House)
  - Bedrooms (Any, 1+, 2+, 3+, 4+, 5+)
  - Bathrooms (Any, 1+, 2+, 3+)
  - Min / Max Price
  - Sort (Price: Low to High, Price: High to Low, Most Recent, Bedrooms)
- **Active Filter Chips:** Visible chips displaying each active criterion with single-click dismissal and a global "Reset All" button.

### 3.2 Property Detail Architecture
- **Hero Image Mosaic / Gallery:** High-impact editorial multi-photo layout with full-screen lightbox exploration.
- **Critical Metadata Bar:** Price, Bedrooms, Bathrooms, Floor Area (sq ft & sq m), Reference Code, and Availability Badge.
- **Sticky Inquiry / Viewing Panel:** Stays accessible as user scrolls through description, architectural features, EPC rating, and floor plans.
- **Related Properties:** Contextual recommendations matching same purpose and neighborhood.

### 3.3 Viewing Request vs. General Inquiry
- **Viewing Request:**
  - Date picker (future dates only)
  - Preferred time slot (Morning 9:00-12:00, Afternoon 12:00-16:00, Evening 16:00-19:00)
  - Full Name, Email, Phone Number, Optional Notes
  - Status feedback: Explicitly labeled as *"Viewing Request Received — Our senior associate will contact you to confirm the appointment within 2 business hours."* (No misleading instant automated calendar sync).
- **General Property Inquiry:** Fast-action question form for specifications, leases, or offer submission.

### 3.4 Client-Side Saved Properties
- Instant heart toggle on all property cards and detail pages.
- LocalStorage persistence with top-navigation indicator badge counter.
- Quick drawer / modal view showing saved favorites with instant removal or direct inquiry.

---

## 4. Edge Case Specifications

1. **Zero Matching Results:**
   - Display a thoughtful, empathetic message.
   - Show currently applied filters with easy 1-click removal.
   - Provide recommended alternative properties.
   - Offer a quick alert inquiry form ("Notify me when matching properties arrive").
2. **Unavailable or Under-Offer Property:**
   - If a property is "Under Offer" or "Sold Subject to Contract", the badge clearly indicates status in subdued monochrome.
   - Inquiry form shifts copy to: *"Register interest in this property should negotiations lapse or request similar properties."*
3. **Form Validation & Network Failure:**
   - Real-time client-side validation on email format, phone format, and required fields.
   - Honeypot anti-spam protection (hidden input that discards automated bot posts).
   - If server API delivery fails or email gateway is unconfigured, display a friendly notice and an automated pre-formatted `mailto:` link so the user never loses their inquiry data.
