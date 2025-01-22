import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { BookOpen } from "lucide-react";

interface ScenarioHeaderProps {
  index: number;
  riskReward: number;
  confidence: number;
}

export const ScenarioHeader = ({ index, riskReward, confidence }: ScenarioHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-4 relative z-10">
      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger>
            <h3 className="text-lg font-semibold text-[#D6BCFA] group-hover:text-white transition-colors">
              Scenario {index + 1}
            </h3>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Trading scenario based on current market conditions</p>
          </TooltipContent>
        </Tooltip>
        <BookOpen className="text-[#9b87f5]" size={16} />
      </div>
      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger>
            <span className="text-sm font-medium text-[#9b87f5] bg-[#1A1F2C] px-3 py-1 rounded-full border border-[#9b87f5]/30">
              R/R: {riskReward.toFixed(2)}
            </span>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Risk to Reward ratio - Higher is better</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger>
            <span 
              className={`text-sm font-medium px-3 py-1 rounded-full border ${
                confidence >= 80 
                  ? "text-green-400 border-green-400/30 bg-green-400/10"
                  : confidence >= 60
                  ? "text-yellow-400 border-yellow-400/30 bg-yellow-400/10"
                  : "text-red-400 border-red-400/30 bg-red-400/10"
              }`}
            >
              {confidence.toFixed(0)}% Confidence
            </span>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>AI-generated confidence score based on technical analysis</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};