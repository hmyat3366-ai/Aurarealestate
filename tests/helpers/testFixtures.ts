/**
 * Test Fixtures and Reference Domain Models for Vane & Sterling Platform
 * Strictly adhering to PROJECT.md § Interface Contracts
 */

export type ListingType = 'sale' | 'rent';

export type PropertyType = 
  | 'apartment' 
  | 'penthouse' 
  | 'villa' 
  | 'townhouse' 
  | 'estate' 
  | 'loft';

export type PropertyStatus = 
  | 'Active' 
  | 'Private Exclusive' 
  | 'Coming Soon' 
  | 'Price Improvement' 
  | 'Under Contract';

export interface Price {
  amount: number;
  currency: 'USD' | 'GBP' | 'EUR';
  rentalPeriod?: 'month' | 'year' | null;
}

export interface Address {
  street: string;
  unit?: string;
  neighborhood: string;
  city: string;
  state?: string;
  postalCode: string;
  coordinates?: { lat: number; lng: number };
}

export interface Amenities {
  interior: string[];
  outdoor: string[];
  building: string[];
}

export interface Agent {
  id: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  avatar: string;
}

export interface Property {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  listingType: ListingType;
  propertyType: PropertyType;
  status: PropertyStatus;
  price: Price;
  pricePerSqFt?: number;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  yearBuilt: number;
  address: Address;
  description: string[];
  images: {
    hero: string;
    gallery: string[];
  };
  amenities: Amenities;
  rentalDetails?: {
    availableDate: string;
    leaseTerm: 'Annual (12+ Months)' | 'Flexible (3-11 Months)' | 'Short-Term (< 3 Months)';
    furnished: boolean;
    petsAllowed: boolean;
    depositAmount: number;
  };
  agent: Agent;
  featured?: boolean;
}

export interface PropertyFilterParams {
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number | 'studio' | string;
  bathrooms?: number | string;
  propertyTypes?: PropertyType[];
  rentalInterval?: string;
  furnished?: boolean;
  petsAllowed?: boolean;
  sortBy?: 'featured' | 'newest' | 'price-asc' | 'price-desc' | 'sqft-desc';
}

export interface ViewingRequest {
  propertyId: string;
  propertyTitle: string;
  fullName: string;
  email: string;
  phone: string;
  tourType: 'in-person' | 'video';
  preferredDate: string;
  preferredTime: 'morning' | 'afternoon' | 'evening';
  status: 'pending_confirmation';
}

export interface SellInquiry {
  ownerName: string;
  email: string;
  phone: string;
  propertyAddress: string;
  propertyType: PropertyType;
  estimatedBedrooms: number;
  estimatedBathrooms: number;
  notes?: string;
}

export const MOCK_AGENTS: Record<string, Agent> = {
  julian: {
    id: 'agent-julian',
    name: 'Julian Vane',
    title: 'Managing Partner, Prime Acquisitions',
    email: 'julian@vaneandsterling.com',
    phone: '+44 (0)20 7946 0881',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  },
  eleanor: {
    id: 'agent-eleanor',
    name: 'Eleanor Sterling',
    title: 'Senior Partner, Private Estates',
    email: 'eleanor@vaneandsterling.com',
    phone: '+44 (0)20 7946 0882',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
  },
  alistair: {
    id: 'agent-alistair',
    name: 'Alistair Finch',
    title: 'Lettings Director, Corporate Portfolio',
    email: 'alistair@vaneandsterling.com',
    phone: '+44 (0)20 7946 0883',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
  },
  clara: {
    id: 'agent-clara',
    name: 'Clara Montagu',
    title: 'Senior Associate, Mayfair & Lofts',
    email: 'clara@vaneandsterling.com',
    phone: '+44 (0)20 7946 0884',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
  },
};

