import React, { useState, useRef, useCallback } from 'react';
import ReactCrop, { type Crop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Upload, X, User } from 'lucide-react';
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

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number,
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  )
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
  
  // Cropping states for profile photos
  const [isOpen, setIsOpen] = useState(false);
  const [imgSrc, setImgSrc] = useState('');
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<Crop>();
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [aspect, setAspect] = useState<number | undefined>(type === 'profile' ? 1 : undefined);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file format
    if (!EnhancedImageCompressionService.isValidImageFormat(file)) {
      toast({
        variant: "destructive",
        title: "Invalid File Format",
        description: "Please select a valid image file (JPG, PNG, HEIF)."
      });
      return;
    }

    // Validate file size (2MB limit for both profile and document)
    const sizeLimit = 2;
    if (!EnhancedImageCompressionService.isFileSizeValid(file, sizeLimit)) {
      toast({
        variant: "destructive",
        title: "File Too Large",
        description: `Please select an image under ${sizeLimit}MB.`
      });
      return;
    }

    if (type === 'profile') {
      // For profile photos, open cropping dialog
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImgSrc(reader.result?.toString() || '');
        setIsOpen(true);
      });
      reader.readAsDataURL(file);
    } else {
      // For documents, process directly
      try {
        setIsProcessing(true);
        const compressedFile = await EnhancedImageCompressionService.compressProofDocument(file);
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
    }
  };

  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    if (aspect) {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, aspect));
    }
  }, [aspect]);

  const getCroppedImg = useCallback(async () => {
    const image = imgRef.current;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!image || !ctx || !completedCrop) {
      return;
    }

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    // Set canvas size to 300x300 for compression
    canvas.width = 300;
    canvas.height = 300;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const cropX = completedCrop.x * scaleX;
    const cropY = completedCrop.y * scaleY;
    const cropWidth = completedCrop.width * scaleX;
    const cropHeight = completedCrop.height * scaleY;

    ctx.drawImage(
      image,
      cropX,
      cropY,
      cropWidth,
      cropHeight,
      0,
      0,
      300,
      300
    );

    return new Promise<string>((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
          }
        },
        'image/jpeg',
        0.85 // High quality compression
      );
    });
  }, [completedCrop]);

  const handleCropComplete = async () => {
    const croppedImageUrl = await getCroppedImg();
    if (croppedImageUrl) {
      setSelectedImage(croppedImageUrl);
      onImageSelect(croppedImageUrl);
      setIsOpen(false);
      setImgSrc('');
      toast({
        title: "Profile photo updated",
        description: "Your profile photo has been cropped and compressed successfully.",
      });
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
    <div className={`space-y-4 ${className}`}>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
        {subtitle && (
          <p className="text-sm text-muted-foreground leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center gap-6">
        {type === 'profile' && (
          <div className="relative group">
            <Avatar className="w-24 h-24 border-4 border-primary/20 hover:border-primary/40 transition-all duration-300">
              <AvatarImage src={selectedImage || undefined} className="object-cover" />
              <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70">
                <User className="h-8 w-8 text-white" />
              </AvatarFallback>
            </Avatar>
            
            <Button
              size="sm"
              variant="outline"
              onClick={triggerFileInput}
              disabled={isProcessing}
              className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0 border-primary bg-background hover:bg-primary hover:text-white"
            >
              <Camera className="h-4 w-4" />
            </Button>
          </div>
        )}

        <div className="flex-1 space-y-3">
          {type === 'profile' && (
            <div className="space-y-3">
              <Button
                type="button"
                variant="outline"
                onClick={triggerFileInput}
                disabled={isProcessing}
                className="w-full h-11 md:h-12 text-sm md:text-base font-medium"
              >
                <Upload className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                {isProcessing ? 'Processing...' : selectedImage ? 'Change Profile Photo' : 'Upload Image'}
              </Button>
              
              {selectedImage && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={removeImage}
                  className="w-full h-10 text-sm"
                >
                  <X className="h-4 w-4 mr-2" />
                  Remove Photo
                </Button>
              )}
            </div>
          )}

          {selectedImage && type !== 'profile' && (
            <div className="relative inline-block">
              <img
                src={selectedImage}
                alt="Selected proof document"
                className="h-28 w-36 object-cover rounded-lg border-2 border-border shadow-sm"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                onClick={removeImage}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}

          {type !== 'profile' && (
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={triggerFileInput}
                disabled={isProcessing}
                className="flex-1 h-11"
              >
                <Upload className="h-4 w-4 mr-2" />
                {isProcessing ? 'Processing...' : selectedImage ? 'Change Image' : 'Select Image'}
              </Button>

              {selectedImage && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={removeImage}
                  className="px-4"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}

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

      {/* Cropping Dialog for Profile Photos */}
      {type === 'profile' && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="max-w-sm md:max-w-md">
            <DialogHeader>
              <DialogTitle>Crop Your Profile Photo</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              {imgSrc && (
                <div className="flex justify-center">
                  <ReactCrop
                    crop={crop}
                    onChange={(_, percentCrop) => setCrop(percentCrop)}
                    onComplete={(c) => setCompletedCrop(c)}
                    aspect={aspect}
                    className="max-w-full"
                  >
                    <img
                      ref={imgRef}
                      alt="Crop me"
                      src={imgSrc}
                      style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }}
                      onLoad={onImageLoad}
                      className="max-h-64 w-auto rounded-lg"
                    />
                  </ReactCrop>
                </div>
              )}
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCropComplete} disabled={!completedCrop}>
                  Apply Crop
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};