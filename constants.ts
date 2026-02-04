
import { Category, Status, Claim, Claimant, SourceType } from './types';

export const MOCK_CLAIMANTS: Claimant[] = [
  {
    id: 'c1',
    name: 'Dr. Ramesh Sharma',
    bio: 'Lead Economist at Nepal Policy Institute. Former advisor to the Ministry of Finance.',
    affiliation: 'Independent',
    photoUrl: 'https://picsum.photos/seed/ramesh/200/200',
    accuracyRate: 72,
    vaguenessScore: 2.5,
    totalClaims: 45,
    // Fix: Adding missing required property 'tags'
    tags: ['Economy', 'Public Policy', 'Finance']
  },
  {
    id: 'c2',
    name: 'Jyotish Guru Shanti',
    bio: 'Renowned Vedic Astrologer based in Kathmandu with over 20 years of experience in political horoscopes.',
    affiliation: 'Spiritual Center',
    photoUrl: 'https://picsum.photos/seed/shanti/200/200',
    accuracyRate: 35,
    vaguenessScore: 8.2,
    totalClaims: 120,
    // Fix: Adding missing required property 'tags'
    tags: ['Astrology', 'Spirituality', 'Predictions']
  },
  {
    id: 'c3',
    name: 'Bikash Thapa',
    bio: 'Infrastructure and Energy Analyst focusing on Hydropower projects in the Himalayas.',
    affiliation: 'Hydro Watch Nepal',
    photoUrl: 'https://picsum.photos/seed/bikash/200/200',
    accuracyRate: 85,
    vaguenessScore: 1.8,
    totalClaims: 28,
    // Fix: Adding missing required property 'tags'
    tags: ['Hydropower', 'Infrastructure', 'Energy']
  }
];

export const MOCK_CLAIMS: Claim[] = [
  {
    id: '1',
    claimantId: 'c1',
    text: "Nepal's GDP will grow by exactly 5.2% in the fiscal year 2024/25.",
    dateMade: '2023-05-12',
    targetDate: '2025-07-15',
    category: Category.ECONOMY,
    status: Status.ONGOING,
    // Fix: replaced 'sourceUrl' with required 'sources' array and added missing required fields
    sources: [{ type: SourceType.NEWS, url: 'https://example.com/news/1' }],
    vaguenessIndex: 2,
    analysisParams: [],
    verificationVectors: []
  },
  {
    id: '2',
    claimantId: 'c2',
    text: "A major political shift will happen in Nepal within the next 3 months due to planetary alignments.",
    dateMade: '2024-01-10',
    targetDate: '2024-04-10',
    category: Category.ASTROLOGY,
    status: Status.DISPROVEN,
    // Fix: replaced 'sourceUrl' with required 'sources' array and removed 'verificationDetails' (not in Claim type)
    sources: [{ type: SourceType.NEWS, url: 'https://example.com/news/2' }],
    vaguenessIndex: 9,
    analysisParams: [],
    verificationVectors: []
  },
  {
    id: '3',
    claimantId: 'c3',
    text: "The Upper Tamakoshi project will reach full capacity by December 2023.",
    dateMade: '2022-08-15',
    targetDate: '2023-12-31',
    category: Category.HYDROPOWER,
    status: Status.FULFILLED,
    // Fix: replaced 'sourceUrl' with required 'sources' array and removed 'verificationDetails' (not in Claim type)
    sources: [{ type: SourceType.NEWS, url: 'https://example.com/news/3' }],
    vaguenessIndex: 1,
    analysisParams: [],
    verificationVectors: []
  }
];
