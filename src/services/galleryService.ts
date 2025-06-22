
export interface GalleryImage {
  id: string;
  url: string;
  thumbnail?: string;
  caption?: string;
  alt: string;
  width: number;
  height: number;
  uploadDate: string;
  tags?: string[];
}

export interface SearchFilters {
  query?: string;
  tags?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  sortBy?: 'newest' | 'oldest';
}

// Enhanced sample images with your new URLs
const SAMPLE_IMAGES: GalleryImage[] = [
  // Original images
  {
    id: '1',
    url: 'https://i.imgur.com/dvKB1GO.jpg',
    alt: 'CPSCS Alumni Memory',
    width: 800,
    height: 600,
    uploadDate: '2024-01-01',
    caption: 'Alumni gathering',
    tags: ['alumni', 'gathering', 'memories']
  },
  {
    id: '2',
    url: 'https://i.imgur.com/ug6dvbR.jpg',
    alt: 'School campus view',
    width: 600,
    height: 800,
    uploadDate: '2024-01-02',
    caption: 'Campus memories',
    tags: ['campus', 'school', 'building']
  },
  {
    id: '3',
    url: 'https://i.imgur.com/zPm782I.jpg',
    alt: 'Student activities',
    width: 800,
    height: 600,
    uploadDate: '2024-01-03',
    caption: 'Student life',
    tags: ['students', 'activities', 'school life']
  },
  {
    id: '4',
    url: 'https://i.imgur.com/j75BIZN.jpg',
    alt: 'Academic achievements',
    width: 600,
    height: 900,
    uploadDate: '2024-01-04',
    caption: 'Academic excellence',
    tags: ['academic', 'achievements', 'excellence']
  },
  {
    id: '5',
    url: 'https://i.imgur.com/BcF7rBZ.jpg',
    alt: 'Sports activities',
    width: 800,
    height: 600,
    uploadDate: '2024-01-05',
    caption: 'Sports and activities',
    tags: ['sports', 'activities', 'physical education']
  },
  {
    id: '6',
    url: 'https://i.imgur.com/WtfTf9U.jpg',
    alt: 'Cultural events',
    width: 700,
    height: 800,
    uploadDate: '2024-01-06',
    caption: 'Cultural celebrations',
    tags: ['culture', 'events', 'celebrations']
  },
  {
    id: '7',
    url: 'https://i.imgur.com/JRSeRaX.jpg',
    alt: 'Graduation ceremony',
    width: 800,
    height: 600,
    uploadDate: '2024-01-07',
    caption: 'Graduation day',
    tags: ['graduation', 'ceremony', 'achievement']
  },
  {
    id: '8',
    url: 'https://i.imgur.com/CoqSTIF.jpg',
    alt: 'Alumni success stories',
    width: 600,
    height: 800,
    uploadDate: '2024-01-08',
    caption: 'Success stories',
    tags: ['alumni', 'success', 'stories']
  },
  {
    id: '9',
    url: 'https://i.imgur.com/JYNxmqf.jpg',
    alt: 'School heritage',
    width: 800,
    height: 500,
    uploadDate: '2024-01-09',
    caption: 'Heritage and tradition',
    tags: ['heritage', 'tradition', 'history']
  },
  {
    id: '10',
    url: 'https://i.imgur.com/nwn1g7L.jpg',
    alt: 'Community service',
    width: 700,
    height: 900,
    uploadDate: '2024-01-10',
    caption: 'Community service',
    tags: ['community', 'service', 'volunteering']
  },
  // New images from your latest batch
  {
    id: '11',
    url: 'https://i.imgur.com/z8KGAgM.jpeg',
    alt: 'CPSCS Alumni Event',
    width: 1080,
    height: 720,
    uploadDate: '2024-02-01',
    caption: 'Special alumni event',
    tags: ['alumni', 'event', 'celebration']
  },
  {
    id: '12',
    url: 'https://i.imgur.com/YlNQMxk.jpeg',
    alt: 'School Anniversary',
    width: 600,
    height: 900,
    uploadDate: '2024-02-02',
    caption: 'Anniversary celebration',
    tags: ['anniversary', 'celebration', 'milestone']
  },
  {
    id: '13',
    url: 'https://i.imgur.com/XGEojzb.jpeg',
    alt: 'Student Performance',
    width: 900,
    height: 600,
    uploadDate: '2024-02-03',
    caption: 'Cultural performance',
    tags: ['performance', 'culture', 'students']
  },
  {
    id: '14',
    url: 'https://i.imgur.com/arMNV9Z.jpeg',
    alt: 'Academic Excellence',
    width: 800,
    height: 1200,
    uploadDate: '2024-02-04',
    caption: 'Excellence in academics',
    tags: ['academic', 'excellence', 'achievement']
  },
  {
    id: '15',
    url: 'https://i.imgur.com/PWrdABK.jpeg',
    alt: 'Campus Life',
    width: 1200,
    height: 800,
    uploadDate: '2024-02-05',
    caption: 'Vibrant campus life',
    tags: ['campus', 'life', 'students']
  },
  {
    id: '16',
    url: 'https://i.postimg.cc/MHkXF7J6/IMG-0620.jpg',
    alt: 'CPSCS Memories',
    width: 750,
    height: 1000,
    uploadDate: '2024-02-06',
    caption: 'Precious memories',
    tags: ['memories', 'nostalgia', 'moments']
  },
  {
    id: '17',
    url: 'https://i.postimg.cc/7LW5gvBT/IMG-0634.jpg',
    alt: 'School Activities',
    width: 900,
    height: 675,
    uploadDate: '2024-02-07',
    caption: 'Dynamic school activities',
    tags: ['activities', 'school', 'engagement']
  },
  {
    id: '18',
    url: 'https://i.postimg.cc/HLxJcWtg/IMG-0758.jpg',
    alt: 'Educational Excellence',
    width: 800,
    height: 1067,
    uploadDate: '2024-02-08',
    caption: 'Educational excellence',
    tags: ['education', 'excellence', 'learning']
  },
  {
    id: '19',
    url: 'https://i.postimg.cc/PJmNsCdm/IMG-2939.jpg',
    alt: 'Alumni Reunion',
    width: 1200,
    height: 900,
    uploadDate: '2024-02-09',
    caption: 'Alumni reunion celebration',
    tags: ['alumni', 'reunion', 'celebration']
  },
  {
    id: '20',
    url: 'https://i.postimg.cc/BQ0X5BCN/IMG-2944.jpg',
    alt: 'School Pride',
    width: 700,
    height: 933,
    uploadDate: '2024-02-10',
    caption: 'Pride of CPSCS',
    tags: ['pride', 'school', 'achievement']
  },
  {
    id: '21',
    url: 'https://i.postimg.cc/SsYJdZ51/IMG-2959.jpg',
    alt: 'Academic Journey',
    width: 900,
    height: 1200,
    uploadDate: '2024-02-11',
    caption: 'Academic journey',
    tags: ['academic', 'journey', 'growth']
  },
  {
    id: '22',
    url: 'https://i.postimg.cc/sD41TG6z/IMG-2964.jpg',
    alt: 'CPSCS Legacy',
    width: 1000,
    height: 750,
    uploadDate: '2024-02-12',
    caption: 'Legacy continues',
    tags: ['legacy', 'tradition', 'continuity']
  }
];

