import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";

interface ImageUploaderProps {
  onAnalysisComplete: (data: any) => void;
}

/**
 * ImageUploader Component
 * Handles image upload functionality with drag-and-drop and paste support
 * Supports image analysis through Supabase Edge Function
 */
const ImageUploader = ({ onAnalysisComplete }: ImageUploaderProps) => {
  // Track analysis state
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  /**
   * Analyzes the uploaded image using Supabase Edge Function
   * @param imageData - Base64 encoded image data
   */
  const analyzeImage = async (imageData: string) => {
    try {
      setIsAnalyzing(true);
      toast.info('Starting image analysis...');

      // Extract base64 data from data URL
      const base64Data = imageData.split(',')[1];
      
      // Call Supabase Edge Function for analysis
      const { data, error } = await supabase.functions.invoke('analyze-trading', {
        body: { imageData: base64Data }
      });

      if (error) {
        throw error;
      }

      // Validate response structure
      if (!data.symbol || !Array.isArray(data.price) || !data.indicators) {
        throw new Error('Invalid data structure received from AI');
      }

      console.log('Analysis result:', data);
      onAnalysisComplete(data);
      toast.success('Analysis complete!');
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to analyze image');
    } finally {
      setIsAnalyzing(false);
    }
  };

  /**
   * Handles file drop events from react-dropzone
   */
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      // Validate file size (4MB limit)
      if (file.size > 4 * 1024 * 1024) {
        toast.error('Image size must be less than 4MB');
        return;
      }
      
      // Read and process the file
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          analyzeImage(e.target.result as string);
        }
      };
      reader.onerror = () => {
        toast.error('Failed to read image file');
      };
      reader.readAsDataURL(file);
    }
  }, []);

  /**
   * Configure dropzone with file type and size restrictions
   */
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 1,
    maxSize: 4 * 1024 * 1024
  });

  /**
   * Handles paste events for direct image pasting
   */
  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          // Validate file size
          if (file.size > 4 * 1024 * 1024) {
            toast.error('Image size must be less than 4MB');
            return;
          }
          
          // Process pasted image
          const reader = new FileReader();
          reader.onload = (e) => {
            if (e.target?.result) {
              analyzeImage(e.target.result as string);
            }
          };
          reader.onerror = () => {
            toast.error('Failed to read pasted image');
          };
          reader.readAsDataURL(file);
        }
      }
    }
  }, []);

  return (
    <div 
      className="w-full"
      onPaste={handlePaste}
    >
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary'}`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          {isAnalyzing ? 'Analyzing...' : 'Drop a trading chart screenshot here, or click to select'}
        </p>
        <p className="text-xs text-gray-500 mt-1">You can also paste (Ctrl+V) a screenshot</p>
      </div>
    </div>
  );
};

export default ImageUploader;