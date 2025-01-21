import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { toast } from 'sonner';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface ImageUploaderProps {
  onAnalysisComplete: (data: any) => void;
}

const ImageUploader = ({ onAnalysisComplete }: ImageUploaderProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Set the API key in localStorage when component mounts
  useEffect(() => {
    const storedKey = localStorage.getItem('GEMINI_API_KEY');
    if (!storedKey) {
      localStorage.setItem('GEMINI_API_KEY', 'AIzaSyBHjClGIarRwpPH06imDJ43eSGU2rTIC6E');
      toast.success('API key saved to localStorage');
    }
  }, []);

  const analyzeImage = async (imageData: string) => {
    try {
      setIsAnalyzing(true);
      const genAI = new GoogleGenerativeAI(localStorage.getItem('GEMINI_API_KEY') || '');
      const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

      const prompt = "Analyze this trading chart screenshot and extract the following data in JSON format: symbol, price array [open, high, low, close], 24h volume, and technical indicators (EMA_9, MA_10, MACD array, RSI_14). Include only the JSON data in your response.";

      const result = await model.generateContent([prompt, { inlineData: { data: imageData, mimeType: "image/jpeg" } }]);
      const response = await result.response;
      const text = response.text();
      
      try {
        const parsedData = JSON.parse(text);
        onAnalysisComplete(parsedData);
        toast.success('Analysis complete!');
      } catch (e) {
        toast.error('Failed to parse AI response');
      }
    } catch (error) {
      toast.error('Failed to analyze image');
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          analyzeImage(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 1
  });

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            if (e.target?.result) {
              analyzeImage(e.target.result as string);
            }
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