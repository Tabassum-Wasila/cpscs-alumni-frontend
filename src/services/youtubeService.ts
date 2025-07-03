
/**
 * YouTube integration service for social media posts
 * Handles URL validation, metadata extraction, and video embedding
 */

export interface YouTubeVideoData {
  videoId: string;
  title: string;
  thumbnail: string;
  embedUrl: string;
  isValid: boolean;
}

export class YouTubeService {
  private static readonly API_KEY = 'YOUR_YOUTUBE_API_KEY'; // Replace with actual API key
  private static readonly YOUTUBE_REGEX = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  
  /**
   * Extract video ID from various YouTube URL formats
   */
  static extractVideoId(url: string): string | null {
    try {
      const match = url.match(this.YOUTUBE_REGEX);
      return match ? match[1] : null;
    } catch (error) {
      console.error('Error extracting video ID:', error);
      return null;
    }
  }

  /**
   * Validate YouTube URL and extract video data
   */
  static async validateAndExtractData(url: string): Promise<YouTubeVideoData | null> {
    try {
      const videoId = this.extractVideoId(url);
      
      if (!videoId) {
        console.log('Invalid YouTube URL format');
        return null;
      }

      // For now, use basic data extraction since we don't have API key
      // In production, you would use YouTube Data API v3
      const videoData = await this.getBasicVideoData(videoId);
      
      return {
        videoId,
        title: videoData.title,
        thumbnail: videoData.thumbnail,
        embedUrl: `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&showinfo=0`,
        isValid: true
      };
    } catch (error) {
      console.error('Error validating YouTube URL:', error);
      return null;
    }
  }

  /**
   * Get basic video data without API (fallback method)
   */
  private static async getBasicVideoData(videoId: string): Promise<{ title: string; thumbnail: string }> {
    // Using YouTube's oEmbed API as fallback
    try {
      const response = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
      
      if (response.ok) {
        const data = await response.json();
        return {
          title: data.title || 'YouTube Video',
          thumbnail: data.thumbnail_url || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
        };
      }
    } catch (error) {
      console.error('Error fetching video data:', error);
    }

    // Ultimate fallback
    return {
      title: 'YouTube Video',
      thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    };
  }

  /**
   * Check if URL is a valid YouTube URL
   */
  static isValidYouTubeUrl(url: string): boolean {
    try {
      return this.YOUTUBE_REGEX.test(url);
    } catch (error) {
      return false;
    }
  }

  /**
   * Get video thumbnail URL
   */
  static getThumbnailUrl(videoId: string, quality: 'default' | 'medium' | 'high' | 'maxres' = 'maxres'): string {
    const qualityMap = {
      default: 'default',
      medium: 'mqdefault',
      high: 'hqdefault',
      maxres: 'maxresdefault'
    };
    
    return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality]}.jpg`;
  }

  /**
   * Generate embed URL with custom parameters
   */
  static getEmbedUrl(videoId: string, autoplay: boolean = false): string {
    const params = new URLSearchParams({
      rel: '0',
      modestbranding: '1',
      showinfo: '0',
      fs: '1',
      cc_load_policy: '0',
      iv_load_policy: '3',
      autohide: '0'
    });

    if (autoplay) {
      params.set('autoplay', '1');
    }

    return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
  }
}
