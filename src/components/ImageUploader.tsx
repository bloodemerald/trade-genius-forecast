import React, { useState, useCallback } from 'react';
import { ImageDropzone } from './trading/image-upload/ImageDropzone';
import { ImageProcessor } from './trading/image-upload/ImageProcessor';
import { AnalysisHandler } from './trading/image-upload/AnalysisHandler';

interface ImageUploaderProps {
  onAnalysisComplete: (data: any) => void;
}

/**
 * ImageUploader Component
 * Orchestrates image upload, processing, and analysis
 */
const ImageUploader = ({ onAnalysisComplete }: ImageUploaderProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { processImage } = ImageProcessor({ onProcessComplete: handleProcessComplete });
  const { analyzeImage } = AnalysisHandler({ onAnalysisComplete: handleAnalysisComplete });

  const handleImageSelected = useCallback((file: File) => {
    processImage(file);
  }, []);

  const handleProcessComplete = async (imageData: string) => {
    setIsAnalyzing(true);
    await analyzeImage(imageData);
    setIsAnalyzing(false);
  };

  const handleAnalysisComplete = (data: any) => {
    onAnalysisComplete(data);
  };

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          handleImageSelected(file);
        }
      }
    }
  }, [handleImageSelected]);

  return (
    <div 
      className="w-full"
      onPaste={handlePaste}
    >
      <ImageDropzone
        onImageSelected={handleImageSelected}
        isAnalyzing={isAnalyzing}
      />
    </div>
  );
};

export default ImageUploader;