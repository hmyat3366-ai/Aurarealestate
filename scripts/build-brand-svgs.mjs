import fs from 'fs';
import path from 'path';

const BRAND_DIR = path.resolve('public/brand');
if (!fs.existsSync(BRAND_DIR)) {
  fs.mkdirSync(BRAND_DIR, { recursive: true });
}

// 1. Architectural Monogram Symbol
// Pure vector geometry: Stylized Letter A + Vaulted Architectural Arch + 4-Point Diamond Sparkle
function createMonogramSvg({
  color = '#9E8260',
  secondaryColor = null,
  size = 100,
  roundedSquare = false,
  bgColor = null
}) {
  const strokeColor = color;
  const archColor = secondaryColor || color;
  const starColor = secondaryColor || color;

  const bgRect = roundedSquare
    ? `<rect width="100" height="100" rx="22" fill="${bgColor || '#121312'}"/>`
    : bgColor
    ? `<rect width="100" height="100" fill="${bgColor}"/>`
    : '';

  // Proportions carefully measured from brand reference:
  // Apex at (50, 15)
  // Left foot curves to (15, 82)
  // Right foot curves to (85, 82)
  // Arch sweeps from (29, 61) up to (50, 42), through right leg at (71, 56) down to (88, 70)
  // Star at (50, 68)
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="${size}" height="${size}" fill="none">
  ${bgRect}
  <!-- Architectural A Monogram -->
  <g id="aura-monogram">
    <!-- Left Leg: Delicate architectural hairline with flared pedestal foot -->
    <path d="M 50 15.5 L 22.8 74 C 20.2 78.8 16.8 81.2 13 82 C 12.2 82.2 12.2 81 13 80.4 C 16.2 79 19.2 76.5 21.6 72.4 L 48.8 15.5 Z" fill="${strokeColor}"/>

    <!-- Right Leg: Monumental high-contrast pillar with flared pedestal foot -->
    <path d="M 48.5 15.5 L 51.5 15.5 L 81 74 C 83.2 78 86.2 80.5 89 81.6 C 89.8 82 89.5 83 88.5 82.8 C 84.5 81.8 81 78.8 78 73 L 53 18.5 Z" fill="${strokeColor}"/>

    <!-- Vaulted Architectural Arch: Sweeping celestial curve through the structural portal -->
    <path d="M 28.5 61.5 C 33 49 42 41.5 50 41.5 C 58.5 41.5 68 49 74.5 59.5 C 79 66.5 84 71 88 71.5 C 88.6 71.5 88.8 70.8 88.2 70.3 C 83.5 67 78.5 61 74 54.5 C 67.5 45 58 38.5 50 38.5 C 41.5 38.5 32.5 46.5 27.5 59.5 C 27.2 60.5 28 62 28.5 61.5 Z" fill="${archColor}"/>

    <!-- Central 4-Point Diamond Star: Architectural focal nexus -->
    <path d="M 50 59.5 C 50.2 64.5 51.5 66.2 56.5 66.5 C 51.5 66.8 50.2 68.5 50 73.5 C 49.8 68.5 48.5 66.8 43.5 66.5 C 48.5 66.2 49.8 64.5 50 59.5 Z" fill="${starColor}"/>
  </g>
</svg>`;
}

// 2. Primary Logo: Monogram + Wordmark + Descriptor (Stacked)
function createPrimaryLogoSvg({ theme = 'light' }) {
  const isDark = theme === 'dark';
  const monogramColor = isDark ? '#C5A880' : '#9E8260';
  const wordmarkColor = isDark ? '#F7F5F0' : '#121312';
  const descriptorColor = isDark ? '#C5A880' : '#9E8260';

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" width="320" height="240" fill="none">
  <!-- Monogram centered at top -->
  <g transform="translate(110, 10)">
    <path d="M 50 15.5 L 22.8 74 C 20.2 78.8 16.8 81.2 13 82 C 12.2 82.2 12.2 81 13 80.4 C 16.2 79 19.2 76.5 21.6 72.4 L 48.8 15.5 Z" fill="${monogramColor}"/>
    <path d="M 48.5 15.5 L 51.5 15.5 L 81 74 C 83.2 78 86.2 80.5 89 81.6 C 89.8 82 89.5 83 88.5 82.8 C 84.5 81.8 81 78.8 78 73 L 53 18.5 Z" fill="${monogramColor}"/>
    <path d="M 28.5 61.5 C 33 49 42 41.5 50 41.5 C 58.5 41.5 68 49 74.5 59.5 C 79 66.5 84 71 88 71.5 C 88.6 71.5 88.8 70.8 88.2 70.3 C 83.5 67 78.5 61 74 54.5 C 67.5 45 58 38.5 50 38.5 C 41.5 38.5 32.5 46.5 27.5 59.5 C 27.2 60.5 28 62 28.5 61.5 Z" fill="${monogramColor}"/>
    <path d="M 50 59.5 C 50.2 64.5 51.5 66.2 56.5 66.5 C 51.5 66.8 50.2 68.5 50 73.5 C 49.8 68.5 48.5 66.8 43.5 66.5 C 48.5 66.2 49.8 64.5 50 59.5 Z" fill="${monogramColor}"/>
  </g>

  <!-- AURA Wordmark: Vector high-contrast Didone with crossbar-less A's -->
  <g id="wordmark" fill="${wordmarkColor}" transform="translate(18, 125)">
    <!-- Letter 1: A (Crossbar-less, open architectural vault) -->
    <path d="M 46 12 L 18 78 C 15 84 10 86.5 5 87 C 4 87 4 85.5 5 85 C 9.5 83.5 13.5 80.5 16 75 L 44 12 Z"/>
    <path d="M 43.5 12 L 48 12 L 80 77 C 82.5 82 86.5 85 91 86 C 92 86.2 91.5 87.5 90.5 87.2 C 85.5 86 81.5 82.5 78 75 L 49.5 15 Z"/>

    <!-- Letter 2: U (High contrast serif) -->
    <path d="M 105 12 H 122 V 16 H 116 V 62 C 116 76 125 84 138 84 C 151 84 159 76 159 62 V 16 H 153 V 12 H 170 V 16 H 164 V 62 C 164 80 152 88 138 88 C 123 88 111 80 111 62 V 16 H 105 Z"/>

    <!-- Letter 3: R (Editorial serif with swooping leg) -->
    <path d="M 185 12 H 218 C 232 12 241 19 241 32 C 241 42 234 49 223 51 L 243 83 C 245.5 87 248.5 88 252 88 V 89 H 236 L 217 53 H 196 V 85 H 202 V 89 H 185 V 85 H 191 V 16 H 185 Z M 196 16 V 49 H 217 C 227 49 233 43 233 32 C 233 21 226 16 216 16 Z"/>

    <!-- Letter 4: A (Crossbar-less, open architectural vault) -->
    <g transform="translate(205, 0)">
      <path d="M 46 12 L 18 78 C 15 84 10 86.5 5 87 C 4 87 4 85.5 5 85 C 9.5 83.5 13.5 80.5 16 75 L 44 12 Z"/>
      <path d="M 43.5 12 L 48 12 L 80 77 C 82.5 82 86.5 85 91 86 C 92 86.2 91.5 87.5 90.5 87.2 C 85.5 86 81.5 82.5 78 75 L 49.5 15 Z"/>
    </g>
  </g>

  <!-- REAL ESTATE Descriptor: Widely tracked architectural uppercase -->
  <text x="160" y="232" font-family="'Montserrat', 'Plus Jakarta Sans', -apple-system, sans-serif" font-size="12" font-weight="400" letter-spacing="0.42em" fill="${descriptorColor}" text-anchor="middle">REAL ESTATE</text>
</svg>`;
}

