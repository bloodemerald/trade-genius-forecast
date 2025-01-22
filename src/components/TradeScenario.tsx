import { motion } from "framer-motion";
import { Target, ArrowDown, TrendingUp, BookOpen, Info } from "lucide-react";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { PositionCalculator } from "./PositionCalculator";

interface TradeScenarioProps {
  entry: number;
  stopLoss: number;
  takeProfit: number;
  riskReward: number;
  potential: number;
  confidence: number;
  index: number;
}

const getScenarioExplanation = (riskReward: number, potential: number, confidence: number) => {
  let explanation = "";
  
  if (confidence >= 80) {
    explanation = "High confidence setup with strong technical alignment. Consider following strict risk management rules.";
  } else if (confidence >= 60) {
    explanation = "Moderate confidence setup. Exercise caution and consider reducing position size.";
  } else {
    explanation = "Low confidence setup. Consider waiting for better opportunities or skip this trade.";
  }
  
  if (riskReward >= 3) {
    explanation += " Favorable risk-to-reward ratio suggests good potential for profits.";
  } else if (riskReward >= 2) {
    explanation += " Acceptable risk-to-reward ratio, manage position size accordingly.";
  } else {
    explanation += " Lower risk-to-reward ratio, consider waiting for better setups.";
  }
  
  return explanation;
};

const IndicatorEducation = ({ title, content }: { title: string; content: string }) => (
  <HoverCard>
    <HoverCardTrigger asChild>
      <button className="inline-flex items-center gap-1 text-[#9b87f5] hover:text-[#D6BCFA] transition-colors">
        <Info size={14} />
        <span className="text-xs underline">{title}</span>
      </button>
    </HoverCardTrigger>
    <HoverCardContent className="w-80 bg-[#1A1F2C] border border-[#9b87f5]/30 text-white p-4">
      <p className="text-sm">{content}</p>
    </HoverCardContent>
  </HoverCard>
);

export const TradeScenario = ({
  entry,
  stopLoss,
  takeProfit,
  riskReward,
  potential,
  confidence,
  index,
}: TradeScenarioProps) => {
  const explanation = getScenarioExplanation(riskReward, potential, confidence);
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="relative backdrop-blur-md bg-[#1A1F2C]/90 rounded-xl p-6 shadow-lg border border-[#9b87f5]/20 overflow-hidden group hover:border-[#9b87f5]/40 transition-all duration-300"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#9b87f5]/5 via-transparent to-[#D6BCFA]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Glowing line effect */}
      <div className="absolute h-[1px] w-full left-0 top-0 bg-gradient-to-r from-transparent via-[#9b87f5]/50 to-transparent" />
      
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-[#D6BCFA] group-hover:text-white transition-colors">
            Scenario {index + 1}
          </h3>
          <BookOpen className="text-[#9b87f5]" size={16} />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-[#9b87f5] bg-[#1A1F2C] px-3 py-1 rounded-full border border-[#9b87f5]/30">
            R/R: {riskReward.toFixed(2)}
          </span>
          <span 
            className={`text-sm font-medium px-3 py-1 rounded-full border ${
              confidence >= 80 
                ? "text-green-400 border-green-400/30 bg-green-400/10"
                : confidence >= 60
                ? "text-yellow-400 border-yellow-400/30 bg-yellow-400/10"
                : "text-red-400 border-red-400/30 bg-red-400/10"
            }`}
          >
            {Math.round(confidence)}% Confidence
          </span>
        </div>
      </div>
      
      {/* ... keep existing code (Price details and scenario information) */}
      
      <div className="space-y-4 relative z-10">
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-3 group/item hover:bg-[#9b87f5]/10 p-2 rounded-lg transition-colors"
        >
          <Target className="text-[#9b87f5]" size={16} />
          <div className="flex flex-col">
            <span className="text-xs text-[#D6BCFA]/70">Entry Price</span>
            <span className="text-sm font-mono text-white">{entry.toFixed(8)}</span>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-3 group/item hover:bg-loss/10 p-2 rounded-lg transition-colors"
        >
          <ArrowDown className="text-loss" size={16} />
          <div className="flex flex-col">
            <span className="text-xs text-[#D6BCFA]/70">Stop Loss</span>
            <span className="text-sm font-mono text-white">{stopLoss.toFixed(8)}</span>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-3 group/item hover:bg-profit/10 p-2 rounded-lg transition-colors"
        >
          <TrendingUp className="text-profit" size={16} />
          <div className="flex flex-col">
            <span className="text-xs text-[#D6BCFA]/70">Take Profit</span>
            <span className="text-sm font-mono text-white">{takeProfit.toFixed(8)}</span>
          </div>
        </motion.div>

        <div className="mt-4 p-3 bg-[#1A1F2C]/50 rounded-lg border border-[#9b87f5]/20">
          <p className="text-sm text-[#D6BCFA]">{explanation}</p>
          <div className="mt-2 flex gap-4">
            <IndicatorEducation
              title="Learn about RSI"
              content="The Relative Strength Index (RSI) measures momentum and helps identify overbought or oversold conditions. Values above 70 suggest overbought conditions, while values below 30 suggest oversold conditions."
            />
            <IndicatorEducation
              title="Risk/Reward Ratio"
              content="The Risk/Reward ratio compares potential losses to potential gains. A ratio of 1:3 means you're risking $1 to potentially gain $3. Higher ratios generally indicate better trading opportunities."
            />
          </div>
        </div>

        <PositionCalculator entryPrice={entry} stopLoss={stopLoss} />
        
        <div className="mt-6 pt-4 border-t border-[#9b87f5]/20 relative">
          <div className="absolute -top-[1px] -left-6 w-4 h-4 border-t border-l border-[#9b87f5]/30" />
          <div className="absolute -top-[1px] -right-6 w-4 h-4 border-t border-r border-[#9b87f5]/30" />
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#D6BCFA]/70">Potential Gain</span>
            <span className="text-lg font-semibold text-profit bg-profit/10 px-3 py-1 rounded-full">
              {potential.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>
      
      {/* Decorative corner elements */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-[#9b87f5]/30" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-[#9b87f5]/30" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-[#9b87f5]/30" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-[#9b87f5]/30" />
    </motion.div>
  );
};
