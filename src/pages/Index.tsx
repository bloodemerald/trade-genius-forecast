import { useState, useEffect } from "react";
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
  symbol: "SOLUSD",
  tokenAddress: null,
  price: [98.45, 102.30, 97.80, 101.25],
  volume: 1458923,
  indicators: {
    EMA_9: 99.85,
    MA_10: 98.75,
    MACD: [1.25, -0.50, 0.75],
    RSI_14: 58.42
  },
  chartObservations: [
    "Strong support at $97.50",
    "Resistance level at $103.00",
    "Trading above 20-day moving average"
  ],
  tradeSignals: [
    "Positive momentum building",
    "Volume above average",
    "Price action remains bullish"
  ],
  priceAction: [
    "Higher lows forming on 4H chart",
    "Break above recent resistance",
    "Increased buying pressure"
  ]
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

  useEffect(() => {
    const autoAnalyze = async () => {
      setLoading(true);
      try {
        const { data: aiData, error } = await supabase.functions.invoke('ai-trading-analysis', {
          body: {
            marketData: {
              symbol: initialData.symbol,
              price: initialData.price,
              volume: initialData.volume,
              indicators: initialData.indicators,
              priceChange: calculateChange(initialData.price[3], initialData.price[0])
            }
          }
        });

        if (error) throw error;
        
        setAIResponse(aiData);
        setData(initialData);
        setChartLoaded(true);
      } catch (error) {
        console.error('Error in auto-analysis:', error);
        toast({
          title: "Auto-analysis failed",
          description: "Using default market data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    autoAnalyze();
  }, []);

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

    const suggestion = aiResponse.suggestion || '';
    const supportMatch = suggestion.match(/support at \$?(\d+\.?\d*)/i);
    const resistanceMatch = suggestion.match(/resistance at \$?(\d+\.?\d*)/i);
    
    const supportLevel = supportMatch ? parseFloat(supportMatch[1]) : currentPrice * 0.98;
    const resistanceLevel = resistanceMatch ? parseFloat(resistanceMatch[1]) : currentPrice * 1.02;
    
    const volatility = Math.abs((data.price[data.price.length - 1] - data.price[0]) / data.price[0]);
    const baseRR = aiResponse.sentiment > 0 ? 2.5 : 2.0;
    
    return [
      {
        entry: currentPrice,
        stopLoss: aiResponse.sentiment > 0 ? supportLevel : resistanceLevel,
        takeProfit: aiResponse.sentiment > 0 ? resistanceLevel : supportLevel,
        confidence: Math.min(85, aiResponse.confidence + 10),
        get riskReward() {
          return Math.abs((this.takeProfit - this.entry) / (this.entry - this.stopLoss));
        },
        get potential() {
          return ((this.takeProfit - this.entry) / this.entry) * 100;
        }
      },
      {
        entry: currentPrice,
        stopLoss: aiResponse.sentiment > 0 ? supportLevel * 0.99 : resistanceLevel * 1.01,
        takeProfit: aiResponse.sentiment > 0 ? resistanceLevel * 1.01 : supportLevel * 0.99,
        confidence: Math.min(75, aiResponse.confidence),
        get riskReward() {
          return Math.abs((this.takeProfit - this.entry) / (this.entry - this.stopLoss));
        },
        get potential() {
          return ((this.takeProfit - this.entry) / this.entry) * 100;
        }
      },
      {
        entry: currentPrice,
        stopLoss: aiResponse.sentiment > 0 ? supportLevel * 0.98 : resistanceLevel * 1.02,
        takeProfit: aiResponse.sentiment > 0 ? resistanceLevel * 1.02 : supportLevel * 0.98,
        confidence: Math.max(40, aiResponse.confidence - 10),
        get riskReward() {
          return Math.abs((this.takeProfit - this.entry) / (this.entry - this.stopLoss));
        },
        get potential() {
          return ((this.takeProfit - this.entry) / this.entry) * 100;
        }
      }
    ];
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
    setData(prevData => ({
      ...newData,
      symbol: prevData.symbol
    }));
  };

  const chartData = data.price.map((price, index) => ({
    time: ['9:30', '10:00', '10:30', '11:00'][index],
    price
  }));

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
            currentData={data}
            onAnalysisComplete={handleAnalysisComplete}
            onGetAISuggestion={getAISuggestion}
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <TradingViewChart 
              symbol={data.symbol} 
              onChartLoad={handleChartLoad}
            />
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
