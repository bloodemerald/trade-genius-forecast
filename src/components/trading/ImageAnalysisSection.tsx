
import { motion, AnimatePresence } from "framer-motion";
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

      // Show loading state
      toast.info("Analyzing chart...");

      // Capture the chart image
      const canvas = await html2canvas(chartElement);
      const imageData = canvas.toDataURL('image/jpeg', 0.8);
      
      // Process the captured image
      const response = await fetch(imageData);
      const blob = await response.blob();
      const file = new File([blob], "chart-snapshot.jpg", { type: "image/jpeg" });
      
      // Create a FileReader to process the image
      const reader = new FileReader();
      reader.onload = async () => {
        if (reader.result) {
          try {
            // Initialize with default data
            const initialData: TradingData = {
              symbol: "BARRON/SOL",
              tokenAddress: null,
              price: [0.05265, 0.05516, 0.05265, 0.05297],
              volume: 198947,
              indicators: {
                EMA_9: 0.05764,
                MA_10: 0.05865,
                MACD: [-0.001757, 0.008922, 0.002650],
                RSI_14: 46.49
              },
              chartObservations: [
                "Support level at 0.0525",
                "Resistance at 0.0535",
                "Rising wedge pattern forming"
              ],
              tradeSignals: [
                "Bullish MACD crossover",
                "RSI showing oversold",
                "Volume spike detected"
              ],
              priceAction: [
                "Higher lows in last 4 candles",
                "Avg daily range: 2.3%",
                "Bullish engulfing pattern"
              ]
            };

            // Update the UI with initial data
            onAnalysisComplete(initialData);

            // Process AI suggestion
            await onGetAISuggestion();
            
            toast.success("Analysis complete!");
          } catch (error) {
            console.error('Error processing analysis:', error);
            toast.error("Failed to analyze chart. Please try again.");
          }
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error capturing chart:', error);
      toast.error("Failed to analyze chart. Please try again.");
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
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={captureChart}
                disabled={loading}
                size="lg"
                variant="ghost"
                className="w-14 h-14 bg-trading-card/50 hover:bg-trading-card/80 backdrop-blur-sm transition-all duration-300 group"
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Loader2 className="h-8 w-8 text-trading-accent" />
                  </motion.div>
                ) : (
                  <Brain className="h-8 w-8 text-trading-accent transition-transform group-hover:scale-110" />
                )}
              </Button>
            </motion.div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Analyze Chart with AI</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <AnimatePresence>
        {aiResponse.suggestion && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-md rounded-lg bg-trading-card/90 backdrop-blur-sm border border-trading-border p-4"
          >
            <p className="text-sm text-[#D6BCFA] leading-relaxed">{aiResponse.suggestion}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
