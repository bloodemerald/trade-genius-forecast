import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative backdrop-blur-md bg-[#1A1F2C]/80 rounded-xl p-6 shadow-lg border border-[#9b87f5]/20 overflow-hidden group hover:border-[#9b87f5]/40 transition-all duration-300"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#9b87f5]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <h3 className="text-sm font-medium text-[#D6BCFA] mb-2 relative z-10">{title}</h3>
      
      <div className="flex items-baseline gap-2 relative z-10 overflow-hidden">
        <div className="overflow-x-auto scrollbar-hide">
          <span className="text-2xl font-semibold text-white whitespace-nowrap">
            {formatValue(value)}
          </span>
        </div>
        {getChangeDisplay()}
      </div>
      
      {/* Decorative elements inspired by Final Fantasy UI */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#9b87f5]/30" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#9b87f5]/30" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#9b87f5]/30" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#9b87f5]/30" />
    </motion.div>
  );
};