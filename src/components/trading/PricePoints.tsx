import { Target, ArrowDown, TrendingUp } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { motion } from "framer-motion";

interface PricePointsProps {
  entry: number;
  stopLoss: number;
  takeProfit: number;
}

export const PricePoints = ({ entry, stopLoss, takeProfit }: PricePointsProps) => {
  return (
    <div className="space-y-4">
      <Tooltip>
        <TooltipTrigger>
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
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>Suggested entry price for this trade</p>
        </TooltipContent>
      </Tooltip>
      
      <Tooltip>
        <TooltipTrigger>
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
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>Price level to exit if trade moves against you</p>
        </TooltipContent>
      </Tooltip>
      
      <Tooltip>
        <TooltipTrigger>
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
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>Target price to secure profits</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};