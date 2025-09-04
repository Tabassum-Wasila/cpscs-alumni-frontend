import imageCompression from 'browser-image-compression';

/**
 * Enhanced image compression service using browser-image-compression
 * Provides efficient compression for profile photos and proof documents
 */

export interface EnhancedCompressionOptions {
  maxSizeMB: number;
  maxWidthOrHeight?: number;
  useWebWorker?: boolean;
  quality?: number;
  fileType?: string;
}

export class EnhancedImageCompressionService {
  private static readonly PROFILE_PHOTO_OPTIONS: EnhancedCompressionOptions = {
    maxSizeMB: 0.1, // 100KB
    maxWidthOrHeight: 512,
    useWebWorker: true,
    quality: 0.8,
    fileType: 'image/jpeg'
  };

  private static readonly PROOF_DOCUMENT_OPTIONS: EnhancedCompressionOptions = {
    maxSizeMB: 0.3, // 300KB
    maxWidthOrHeight: 1024,
    useWebWorker: true,
    quality: 0.85,
    fileType: 'image/jpeg'
  };

  /**
   * Compress profile photo to optimal size for avatars
   */
  static async compressProfilePhoto(file: File): Promise<File> {
    try {
      console.log(`Compressing profile photo: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);
      
      const compressedFile = await imageCompression(file, this.PROFILE_PHOTO_OPTIONS);
      
      console.log(`Profile photo compressed to: ${(compressedFile.size / 1024).toFixed(2)}KB`);
      return compressedFile;
    } catch (error) {
      console.error('Profile photo compression failed:', error);
      throw new Error('Failed to compress profile photo');
    }
  }

  /**
   * Compress proof document image to reasonable size
   */
  static async compressProofDocument(file: File): Promise<File> {
    try {
      console.log(`Compressing proof document: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);
      
      const compressedFile = await imageCompression(file, this.PROOF_DOCUMENT_OPTIONS);
      
      console.log(`Proof document compressed to: ${(compressedFile.size / 1024).toFixed(2)}KB`);
      return compressedFile;
    } catch (error) {
      console.error('Proof document compression failed:', error);
      throw new Error('Failed to compress proof document');
    }
  }

  /**
   * Generic image compression with custom options
   */
  static async compressImage(file: File, options: Partial<EnhancedCompressionOptions> = {}): Promise<File> {
    try {
      const defaultOptions = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
        quality: 0.8,
        fileType: 'image/jpeg'
      };

      const compressionOptions = { ...defaultOptions, ...options };
      
      console.log(`Compressing image: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);
      
      const compressedFile = await imageCompression(file, compressionOptions);
      
      console.log(`Image compressed to: ${(compressedFile.size / 1024).toFixed(2)}KB`);
      return compressedFile;
    } catch (error) {
      console.error('Image compression failed:', error);
      throw new Error('Failed to compress image');
    }
  }

  /**
   * Convert file to base64 string
   */
  static async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to convert file to base64'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }

  /**
   * Validate if file is a supported image format
   */
  static isValidImageFormat(file: File): boolean {
    const supportedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/heif', 'image/heic'];
    return supportedFormats.includes(file.type.toLowerCase());
  }

  /**
   * Check if file size is within limits
   */
  static isFileSizeValid(file: File, maxSizeMB: number = 2): boolean {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes;
  }
}