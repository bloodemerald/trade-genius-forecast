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

  useEffect(() => {
    const storedKey = localStorage.getItem('GEMINI_API_KEY');
    if (!storedKey) {
      localStorage.setItem('GEMINI_API_KEY', 'AIzaSyBHjClGIarRwpPH06imDJ43eSGU2rTIC6E');
      toast.success('API key loaded');
    }
  }, []);

  const analyzeImage = async (imageData: string) => {
    try {
      setIsAnalyzing(true);
      toast.info('Starting image analysis...');

      const apiKey = localStorage.getItem('GEMINI_API_KEY');
      if (!apiKey) {
        throw new Error('API key not found');
      }

      // Remove the data URL prefix to get just the base64 data
      const base64Data = imageData.split(',')[1];
      
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

      const prompt = `
        Analyze this trading chart screenshot and provide the following data in a strict JSON format:
        {
          "symbol": "string (e.g., 'BTC/USD')",
          "price": [number, number, number, number] (open, high, low, close),
          "volume": number (24h volume),
          "indicators": {
            "EMA_9": number,
            "MA_10": number,
            "MACD": [number, number, number],
            "RSI_14": number
          }
        }
        Only return the JSON data, no additional text.
      `;

      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            data: base64Data,
            mimeType: "image/jpeg"
          }
        }
      ]);

      const response = await result.response;
      const text = response.text();
      
      try {
        // Clean the response text to ensure it only contains valid JSON
        const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
        const parsedData = JSON.parse(cleanedText);
        
        // Validate the parsed data structure
        if (!parsedData.symbol || !Array.isArray(parsedData.price) || !parsedData.indicators) {
          throw new Error('Invalid data structure received from AI');
        }

        onAnalysisComplete(parsedData);
        toast.success('Analysis complete!');
      } catch (parseError) {
        console.error('Parse error:', parseError);
        console.log('Raw AI response:', text);
        toast.error('Failed to parse AI response. Please try another image.');
      }
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to analyze image');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        toast.error('Image size must be less than 4MB');
        return;
      }
      
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

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 1,
    maxSize: 4 * 1024 * 1024
  });

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          if (file.size > 4 * 1024 * 1024) {
            toast.error('Image size must be less than 4MB');
            return;
          }
          
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