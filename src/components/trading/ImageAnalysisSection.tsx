import { motion } from "framer-motion";
import { Brain, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TradingData, AIResponse } from "@/types/trading";
import html2canvas from "html2canvas";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
      
      // Process the captured image through the AI analysis
      const response = await fetch(imageData);
      const blob = await response.blob();
      const file = new File([blob], "chart-snapshot.jpg", { type: "image/jpeg" });
      
      // Set initial analysis state before processing
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

      // Trigger AI suggestion immediately after setting initial state
      onGetAISuggestion();
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
      className="absolute top-4 right-4 z-10 flex flex-col items-end gap-4"
    >
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={captureChart}
              disabled={loading}
              size="lg"
              variant="ghost"
              className="w-14 h-14 bg-trading-card/50 hover:bg-trading-card/80 backdrop-blur-sm transition-all duration-300 group"
            >
              {loading ? (
                <Loader2 className="h-8 w-8 animate-spin text-trading-accent" />
              ) : (
                <Brain className="h-8 w-8 text-trading-accent transition-transform group-hover:scale-110" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Analyze Chart with AI</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {aiResponse.suggestion && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-md rounded-lg bg-trading-card/90 backdrop-blur-sm border border-trading-border p-4"
        >
          <p className="text-sm text-[#D6BCFA] leading-relaxed">{aiResponse.suggestion}</p>
        </motion.div>
      )}
    </motion.div>
  );
};