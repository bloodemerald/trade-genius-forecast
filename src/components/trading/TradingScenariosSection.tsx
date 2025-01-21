import { motion } from "framer-motion";
import { TradeScenario } from "@/components/TradeScenario";

interface Scenario {
  entry: number;
  stopLoss: number;
  takeProfit: number;
  riskReward: number;
  potential: number;
  confidence: number;
}

interface TradingScenariosSectionProps {
  scenarios: Scenario[];
  confidence: number;
}

export const TradingScenariosSection = ({ scenarios, confidence }: TradingScenariosSectionProps) => {
  return (
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
            confidence={confidence} 
          />
        ))}
      </div>
    </div>
  );
};