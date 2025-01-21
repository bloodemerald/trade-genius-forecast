import { motion } from "framer-motion";
import { Target, ArrowDown, TrendingUp } from "lucide-react";

interface TradeScenarioProps {
  entry: number;
  stopLoss: number;
  takeProfit: number;
  riskReward: number;
  potential: number;
  index: number;
}

export const TradeScenario = ({
  entry,
  stopLoss,
  takeProfit,
  riskReward,
  potential,
  index,
}: TradeScenarioProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="backdrop-blur-md bg-white/10 rounded-xl p-6 shadow-lg border border-gray-200/20"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Scenario {index + 1}</h3>
        <span className="text-sm font-medium text-neutral">R/R: {riskReward.toFixed(2)}</span>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Target className="text-neutral" size={16} />
          <span className="text-sm">Entry: {entry.toFixed(8)}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <ArrowDown className="text-loss" size={16} />
          <span className="text-sm">Stop Loss: {stopLoss.toFixed(8)}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <TrendingUp className="text-profit" size={16} />
          <span className="text-sm">Take Profit: {takeProfit.toFixed(8)}</span>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200/20">
          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral">Potential Gain</span>
            <span className="text-lg font-semibold text-profit">
              {potential.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};