// 3. Horizontal Logo: AURA | REAL ESTATE (As shown in Brand Reference header and logo variations)
function createHorizontalLogoSvg({ theme = 'light' }) {
  const isDark = theme === 'dark';
  const wordmarkColor = isDark ? '#F7F5F0' : '#121312';
  const dividerColor = isDark ? '#63655E' : '#C5A880';
  const descriptorColor = isDark ? '#C5A880' : '#9E8260';

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 340 50" width="340" height="50" fill="none">
  <!-- AURA Wordmark -->
  <g id="aura-wordmark" fill="${wordmarkColor}" transform="scale(0.44) translate(4, 8)">
    <!-- Letter 1: A -->
    <path d="M 46 12 L 18 78 C 15 84 10 86.5 5 87 C 4 87 4 85.5 5 85 C 9.5 83.5 13.5 80.5 16 75 L 44 12 Z"/>
    <path d="M 43.5 12 L 48 12 L 80 77 C 82.5 82 86.5 85 91 86 C 92 86.2 91.5 87.5 90.5 87.2 C 85.5 86 81.5 82.5 78 75 L 49.5 15 Z"/>

    <!-- Letter 2: U -->
    <path d="M 105 12 H 122 V 16 H 116 V 62 C 116 76 125 84 138 84 C 151 84 159 76 159 62 V 16 H 153 V 12 H 170 V 16 H 164 V 62 C 164 80 152 88 138 88 C 123 88 111 80 111 62 V 16 H 105 Z"/>

    <!-- Letter 3: R -->
    <path d="M 185 12 H 218 C 232 12 241 19 241 32 C 241 42 234 49 223 51 L 243 83 C 245.5 87 248.5 88 252 88 V 89 H 236 L 217 53 H 196 V 85 H 202 V 89 H 185 V 85 H 191 V 16 H 185 Z M 196 16 V 49 H 217 C 227 49 233 43 233 32 C 233 21 226 16 216 16 Z"/>

    <!-- Letter 4: A -->
    <g transform="translate(205, 0)">
      <path d="M 46 12 L 18 78 C 15 84 10 86.5 5 87 C 4 87 4 85.5 5 85 C 9.5 83.5 13.5 80.5 16 75 L 44 12 Z"/>
      <path d="M 43.5 12 L 48 12 L 80 77 C 82.5 82 86.5 85 91 86 C 92 86.2 91.5 87.5 90.5 87.2 C 85.5 86 81.5 82.5 78 75 L 49.5 15 Z"/>
    </g>
  </g>

  <!-- Architectural Vertical Divider Line -->
  <line x1="150" y1="12" x2="150" y2="38" stroke="${dividerColor}" stroke-width="1"/>

  <!-- REAL ESTATE Lettering -->
  <text x="165" y="28" font-family="'Montserrat', 'Plus Jakarta Sans', -apple-system, sans-serif" font-size="9" font-weight="400" letter-spacing="0.32em" fill="${descriptorColor}">REAL ESTATE</text>
</svg>`;
}

// 4. Stacked Wordmark Logo: AURA over REAL ESTATE (As shown under Logo Variations in Brand Reference)
function createStackedLogoSvg({ theme = 'light' }) {
  const isDark = theme === 'dark';
  const wordmarkColor = isDark ? '#F7F5F0' : '#121312';
  const descriptorColor = isDark ? '#C5A880' : '#9E8260';

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 80" width="200" height="80" fill="none">
  <!-- AURA Wordmark Centered -->
  <g id="aura-wordmark" fill="${wordmarkColor}" transform="scale(0.52) translate(40, 10)">
    <!-- Letter 1: A -->
    <path d="M 46 12 L 18 78 C 15 84 10 86.5 5 87 C 4 87 4 85.5 5 85 C 9.5 83.5 13.5 80.5 16 75 L 44 12 Z"/>
    <path d="M 43.5 12 L 48 12 L 80 77 C 82.5 82 86.5 85 91 86 C 92 86.2 91.5 87.5 90.5 87.2 C 85.5 86 81.5 82.5 78 75 L 49.5 15 Z"/>

    <!-- Letter 2: U -->
    <path d="M 105 12 H 122 V 16 H 116 V 62 C 116 76 125 84 138 84 C 151 84 159 76 159 62 V 16 H 153 V 12 H 170 V 16 H 164 V 62 C 164 80 152 88 138 88 C 123 88 111 80 111 62 V 16 H 105 Z"/>

    <!-- Letter 3: R -->
    <path d="M 185 12 H 218 C 232 12 241 19 241 32 C 241 42 234 49 223 51 L 243 83 C 245.5 87 248.5 88 252 88 V 89 H 236 L 217 53 H 196 V 85 H 202 V 89 H 185 V 85 H 191 V 16 H 185 Z M 196 16 V 49 H 217 C 227 49 233 43 233 32 C 233 21 226 16 216 16 Z"/>

    <!-- Letter 4: A -->
    <g transform="translate(205, 0)">
      <path d="M 46 12 L 18 78 C 15 84 10 86.5 5 87 C 4 87 4 85.5 5 85 C 9.5 83.5 13.5 80.5 16 75 L 44 12 Z"/>
      <path d="M 43.5 12 L 48 12 L 80 77 C 82.5 82 86.5 85 91 86 C 92 86.2 91.5 87.5 90.5 87.2 C 85.5 86 81.5 82.5 78 75 L 49.5 15 Z"/>
    </g>
  </g>

  <!-- REAL ESTATE Descriptor Centered -->
  <text x="100" y="70" font-family="'Montserrat', 'Plus Jakarta Sans', -apple-system, sans-serif" font-size="8.5" font-weight="400" letter-spacing="0.38em" fill="${descriptorColor}" text-anchor="middle">REAL ESTATE</text>
</svg>`;
}

