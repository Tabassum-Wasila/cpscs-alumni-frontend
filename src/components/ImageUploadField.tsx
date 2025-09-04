import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Upload, X } from 'lucide-react';
import { EnhancedImageCompressionService } from '@/services/enhancedImageCompressionService';
import { toast } from '@/hooks/use-toast';

interface ImageUploadFieldProps {
  onImageSelect: (base64Image: string | null) => void;
  currentImage?: string;
  className?: string;
  title: string;
  subtitle?: string;
  type?: 'profile' | 'document';
  accept?: string;
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  onImageSelect,
  currentImage,
  className = '',
  title,
  subtitle,
  type = 'document',
  accept = 'image/jpeg,image/jpg,image/png,image/heif,image/heic'
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(currentImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessing(true);

      // Validate file format
      if (!EnhancedImageCompressionService.isValidImageFormat(file)) {
        toast({
          variant: "destructive",
          title: "Invalid File Format",
          description: "Please select a valid image file (JPG, PNG, HEIF)."
        });
        return;
      }

      // Validate file size (2MB limit)
      if (!EnhancedImageCompressionService.isFileSizeValid(file, 2)) {
        toast({
          variant: "destructive",
          title: "File Too Large",
          description: "Please select an image under 2MB."
        });
        return;
      }

      // Compress based on type
      let compressedFile: File;
      if (type === 'profile') {
        compressedFile = await EnhancedImageCompressionService.compressProfilePhoto(file);
      } else {
        compressedFile = await EnhancedImageCompressionService.compressProofDocument(file);
      }

      // Convert to base64
      const base64Image = await EnhancedImageCompressionService.fileToBase64(compressedFile);
      
      setSelectedImage(base64Image);
      onImageSelect(base64Image);

      toast({
        title: "Image Uploaded Successfully",
        description: `Compressed to ${(compressedFile.size / 1024).toFixed(0)}KB`
      });

    } catch (error) {
      console.error('Error processing image:', error);
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: "Failed to process the image. Please try again."
      });
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    onImageSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-foreground">{title}</h3>
        {subtitle && (
          <p className="text-xs text-muted-foreground leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center gap-4">
        {type === 'profile' && (
          <Avatar className="h-20 w-20">
            <AvatarImage src={selectedImage || undefined} />
            <AvatarFallback className="bg-muted">
              <Camera className="h-8 w-8 text-muted-foreground" />
            </AvatarFallback>
          </Avatar>
        )}

        <div className="flex-1 space-y-2">
          {selectedImage && type !== 'profile' && (
            <div className="relative inline-block">
              <img
                src={selectedImage}
                alt="Selected proof document"
                className="h-24 w-32 object-cover rounded-md border"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute -top-2 -right-2 h-6 w-6"
                onClick={removeImage}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={triggerFileInput}
              disabled={isProcessing}
              className="flex-1"
            >
              <Upload className="h-4 w-4 mr-2" />
              {isProcessing ? 'Processing...' : selectedImage ? 'Change Image' : 'Select Image'}
            </Button>

            {selectedImage && type === 'profile' && (
              <Button
                type="button"
                variant="outline"
                onClick={removeImage}
                className="px-3"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          <p className="text-xs text-muted-foreground">
            Max 2MB • JPG, PNG, HEIF formats supported
          </p>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};