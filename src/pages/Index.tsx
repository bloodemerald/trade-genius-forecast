import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeProvider } from "next-themes";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/trading/Header";
import { ImageAnalysisSection } from "@/components/trading/ImageAnalysisSection";
import { TradingCardsGrid } from "@/components/trading/TradingCardsGrid";
import { TradingScenariosSection } from "@/components/trading/TradingScenariosSection";
import { TradingViewChart } from "@/components/trading/TradingViewChart";
import type { TradingData, AIResponse } from "@/types/trading";

const Index = () => {
  const [data, setData] = useState<TradingData>({
    symbol: "SOL/USD",
    tokenAddress: null,
    price: [0, 0, 0, 0],
    volume: 0,
    indicators: {
      EMA_9: 0,
      MA_10: 0,
      MACD: [0, 0, 0],
      RSI_14: 0,
    },
    chartObservations: [],
    tradeSignals: [],
    priceAction: []
  });
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAIResponse] = useState<AIResponse>({
    suggestion: '',
    sentiment: 0,
    confidence: 0
  });
  const { toast } = useToast();

  const calculateScenarios = (currentPrice: number) => {
    if (!currentPrice || isNaN(currentPrice)) {
      return Array(3).fill({
        entry: 0,
        stopLoss: 0,
        takeProfit: 0,
        confidence: 0,
        riskReward: 0,
        potential: 0
      });
    }

    const volatility = Math.abs(data.price[1] - data.price[2]) / data.price[3] * 100;
    const averageVolume = data.volume;
    const isOverbought = data.indicators.RSI_14 > 70;
    const isOversold = data.indicators.RSI_14 < 30;
    const trendStrength = Math.abs(data.indicators.MACD[2]);
    
    const riskMultiplier = isOversold ? 0.8 : isOverbought ? 1.2 : 1;
    const rewardMultiplier = trendStrength > 0.005 ? 1.5 : 1;
    
    const rsiConfidence = data.indicators.RSI_14 > 70 || data.indicators.RSI_14 < 30 ? 30 : 20;
    const macdConfidence = trendStrength > 0.005 ? 30 : 20;
    const volumeConfidence = data.volume > 100000 ? 20 : 10;
    
    return [
      {
        entry: currentPrice,
        stopLoss: currentPrice * (1 - volatility * 0.5 * riskMultiplier / 100),
        takeProfit: currentPrice * (1 + volatility * 1.25 * rewardMultiplier / 100),
        confidence: Math.min(85, rsiConfidence + macdConfidence + volumeConfidence),
        get riskReward() {
          return (this.takeProfit - this.entry) / (this.entry - this.stopLoss);
        },
        get potential() {
          return ((this.takeProfit - this.entry) / this.entry) * 100;
        }
      },
      {
        entry: currentPrice,
        stopLoss: currentPrice * (1 - volatility * 0.75 * riskMultiplier / 100),
        takeProfit: currentPrice * (1 + volatility * 2.25 * rewardMultiplier / 100),
        confidence: Math.min(75, rsiConfidence + macdConfidence + volumeConfidence - 10),
        get riskReward() {
          return (this.takeProfit - this.entry) / (this.entry - this.stopLoss);
        },
        get potential() {
          return ((this.takeProfit - this.entry) / this.entry) * 100;
        }
      },
      {
        entry: currentPrice,
        stopLoss: currentPrice * (1 - volatility * riskMultiplier / 100),
        takeProfit: currentPrice * (1 + volatility * 3.375 * rewardMultiplier / 100),
        confidence: Math.min(65, rsiConfidence + macdConfidence + volumeConfidence - 20),
        get riskReward() {
          return (this.takeProfit - this.entry) / (this.entry - this.stopLoss);
        },
        get potential() {
          return ((this.takeProfit - this.entry) / this.entry) * 100;
        }
      }
    ];
  };

  const scenarios = calculateScenarios(data.price[3]);

  const getAISuggestion = async () => {
    setLoading(true);
    try {
      const { data: aiData, error } = await supabase.functions.invoke('ai-trading-analysis', {
        body: {
          marketData: {
            symbol: data.symbol,
            price: data.price,
            volume: data.volume,
            indicators: data.indicators,
            priceChange: calculateChange(data.price[3], data.price[0])
          }
        }
      });

      if (error) throw error;
      setAIResponse(aiData);
    } catch (error) {
      console.error('Error getting AI suggestion:', error);
      toast({
        title: "Error",
        description: "Failed to get AI trading suggestion. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateChange = (current: number, previous: number) => {
    return ((current - previous) / previous) * 100;
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background text-foreground p-8 transition-colors duration-300"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto space-y-8"
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Header symbol={data.symbol} />
          </motion.div>
          
          <ImageAnalysisSection
            loading={loading}
            aiResponse={aiResponse}
            onAnalysisComplete={setData}
            onGetAISuggestion={getAISuggestion}
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <TradingViewChart symbol={data.symbol} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <TradingCardsGrid
              currentPrice={data.price[3]}
              previousPrice={data.price[0]}
              volume={data.volume}
              rsi={data.indicators.RSI_14}
              sentiment={aiResponse.sentiment}
              aiAnalysis={{
                chartObservations: data.chartObservations,
                tradeSignals: data.tradeSignals,
                priceAction: data.priceAction
              }}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <TradingScenariosSection 
              scenarios={scenarios}
              confidence={aiResponse.confidence || 0}
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </ThemeProvider>
  );
};

export default Index;