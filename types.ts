
export enum Category {
  POLITICS = 'Politics',
  ECONOMY = 'Economy',
  ASTROLOGY = 'Astrology',
  HYDROPOWER = 'Hydropower',
  TOURISM = 'Tourism',
  MANIFESTO = 'Manifesto Tracker'
}

export enum Status {
  FULFILLED = 'Fulfilled',
  DISPROVEN = 'Disproven',
  PARTIAL = 'Partial',
  ONGOING = 'Ongoing',
  INCONCLUSIVE = 'Inconclusive'
}

export enum SourceType {
  TIKTOK = 'TikTok',
  FACEBOOK = 'Facebook',
  X_TWITTER = 'X/Twitter',
  REDDIT = 'Reddit',
  NEWS = 'News Site',
  YOUTUBE = 'YouTube'
}

export interface VerificationVector {
  modelName: string;
  verdict: Status;
  confidence: number;
  reasoning: string;
}

export interface AnalysisParameter {
  label: string;
  fulfilled: boolean;
  isHumanAdded?: boolean;
}

export interface ClaimSource {
  type: SourceType;
  url: string;
  screenshotUrl?: string;
}

export interface Claimant {
  id: string;
  name: string;
  bio: string;
  affiliation: string;
  photoUrl: string;
  accuracyRate: number;
  vaguenessScore: number; 
  totalClaims: number;
  tags: string[];
}

export interface ClaimVersion {
  timestamp: string;
  text: string;
  status: Status;
  vaguenessIndex: number;
}

export interface Claim {
  id: string;
  claimantId: string;
  text: string;
  dateMade: string;
  targetDate: string;
  category: Category;
  status: Status;
  sources: ClaimSource[];
  vaguenessIndex: number; 
  analysisParams: AnalysisParameter[];
  verificationVectors: VerificationVector[];
  webEvidenceLinks?: { title: string; url: string }[];
  topicGroup?: string; 
  history?: ClaimVersion[];
}

export type Language = 'en' | 'ne';
