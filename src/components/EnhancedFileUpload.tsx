
import React, { useCallback, useState } from 'react';
import { Upload, X, Image, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ImageCompressionService } from '@/services/imageCompressionService';

interface EnhancedFileUploadProps {
  onFileSelect: (file: File | null) => void;
  error?: string;
  className?: string;
  maxSizeMB?: number;
  accept?: string;
}

const EnhancedFileUpload: React.FC<EnhancedFileUploadProps> = ({ 
  onFileSelect, 
  error, 
  className,
  maxSizeMB = 5,
  accept = "image/*"
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionStatus, setCompressionStatus] = useState<'idle' | 'compressing' | 'success' | 'error'>('idle');
  const [compressionError, setCompressionError] = useState<string>('');

  const validateAndCompressFile = async (file: File) => {
    // Reset status
    setCompressionStatus('idle');
    setCompressionError('');

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setCompressionError('Please select an image file');
      onFileSelect(null);
      return;
    }

    // Validate file size (before compression)
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      setCompressionError(`File size must be less than ${maxSizeMB}MB`);
      onFileSelect(null);
      return;
    }

    try {
      setIsCompressing(true);
      setCompressionStatus('compressing');
      
      console.log(`Original file: ${file.name} (${fileSizeMB.toFixed(2)}MB)`);
      
      // Compress the image
      const compressedFile = await ImageCompressionService.compressImage(file, {
        maxSizeKB: 500,
        quality: 0.5,
        maxWidth: 1920,
        maxHeight: 1080
      });
      
      const compressedSizeMB = compressedFile.size / (1024 * 1024);
      const compressedSizeKB = compressedFile.size / 1024;
      
      console.log(`Compressed file: ${compressedFile.name} (${compressedSizeKB.toFixed(2)}KB)`);
      
      setSelectedFile(compressedFile);
      setCompressionStatus('success');
      onFileSelect(compressedFile);
      
    } catch (error) {
      console.error('Compression failed:', error);
      setCompressionError('Failed to compress image. Please try another file.');
      setCompressionStatus('error');
      onFileSelect(null);
    } finally {
      setIsCompressing(false);
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndCompressFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndCompressFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setCompressionStatus('idle');
    setCompressionError('');
    onFileSelect(null);
  };

  const getStatusIcon = () => {
    switch (compressionStatus) {
      case 'compressing':
        return <Loader2 className="w-5 h-5 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Image className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusMessage = () => {
    switch (compressionStatus) {
      case 'compressing':
        return 'Compressing image...';
      case 'success':
        return `Compressed to ${(selectedFile!.size / 1024).toFixed(0)}KB`;
      case 'error':
        return compressionError;
      default:
        return '';
    }
  };

  return (
    <div className={cn("w-full", className)}>
      {!selectedFile ? (
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200",
            dragActive ? "border-cpscs-blue bg-blue-50 scale-105" : "border-gray-300 hover:border-cpscs-blue hover:bg-gray-50",
            error || compressionError ? "border-red-300 bg-red-50" : "",
            isCompressing ? "pointer-events-none opacity-75" : ""
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => !isCompressing && document.getElementById('enhanced-file-upload')?.click()}
        >
          <div className="flex flex-col items-center space-y-2">
            {isCompressing ? (
              <Loader2 className="w-8 h-8 animate-spin text-cpscs-blue" />
            ) : (
              <Upload className="w-8 h-8 text-gray-400" />
            )}
            
            <div className="text-sm text-gray-600">
              {isCompressing ? (
                <span className="font-medium text-cpscs-blue">Compressing image...</span>
              ) : (
                <>
                  <span className="font-medium text-cpscs-blue">Click to upload</span> or drag and drop
                </>
              )}
            </div>
            
            <div className="text-xs text-gray-500">
              Images up to {maxSizeMB}MB (auto-compressed to &lt;500KB)
            </div>
          </div>
          
          <input
            id="enhanced-file-upload"
            type="file"
            className="hidden"
            accept={accept}
            onChange={handleFileInput}
            disabled={isCompressing}
          />
        </div>
      ) : (
        <div className="border rounded-lg p-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getStatusIcon()}
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900 truncate">
                  {selectedFile.name}
                </div>
                <div className="text-xs text-gray-500">
                  {getStatusMessage()}
                </div>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={removeFile}
              className="text-red-500 hover:bg-red-50 flex-shrink-0"
              disabled={isCompressing}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          {selectedFile && compressionStatus === 'success' && (
            <div className="mt-3 p-2 bg-green-50 rounded border border-green-200">
              <div className="flex items-center space-x-2 text-xs text-green-700">
                <CheckCircle className="w-4 h-4" />
                <span>
                  Image compressed successfully! 
                  ({((selectedFile.size / 1024)).toFixed(0)}KB, optimized for fast upload)
                </span>
              </div>
            </div>
          )}
        </div>
      )}
      
      {(error || compressionError) && (
        <div className="text-sm text-red-600 mt-2 flex items-center space-x-1">
          <AlertCircle className="w-4 h-4" />
          <span>{error || compressionError}</span>
        </div>
      )}
    </div>
  );
};

export default EnhancedFileUpload;
