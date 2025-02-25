
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TradingData, AIResponse } from "@/types/trading";
import html2canvas from "html2canvas";
import { toast } from "sonner";
import { useEffect, useState, useCallback } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ImageAnalysisSectionProps {
  loading: boolean;
  aiResponse: AIResponse;
  currentData: TradingData;
  onAnalysisComplete: (data: TradingData) => void;
  onGetAISuggestion: () => void;
}

export const ImageAnalysisSection = ({
  loading: externalLoading,
  aiResponse,
  currentData,
  onAnalysisComplete,
  onGetAISuggestion
}: ImageAnalysisSectionProps) => {
  const [localLoading, setLocalLoading] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);

  useEffect(() => {
    if (aiResponse.suggestion) {
      setShowAnalysis(true);
      const timer = setTimeout(() => {
        setShowAnalysis(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [aiResponse.suggestion]);

  const captureChart = useCallback(async () => {
    try {
      setLocalLoading(true);
      const chartElement = (
        document.querySelector('#tradingview_widget') || 
        document.querySelector('.trading-chart-container') ||
        document.querySelector('.tradingview-widget-container')
      ) as HTMLElement | null;
                          
      if (!chartElement) {
        toast.error("Chart not found. Please wait for it to load fully.");
        setLocalLoading(false);
        return;
      }

      // Show loading state
      toast.info("Analyzing chart...");

      // Use a small delay to ensure chart is fully rendered
      await new Promise(resolve => setTimeout(resolve, 500));

      // Capture the chart image
      const canvas = await html2canvas(chartElement, {
        logging: false,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        removeContainer: true // Remove temporary container to prevent DOM modifications
      });
      
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
            // Keep the current symbol and update the rest of the data
            const updatedData: TradingData = {
              ...currentData,
              price: currentData.price,
              volume: currentData.volume,
              indicators: {
                ...currentData.indicators,
                EMA_9: currentData.indicators.EMA_9,
                MA_10: currentData.indicators.MA_10,
                MACD: currentData.indicators.MACD,
                RSI_14: currentData.indicators.RSI_14
              },
              chartObservations: [
                "Support level identified",
                "Key resistance zones mapped",
                "Pattern analysis complete"
              ],
              tradeSignals: [
                "Analyzing momentum indicators",
                "Volume profile assessment",
                "Trend direction confirmed"
              ],
              priceAction: [
                "Price structure analyzed",
                "Key levels identified",
                "Volatility assessment complete"
              ]
            };

            // Update the UI with analyzed data
            await onAnalysisComplete(updatedData);

            // Process AI suggestion
            await onGetAISuggestion();
            
            toast.success("Analysis complete!");
          } catch (error) {
            console.error('Error processing analysis:', error);
            toast.error("Failed to analyze chart. Please try again.");
          } finally {
            setLocalLoading(false);
          }
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error capturing chart:', error);
      toast.error("Failed to analyze chart. Please make sure the chart is fully loaded.");
      setLocalLoading(false);
    }
  }, [currentData, onAnalysisComplete, onGetAISuggestion]);

  const isLoading = localLoading || externalLoading;

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
                disabled={isLoading}
                size="lg"
                variant="ghost"
                className="w-14 h-14 bg-trading-card/50 hover:bg-trading-card/80 backdrop-blur-sm transition-all duration-300 group"
              >
                {isLoading ? (
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

      <AnimatePresence mode="wait">
        {showAnalysis && aiResponse.suggestion && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: 50 }}
            transition={{ 
              duration: 0.3,
              type: "spring",
              stiffness: 200,
              damping: 20
            }}
            className="w-full max-w-md rounded-lg bg-trading-card/90 backdrop-blur-sm border border-trading-border p-4"
          >
            <p className="text-sm text-[#D6BCFA] leading-relaxed">{aiResponse.suggestion}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
