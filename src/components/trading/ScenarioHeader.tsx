import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ScenarioHeaderProps {
  index: number;
  riskReward: number;
  confidence: number;
}

export const ScenarioHeader = ({ index, riskReward, confidence }: ScenarioHeaderProps) => {
  const handleRRClick = () => {
    // Get TradingView widget instance
    const widget = (window as any).tvWidget;
    if (widget) {
      // Create long position template
      widget.chart().createPositionLine()
        .setText("Long Position")
        .setQuantity(`R/R: ${riskReward.toFixed(2)}`)
        .setPrice(widget.chart().price())
        .setExtendLeft(false)
        .setLineLength(3)
        .setLineStyle(0)
        .setLineWidth(2)
        .setBodyBorderColor("#22c55e")
        .setBodyBackgroundColor("rgba(34, 197, 94, 0.2)")
        .setBodyTextColor("#22c55e")
        .setQuantityBorderColor("#22c55e")
        .setQuantityBackgroundColor("rgba(34, 197, 94, 0.2)")
        .setQuantityTextColor("#22c55e")
        .setLineColor("#22c55e")
        .setEditable(true);
    }
  };

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
            <Button
              onClick={handleRRClick}
              variant="ghost"
              className="text-sm font-medium text-[#9b87f5] bg-[#1A1F2C] px-3 py-1 rounded-full border border-[#9b87f5]/30 hover:bg-[#1A1F2C]/80"
            >
              R/R: {riskReward.toFixed(2)}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Click to show position on chart - Risk to Reward ratio</p>
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