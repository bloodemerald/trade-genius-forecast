import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Brain } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

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
    const previousVolume = marketCondition.volume * 0.8;
    return ((marketCondition.volume - previousVolume) / previousVolume) * 100;
  };

  const calculatePriceChange = () => {
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

      if (error) throw error;
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <Card className="backdrop-blur-md bg-[#1A1F2C]/90 border border-[#9b87f5]/20 overflow-hidden hover:border-[#9b87f5]/40 transition-all duration-300">
        <div className="p-6">
          <Button 
            onClick={analyzeMarket} 
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#9b87f5] to-[#8b77e5] hover:from-[#8b77e5] hover:to-[#7a66d4] text-white border-none shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                <span>Analyzing Market...</span>
              </>
            ) : (
              <>
                <Brain className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                <span>Get AI Trading Suggestion</span>
              </>
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