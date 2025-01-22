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
      className="backdrop-blur-lg bg-[#1A1F2C]/50 rounded-2xl p-6 border border-[#9b87f5]/20 relative overflow-hidden group hover:border-[#9b87f5]/40 transition-all duration-300"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#9b87f5]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <h2 className="text-xl font-semibold mb-4 text-[#9b87f5] relative z-10">AI Analysis</h2>
      <div className="relative z-10 space-y-4">
        <div className="flex gap-4">
          <Button
            onClick={captureChart}
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-[#9b87f5] to-[#8b77e5] hover:from-[#8b77e5] hover:to-[#7a66d4] text-white shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                <span>Analyzing Chart...</span>
              </>
            ) : (
              <>
                <Camera className="mr-2 h-5 w-5" />
                <span>Take Chart Snapshot</span>
              </>
            )}
          </Button>

          <Button
            onClick={onGetAISuggestion}
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-[#9b87f5] to-[#8b77e5] hover:from-[#8b77e5] hover:to-[#7a66d4] text-white shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                <span>Getting AI Insights...</span>
              </>
            ) : (
              <>
                <Brain className="mr-2 h-5 w-5" />
                <span>Get AI Trading Suggestion</span>
              </>
            )}
          </Button>
        </div>

        {aiResponse.suggestion && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="p-4 rounded-lg bg-[#1A1F2C]/50 border border-[#9b87f5]/20 relative z-10"
          >
            <p className="text-sm text-[#D6BCFA] leading-relaxed">{aiResponse.suggestion}</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};