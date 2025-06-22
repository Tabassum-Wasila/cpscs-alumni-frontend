
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

// Sample fallback images with your provided URLs
const SAMPLE_IMAGES: GalleryImage[] = [
  {
    id: '1',
    url: 'https://i.imgur.com/dvKB1GO.jpg',
    alt: 'CPSCS Alumni Memory',
    width: 800,
    height: 600,
    uploadDate: '2024-01-01',
    caption: 'Alumni gathering'
  },
  {
    id: '2',
    url: 'https://i.imgur.com/ug6dvbR.jpg',
    alt: 'School campus view',
    width: 600,
    height: 800,
    uploadDate: '2024-01-02',
    caption: 'Campus memories'
  },
  {
    id: '3',
    url: 'https://i.imgur.com/zPm782I.jpg',
    alt: 'Student activities',
    width: 800,
    height: 600,
    uploadDate: '2024-01-03',
    caption: 'Student life'
  },
  {
    id: '4',
    url: 'https://i.imgur.com/j75BIZN.jpg',
    alt: 'Academic achievements',
    width: 600,
    height: 900,
    uploadDate: '2024-01-04',
    caption: 'Academic excellence'
  },
  {
    id: '5',
    url: 'https://i.imgur.com/BcF7rBZ.jpg',
    alt: 'Sports activities',
    width: 800,
    height: 600,
    uploadDate: '2024-01-05',
    caption: 'Sports and activities'
  },
  {
    id: '6',
    url: 'https://i.imgur.com/WtfTf9U.jpg',
    alt: 'Cultural events',
    width: 700,
    height: 800,
    uploadDate: '2024-01-06',
    caption: 'Cultural celebrations'
  },
  {
    id: '7',
    url: 'https://i.imgur.com/JRSeRaX.jpg',
    alt: 'Graduation ceremony',
    width: 800,
    height: 600,
    uploadDate: '2024-01-07',
    caption: 'Graduation day'
  },
  {
    id: '8',
    url: 'https://i.imgur.com/CoqSTIF.jpg',
    alt: 'Alumni success stories',
    width: 600,
    height: 800,
    uploadDate: '2024-01-08',
    caption: 'Success stories'
  },
  {
    id: '9',
    url: 'https://i.imgur.com/JYNxmqf.jpg',
    alt: 'School heritage',
    width: 800,
    height: 500,
    uploadDate: '2024-01-09',
    caption: 'Heritage and tradition'
  },
  {
    id: '10',
    url: 'https://i.imgur.com/nwn1g7L.jpg',
    alt: 'Community service',
    width: 700,
    height: 900,
    uploadDate: '2024-01-10',
    caption: 'Community service'
  }
];

class GalleryService {
  private adminApiUrl = '/api/gallery'; // Future admin API endpoint

  async getGalleryImages(): Promise<GalleryImage[]> {
    try {
      // Try to fetch from admin API first (will be implemented later)
      const response = await fetch(this.adminApiUrl);
      if (response.ok) {
        const data = await response.json();
        return data.images || SAMPLE_IMAGES;
      }
    } catch (error) {
      console.log('Admin API not available, using sample images');
    }
    
    // Return sample images as fallback
    return SAMPLE_IMAGES;
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

  // Method for future admin panel integration
  async uploadImage(file: File, metadata: Partial<GalleryImage>): Promise<GalleryImage> {
    // This will be implemented when admin panel is ready
    throw new Error('Upload functionality not yet implemented');
  }

  async deleteImage(id: string): Promise<boolean> {
    // This will be implemented when admin panel is ready
    throw new Error('Delete functionality not yet implemented');
  }
}

export const galleryService = new GalleryService();
