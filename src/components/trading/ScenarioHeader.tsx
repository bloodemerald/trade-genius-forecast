
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface ScenarioHeaderProps {
  index: number;
  riskReward: number;
  confidence: number;
}

export const ScenarioHeader = ({ index, riskReward, confidence }: ScenarioHeaderProps) => {
  const handleRRClick = () => {
    const widget = (window as any).tvWidget;
    if (widget) {
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

  const getConfidenceColor = (value: number) => {
    if (value >= 80) return "bg-green-500";
    if (value >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="flex items-center justify-between mb-4 relative z-10">
      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger>
            <h3 className="text-lg font-semibold text-[#9b87f5] group-hover:text-[#D6BCFA] transition-colors">
              Scenario {index + 1}
            </h3>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Trading scenario based on current market conditions</p>
          </TooltipContent>
        </Tooltip>
        <BookOpen className="text-[#9b87f5]" size={16} />
      </div>
      <div className="flex items-center gap-4">
        <Tooltip>
          <TooltipTrigger>
            <Button
              onClick={handleRRClick}
              variant="ghost"
              className="text-sm font-medium text-[#9b87f5] bg-[#1A1F2C]/80 px-3 py-1 rounded-full border border-[#9b87f5]/30 hover:bg-[#1A1F2C] hover:border-[#9b87f5]/50"
            >
              R/R: {riskReward.toFixed(2)}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Click to show position on chart - Risk to Reward ratio</p>
          </TooltipContent>
        </Tooltip>
        <div className="flex flex-col gap-1 min-w-[120px]">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#D6BCFA]/70">Confidence</span>
            <span className="text-xs font-medium text-[#D6BCFA]">{confidence.toFixed(0)}%</span>
          </div>
          <Progress 
            value={confidence} 
            className="h-1.5 bg-[#1A1F2C]"
            indicatorClassName={`${getConfidenceColor(confidence)} transition-all duration-500`}
          />
        </div>
      </div>
    </div>
  );
};
