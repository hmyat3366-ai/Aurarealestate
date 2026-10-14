export interface Neighborhood {
  id: string;
  slug: string;
  name: string;
  headline: string;
  description: string;
  heroImage: string;
  vibe: string[];
  keyHighlights: string[];
  avgPriceSale: string;
  avgPriceRent: string;
  notableStreets: string[];
}

export const NEIGHBORHOODS: Neighborhood[] = [
  {
    id: "loc-mayfair",
    slug: "mayfair",
    name: "Mayfair",
    headline: "London's Epicentre of Elegance, Haute Horlogerie & Private Clubs",
    description:
      "Bordered by Hyde Park, Green Park, and Regent Street, Mayfair remains the premier global address for international connoisseurs. From the garden quietude of Grosvenor Square to Michelin-starred dining on Mount Street, its Georgian and Regency architecture houses London's most sought-after lateral apartments and private mansions.",
    heroImage:
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1800&q=85",
    vibe: ["Aristocratic Heritage", "World-Class Dining", "Private Member Clubs", "Art Galleries"],
    keyHighlights: [
      "Moments from Connaught Village & Berkeley Square",
      "World-class private clubs including Annabel's & 5 Hertford Street",
      "Unrivalled access to Hyde Park and Green Park",
    ],
    avgPriceSale: "£3,200 – £5,500 / sq ft",
    avgPriceRent: "£6,500 – £35,000 / month",
    notableStreets: ["Grosvenor Square", "Mount Street", "South Street", "Curzon Street"],
  },
  {
    id: "loc-kensington",
    slug: "kensington",
    name: "Kensington & Holland Park",
    headline: "Leafy Grandeur, Stucco Villas & Cultured Enclaves",
    description:
      "Synonymous with architectural grace, Kensington combines grand white stucco terraces with romantic wooded avenues around Holland Park. Famed for its royal residence, world-leading museums, and private garden squares, Kensington attracts families seeking spacious estates and distinguished international schools.",
    heroImage:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1800&q=85",
    vibe: ["Stucco Villas", "Royal Parks", "Academic Excellence", "Private Squares"],
    keyHighlights: [
      "The peaceful Japanese Kyoto Gardens within Holland Park",
      "Kensington Palace and adjacent Kensington Gardens",
      "Boutique shopping along Kensington Church Street",
    ],
    avgPriceSale: "£2,400 – £4,200 / sq ft",
    avgPriceRent: "£5,000 – £25,000 / month",
    notableStreets: ["Holland Park Villas", "Kensington Palace Gardens", "Phillimore Gardens"],
  },
  {
    id: "loc-chelsea",
    slug: "chelsea",
    name: "Chelsea",
    headline: "Bohemian Sophistication, Riverside Walkways & King's Road Charm",
    description:
      "Steeped in artistic history from Turner to the Pre-Raphaelites, Chelsea marries picturesque Queen Anne townhouses along the riverfront with vibrant boutiques and cafés along the King's Road. Its quiet garden squares and secluded mews provide peaceful sanctuaries in the city's heart.",
    heroImage:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=85",
    vibe: ["Riverside Living", "Artistic Lineage", "Chic Boutiques", "Floral Gardens"],
    keyHighlights: [
      "Front-line views of Albert Bridge from Cheyne Walk",
      "Chelsea Physic Garden and Royal Hospital grounds",
      "Saatchi Gallery and Duke of York Square",
    ],
    avgPriceSale: "£2,100 – £3,800 / sq ft",
    avgPriceRent: "£4,500 – £20,000 / month",
    notableStreets: ["Cheyne Walk", "Carlyle Square", "Tite Street", "Royal Hospital Road"],
  },
  {
    id: "loc-marylebone",
    slug: "marylebone",
    name: "Marylebone",
    headline: "Village Character with Metropolitan Refinement",
    description:
      "Marylebone blends the architectural majesty of the Portman and Howard de Walden estates with the intimate charm of an English village high street. Renowned for design-led boutiques along Chiltern Street, renowned medical practices on Harley Street, and grand lateral mansions.",
    heroImage:
      "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1800&q=85",
    vibe: ["Village High Street", "Design Hub", "Regent's Park Proximity", "Georgian Mansions"],
    keyHighlights: [
      "Culinary haven centered around Chiltern Firehouse",
      "Bespoke independent stores on Marylebone High Street",
      "Immediate stroll to Regent's Park and the Open Air Theatre",
    ],
    avgPriceSale: "£1,900 – £3,400 / sq ft",
    avgPriceRent: "£3,800 – £16,000 / month",
    notableStreets: ["Mansfield Street", "Chiltern Street", "Montagu Square", "Portland Place"],
  },
  {
    id: "loc-belgravia",
    slug: "belgravia",
    name: "Belgravia",
    headline: "Grand White Stucco Palaces & Diplomatic Enclaves",
    description:
      "Commanding the area south of Hyde Park Corner, Belgravia is world-famous for its majestic Thomas Cubitt white stucco architecture and expansive communal garden squares, including Eaton Square and Belgrave Square. A discreet haven for embassies, dignitaries, and global leaders.",
    heroImage:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1800&q=85",
    vibe: ["Stucco Architecture", "Diplomatic Residences", "Exclusive Squares", "Discreet Luxury"],
    keyHighlights: [
      "Privately manicured garden squares with private keyholder access",
      "Artisan bakeries and boutiques on Elizabeth Street and Motcomb Street",
      "Unrivalled proximity to Knightsbridge and Harrods",
    ],
    avgPriceSale: "£2,800 – £4,800 / sq ft",
    avgPriceRent: "£6,000 – £30,000 / month",
    notableStreets: ["Eaton Square", "Wilton Crescent", "Chester Square", "Belgrave Square"],
  },
  {
    id: "loc-richmond",
    slug: "richmond",
    name: "Richmond upon Thames",
    headline: "Idyllic Country Living Within Royal Greater London",
    description:
      "Perched gracefully on the meandering banks of the River Thames, Richmond offers picturesque panoramas, 2,500 acres of royal deer parkland, and historic country mansions. The ultimate retreat for those seeking open skies, riverside rowing, and world-class sporting facilities.",
    heroImage:
      "https://images.unsplash.com/photo-1600573472591-ee6c563aaec9?auto=format&fit=crop&w=1800&q=85",
    vibe: ["Royal Deer Park", "Meandering River", "Country Estates", "Pastoral Tranquility"],
    keyHighlights: [
      "The protected pastoral view from Richmond Hill over Petersham Meadows",
      "Richmond Park with ancient oak forests and herds of red and fallow deer",
      "Direct fast rail to London Waterloo in under 20 minutes",
    ],
    avgPriceSale: "£1,200 – £2,200 / sq ft",
    avgPriceRent: "£3,500 – £18,000 / month",
    notableStreets: ["Richmond Hill", "The Green", "Petersham Road", "Maids of Honour Row"],
  },
];
