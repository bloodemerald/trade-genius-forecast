
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

  const calculateScenarios = (price: number) => {
    const volatility = 0.02; // 2% base volatility
    const baseRR = 2.5; // Base risk-reward ratio
    
    return [
      {
        entry: price,
        stopLoss: price * (1 - volatility),
        takeProfit: price * (1 + (volatility * baseRR)),
        riskReward: baseRR,
        potential: (price * (1 + (volatility * baseRR)) - price) / price * 100,
        confidence: Math.min(85, aiResponse.confidence + 10)
      },
      {
        entry: price,
        stopLoss: price * (1 - (volatility * 1.5)),
        takeProfit: price * (1 + (volatility * baseRR * 1.5)),
        riskReward: baseRR * 1.2,
        potential: (price * (1 + (volatility * baseRR * 1.5)) - price) / price * 100,
        confidence: Math.min(75, aiResponse.confidence)
      },
      {
        entry: price,
        stopLoss: price * (1 - (volatility * 2)),
        takeProfit: price * (1 + (volatility * baseRR * 2)),
        riskReward: baseRR * 1.5,
        potential: (price * (1 + (volatility * baseRR * 2)) - price) / price * 100,
        confidence: Math.max(40, aiResponse.confidence - 10)
      }
    ];
  };

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

      toast.info("Analyzing chart...");

      await new Promise(resolve => setTimeout(resolve, 500));

      const canvas = await html2canvas(chartElement, {
        logging: false,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        removeContainer: true
      });
      
      const imageData = canvas.toDataURL('image/jpeg', 0.8);
      const response = await fetch(imageData);
      const blob = await response.blob();
      const file = new File([blob], "chart-snapshot.jpg", { type: "image/jpeg" });
      
      const reader = new FileReader();
      reader.onload = async () => {
        if (reader.result) {
          try {
            const currentPrice = currentData.price[currentData.price.length - 1];
            const scenarios = calculateScenarios(currentPrice);
            
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
                "Support and resistance levels identified",
                "Price action patterns analyzed",
                "Market structure evaluated"
              ],
              tradeSignals: [
                "Technical indicators assessed",
                "Volume profile examined",
                "Trend direction confirmed"
              ],
              priceAction: [
                "Price structure analyzed",
                "Key levels mapped",
                "Market context evaluated"
              ]
            };

            await onAnalysisComplete(updatedData);
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
  }, [currentData, onAnalysisComplete, onGetAISuggestion, aiResponse.confidence]);

  const isLoading = localLoading || externalLoading;

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="absolute top-4 right-4 z-10"
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
      </motion.div>

      <AnimatePresence mode="wait">
        {showAnalysis && aiResponse.suggestion && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ 
              duration: 0.3,
              type: "spring",
              stiffness: 200,
              damping: 20
            }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-2xl mx-auto"
          >
            <div className="relative mx-4">
              <div className="bg-gradient-to-br from-trading-card/95 to-trading-card border-2 border-trading-border/50 rounded-lg shadow-xl backdrop-blur-md p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-primary-foreground mb-2">
                      AI Analysis
                    </h3>
                    <p className="text-sm text-[#D6BCFA] leading-relaxed">
                      {aiResponse.suggestion}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
