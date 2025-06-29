
export interface BaseSponsor {
  id: string;
  name: string;
  shortDescription?: string;
  bannerImage?: string;
  website?: string;
  socialLinks?: {
    linkedin?: string;
    facebook?: string;
    twitter?: string;
  };
  contributedAmount?: number;
  quote?: string;
  dateAdded: string;
}

export interface Organization extends BaseSponsor {
  type: 'organization';
  logo: string;
  industry?: string;
  tags?: string[];
}

export interface Patron extends BaseSponsor {
  type: 'patron';
  profilePhoto: string;
  designation?: string;
  company?: string;
  fullName?: string;
}

export type Sponsor = Organization | Patron;

export interface SponsorsData {
  organizations: Organization[];
  patrons: Patron[];
}

export interface SponsorFilters {
  searchQuery?: string;
  sortBy: 'newest' | 'oldest';
  category?: string;
}