export const MOCK_SALE_PROPERTIES: Property[] = [
  {
    id: 'vs-sale-01',
    slug: 'the-belgravia-crescent-penthouse',
    title: 'The Belgravia Crescent Penthouse',
    subtitle: 'Triplex penthouse with private wraparound roof terrace',
    listingType: 'sale',
    propertyType: 'penthouse',
    status: 'Active',
    price: { amount: 14500000, currency: 'USD', rentalPeriod: null },
    pricePerSqFt: 3452,
    bedrooms: 4,
    bathrooms: 4,
    squareFeet: 4200,
    yearBuilt: 2021,
    address: {
      street: '14 Wilton Crescent',
      unit: 'Penthouse A',
      neighborhood: 'Belgravia',
      city: 'London',
      postalCode: 'SW1X 8RN',
      coordinates: { lat: 51.4998, lng: -0.1554 },
    },
    description: [
      'An exceptional triplex penthouse crowned with a 360-degree glass pavilion terrace.',
      'Bespoke architectural joinery crafted from fluted travertine and Belgian smoked oak.',
    ],
    images: {
      hero: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=85',
      gallery: [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=85',
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1800&q=85',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1800&q=85',
        'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1800&q=85',
        'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1800&q=85',
      ],
    },
    amenities: {
      interior: ['Private Direct Lift', 'Travertine Fireplace', 'Wine Tasting Cellar', 'Automated Lutron Lighting'],
      outdoor: ['Wraparound Rooftop Terrace', 'Outdoor Kitchen', 'Private Heated Pool'],
      building: ['24/7 Concierge', 'Valet Parking', 'Subterranean Spa'],
    },
    agent: MOCK_AGENTS.eleanor,
    featured: true,
  },
  {
    id: 'vs-sale-02',
    slug: 'the-marylebone-high-townhouse',
    title: 'The Marylebone High Townhouse',
    subtitle: 'Restored Georgian residence on private mews',
    listingType: 'sale',
    propertyType: 'townhouse',
    status: 'Private Exclusive',
    price: { amount: 7850000, currency: 'USD', rentalPeriod: null },
    pricePerSqFt: 1987,
    bedrooms: 5,
    bathrooms: 4,
    squareFeet: 3950,
    yearBuilt: 1890,
    address: {
      street: '42 Bingham Place',
      neighborhood: 'Marylebone',
      city: 'London',
      postalCode: 'W1U 5HX',
      coordinates: { lat: 51.5202, lng: -0.1542 },
    },
    description: [
      'A serene Georgian townhouse featuring preserved original moldings alongside minimalist contemporary interventions.',
    ],
    images: {
      hero: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1800&q=85',
      gallery: [
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1800&q=85',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1800&q=85',
        'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1800&q=85',
      ],
    },
    amenities: {
      interior: ['Original Fireplaces', 'Chef Kitchen with Gaggenau Appliances', 'Private Library'],
      outdoor: ['Walled Japanese Zen Garden', 'Courtyard Patio'],
      building: ['Integral Garage', 'Alarm System'],
    },
    agent: MOCK_AGENTS.clara,
    featured: false,
  },
  {
    id: 'vs-sale-03',
    slug: 'holland-park-modernist-villa',
    title: 'Holland Park Modernist Villa',
    subtitle: 'Brutalist concrete and glass sanctuary bordering parkland',
    listingType: 'sale',
    propertyType: 'villa',
    status: 'Active',
    price: { amount: 18950000, currency: 'USD', rentalPeriod: null },
    pricePerSqFt: 2960,
    bedrooms: 6,
    bathrooms: 6,
    squareFeet: 6400,
    yearBuilt: 2023,
    address: {
      street: '8 Addison Road',
      neighborhood: 'Kensington',
      city: 'London',
      postalCode: 'W14 8DJ',
      coordinates: { lat: 51.5005, lng: -0.2078 },
    },
    description: [
      'Architectural masterwork featuring board-formed concrete, floor-to-ceiling sliding glass walls, and a sunken meadow courtyard.',
    ],
    images: {
      hero: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1800&q=85',
      gallery: [
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1800&q=85',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=85',
      ],
    },
    amenities: {
      interior: ['20-Meter Indoor Lap Pool', 'Private Screening Cinema', 'Wine Cellar'],
      outdoor: ['Pergola Dining Pavillion', 'Landscaped Grounds'],
      building: ['Triple Car Underground Gallery', 'Biometric Security'],
    },
    agent: MOCK_AGENTS.julian,
    featured: true,
  },
  {
    id: 'vs-sale-04',
    slug: 'the-mayfair-heritage-loft',
    title: 'The Mayfair Heritage Loft',
    subtitle: 'Historic gallery conversion with 14-foot ceiling heights',
    listingType: 'sale',
    propertyType: 'loft',
    status: 'Coming Soon',
    price: { amount: 4250000, currency: 'USD', rentalPeriod: null },
    pricePerSqFt: 2023,
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 2100,
    yearBuilt: 1910,
    address: {
      street: '18 Cork Street',
      unit: '3B',
      neighborhood: 'Mayfair',
      city: 'London',
      postalCode: 'W1S 3NH',
      coordinates: { lat: 51.5097, lng: -0.1418 },
    },
    description: [
      'A luminous loft conversion situated in the heart of Mayfairs premier art district.',
    ],
    images: {
      hero: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1800&q=85',
      gallery: [
        'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1800&q=85',
      ],
    },
    amenities: {
      interior: ['Museum-Grade Lighting Track', 'Exposed Steel Beams', 'Polished Terrazzo Flooring'],
      outdoor: ['Private Breakfast Balcony'],
      building: ['Direct Elevator Entry', 'Porter'],
    },
    agent: MOCK_AGENTS.clara,
    featured: false,
  },
  {
    id: 'vs-sale-05',
    slug: 'knightsbridge-garden-estate',
    title: 'Knightsbridge Garden Estate',
    subtitle: 'Palatial freehold mansion with direct private park access',
    listingType: 'sale',
    propertyType: 'estate',
    status: 'Private Exclusive',
    price: { amount: 24000000, currency: 'USD', rentalPeriod: null },
    pricePerSqFt: 2727,
    bedrooms: 7,
    bathrooms: 8,
    squareFeet: 8800,
    yearBuilt: 1875,
    address: {
      street: '22 Ennismore Gardens',
      neighborhood: 'Knightsbridge',
      city: 'London',
      postalCode: 'SW7 1AA',
      coordinates: { lat: 51.5002, lng: -0.1685 },
    },
    description: [
      'An imposing white-stucco double-fronted mansion overlooking communal private ornamental gardens.',
    ],
    images: {
      hero: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1800&q=85',
      gallery: [
        'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1800&q=85',
      ],
    },
    amenities: {
      interior: ['Grand Ballroom', 'Staff Quarters', 'Commercial Prep Kitchen', 'Private Sauna & Hammam'],
      outdoor: ['Direct Garden Square Key Access', 'Private Italianate Parterre'],
      building: ['Gated Carriage Driveway', 'Full Time Security Staff'],
    },
    agent: MOCK_AGENTS.eleanor,
    featured: true,
  },
  {
    id: 'vs-sale-06',
    slug: 'chelsea-embankment-riverside-duplex',
    title: 'Chelsea Embankment Riverside Duplex',
    subtitle: 'Dramatic Thames views with dual-aspect reception spaces',
    listingType: 'sale',
    propertyType: 'apartment',
    status: 'Active',
    price: { amount: 9200000, currency: 'USD', rentalPeriod: null },
    pricePerSqFt: 2967,
    bedrooms: 3,
    bathrooms: 3,
    squareFeet: 3100,
    yearBuilt: 2018,
    address: {
      street: '7 Cheyne Walk',
      unit: 'River Suite 2',
      neighborhood: 'Chelsea',
      city: 'London',
      postalCode: 'SW3 4HH',
      coordinates: { lat: 51.4837, lng: -0.1678 },
    },
    description: [
      'Unrivalled panoramic river views stretching past the Albert Bridge.',
    ],
    images: {
      hero: 'https://images.unsplash.com/photo-1600573472591-ee6c563aaec9?auto=format&fit=crop&w=1800&q=85',
      gallery: [
        'https://images.unsplash.com/photo-1600573472591-ee6c563aaec9?auto=format&fit=crop&w=1800&q=85',
      ],
    },
    amenities: {
      interior: ['Floor-to-Ceiling Acoustic Glazing', 'Solid Herringbone Parquet', 'Walk-In Dressing Suites'],
      outdoor: ['Cantilevered River Terrace'],
      building: ['24-Hour Uniformed Doorman', 'Secure Underground Parking'],
    },
    agent: MOCK_AGENTS.julian,
    featured: false,
  },
  {
    id: 'vs-sale-07',
    slug: 'regents-park-pavilion-villa',
    title: 'Regent\'s Park Pavilion Villa',
    subtitle: 'John Nash neoclassical residence with private perimeter',
    listingType: 'sale',
    propertyType: 'villa',
    status: 'Price Improvement',
    price: { amount: 16750000, currency: 'USD', rentalPeriod: null },
    pricePerSqFt: 2991,
    bedrooms: 5,
    bathrooms: 5,
    squareFeet: 5600,
    yearBuilt: 1826,
    address: {
      street: '12 Cumberland Terrace',
      neighborhood: 'Regent\'s Park',
      city: 'London',
      postalCode: 'NW1 4HS',
      coordinates: { lat: 51.5302, lng: -0.1442 },
    },
    description: [
      'A majestic Grade I listed Nash villa offering uninterrupted vistas over the Royal Parks boating lake.',
    ],
    images: {
      hero: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1800&q=85',
      gallery: [
        'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1800&q=85',
      ],
    },
    amenities: {
      interior: ['Ionic Corinthian Columns', 'Double-Height Music Salon', 'Wine Vault'],
      outdoor: ['Private South-Facing Lawn', 'Direct Park Access'],
      building: ['Mews Coach House', 'Private Security Patrol'],
    },
    agent: MOCK_AGENTS.julian,
    featured: true,
  },
  {
    id: 'vs-sale-08',
    slug: 'fitzrovia-architectural-penthouse',
    title: 'Fitzrovia Architectural Penthouse',
    subtitle: 'Industrial warmth meets minimalist Scandinavian aesthetics',
    listingType: 'sale',
    propertyType: 'penthouse',
    status: 'Under Contract',
    price: { amount: 5950000, currency: 'USD', rentalPeriod: null },
    pricePerSqFt: 2245,
    bedrooms: 3,
    bathrooms: 3,
    squareFeet: 2650,
    yearBuilt: 2020,
    address: {
      street: '34 Charlotte Street',
      unit: 'Penthouse East',
      neighborhood: 'Fitzrovia',
      city: 'London',
      postalCode: 'W1T 2NH',
      coordinates: { lat: 51.5192, lng: -0.1365 },
    },
    description: [
      'A serene retreat elevated above the buzzing culinary district of Charlotte Street.',
    ],
    images: {
      hero: 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=1800&q=85',
      gallery: [
        'https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=1800&q=85',
      ],
    },
    amenities: {
      interior: ['Bespoke Bulthaup Kitchen', 'Microcement Bathrooms', 'Acoustic Soundproofing'],
      outdoor: ['Cedar Wood Decking', 'Fire Pit'],
      building: ['Keycard Lift Entry', 'Bike Storage'],
    },
    agent: MOCK_AGENTS.clara,
    featured: false,
  },
];

