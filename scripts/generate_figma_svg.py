import os
import shutil

def generate_figma_svg():
    width = 1600
    height = 2050

    svg_content = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" width="{width}" height="{height}">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&amp;family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&amp;family=Space+Mono:wght@400;700&amp;display=swap');
      .font-serif {{ font-family: 'Playfair Display', Georgia, serif; }}
      .font-sans {{ font-family: 'Montserrat', -apple-system, sans-serif; }}
      .font-mono {{ font-family: 'Space Mono', monospace; }}
    </style>
  </defs>

  <!-- Canvas Background -->
  <rect width="{width}" height="{height}" fill="#FBFBF9" />

  <!-- Grid Guide Background (Subtle Architectural Lines) -->
  <line x1="80" y1="0" x2="80" y2="{height}" stroke="#E6E3DC" stroke-width="0.5" stroke-dasharray="4 4" />
  <line x1="1520" y1="0" x2="1520" y2="{height}" stroke="#E6E3DC" stroke-width="0.5" stroke-dasharray="4 4" />

  <!-- HEADER -->
  <g transform="translate(80, 80)">
    <!-- Brand Tag -->
    <rect x="0" y="0" width="130" height="24" rx="2" fill="#F4EDE2" />
    <text x="12" y="16" class="font-sans" font-size="10" font-weight="600" fill="#78542E" letter-spacing="0.14em">AURA REAL ESTATE</text>
    
    <!-- Title -->
    <text x="0" y="70" class="font-serif" font-size="44" font-weight="400" fill="#121312" letter-spacing="-0.025em">Design System &amp; Brand Tokens</text>
    <text x="0" y="102" class="font-sans" font-size="15" fill="#4A4C48" letter-spacing="0">Official architectural color palette, typography hierarchy, and UI component specifications for Figma.</text>
    
    <!-- Hairline Divider -->
    <line x1="0" y1="130" x2="1440" y2="130" stroke="#78542E" stroke-width="1.5" />
  </g>

  <!-- SECTION 1: COLOR PALETTE -->
  <g transform="translate(80, 260)">
    <text x="0" y="0" class="font-sans" font-size="12" font-weight="700" fill="#78542E" letter-spacing="0.14em">01 / ARCHITECTURAL COLOR SYSTEM</text>
    <text x="0" y="28" class="font-serif" font-size="28" fill="#121312">Canvas Surfaces &amp; Base Tokens</text>

    <!-- Row 1: Surfaces -->
    <!-- Swatch 1: Warm Alabaster -->
    <g transform="translate(0, 50)">
      <rect width="268" height="130" rx="2" fill="#FBFBF9" stroke="#E6E3DC" stroke-width="1" />
      <rect x="0" y="0" width="268" height="60" fill="#FBFBF9" />
      <text x="16" y="85" class="font-sans" font-size="14" font-weight="600" fill="#121312">Warm Alabaster</text>
      <text x="16" y="105" class="font-mono" font-size="11" fill="#4A4C48">#FBFBF9 • Canvas</text>
      <text x="16" y="120" class="font-sans" font-size="9" fill="#63655E">Primary Canvas Base</text>
    </g>

    <!-- Swatch 2: Ivory Sand -->
    <g transform="translate(293, 50)">
      <rect width="268" height="130" rx="2" fill="#FFFFFF" stroke="#E6E3DC" stroke-width="1" />
      <rect x="0" y="0" width="268" height="60" fill="#F3F1EC" />
      <text x="16" y="85" class="font-sans" font-size="14" font-weight="600" fill="#121312">Ivory Sand</text>
      <text x="16" y="105" class="font-mono" font-size="11" fill="#4A4C48">#F3F1EC • Secondary</text>
      <text x="16" y="120" class="font-sans" font-size="9" fill="#63655E">Filter Bars &amp; Consoles</text>
    </g>

    <!-- Swatch 3: Pure White -->
    <g transform="translate(586, 50)">
      <rect width="268" height="130" rx="2" fill="#FFFFFF" stroke="#E6E3DC" stroke-width="1" />
      <rect x="0" y="0" width="268" height="60" fill="#FFFFFF" stroke="#E6E3DC" stroke-width="0.5" />
      <text x="16" y="85" class="font-sans" font-size="14" font-weight="600" fill="#121312">Pure White</text>
      <text x="16" y="105" class="font-mono" font-size="11" fill="#4A4C48">#FFFFFF • Card</text>
      <text x="16" y="120" class="font-sans" font-size="9" fill="#63655E">Elevated Property Cards</text>
    </g>

    <!-- Swatch 4: Obsidian Dark -->
    <g transform="translate(879, 50)">
      <rect width="268" height="130" rx="2" fill="#FFFFFF" stroke="#E6E3DC" stroke-width="1" />
      <rect x="0" y="0" width="268" height="60" fill="#121312" />
      <text x="16" y="85" class="font-sans" font-size="14" font-weight="600" fill="#121312">Obsidian Dark</text>
      <text x="16" y="105" class="font-mono" font-size="11" fill="#4A4C48">#121312 • Dark Primary</text>
      <text x="16" y="120" class="font-sans" font-size="9" fill="#63655E">Footer, Hero &amp; Buttons</text>
    </g>

    <!-- Swatch 5: Obsidian Hover -->
    <g transform="translate(1172, 50)">
      <rect width="268" height="130" rx="2" fill="#FFFFFF" stroke="#E6E3DC" stroke-width="1" />
      <rect x="0" y="0" width="268" height="60" fill="#282A27" />
      <text x="16" y="85" class="font-sans" font-size="14" font-weight="600" fill="#121312">Obsidian Hover</text>
      <text x="16" y="105" class="font-mono" font-size="11" fill="#4A4C48">#282A27 • Dark Hover</text>
      <text x="16" y="120" class="font-sans" font-size="9" fill="#63655E">Interactive Pressed State</text>
    </g>

    <!-- Row 2: Inks & Hairlines & Bronze -->
    <text x="0" y="225" class="font-serif" font-size="28" fill="#121312">Inks, Hairlines &amp; Bronze Accents</text>

    <!-- Swatch 6: Graphite Body -->
    <g transform="translate(0, 245)">
      <rect width="268" height="130" rx="2" fill="#FFFFFF" stroke="#E6E3DC" stroke-width="1" />
      <rect x="0" y="0" width="268" height="60" fill="#4A4C48" />
      <text x="16" y="85" class="font-sans" font-size="14" font-weight="600" fill="#121312">Graphite Ink</text>
      <text x="16" y="105" class="font-mono" font-size="11" fill="#4A4C48">#4A4C48 • 8.38:1 AAA</text>
      <text x="16" y="120" class="font-sans" font-size="9" fill="#63655E">Editorial Body Copy</text>
    </g>

    <!-- Swatch 7: Mineral Muted -->
    <g transform="translate(293, 245)">
      <rect width="268" height="130" rx="2" fill="#FFFFFF" stroke="#E6E3DC" stroke-width="1" />
      <rect x="0" y="0" width="268" height="60" fill="#63655E" />
      <text x="16" y="85" class="font-sans" font-size="14" font-weight="600" fill="#121312">Mineral Muted</text>
      <text x="16" y="105" class="font-mono" font-size="11" fill="#4A4C48">#63655E • 5.70:1 AA</text>
      <text x="16" y="120" class="font-sans" font-size="9" fill="#63655E">Metadata &amp; Captions</text>
    </g>

    <!-- Swatch 8: Heritage Bronze -->
    <g transform="translate(586, 245)">
      <rect width="268" height="130" rx="2" fill="#FFFFFF" stroke="#E6E3DC" stroke-width="1" />
      <rect x="0" y="0" width="268" height="60" fill="#78542E" />
      <text x="16" y="85" class="font-sans" font-size="14" font-weight="600" fill="#121312">Heritage Bronze</text>
      <text x="16" y="105" class="font-mono" font-size="11" fill="#4A4C48">#78542E • 6.53:1 AA</text>
      <text x="16" y="120" class="font-sans" font-size="9" fill="#63655E">Eyebrow Tags &amp; Accents</text>
    </g>

    <!-- Swatch 9: Bronze Light / Champagne -->
    <g transform="translate(879, 245)">
      <rect width="268" height="130" rx="2" fill="#FFFFFF" stroke="#E6E3DC" stroke-width="1" />
      <rect x="0" y="0" width="268" height="60" fill="#F4EDE2" />
      <text x="16" y="85" class="font-sans" font-size="14" font-weight="600" fill="#121312">Champagne Light</text>
      <text x="16" y="105" class="font-mono" font-size="11" fill="#4A4C48">#F4EDE2 • Badge Tint</text>
      <text x="16" y="120" class="font-sans" font-size="9" fill="#63655E">Exclusive Badge Background</text>
    </g>

    <!-- Swatch 10: Hairline Interactive -->
    <g transform="translate(1172, 245)">
      <rect width="268" height="130" rx="2" fill="#FFFFFF" stroke="#E6E3DC" stroke-width="1" />
      <rect x="0" y="0" width="268" height="60" fill="#8E8A80" />
      <text x="16" y="85" class="font-sans" font-size="14" font-weight="600" fill="#121312">Interactive Border</text>
      <text x="16" y="105" class="font-mono" font-size="11" fill="#4A4C48">#8E8A80 • 3.32:1 AA UI</text>
      <text x="16" y="120" class="font-sans" font-size="9" fill="#63655E">Form Input Outlines</text>
    </g>
  </g>

  <!-- SECTION 2: STATUS BADGES -->
  <g transform="translate(80, 710)">
    <text x="0" y="0" class="font-sans" font-size="12" font-weight="700" fill="#78542E" letter-spacing="0.14em">02 / DOMAIN FINANCIAL STATUS BADGES</text>
    
    <!-- Badge 1: For Sale -->
    <g transform="translate(0, 24)">
      <rect width="200" height="42" rx="2" fill="#EEF2EE" stroke="#23362A" stroke-width="0.5" />
      <text x="24" y="26" class="font-sans" font-size="12" font-weight="700" fill="#23362A" letter-spacing="0.12em">FOR SALE</text>
      <text x="215" y="26" class="font-mono" font-size="10" fill="#63655E">#EEF2EE bg / #23362A text (12.1:1 AAA)</text>
    </g>

    <!-- Badge 2: To Let -->
    <g transform="translate(500, 24)">
      <rect width="200" height="42" rx="2" fill="#EAF0F6" stroke="#192C3D" stroke-width="0.5" />
      <text x="24" y="26" class="font-sans" font-size="12" font-weight="700" fill="#192C3D" letter-spacing="0.12em">TO LET / RENT</text>
      <text x="215" y="26" class="font-mono" font-size="10" fill="#63655E">#EAF0F6 bg / #192C3D text (12.8:1 AAA)</text>
    </g>

    <!-- Badge 3: Pending -->
    <g transform="translate(1000, 24)">
      <rect width="200" height="42" rx="2" fill="#F7EFE6" stroke="#5A3B18" stroke-width="0.5" />
      <text x="24" y="26" class="font-sans" font-size="12" font-weight="700" fill="#5A3B18" letter-spacing="0.12em">PENDING CONFIRM</text>
      <text x="215" y="26" class="font-mono" font-size="10" fill="#63655E">#F7EFE6 bg / #5A3B18 text (9.4:1 AAA)</text>
    </g>
  </g>

  <!-- SECTION 3: TRIPARTITE TYPOGRAPHY SYSTEM -->
  <g transform="translate(80, 830)">
    <line x1="0" y1="0" x2="1440" y2="0" stroke="#E6E3DC" stroke-width="1" />
    <text x="0" y="40" class="font-sans" font-size="12" font-weight="700" fill="#78542E" letter-spacing="0.14em">03 / TRIPARTITE TYPOGRAPHIC HIERARCHY</text>

    <!-- Serif Column -->
    <g transform="translate(0, 70)">
      <rect width="450" height="380" rx="2" fill="#FFFFFF" stroke="#E6E3DC" stroke-width="1" />
      <text x="24" y="40" class="font-sans" font-size="11" font-weight="700" fill="#78542E" letter-spacing="0.14em">EDITORIAL SERIF</text>
      <text x="24" y="70" class="font-serif" font-size="28" font-weight="400" fill="#121312">Playfair Display</text>
      <text x="24" y="92" class="font-sans" font-size="11" fill="#63655E">High-contrast serifs, classical proportions</text>
      <line x1="24" y1="110" x2="426" y2="110" stroke="#E6E3DC" stroke-width="0.5" />

      <!-- Specimen -->
      <text x="24" y="150" class="font-serif" font-size="34" fill="#121312">Hero H1 Headline</text>
      <text x="24" y="170" class="font-mono" font-size="10" fill="#63655E">clamp(34px, 1.35rem + 2.95vw, 64px) • -0.035em</text>

      <text x="24" y="215" class="font-serif" font-size="26" fill="#121312">Section H2 Title</text>
      <text x="24" y="235" class="font-mono" font-size="10" fill="#63655E">clamp(26px, 1.25rem + 1.4vw, 42px) • -0.02em</text>

      <text x="24" y="280" class="font-serif" font-size="20" fill="#121312">Section H3 Subtitle</text>
      <text x="24" y="300" class="font-mono" font-size="10" fill="#63655E">clamp(20px, 1.05rem + 0.75vw, 28px) • -0.015em</text>

      <text x="24" y="340" class="font-serif" font-size="18" font-style="italic" fill="#78542E">"Curators of Architectural Pedigree &amp; Provenance"</text>
    </g>

    <!-- Sans Column -->
    <g transform="translate(495, 70)">
      <rect width="450" height="380" rx="2" fill="#FFFFFF" stroke="#E6E3DC" stroke-width="1" />
      <text x="24" y="40" class="font-sans" font-size="11" font-weight="700" fill="#78542E" letter-spacing="0.14em">FUNCTIONAL SANS</text>
      <text x="24" y="70" class="font-sans" font-size="28" font-weight="600" fill="#121312">Montserrat</text>
      <text x="24" y="92" class="font-sans" font-size="11" fill="#63655E">Geometric clarity, maximum readability</text>
      <line x1="24" y1="110" x2="426" y2="110" stroke="#E6E3DC" stroke-width="0.5" />

      <!-- Specimen -->
      <text x="24" y="145" class="font-sans" font-size="16" font-weight="600" fill="#121312">Lead Statement (18px)</text>
      <text x="24" y="170" class="font-sans" font-size="14" fill="#4A4C48">Standard readable body copy (16px) with 1.60 leading and 65ch measure constraints.</text>

      <text x="24" y="215" class="font-sans" font-size="12" font-weight="600" fill="#121312" letter-spacing="0.10em">BUTTON ACTION LABEL (13PX)</text>
      <text x="24" y="235" class="font-mono" font-size="10" fill="#63655E">text-btn • letter-spacing: +0.10em</text>

      <text x="24" y="275" class="font-sans" font-size="11" font-weight="600" fill="#78542E" letter-spacing="0.14em">EYEBROW SUBHEADING (12PX)</text>
      <text x="24" y="295" class="font-mono" font-size="10" fill="#63655E">text-eyebrow-label • letter-spacing: +0.14em</text>

      <text x="24" y="335" class="font-sans" font-size="13" font-weight="500" fill="#121312">Navigation Link Item • text-nav-link (13px)</text>
    </g>

    <!-- Mono Column -->
    <g transform="translate(990, 70)">
      <rect width="450" height="380" rx="2" fill="#FFFFFF" stroke="#E6E3DC" stroke-width="1" />
      <text x="24" y="40" class="font-sans" font-size="11" font-weight="700" fill="#78542E" letter-spacing="0.14em">TECHNICAL MONOSPACE</text>
      <text x="24" y="70" class="font-mono" font-size="28" font-weight="400" fill="#121312">Space Mono</text>
      <text x="24" y="92" class="font-sans" font-size="11" fill="#63655E">Fixed-pitch precision for metrics and indexing</text>
      <line x1="24" y1="110" x2="426" y2="110" stroke="#E6E3DC" stroke-width="0.5" />

      <!-- Specimen -->
      <text x="24" y="150" class="font-mono" font-size="14" font-weight="700" fill="#121312">[REF: AURA-MAY-01]</text>
      <text x="24" y="170" class="font-mono" font-size="10" fill="#63655E">Property Unique Catalog Identifier</text>

      <text x="24" y="215" class="font-mono" font-size="13" fill="#121312">IMAGE: 01 / 05</text>
      <text x="24" y="235" class="font-mono" font-size="10" fill="#63655E">Carousel Index Counter</text>

      <text x="24" y="280" class="font-mono" font-size="16" font-weight="700" fill="#78542E">£14,500,000</text>
      <text x="24" y="300" class="font-mono" font-size="10" fill="#63655E">Property Price Tag (17px - 24px clamp)</text>

      <text x="24" y="340" class="font-mono" font-size="12" fill="#4A4C48">125+ YRS • £50B+ TRANSACTED</text>
    </g>
  </g>

  <!-- SECTION 4: INTERACTIVE UI ATOMS -->
  <g transform="translate(80, 1320)">
    <line x1="0" y1="0" x2="1440" y2="0" stroke="#E6E3DC" stroke-width="1" />
    <text x="0" y="40" class="font-sans" font-size="12" font-weight="700" fill="#78542E" letter-spacing="0.14em">04 / UI COMPONENT ATOMS &amp; INTERACTIVE CONTROLS</text>

    <!-- Primary Button -->
    <g transform="translate(0, 70)">
      <rect width="180" height="46" rx="2" fill="#121312" />
      <text x="90" y="28" class="font-sans" font-size="12" font-weight="600" fill="#FBFBF9" letter-spacing="0.10em" text-anchor="middle">SEARCH PROPERTIES</text>
      <text x="0" y="65" class="font-mono" font-size="9" fill="#63655E">Primary CTA (bg-obsidian, rounded-xs)</text>
    </g>

    <!-- Secondary Bronze Button -->
    <g transform="translate(210, 70)">
      <rect width="180" height="46" rx="2" fill="#78542E" />
      <text x="90" y="28" class="font-sans" font-size="12" font-weight="600" fill="#FBFBF9" letter-spacing="0.10em" text-anchor="middle">BOOK VALUATION</text>
      <text x="0" y="65" class="font-mono" font-size="9" fill="#63655E">Brand Action (bg-bronze, rounded-xs)</text>
    </g>

    <!-- Outlined Button -->
    <g transform="translate(420, 70)">
      <rect width="180" height="46" rx="2" fill="transparent" stroke="#121312" stroke-width="1" />
      <text x="90" y="28" class="font-sans" font-size="12" font-weight="600" fill="#121312" letter-spacing="0.10em" text-anchor="middle">VIEW DETAILS</text>
      <text x="0" y="65" class="font-mono" font-size="9" fill="#63655E">Outlined Action (border-obsidian)</text>
    </g>

    <!-- Form Input Box -->
    <g transform="translate(630, 70)">
      <rect width="360" height="46" rx="2" fill="#FFFFFF" stroke="#8E8A80" stroke-width="1" />
      <text x="16" y="28" class="font-sans" font-size="14" fill="#121312">Mayfair, Belgravia, SoHo...</text>
      <text x="0" y="65" class="font-mono" font-size="9" fill="#63655E">Form Input (border-interactive, 16px text base)</text>
    </g>

    <!-- Segmented Tab Switcher -->
    <g transform="translate(1020, 70)">
      <rect width="420" height="46" rx="2" fill="#F3F1EC" />
      <rect x="4" y="4" width="204" height="38" rx="2" fill="#FFFFFF" stroke="#D5D1C7" stroke-width="0.5" />
      <text x="106" y="27" class="font-sans" font-size="11" font-weight="600" fill="#121312" letter-spacing="0.10em" text-anchor="middle">BUY / FOR SALE</text>
      <text x="314" y="27" class="font-sans" font-size="11" font-weight="500" fill="#63655E" letter-spacing="0.10em" text-anchor="middle">RENT / TO LET</text>
      <text x="0" y="65" class="font-mono" font-size="9" fill="#63655E">Segmented Search Console Switcher</text>
    </g>
  </g>

  <!-- SECTION 5: ELEVATED PROPERTY CARD MOCKUP -->
  <g transform="translate(80, 1530)">
    <line x1="0" y1="0" x2="1440" y2="0" stroke="#E6E3DC" stroke-width="1" />
    <text x="0" y="40" class="font-sans" font-size="12" font-weight="700" fill="#78542E" letter-spacing="0.14em">05 / PROPERTY CARD COMPONENT ARCHITECTURE</text>

    <!-- Sample Card Preview -->
    <g transform="translate(0, 70)">
      <rect width="450" height="340" rx="2" fill="#FFFFFF" stroke="#E6E3DC" stroke-width="1" />
      <!-- Image Placeholder with warm gradient -->
      <rect width="450" height="210" rx="2" fill="#F3F1EC" />
      <text x="225" y="110" class="font-sans" font-size="12" fill="#8E8A80" text-anchor="middle">Architectural Photography (16:10 Ratio)</text>
      
      <!-- Badges on Image -->
      <rect x="16" y="16" width="85" height="24" rx="2" fill="#EEF2EE" />
      <text x="26" y="32" class="font-sans" font-size="10" font-weight="700" fill="#23362A" letter-spacing="0.10em">FOR SALE</text>

      <rect x="355" y="16" width="78" height="24" rx="2" fill="rgba(18,19,18,0.7)" />
      <text x="394" y="32" class="font-mono" font-size="10" fill="#FFFFFF" text-anchor="middle">01 / 05</text>

      <!-- Content -->
      <text x="20" y="245" class="font-mono" font-size="10" font-weight="700" fill="#78542E">MAYFAIR • LONDON W1K</text>
      <text x="20" y="275" class="font-serif" font-size="20" font-weight="400" fill="#121312">The Grosvenor Square Residence</text>
      
      <text x="20" y="312" class="font-mono" font-size="18" font-weight="700" fill="#121312">£14,500,000</text>
      <text x="430" y="312" class="font-sans" font-size="11" fill="#63655E" text-anchor="end">4 BEDS • 5 BATHS • 4,850 SQ FT</text>
    </g>

    <!-- Card Description Spec -->
    <g transform="translate(500, 70)">
      <text x="0" y="25" class="font-serif" font-size="22" fill="#121312">Component Invariants &amp; Rules</text>
      <text x="0" y="60" class="font-sans" font-size="13" fill="#4A4C48">• Corner Radius: 2px sharp architectural edges (rounded-xs).</text>
      <text x="0" y="90" class="font-sans" font-size="13" fill="#4A4C48">• Elevation: Ambient soft shadow 0 2px 12px -2px rgba(18,19,18,0.04).</text>
      <text x="0" y="120" class="font-sans" font-size="13" fill="#4A4C48">• Border: 1px subtle hairline stroke #E6E3DC.</text>
      <text x="0" y="150" class="font-sans" font-size="13" fill="#4A4C48">• Carousel Arrows: Isolated click handlers, never trigger card detail navigation.</text>
      <text x="0" y="180" class="font-sans" font-size="13" fill="#4A4C48">• Favorite Heart: Direct toggle with OTP authentication trigger for guests.</text>
      <text x="0" y="220" class="font-mono" font-size="11" fill="#78542E">Figma Ready: Drag this SVG directly into Figma to edit every element as native layers.</text>
    </g>
  </g>

  <!-- FOOTER -->
  <g transform="translate(80, 1980)">
    <line x1="0" y1="0" x2="1440" y2="0" stroke="#E6E3DC" stroke-width="1" />
    <text x="0" y="30" class="font-sans" font-size="11" fill="#63655E">AURA REAL ESTATE © 2026 • ALL RIGHTS RESERVED • CONFIDENTIAL DESIGN SYSTEM SPECIFICATION</text>
    <text x="1440" y="30" class="font-mono" font-size="11" fill="#63655E" text-anchor="end">TOKENS STUDIO &amp; FIGMA NATIVE VARIABLES READY</text>
  </g>
</svg>"""

    svg_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public", "AURA_Design_System_Canvas.svg")
    svg_path = os.path.abspath(svg_path)
    with open(svg_path, "w", encoding="utf-8") as f:
        f.write(svg_content)
    print(f"Generated Figma Canvas SVG at: {svg_path}")

    # Copy to artifact dir
    artifact_dir = r"C:\Users\Aniz Wiz Gouki\.gemini\antigravity\brain\0cae285a-9757-4d80-86f0-aa88bb10a362"
    if os.path.exists(artifact_dir):
        dest_artifact = os.path.join(artifact_dir, "AURA_Design_System_Canvas.svg")
        shutil.copyfile(svg_path, dest_artifact)
        print(f"Copied Figma Canvas SVG to artifact directory: {dest_artifact}")

if __name__ == "__main__":
    generate_figma_svg()
