
import { motion } from "framer-motion";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { ScenarioHeader } from "./trading/ScenarioHeader";
import { PricePoints } from "./trading/PricePoints";
import { ScenarioExplanation } from "./trading/ScenarioExplanation";
import { PotentialGain } from "./trading/PotentialGain";
import { DecorativeElements } from "./trading/DecorativeElements";

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
  return (
    <TooltipProvider>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
        className="relative backdrop-blur-md bg-[#1A1F2C]/90 rounded-xl p-6 shadow-lg border border-[#9b87f5]/20 overflow-hidden group hover:border-[#9b87f5]/40 transition-all duration-300"
      >
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

            <ScenarioExplanation 
              explanation={getScenarioExplanation(riskReward, potential, confidence)} 
            />
            
            <PotentialGain potential={potential} />
          </div>
        </DecorativeElements>
      </motion.div>
    </TooltipProvider>
  );
};

const getScenarioExplanation = (riskReward: number, potential: number, confidence: number) => {
  let explanation = "";
  
  if (confidence >= 80) {
    explanation = "High confidence setup with strong technical alignment. ";
  } else if (confidence >= 60) {
    explanation = "Moderate confidence setup with decent technical signals. ";
  } else {
    explanation = "Lower confidence setup, exercise caution. ";
  }
  
  if (riskReward >= 3) {
    explanation += "Excellent risk-to-reward ratio offering strong profit potential.";
  } else if (riskReward >= 2) {
    explanation += "Good risk-to-reward ratio with balanced risk management.";
  } else {
    explanation += "Consider waiting for better risk-to-reward setup.";
  }
  
  return explanation;
};