export const MOCK_RENT_PROPERTIES: Property[] = [
  {
    id: 'vs-rent-01',
    slug: 'the-connaught-square-residence',
    title: 'The Connaught Square Residence',
    subtitle: 'Full-floor residence fronting iconic private garden square',
    listingType: 'rent',
    propertyType: 'apartment',
    status: 'Active',
    price: { amount: 14000, currency: 'USD', rentalPeriod: 'month' },
    bedrooms: 3,
    bathrooms: 3,
    squareFeet: 2450,
    yearBuilt: 1905,
    address: {
      street: '28 Connaught Square',
      unit: 'Piano Nobile',
      neighborhood: 'Mayfair',
      city: 'London',
      postalCode: 'W2 2HL',
      coordinates: { lat: 51.5148, lng: -0.1623 },
    },
    description: [
      'A refined residence furnished with collectible 20th-century Scandinavian design pieces.',
    ],
    images: {
      hero: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1800&q=85',
      gallery: [
        'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1800&q=85',
      ],
    },
    amenities: {
      interior: ['Sonos Sound System', 'Sub-Zero Refrigeration', 'Dressing Room'],
      outdoor: ['Garden Square Access'],
      building: ['Day Porter', 'Secure Entry'],
    },
    rentalDetails: {
      availableDate: '2026-11-01',
      leaseTerm: 'Annual (12+ Months)',
      furnished: true,
      petsAllowed: false,
      depositAmount: 28000,
    },
    agent: MOCK_AGENTS.alistair,
    featured: true,
  },
  {
    id: 'vs-rent-02',
    slug: 'cheyne-walk-riverfront-townhouse',
    title: 'Cheyne Walk Riverfront Townhouse',
    subtitle: 'Expansive historic townhouse overlooking river Thames',
    listingType: 'rent',
    propertyType: 'townhouse',
    status: 'Active',
    price: { amount: 18500, currency: 'USD', rentalPeriod: 'month' },
    bedrooms: 5,
    bathrooms: 4,
    squareFeet: 4200,
    yearBuilt: 1840,
    address: {
      street: '15 Cheyne Walk',
      neighborhood: 'Chelsea',
      city: 'London',
      postalCode: 'SW3 5HN',
      coordinates: { lat: 51.4831, lng: -0.1691 },
    },
    description: [
      'Five-storey Georgian house offering unmatched vistas of Battersea Park and Albert Bridge.',
    ],
    images: {
      hero: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=85',
      gallery: [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=85',
      ],
    },
    amenities: {
      interior: ['Wine Storage Room', 'Gym Room', 'Sauna'],
      outdoor: ['Private Landscaped Garden', 'Rooftop Terrace'],
      building: ['CCTV Monitoring', 'Off-Street Parking'],
    },
    rentalDetails: {
      availableDate: '2026-11-15',
      leaseTerm: 'Annual (12+ Months)',
      furnished: false,
      petsAllowed: true,
      depositAmount: 37000,
    },
    agent: MOCK_AGENTS.alistair,
    featured: false,
  },
  {
    id: 'vs-rent-03',
    slug: 'kensington-palace-gardens-suite',
    title: 'Kensington Palace Gardens Suite',
    subtitle: 'Ultra-exclusive luxury suite on Billionaires Row',
    listingType: 'rent',
    propertyType: 'penthouse',
    status: 'Private Exclusive',
    price: { amount: 22000, currency: 'USD', rentalPeriod: 'month' },
    bedrooms: 4,
    bathrooms: 4,
    squareFeet: 3800,
    yearBuilt: 2022,
    address: {
      street: '10 Kensington Palace Gardens',
      unit: 'Executive Penthouse',
      neighborhood: 'Kensington',
      city: 'London',
      postalCode: 'W8 4QP',
      coordinates: { lat: 51.5052, lng: -0.1912 },
    },
    description: [
      'A sanctuary of supreme privacy, armed guard security, and private embassy-level specifications.',
    ],
    images: {
      hero: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1800&q=85',
      gallery: [
        'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1800&q=85',
      ],
    },
    amenities: {
      interior: ['Chilled Wine Room', 'Private Steam Bath', 'Safe Room / Panic Facility'],
      outdoor: ['Private Sunset Loggia'],
      building: ['24/7 Diplomatic Security', 'Chauffeur Lounge', 'Indoor Pool'],
    },
    rentalDetails: {
      availableDate: '2026-12-01',
      leaseTerm: 'Flexible (3-11 Months)',
      furnished: true,
      petsAllowed: false,
      depositAmount: 44000,
    },
    agent: MOCK_AGENTS.eleanor,
    featured: true,
  },
  {
    id: 'vs-rent-04',
    slug: 'chiltern-street-design-loft',
    title: 'Chiltern Street Design Loft',
    subtitle: 'Bespoke apartment opposite the famed Firehouse',
    listingType: 'rent',
    propertyType: 'loft',
    status: 'Active',
    price: { amount: 6500, currency: 'USD', rentalPeriod: 'month' },
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 1450,
    yearBuilt: 1925,
    address: {
      street: '22 Chiltern Street',
      unit: 'Apartment 4',
      neighborhood: 'Marylebone',
      city: 'London',
      postalCode: 'W1U 7PJ',
      coordinates: { lat: 51.5195, lng: -0.1558 },
    },
    description: [
      'An exquisitely curated apartment crafted with raw brass details, poured concrete, and custom walnut cabinetry.',
    ],
    images: {
      hero: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1800&q=85',
      gallery: [
        'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1800&q=85',
      ],
    },
    amenities: {
      interior: ['Custom Walnut Joinery', 'Underfloor Heating', 'Smeg Range Cooker'],
      outdoor: ['Juliet Balcony'],
      building: ['Video Entry Phone'],
    },
    rentalDetails: {
      availableDate: '2026-10-20',
      leaseTerm: 'Annual (12+ Months)',
      furnished: true,
      petsAllowed: true,
      depositAmount: 13000,
    },
    agent: MOCK_AGENTS.clara,
    featured: false,
  },
  {
    id: 'vs-rent-05',
    slug: 'richmond-green-detached-villa',
    title: 'Richmond Green Detached Villa',
    subtitle: 'Country living in the capital bordering royal deer parks',
    listingType: 'rent',
    propertyType: 'villa',
    status: 'Active',
    price: { amount: 15000, currency: 'USD', rentalPeriod: 'month' },
    bedrooms: 5,
    bathrooms: 5,
    squareFeet: 5200,
    yearBuilt: 1912,
    address: {
      street: '9 The Green',
      neighborhood: 'Richmond',
      city: 'London',
      postalCode: 'TW9 1PL',
      coordinates: { lat: 51.4612, lng: -0.3061 },
    },
    description: [
      'Gated Edwardian estate offering serene countryside seclusion with rapid West End transit.',
    ],
    images: {
      hero: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1800&q=85',
      gallery: [
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1800&q=85',
      ],
    },
    amenities: {
      interior: ['Heated Conservatory', 'Butler Pantry', 'Children Playroom'],
      outdoor: ['Half-Acre Landscaped Lawn', 'Tennis Court'],
      building: ['Electric Vehicle Charging Gate', 'Private Garage'],
    },
    rentalDetails: {
      availableDate: '2026-11-01',
      leaseTerm: 'Annual (12+ Months)',
      furnished: false,
      petsAllowed: true,
      depositAmount: 30000,
    },
    agent: MOCK_AGENTS.alistair,
    featured: true,
  },
  {
    id: 'vs-rent-06',
    slug: 'wilton-crescent-stucco-apartment',
    title: 'Wilton Crescent Stucco Apartment',
    subtitle: 'Classic Regency apartment with soaring 4-meter ceilings',
    listingType: 'rent',
    propertyType: 'apartment',
    status: 'Price Improvement',
    price: { amount: 11500, currency: 'USD', rentalPeriod: 'month' },
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 1850,
    yearBuilt: 1845,
    address: {
      street: '8 Wilton Crescent',
      unit: 'First Floor Suite',
      neighborhood: 'Belgravia',
      city: 'London',
      postalCode: 'SW1X 8RN',
      coordinates: { lat: 51.5003, lng: -0.1558 },
    },
    description: [
      'Stately Regency apartment retaining original chandelier rosettes and tall sash windows opening to balustrades.',
    ],
    images: {
      hero: 'https://images.unsplash.com/photo-1600573472591-ee6c563aaec9?auto=format&fit=crop&w=1800&q=85',
      gallery: [
        'https://images.unsplash.com/photo-1600573472591-ee6c563aaec9?auto=format&fit=crop&w=1800&q=85',
      ],
    },
    amenities: {
      interior: ['Marble Fireplace', 'Integrated Crestron Audio', 'Air Conditioning'],
      outdoor: ['Front Balustrade Overlooking Crescent'],
      building: ['Caretaker On-Site'],
    },
    rentalDetails: {
      availableDate: '2026-10-25',
      leaseTerm: 'Flexible (3-11 Months)',
      furnished: true,
      petsAllowed: false,
      depositAmount: 23000,
    },
    agent: MOCK_AGENTS.alistair,
    featured: false,
  },
  {
    id: 'vs-rent-07',
    slug: 'st-johns-wood-contemporary-villa',
    title: 'St John\'s Wood Contemporary Villa',
    subtitle: 'Newly commissioned architectural home near Regent\'s Park',
    listingType: 'rent',
    propertyType: 'villa',
    status: 'Active',
    price: { amount: 16500, currency: 'USD', rentalPeriod: 'month' },
    bedrooms: 5,
    bathrooms: 5,
    squareFeet: 4800,
    yearBuilt: 2022,
    address: {
      street: '14 Avenue Road',
      neighborhood: 'St John\'s Wood',
      city: 'London',
      postalCode: 'NW8 6BU',
      coordinates: { lat: 51.5381, lng: -0.1689 },
    },
    description: [
      'A masterfully detailed modern villa with lightwells and double-height living areas.',
    ],
    images: {
      hero: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1800&q=85',
      gallery: [
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1800&q=85',
      ],
    },
    amenities: {
      interior: ['Private Lift', 'Sauna and Treatment Room', 'Wine Display'],
      outdoor: ['South Lawn Garden', 'Outdoor BBQ Terrace'],
      building: ['Gated In-and-Out Driveway'],
    },
    rentalDetails: {
      availableDate: '2026-11-10',
      leaseTerm: 'Annual (12+ Months)',
      furnished: false,
      petsAllowed: true,
      depositAmount: 33000,
    },
    agent: MOCK_AGENTS.julian,
    featured: true,
  },
  {
    id: 'vs-rent-08',
    slug: 'soho-artist-loft-and-terrace',
    title: 'Soho Artist Loft & Terrace',
    subtitle: 'Top-floor converted printworks with private skyline terrace',
    listingType: 'rent',
    propertyType: 'loft',
    status: 'Under Contract',
    price: { amount: 7200, currency: 'USD', rentalPeriod: 'month' },
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 1750,
    yearBuilt: 1930,
    address: {
      street: '19 Meard Street',
      unit: 'Penthouse 5',
      neighborhood: 'Soho',
      city: 'London',
      postalCode: 'W1F 0EY',
      coordinates: { lat: 51.5134, lng: -0.1342 },
    },
    description: [
      'Authentic warehouse features including exposed reclaimed brick, cast iron radiators, and Crittall doors.',
    ],
    images: {
      hero: 'https://images.unsplash.com/photo-1600573472556-e636c2acda88?auto=format&fit=crop&w=1800&q=85',
      gallery: [
        'https://images.unsplash.com/photo-1600573472556-e636c2acda88?auto=format&fit=crop&w=1800&q=85',
      ],
    },
    amenities: {
      interior: ['Cast Iron Radiators', 'Custom Concrete Countertops', 'Skylights'],
      outdoor: ['Private Teak Skyline Deck'],
      building: ['Lift Access', 'Key Fob Security'],
    },
    rentalDetails: {
      availableDate: '2026-11-01',
      leaseTerm: 'Short-Term (< 3 Months)',
      furnished: true,
      petsAllowed: true,
      depositAmount: 14400,
    },
    agent: MOCK_AGENTS.clara,
    featured: false,
  },
];

