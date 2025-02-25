
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

  const calculateScenarios = (price: number, sentiment: number, confidence: number) => {
    const volatility = Math.abs((currentData.price[currentData.price.length - 1] - currentData.price[0]) / currentData.price[0]);
    const baseRR = sentiment > 0 ? 2.5 : 2.0;
    const direction = sentiment > 0 ? 1 : -1;
    
    const scenarios = [
      {
        entry: price,
        stopLoss: price * (1 - (volatility * 0.02 * direction)),
        takeProfit: price * (1 + (volatility * 0.05 * direction)),
        riskReward: baseRR,
        potential: ((price * (1 + (volatility * 0.05 * direction))) - price) / price * 100,
        confidence: Math.min(85, confidence + 10)
      },
      {
        entry: price,
        stopLoss: price * (1 - (volatility * 0.025 * direction)),
        takeProfit: price * (1 + (volatility * 0.0625 * direction)),
        riskReward: baseRR * 1.2,
        potential: ((price * (1 + (volatility * 0.0625 * direction))) - price) / price * 100,
        confidence: Math.min(75, confidence)
      },
      {
        entry: price,
        stopLoss: price * (1 - (volatility * 0.03 * direction)),
        takeProfit: price * (1 + (volatility * 0.075 * direction)),
        riskReward: baseRR * 1.5,
        potential: ((price * (1 + (volatility * 0.075 * direction))) - price) / price * 100,
        confidence: Math.max(40, confidence - 10)
      }
    ];

    return scenarios;
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
            
            // Get AI analysis first
            await onGetAISuggestion();
            
            // Extract support and resistance levels from AI suggestion
            const suggestion = aiResponse.suggestion || '';
            console.log('AI Suggestion:', suggestion); // Debug log
            
            const supportMatch = suggestion.match(/support at \$?(\d+\.?\d*)/i);
            const resistanceMatch = suggestion.match(/resistance at \$?(\d+\.?\d*)/i);
            
            console.log('Support Match:', supportMatch); // Debug log
            console.log('Resistance Match:', resistanceMatch); // Debug log
            
            const supportLevel = supportMatch ? parseFloat(supportMatch[1]) : currentPrice * 0.98;
            const resistanceLevel = resistanceMatch ? parseFloat(resistanceMatch[1]) : currentPrice * 1.02;
            
            // Extract observations from AI suggestion
            const observations = suggestion.split('.').filter(s => s.trim().length > 0);
            
            const updatedData: TradingData = {
              ...currentData,
              chartObservations: [
                supportMatch ? `Support level at $${supportLevel}` : "Support levels analyzed",
                resistanceMatch ? `Resistance level at $${resistanceLevel}` : "Resistance levels analyzed",
                "Market structure evaluated"
              ],
              tradeSignals: observations.slice(0, 3).map(obs => obs.trim()),
              priceAction: [
                `Current price at $${currentPrice}`,
                `Trading ${currentPrice > supportLevel ? 'above' : 'below'} support`,
                `${aiResponse.sentiment > 0 ? 'Bullish' : 'Bearish'} momentum detected`
              ]
            };

            await onAnalysisComplete(updatedData);
            
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
  }, [currentData, onAnalysisComplete, onGetAISuggestion, aiResponse]);

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