// Write all assets to public/brand/
const assets = [
  { filename: 'aura-monogram-bronze.svg', content: createMonogramSvg({ color: '#9E8260' }) },
  { filename: 'aura-monogram-charcoal.svg', content: createMonogramSvg({ color: '#121312' }) },
  { filename: 'aura-monogram-white.svg', content: createMonogramSvg({ color: '#F7F5F0' }) },
  { filename: 'aura-monogram-champagne.svg', content: createMonogramSvg({ color: '#C5A880' }) },
  { filename: 'aura-favicon.svg', content: createMonogramSvg({ color: '#C5A880', roundedSquare: true, bgColor: '#1A1C1A' }) },
  { filename: 'aura-logo-primary-light.svg', content: createPrimaryLogoSvg({ theme: 'light' }) },
  { filename: 'aura-logo-primary-dark.svg', content: createPrimaryLogoSvg({ theme: 'dark' }) },
  { filename: 'aura-logo-horizontal-light.svg', content: createHorizontalLogoSvg({ theme: 'light' }) },
  { filename: 'aura-logo-horizontal-dark.svg', content: createHorizontalLogoSvg({ theme: 'dark' }) },
  { filename: 'aura-logo-stacked-light.svg', content: createStackedLogoSvg({ theme: 'light' }) },
  { filename: 'aura-logo-stacked-dark.svg', content: createStackedLogoSvg({ theme: 'dark' }) },
];

for (const asset of assets) {
  const filePath = path.join(BRAND_DIR, asset.filename);
  fs.writeFileSync(filePath, asset.content, 'utf8');
  console.log(`Generated: ${asset.filename}`);
}

// Also write favicon and icon files to public/ and src/app/
fs.writeFileSync(path.resolve('public/icon.svg'), createMonogramSvg({ color: '#C5A880', roundedSquare: true, bgColor: '#1A1C1A' }));
fs.writeFileSync(path.resolve('public/favicon.ico'), createMonogramSvg({ color: '#C5A880', roundedSquare: true, bgColor: '#1A1C1A' }));
fs.writeFileSync(path.resolve('src/app/icon.svg'), createMonogramSvg({ color: '#C5A880', roundedSquare: true, bgColor: '#1A1C1A' }));
fs.writeFileSync(path.resolve('src/app/apple-icon.svg'), createMonogramSvg({ color: '#C5A880', roundedSquare: true, bgColor: '#1A1C1A' }));

console.log('Brand SVG assets generation complete.');