export const ALL_PROPERTIES: Property[] = [
  ...MOCK_SALE_PROPERTIES,
  ...MOCK_RENT_PROPERTIES,
];

/**
 * Functional Filter Algorithm conforming to requirements
 */
export function filterProperties(
  properties: Property[],
  params: PropertyFilterParams
): Property[] {
  return properties.filter((p) => {
    // Location match (neighborhood, city, street, title)
    if (params.location && params.location !== 'all' && params.location.trim() !== '') {
      const q = params.location.toLowerCase().trim();
      const match =
        p.address.neighborhood.toLowerCase().includes(q) ||
        p.address.city.toLowerCase().includes(q) ||
        p.address.street.toLowerCase().includes(q) ||
        p.title.toLowerCase().includes(q);
      if (!match) return false;
    }

    // Min Price
    if (typeof params.minPrice === 'number' && !isNaN(params.minPrice)) {
      if (p.price.amount < params.minPrice) return false;
    }

    // Max Price
    if (typeof params.maxPrice === 'number' && !isNaN(params.maxPrice)) {
      if (p.price.amount > params.maxPrice) return false;
    }

    // Bedrooms
    if (params.bedrooms !== undefined && params.bedrooms !== 'all') {
      if (params.bedrooms === 'studio') {
        if (p.bedrooms !== 0) return false;
      } else {
        const requiredBeds = Number(params.bedrooms);
        if (!isNaN(requiredBeds) && p.bedrooms < requiredBeds) return false;
      }
    }

    // Bathrooms
    if (params.bathrooms !== undefined && params.bathrooms !== 'all') {
      const requiredBaths = Number(params.bathrooms);
      if (!isNaN(requiredBaths) && p.bathrooms < requiredBaths) return false;
    }

    // Property Types
    if (params.propertyTypes && params.propertyTypes.length > 0) {
      if (!params.propertyTypes.includes(p.propertyType)) return false;
    }

    // Rental Interval
    if (params.rentalInterval) {
      if (!p.rentalDetails || p.rentalDetails.leaseTerm !== params.rentalInterval) return false;
    }

    // Furnished
    if (params.furnished !== undefined) {
      if (!p.rentalDetails || p.rentalDetails.furnished !== params.furnished) return false;
    }

    // Pets Allowed
    if (params.petsAllowed !== undefined) {
      if (!p.rentalDetails || p.rentalDetails.petsAllowed !== params.petsAllowed) return false;
    }

    return true;
  });
}

