# Design System & Component Inventory

## 1. Visual Direction & Aesthetic Philosophy
**Vane & Sterling** embodies restrained architectural luxury.
Rather than generic glossy commercial gradients, excessive glassmorphism, or rounded neon buttons, the aesthetic is inspired by classical British and continental architectural journals:
- Editorial whitespace with generous margins (8px base increment).
- Elegant high-contrast serif typography for titles paired with crisp sans-serif for numbers and metadata.
- Deep obsidian and charcoal ink tones over warm mineral stone surfaces.
- A distinctive single heritage bronze accent (`#A87C4F`) used sparingly for interactive focus and prestige status.

---

## 2. Design Tokens

### 2.1 Color Palette
- **Canvas / Background:**
  - `surface-canvas`: `#FFFFFF` (Primary clean paper)
  - `surface-warm`: `#FBFBF9` (Subtle warm limestone tone for alternate sections)
  - `surface-muted`: `#F5F5F3` (Soft structural grey for badges and card backgrounds)
  - `surface-dark`: `#111413` (Deep graphite obsidian for inverted editorial footers and accents)
- **Text & Content:**
  - `agency-950`: `#0C0E0D` (Near-black obsidian for prominent headlines)
  - `agency-900`: `#141715` (Deep charcoal for primary body and titles)
  - `agency-600`: `#4B534D` (Mid-tone slate for supporting descriptions)
  - `agency-500`: `#69726B` (Muted secondary for metadata, dates, and labels)
  - `agency-400`: `#9CA39E` (Subtle caption text and placeholders)
- **Borders & Dividers:**
  - `border-subtle`: `#EAEAE6` (Hairline editorial rules)
  - `border-strong`: `#D2D2CC` (Input borders, card dividers)
  - `border-dark`: `#262D2A` (Inverted section borders)
- **Signature Accent:**
  - `accent-500`: `#A87C4F` (Heritage Bronze — primary action buttons and active indicators)
  - `accent-600`: `#8C633B` (Hover state for bronze buttons)
  - `accent-100`: `#F4EDE2` (Warm champagne tint for highlighted tags)

### 2.2 Typography Scale
- **Headings (Editorial Serif - `font-serif`):**
  - Hero Display: `text-4xl md:text-6xl lg:text-7xl font-serif tracking-tight leading-[1.08]`
  - Section Title: `text-2xl md:text-4xl font-serif tracking-tight leading-snug`
  - Property Title: `text-xl md:text-2xl font-serif tracking-tight`
- **Body & Data (Precise Sans - `font-sans`):**
  - Lead Paragraph: `text-lg text-agency-600 font-light leading-relaxed`
  - Standard Body: `text-sm md:text-base text-agency-700 leading-normal`
  - Property Price: `text-xl md:text-2xl font-semibold tracking-tight text-agency-950`
  - Meta Labels: `text-xs uppercase tracking-wider font-medium text-agency-500`

### 2.3 Grid & Responsive Breakpoints
- Base grid: 8px increments (`p-2`, `p-4`, `p-6`, `p-8`, `p-12`, `p-16`).
- Max content width: `1280px` (`max-w-content`) with `px-4 sm:px-6 lg:px-8`.
- Breakpoints:
  - Mobile Small: 360px – 390px (single column, full-width touch targets)
  - Tablet: 768px (2-column listings, stacked headers)
  - Desktop: 1280px (3-column listings, split detail view)
  - Large Desktop: 1440px (spacious editorial layout)

---

## 3. Reusable UI Component Inventory

1. **Navigation:**
   - `Header`: Clean sticky navigation bar with transparent-to-solid transition, logo, primary links (Buy, Rent, Locations, Sell with Us, About, Contact), Saved Shortlist indicator with live counter, and Mobile Drawer trigger.
   - `Footer`: Comprehensive editorial footer with agency licensing info, office addresses, legal disclosures, newsletter/inquiries, and direct page links.
2. **Search & Filters:**
   - `SearchBar`: Tabbed quick search (Buy / Rent) with location dropdown, property type, price selector, and search submit.
   - `PropertyFilterBar`: Comprehensive filter toolbar with price range inputs, bedroom counter buttons, property type picker, sort menu, active filter pills, and 1-click reset.
3. **Property Presentation:**
   - `PropertyCard`: Premium card with image aspect ratio 4:3 / 16:10, bookmark toggle button, price display (£ PCM vs £ outright), bedrooms/bathrooms/sqft badges, and availability pill.
   - `PropertyGallery`: Editorial multi-image grid on desktop with "View all X photos" button launching a full-screen accessible `LightboxGallery`.
   - `PropertySpecs`: Detailed specification grid presenting tenure, EPC band, council tax, floor area, and reference code.
4. **Inquiry & Conversion:**
   - `ViewingModal`: Dialog allowing visitors to select viewing date and time window with instant confirmation messaging.
   - `StickyInquiryPanel`: Desktop side card remaining in viewport during property inspection.
   - `SellInquiryForm`: Protected form for private sellers with location, property type, approximate value, and contact fields.
   - `SavedPropertiesDrawer`: Quick drawer listing bookmarked properties.
5. **Feedback & States:**
   - `EmptyState`: Elegant fallback when no search matches are found, offering active filter clearing and alert subscriptions.
   - `LoadingSkeleton`: Polished skeleton cards for seamless async loading.
   - `StatusBanner`: Clear notification banners for inquiry submissions and email fallbacks.
