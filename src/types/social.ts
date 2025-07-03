
export interface SocialPost {
  id: string;
  authorId: string;
  author: {
    name: string;
    profilePhoto?: string;
    batch?: string;
    designation?: string;
    company?: string;
  };
  content: string;
  mediaType: 'none' | 'image' | 'youtube';
  imageUrl?: string;
  youtubeUrl?: string;
  youtubeData?: {
    title: string;
    thumbnail: string;
    videoId: string;
  };
  likeCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt?: string;
  isLiked?: boolean;
  isExpanded?: boolean;
}

export interface SocialComment {
  id: string;
  postId: string;
  authorId: string;
  author: {
    name: string;
    profilePhoto?: string;
    batch?: string;
  };
  content: string;
  createdAt: string;
}

export interface CreatePostData {
  content: string;
  mediaType: 'none' | 'image' | 'youtube';
  imageFile?: File;
  youtubeUrl?: string;
}

export interface SocialFilters {
  searchQuery?: string;
  sortBy: 'newest' | 'oldest' | 'popular';
}
