import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, Brain, Loader2 } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface TradingCardProps {
  title: string;
  value: number | null;
  change: number;
  isPrice?: boolean;
  showPercentage?: boolean;
}

export const TradingCard = ({ 
  title, 
  value, 
  change, 
  isPrice = false,
  showPercentage = false 
}: TradingCardProps) => {
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const { toast } = useToast();

  const formatValue = (val: number | null) => {
    if (val === null || val === undefined) return "N/A";
    
    if (title === "RSI (14)") {
      return val.toFixed(2);
    }
    
    if (title === "24h Volume") {
      return val.toLocaleString("en-US", { maximumFractionDigits: 0 });
    }
    
    return isPrice
      ? val.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 8,
        })
      : val.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
  };

  const getChangeDisplay = () => {
    if (!showPercentage) return null;
    
    return (
      <div
        className={`flex items-center ${
          change >= 0 ? "text-profit" : "text-loss"
        } text-sm font-medium ml-auto flex-shrink-0`}
      >
        {change >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
        <span className="min-w-[3rem] text-right">{Math.abs(change).toFixed(2)}%</span>
      </div>
    );
  };

  const getAISuggestion = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-trading-analysis', {
        body: {
          marketData: {
            price: value,
            priceChange: change,
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
      className="relative backdrop-blur-md bg-[#1A1F2C]/80 rounded-xl p-6 shadow-lg border border-[#9b87f5]/20 overflow-hidden group hover:border-[#9b87f5]/40 transition-all duration-300"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#9b87f5]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <h3 className="text-sm font-medium text-[#D6BCFA] mb-2 relative z-10">{title}</h3>
      
      <div className="flex items-baseline gap-2 relative z-10 overflow-hidden mb-4">
        <div className="overflow-x-auto scrollbar-hide">
          <span className="text-2xl font-semibold text-white whitespace-nowrap">
            {formatValue(value)}
          </span>
        </div>
        {getChangeDisplay()}
      </div>

      <button
        onClick={getAISuggestion}
        disabled={loading}
        className="w-full relative z-10 py-2 px-4 bg-gradient-to-r from-[#9b87f5] to-[#8b77e5] hover:from-[#8b77e5] hover:to-[#7a66d4] text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Analyzing...</span>
          </>
        ) : (
          <>
            <Brain className="h-4 w-4 transition-transform group-hover:scale-110" />
            <span>Get AI Suggestion</span>
          </>
        )}
      </button>

      {suggestion && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="mt-4 p-3 rounded-lg bg-[#1A1F2C]/50 border border-[#9b87f5]/20 relative z-10"
        >
          <p className="text-sm text-[#D6BCFA] leading-relaxed">{suggestion}</p>
        </motion.div>
      )}
      
      {/* Decorative elements inspired by Final Fantasy UI */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#9b87f5]/30" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#9b87f5]/30" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#9b87f5]/30" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#9b87f5]/30" />
    </motion.div>
  );
};