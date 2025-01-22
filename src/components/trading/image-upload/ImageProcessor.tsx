import React from 'react';
import { toast } from 'sonner';

interface ImageProcessorProps {
  onProcessComplete: (imageData: string) => void;
}

/**
 * ImageProcessor Component
 * Handles image validation and processing
 */
export const ImageProcessor = ({ onProcessComplete }: ImageProcessorProps) => {
  const processImage = (file: File) => {
    // Validate file size (4MB limit)
    if (file.size > 4 * 1024 * 1024) {
      toast.error('Image size must be less than 4MB');
      return;
    }
    
    // Read and process the file
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        onProcessComplete(e.target.result as string);
      }
    };
    reader.onerror = () => {
      toast.error('Failed to read image file');
    };
    reader.readAsDataURL(file);
  };

  return {
    processImage
  };
};