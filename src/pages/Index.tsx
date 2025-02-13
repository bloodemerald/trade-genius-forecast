
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

const initialData: TradingData = {
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
};

const Index = () => {
  const [data, setData] = useState<TradingData>(initialData);
  const [loading, setLoading] = useState(false);
  const [chartLoaded, setChartLoaded] = useState(false);
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
    const trendStrength = Math.abs(data.indicators.MACD[2]);
    const rsiSignal = data.indicators.RSI_14 > 70 ? -1 : data.indicators.RSI_14 < 30 ? 1 : 0;
    
    const scenarios = [
      {
        entry: currentPrice,
        stopLoss: currentPrice * (1 - volatility * 0.5 / 100),
        takeProfit: currentPrice * (1 + volatility * 1.5 / 100),
        confidence: 20,
        get riskReward() {
          return Math.abs((this.takeProfit - this.entry) / (this.entry - this.stopLoss));
        },
        get potential() {
          return ((this.takeProfit - this.entry) / this.entry) * 100;
        }
      },
      {
        entry: currentPrice,
        stopLoss: currentPrice * (1 - volatility * 0.75 / 100),
        takeProfit: currentPrice * (1 + volatility * 2.25 / 100),
        confidence: 20,
        get riskReward() {
          return Math.abs((this.takeProfit - this.entry) / (this.entry - this.stopLoss));
        },
        get potential() {
          return ((this.takeProfit - this.entry) / this.entry) * 100;
        }
      },
      {
        entry: currentPrice,
        stopLoss: currentPrice * (1 - volatility / 100),
        takeProfit: currentPrice * (1 + volatility * 3.375 / 100),
        confidence: 20,
        get riskReward() {
          return Math.abs((this.takeProfit - this.entry) / (this.entry - this.stopLoss));
        },
        get potential() {
          return ((this.takeProfit - this.entry) / this.entry) * 100;
        }
      }
    ];

    return scenarios;
  };

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

  const handleChartLoad = () => {
    setChartLoaded(true);
    console.log("Chart loaded successfully");
  };

  const handleAnalysisComplete = (newData: TradingData) => {
    setData(newData);
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
            onAnalysisComplete={handleAnalysisComplete}
            onGetAISuggestion={getAISuggestion}
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <TradingViewChart symbol={data.symbol} onChartLoad={handleChartLoad} />
          </motion.div>

          {chartLoaded && (
            <>
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
                  scenarios={calculateScenarios(data.price[3])}
                  confidence={aiResponse.confidence || 0}
                />
              </motion.div>
            </>
          )}
        </motion.div>
      </motion.div>
    </ThemeProvider>
  );
};

export default Index;
