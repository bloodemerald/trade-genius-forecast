import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Brain, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

interface MarketCondition {
  price: number;
  volume: number;
  rsi: number;
  macd: number[];
}

export const AITradingAssistant = ({ marketCondition }: { marketCondition: MarketCondition }) => {
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const { toast } = useToast();

  const calculateVolumeChange = () => {
    // For demo, using a random baseline. In real app, would use historical data
    const previousVolume = marketCondition.volume * 0.8;
    return ((marketCondition.volume - previousVolume) / previousVolume) * 100;
  };

  const calculatePriceChange = () => {
    // For demo, using current price vs opening. In real app, would use historical data
    const openPrice = marketCondition.price * 0.98;
    return ((marketCondition.price - openPrice) / openPrice) * 100;
  };

  const analyzeMarket = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-trading-analysis', {
        body: {
          marketData: {
            price: marketCondition.price,
            volume: marketCondition.volume,
            rsi: marketCondition.rsi,
            volumeChange: calculateVolumeChange(),
            priceChange: calculatePriceChange()
          }
        }
      });

      if (error) {
        throw error;
      }

      setSuggestion(data.suggestion);
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

  const volumeChange = calculateVolumeChange();
  const priceChange = calculatePriceChange();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <Card className="backdrop-blur-md bg-[#1A1F2C]/90 border border-[#9b87f5]/20 overflow-hidden">
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-[#9b87f5]/10">
                <Brain className="text-[#9b87f5] h-5 w-5" />
              </div>
              <h2 className="text-lg font-semibold text-[#D6BCFA]">AI Trading Assistant</h2>
            </div>
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-[#9b87f5]/10">
                  <TrendingUp className="h-4 w-4 text-[#9b87f5]" />
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-80 bg-[#1A1F2C] border border-[#9b87f5]/30 text-white">
                <div className="space-y-2">
                  <h4 className="font-medium text-[#D6BCFA]">Market Analysis</h4>
                  <p className="text-sm text-[#D6BCFA]/70">
                    The AI assistant analyzes current market conditions including price movements, 
                    volume trends, and momentum indicators to provide trading suggestions.
                  </p>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="p-3 rounded-lg bg-[#1A1F2C]/50 border border-[#9b87f5]/10">
              <div className="text-sm text-[#D6BCFA]/70 mb-1">RSI (14)</div>
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-white">{marketCondition.rsi.toFixed(2)}</span>
                {marketCondition.rsi > 70 ? (
                  <ArrowUpRight className="text-red-500 h-4 w-4" />
                ) : marketCondition.rsi < 30 ? (
                  <ArrowDownRight className="text-green-500 h-4 w-4" />
                ) : null}
              </div>
            </div>
            <div className="p-3 rounded-lg bg-[#1A1F2C]/50 border border-[#9b87f5]/10">
              <div className="text-sm text-[#D6BCFA]/70 mb-1">Volume Change</div>
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-white">{volumeChange.toFixed(2)}%</span>
                {volumeChange > 0 ? (
                  <ArrowUpRight className="text-green-500 h-4 w-4" />
                ) : (
                  <ArrowDownRight className="text-red-500 h-4 w-4" />
                )}
              </div>
            </div>
            <div className="p-3 rounded-lg bg-[#1A1F2C]/50 border border-[#9b87f5]/10">
              <div className="text-sm text-[#D6BCFA]/70 mb-1">Price Change</div>
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-white">{priceChange.toFixed(2)}%</span>
                {priceChange > 0 ? (
                  <ArrowUpRight className="text-green-500 h-4 w-4" />
                ) : (
                  <ArrowDownRight className="text-red-500 h-4 w-4" />
                )}
              </div>
            </div>
          </div>

          <Button 
            onClick={analyzeMarket} 
            disabled={loading}
            className="w-full bg-[#9b87f5] hover:bg-[#8b77e5] text-white border-none"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing Market...
              </>
            ) : (
              'Get Trading Suggestion'
            )}
          </Button>

          {suggestion && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-4 p-4 rounded-lg bg-[#1A1F2C]/50 border border-[#9b87f5]/20"
            >
              <p className="text-sm text-[#D6BCFA] leading-relaxed">{suggestion}</p>
            </motion.div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};