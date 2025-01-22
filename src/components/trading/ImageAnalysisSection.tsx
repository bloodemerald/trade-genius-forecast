import { motion } from "framer-motion";
import { Brain, Camera, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TradingData, AIResponse } from "@/types/trading";
import html2canvas from "html2canvas";
import { toast } from "sonner";

interface ImageAnalysisSectionProps {
  loading: boolean;
  aiResponse: AIResponse;
  onAnalysisComplete: (data: TradingData) => void;
  onGetAISuggestion: () => void;
}

export const ImageAnalysisSection = ({
  loading,
  aiResponse,
  onAnalysisComplete,
  onGetAISuggestion
}: ImageAnalysisSectionProps) => {
  const captureChart = async () => {
    try {
      const chartElement = document.querySelector('#trading-chart-container') as HTMLElement;
      if (!chartElement) {
        toast.error("Chart not found. Please wait for it to load.");
        return;
      }

      const canvas = await html2canvas(chartElement);
      const imageData = canvas.toDataURL('image/jpeg', 0.8);
      onAnalysisComplete({
        symbol: "ANALYZING",
        tokenAddress: null,
        price: [0, 0, 0, 0],
        volume: 0,
        indicators: {
          EMA_9: 0,
          MA_10: 0,
          MACD: [0, 0, 0],
          RSI_14: 0
        }
      });

      // Process the captured image through the AI analysis
      const response = await fetch(imageData);
      const blob = await response.blob();
      const file = new File([blob], "chart-snapshot.jpg", { type: "image/jpeg" });
      
      const reader = new FileReader();
      reader.onload = async (e) => {
        if (e.target?.result) {
          onAnalysisComplete({
            symbol: "ANALYZING",
            tokenAddress: null,
            price: [0, 0, 0, 0],
            volume: 0,
            indicators: {
              EMA_9: 0,
              MA_10: 0,
              MACD: [0, 0, 0],
              RSI_14: 0
            }
          });
          onGetAISuggestion();
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error capturing chart:', error);
      toast.error("Failed to capture chart. Please try again.");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="absolute top-4 right-4 z-10"
    >
      <Button
        onClick={captureChart}
        disabled={loading}
        size="icon"
        variant="ghost"
        className="bg-trading-card/50 hover:bg-trading-card/80 backdrop-blur-sm transition-all duration-300 group"
      >
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin text-trading-accent" />
        ) : (
          <Brain className="h-5 w-5 text-trading-accent transition-transform group-hover:scale-110" />
        )}
      </Button>

      {aiResponse.suggestion && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="mt-4 p-4 rounded-lg bg-trading-card/90 backdrop-blur-sm border border-trading-border w-64"
        >
          <p className="text-sm text-[#D6BCFA] leading-relaxed">{aiResponse.suggestion}</p>
        </motion.div>
      )}
    </motion.div>
  );
};