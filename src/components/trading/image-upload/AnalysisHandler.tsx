import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';

interface AnalysisHandlerProps {
  onAnalysisComplete: (data: any) => void;
}

/**
 * AnalysisHandler Component
 * Handles the analysis logic and API calls
 */
export const AnalysisHandler = ({ onAnalysisComplete }: AnalysisHandlerProps) => {
  const analyzeImage = async (imageData: string) => {
    try {
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
    }
  };

  return {
    analyzeImage
  };
};