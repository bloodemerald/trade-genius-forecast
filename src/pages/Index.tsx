import { useState } from "react";
import { TradingCard } from "@/components/TradingCard";
import { TradeScenario } from "@/components/TradeScenario";
import { motion } from "framer-motion";
import ImageUploader from "@/components/ImageUploader";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ThemeProvider } from "next-themes";
import { Brain, Loader2 } from "lucide-react";
import { useToast, toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface TradingData {
  symbol: string;
  tokenAddress: string | null;
  price: number[];
  volume: number;
  indicators: {
    EMA_9: number;
    MA_10: number;
    MACD: number[];
    RSI_14: number;
  };
}

interface AIResponse {
  suggestion: string;
  sentiment: number;
  confidence: number;
}

const Index = () => {
  const [data, setData] = useState<TradingData>({
    symbol: "BARRON/SOL",
    tokenAddress: null,
    price: [0.05265, 0.05516, 0.05265, 0.05297],
    volume: 198947,
    indicators: {
      EMA_9: 0.05764,
      MA_10: 0.05865,
      MACD: [-0.001757, 0.008922, 0.002650],
      RSI_14: 46.49,
    },
  });
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAIResponse] = useState<AIResponse>({
    suggestion: '',
    sentiment: 50,
    confidence: 0
  });

  const calculateSentiment = (rsi: number): number => {
    if (rsi >= 70) return 100; // Strongly Bullish
    if (rsi >= 60) return 75;  // Moderately Bullish
    if (rsi >= 45) return 60;  // Slightly Bullish
    if (rsi >= 40) return 50;  // Neutral
    if (rsi >= 30) return 40;  // Slightly Bearish
    if (rsi >= 20) return 25;  // Moderately Bearish
    return 0;                  // Strongly Bearish
  };

  const calculateScenarios = (currentPrice: number) => {
    const volatility = Math.abs(data.price[1] - data.price[2]) / data.price[3] * 100;
    const averageVolume = data.volume;
    const isOverbought = data.indicators.RSI_14 > 70;
    const isOversold = data.indicators.RSI_14 < 30;
    const trendStrength = Math.abs(data.indicators.MACD[2]);
    
    const riskMultiplier = isOversold ? 0.8 : isOverbought ? 1.2 : 1;
    const rewardMultiplier = trendStrength > 0.005 ? 1.5 : 1;
    
    // Calculate base confidence based on technical indicators
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

  const calculateChange = (current: number, previous: number) => {
    return ((current - previous) / previous) * 100;
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

  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background text-foreground p-8 transition-colors duration-300">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto space-y-8"
        >
          {/* Header section */}
          <div className="flex items-center justify-between">
            <div>
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#9b87f5] to-[#D6BCFA]"
              >
                {data.symbol}
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="text-muted-foreground mt-1"
              >
                Technical Analysis Dashboard
              </motion.p>
            </div>
            <div className="flex items-center gap-4">
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-sm text-muted-foreground bg-background/50 px-4 py-2 rounded-full border border-[#9b87f5]/20"
              >
                Last updated: {new Date().toLocaleTimeString()}
              </motion.div>
              <ThemeToggle />
            </div>
          </div>

          {/* Image Analysis section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="backdrop-blur-lg bg-[#1A1F2C]/50 rounded-2xl p-6 border border-[#9b87f5]/20 relative overflow-hidden group hover:border-[#9b87f5]/40 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#9b87f5]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <h2 className="text-xl font-semibold mb-4 text-[#9b87f5] relative z-10">Image Analysis</h2>
            <div className="relative z-10 space-y-4">
              <ImageUploader onAnalysisComplete={setData} />
              
              <button
                onClick={getAISuggestion}
                disabled={loading}
                className="w-full relative z-10 py-3 px-4 bg-gradient-to-r from-[#9b87f5] to-[#8b77e5] hover:from-[#8b77e5] hover:to-[#7a66d4] text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Analyzing Trading Data...</span>
                  </>
                ) : (
                  <>
                    <Brain className="h-5 w-5 transition-transform group-hover:scale-110" />
                    <span>Get AI Trading Suggestion</span>
                  </>
                )}
              </button>

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

          {/* Trading Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <TradingCard
              title="Current Price"
              value={data.price[3]}
              change={calculateChange(data.price[3], data.price[0])}
              isPrice
              showPercentage
            />
            <TradingCard
              title="24h Volume"
              value={data.volume}
              change={0}
            />
            <TradingCard
              title="RSI (14)"
              value={data.indicators.RSI_14}
              change={0}
            />
            <TradingCard
              title="Market Sentiment"
              value={aiResponse.sentiment}
              change={0}
            />
          </div>

          {/* Trading Scenarios */}
          <div>
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xl font-semibold mb-6 text-[#9b87f5]"
            >
              Trading Scenarios
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {scenarios.map((scenario, index) => (
                <TradeScenario 
                  key={index} 
                  {...scenario} 
                  index={index}
                  confidence={aiResponse.confidence} 
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </ThemeProvider>
  );
};

export default Index;
