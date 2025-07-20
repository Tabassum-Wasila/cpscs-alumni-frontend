export interface Notice {
  id: string;
  noticeTitle: string;
  noticeBody: string;
  imageUrl?: string;
  videoUrl?: string;
  pdfUrl?: string;
  publishDate: string;
  category?: 'announcement' | 'event' | 'general' | 'spotlight';
  priority?: 'high' | 'medium' | 'low';
}

export interface NoticeFilters {
  searchQuery: string;
  sortBy: 'date-desc' | 'date-asc';
  category?: string;
}