
import React, { useCallback, useState } from 'react';
import { Upload, X, FileText, Image, File, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ImageCompressionService } from '@/services/imageCompressionService';

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  error?: string;
  className?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, error, className }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [processingError, setProcessingError] = useState<string>('');

  const validateFile = (file: File): string | null => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf',
      'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];

    if (file.size > maxSize) {
      return 'File size must be less than 5MB';
    }

    if (!allowedTypes.includes(file.type)) {
      return 'Please upload an image, PDF, or document file';
    }

    return null;
  };

  const processFile = async (file: File) => {
    setProcessingStatus('idle');
    setProcessingError('');

    const validationError = validateFile(file);
    if (validationError) {
      setProcessingError(validationError);
      setProcessingStatus('error');
      onFileSelect(null);
      return;
    }

    try {
      setIsProcessing(true);
      setProcessingStatus('processing');
      
      let processedFile = file;
      
      // Compress images
      if (file.type.startsWith('image/')) {
        console.log(`Processing image: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);
        
        processedFile = await ImageCompressionService.compressImage(file, {
          maxSizeKB: 500,
          quality: 0.5,
          maxWidth: 1920,
          maxHeight: 1080
        });
        
        console.log(`Compressed to: ${(processedFile.size / 1024).toFixed(2)}KB`);
      }

      setSelectedFile(processedFile);
      setProcessingStatus('success');
      onFileSelect(processedFile);
      
    } catch (error) {
      console.error('File processing failed:', error);
      setProcessingError('Failed to process file. Please try again.');
      setProcessingStatus('error');
      onFileSelect(null);
    } finally {
      setIsProcessing(false);
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
      processFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setProcessingStatus('idle');
    setProcessingError('');
    onFileSelect(null);
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image className="w-4 h-4" />;
    if (file.type === 'application/pdf') return <FileText className="w-4 h-4" />;
    return <File className="w-4 h-4" />;
  };

  const getStatusIcon = () => {
    switch (processingStatus) {
      case 'processing':
        return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className={cn("w-full", className)}>
      {!selectedFile ? (
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
            dragActive ? "border-cpscs-blue bg-blue-50" : "border-gray-300 hover:border-cpscs-blue",
            error || processingError ? "border-red-300 bg-red-50" : "",
            isProcessing ? "pointer-events-none opacity-75" : ""
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => !isProcessing && document.getElementById('file-upload')?.click()}
        >
          {isProcessing ? (
            <div className="flex flex-col items-center space-y-2">
              <Loader2 className="w-8 h-8 animate-spin text-cpscs-blue" />
              <div className="text-sm font-medium text-cpscs-blue">Processing file...</div>
              <div className="text-xs text-gray-500">Compressing images for optimal upload</div>
            </div>
          ) : (
            <>
              <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <div className="text-sm text-gray-600 mb-2">
                <span className="font-medium text-cpscs-blue">Click to upload</span> or drag and drop
              </div>
              <div className="text-xs text-gray-500">
                Images, PDFs, Documents (Max 5MB, auto-compressed)
              </div>
            </>
          )}
          <input
            id="file-upload"
            type="file"
            className="hidden"
            accept="image/*,.pdf,.doc,.docx,.txt"
            onChange={handleFileInput}
            disabled={isProcessing}
          />
        </div>
      ) : (
        <div className="border rounded-lg p-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {getFileIcon(selectedFile)}
              <div>
                <div className="text-sm font-medium text-gray-900">{selectedFile.name}</div>
                <div className="text-xs text-gray-500 flex items-center space-x-2">
                  <span>{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</span>
                  {getStatusIcon()}
                  {processingStatus === 'success' && selectedFile.type.startsWith('image/') && (
                    <span className="text-green-600">Compressed</span>
                  )}
                </div>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={removeFile}
              className="text-red-500 hover:bg-red-50"
              disabled={isProcessing}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
      {(error || processingError) && (
        <div className="text-sm text-red-600 mt-1 flex items-center space-x-1">
          <AlertCircle className="w-4 h-4" />
          <span>{error || processingError}</span>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