class GalleryService {
  private adminApiUrl = '/api/gallery';
  private allImages = SAMPLE_IMAGES;

  async getGalleryImages(filters?: SearchFilters): Promise<GalleryImage[]> {
    try {
      const response = await fetch(this.adminApiUrl);
      if (response.ok) {
        const data = await response.json();
        this.allImages = data.images || SAMPLE_IMAGES;
      }
    } catch (error) {
      console.log('Admin API not available, using sample images');
    }
    
    return this.filterAndSortImages(this.allImages, filters);
  }

  private filterAndSortImages(images: GalleryImage[], filters?: SearchFilters): GalleryImage[] {
    let filteredImages = [...images];

    if (filters?.query) {
      const query = filters.query.toLowerCase();
      filteredImages = filteredImages.filter(image => 
        image.caption?.toLowerCase().includes(query) ||
        image.alt.toLowerCase().includes(query) ||
        image.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    if (filters?.tags?.length) {
      filteredImages = filteredImages.filter(image =>
        filters.tags!.some(filterTag => 
          image.tags?.some(imageTag => imageTag.toLowerCase().includes(filterTag.toLowerCase()))
        )
      );
    }

    if (filters?.dateRange) {
      filteredImages = filteredImages.filter(image => {
        const imageDate = new Date(image.uploadDate);
        const startDate = new Date(filters.dateRange!.start);
        const endDate = new Date(filters.dateRange!.end);
        return imageDate >= startDate && imageDate <= endDate;
      });
    }

    // Sort images
    if (filters?.sortBy) {
      filteredImages.sort((a, b) => {
        const dateA = new Date(a.uploadDate);
        const dateB = new Date(b.uploadDate);
        
        if (filters.sortBy === 'newest') {
          return dateB.getTime() - dateA.getTime();
        } else {
          return dateA.getTime() - dateB.getTime();
        }
      });
    }

    return filteredImages;
  }

  async getAllTags(): Promise<string[]> {
    const allTags = new Set<string>();
    this.allImages.forEach(image => {
      image.tags?.forEach(tag => allTags.add(tag));
    });
    return Array.from(allTags).sort();
  }

  async getImageMetadata(url: string): Promise<{ width: number; height: number } | null> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.naturalWidth, height: img.naturalHeight });
      };
      img.onerror = () => {
        resolve(null);
      };
      img.src = url;
    });
  }

  async uploadImage(file: File, metadata: Partial<GalleryImage>): Promise<GalleryImage> {
    throw new Error('Upload functionality not yet implemented');
  }

  async deleteImage(id: string): Promise<boolean> {
    throw new Error('Delete functionality not yet implemented');
  }
}

export const galleryService = new GalleryService();