/**
 * Functional Sort Algorithm conforming to 5-way sorting requirement
 */
export function sortProperties(
  properties: Property[],
  sortBy: PropertyFilterParams['sortBy'] = 'featured'
): Property[] {
  const list = [...properties];
  switch (sortBy) {
    case 'price-asc':
      return list.sort((a, b) => a.price.amount - b.price.amount);
    case 'price-desc':
      return list.sort((a, b) => b.price.amount - a.price.amount);
    case 'sqft-desc':
      return list.sort((a, b) => b.squareFeet - a.squareFeet);
    case 'newest':
      return list.sort((a, b) => (b.yearBuilt || 0) - (a.yearBuilt || 0));
    case 'featured':
    default:
      return list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  }
}

/**
 * Currency & Metric Formatters
 */
export function formatPrice(price: Price): string {
  const currencySymbol = price.currency === 'USD' ? '$' : price.currency === 'GBP' ? '£' : '€';
  const formattedNumber = new Intl.NumberFormat('en-US').format(price.amount);
  
  if (price.rentalPeriod === 'month') {
    return `${currencySymbol}${formattedNumber}/mo`;
  }
  if (price.rentalPeriod === 'year') {
    return `${currencySymbol}${formattedNumber}/yr`;
  }
  return `${currencySymbol}${formattedNumber}`;
}

export function formatSqft(sqft: number): string {
  return `${new Intl.NumberFormat('en-US').format(sqft)} sq ft`;
}

/**
 * RFC 2368 compliant Mailto URL builder
 */
export function generateMailtoLink(inquiry: SellInquiry): string {
  const recipient = 'privateoffice@vaneandsterling.com';
  const subject = `Private Valuation Consultation: ${inquiry.propertyAddress}`;
  const body = [
    `Dear Vane & Sterling Private Office,`,
    ``,
    `I would like to request confidential advice regarding the valuation and representation of my property.`,
    ``,
    `Owner Name: ${inquiry.ownerName}`,
    `Email: ${inquiry.email}`,
    `Phone: ${inquiry.phone}`,
    `Property Address: ${inquiry.propertyAddress}`,
    `Property Type: ${inquiry.propertyType}`,
    `Bedrooms: ${inquiry.estimatedBedrooms}`,
    `Bathrooms: ${inquiry.estimatedBathrooms}`,
    `Notes: ${inquiry.notes || 'None provided'}`,
    ``,
    `Kind regards,`,
    `${inquiry.ownerName}`,
  ].join('\r\n');

  return `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body).replace(/%3A/gi, ':')}`;
}
