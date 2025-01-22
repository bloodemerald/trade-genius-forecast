import { motion } from "framer-motion";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PositionCalculator } from "./PositionCalculator";
import { ScenarioHeader } from "./trading/ScenarioHeader";
import { PricePoints } from "./trading/PricePoints";
import { ScenarioExplanation } from "./trading/ScenarioExplanation";
import { PotentialGain } from "./trading/PotentialGain";
import { DecorativeElements } from "./trading/DecorativeElements";
import { getScenarioExplanation } from "./trading/utils";

interface TradeScenarioProps {
  entry: number;
  stopLoss: number;
  takeProfit: number;
  riskReward: number;
  potential: number;
  confidence: number;
  index: number;
}

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
    <TooltipProvider>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
        className="relative backdrop-blur-md bg-[#1A1F2C]/90 rounded-xl p-6 shadow-lg border border-[#9b87f5]/20 overflow-hidden group hover:border-[#9b87f5]/40 transition-all duration-300"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#9b87f5]/5 via-transparent to-[#D6BCFA]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <DecorativeElements>
          <div className="space-y-4 relative z-10">
            <ScenarioHeader 
              index={index}
              riskReward={riskReward}
              confidence={confidence}
            />
            
            <PricePoints
              entry={entry}
              stopLoss={stopLoss}
              takeProfit={takeProfit}
            />

            <ScenarioExplanation explanation={explanation} />

            <PositionCalculator entryPrice={entry} stopLoss={stopLoss} />
            
            <PotentialGain potential={potential} />
          </div>
        </DecorativeElements>
      </motion.div>
    </TooltipProvider>
  );
};