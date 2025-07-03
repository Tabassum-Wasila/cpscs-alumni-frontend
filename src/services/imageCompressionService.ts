
/**
 * Advanced image compression service for social media posts
 * Compresses images to under 500KB while maintaining aspect ratio
 */

export interface CompressionOptions {
  maxSizeKB: number;
  quality: number;
  maxWidth?: number;
  maxHeight?: number;
}

export class ImageCompressionService {
  private static readonly DEFAULT_OPTIONS: CompressionOptions = {
    maxSizeKB: 500,
    quality: 0.5,
    maxWidth: 1920,
    maxHeight: 1080
  };

  /**
   * Compress image file to specified size while maintaining aspect ratio
   */
  static async compressImage(
    file: File, 
    options: Partial<CompressionOptions> = {}
  ): Promise<File> {
    const opts = { ...this.DEFAULT_OPTIONS, ...options };
    
    console.log(`Starting compression for ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);
    
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      img.onload = () => {
        try {
          // Calculate new dimensions while maintaining aspect ratio
          const { width, height } = this.calculateDimensions(
            img.naturalWidth, 
            img.naturalHeight, 
            opts.maxWidth!, 
            opts.maxHeight!
          );
          
          canvas.width = width;
          canvas.height = height;
          
          // Draw and compress image
          ctx.drawImage(img, 0, 0, width, height);
          
          // Convert to blob with compression
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Failed to compress image'));
                return;
              }
              
              const compressedSize = blob.size / 1024; // KB
              console.log(`Compressed to ${compressedSize.toFixed(2)}KB`);
              
              // Create new File object
              const compressedFile = new File(
                [blob], 
                this.generateFileName(file.name), 
                { type: 'image/jpeg' }
              );
              
              resolve(compressedFile);
            },
            'image/jpeg',
            opts.quality
          );
        } catch (error) {
          reject(error);
        }
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Calculate new dimensions while maintaining aspect ratio
   */
  private static calculateDimensions(
    originalWidth: number, 
    originalHeight: number, 
    maxWidth: number, 
    maxHeight: number
  ): { width: number; height: number } {
    let { width, height } = { width: originalWidth, height: originalHeight };
    
    // Scale down if too large
    if (width > maxWidth) {
      height = Math.round((height * maxWidth) / width);
      width = maxWidth;
    }
    
    if (height > maxHeight) {
      width = Math.round((width * maxHeight) / height);
      height = maxHeight;
    }
    
    return { width, height };
  }

  /**
   * Generate compressed file name
   */
  private static generateFileName(originalName: string): string {
    const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '');
    return `${nameWithoutExt}_compressed.jpg`;
  }

  /**
   * Validate if file is an image
   */
  static isValidImage(file: File): boolean {
    return file.type.startsWith('image/');
  }

  /**
   * Get image dimensions without loading full image
   */
  static getImageDimensions(file: File): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }
}
