
export interface Author {
  id: string;
  name: string;
  profilePhoto?: string;
  bio?: string;
  batch?: string;
  designation?: string;
  company?: string;
  socialLinks?: {
    linkedin?: string;
    facebook?: string;
    twitter?: string;
    website?: string;
  };
}

export interface MagazineArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: Author;
  category: 'story' | 'achievement' | 'career' | 'memories' | 'innovation' | 'community';
  tags: string[];
  featuredImage: string;
  bannerImage?: string;
  readTime: number;
  publishedAt: string;
  updatedAt?: string;
  loveCount: number;
  viewCount: number;
  featured: boolean;
  status: 'published' | 'draft';
}

export interface MagazineFilters {
  searchQuery?: string;
  category?: string;
  author?: string;
  sortBy: 'newest' | 'oldest' | 'popular' | 'trending';
}

export interface ArticleSubmission {
  title: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string[];
  featuredImage?: File;
  bannerImage?: File;
  authorBio?: string;
  linkedinProfile?: string;
  personalWebsite?: string;
}
