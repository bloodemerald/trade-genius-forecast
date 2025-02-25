
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { Info } from "lucide-react";

interface ScenarioExplanationProps {
  explanation: string;
}

export const ScenarioExplanation = ({ explanation }: ScenarioExplanationProps) => {
  return (
    <div className="mt-4 p-3 bg-[#1A1F2C]/50 rounded-lg border border-[#9b87f5]/20">
      <p className="text-sm text-[#D6BCFA]">{explanation}</p>
      <div className="mt-2 flex gap-4">
        <HoverCard>
          <HoverCardTrigger asChild>
            <button className="inline-flex items-center gap-1 text-[#9b87f5] hover:text-[#D6BCFA] transition-all duration-200 hover:scale-105 group">
              <Info size={14} className="group-hover:rotate-12 transition-transform duration-200" />
              <span className="text-xs border-b border-[#9b87f5]/30 group-hover:border-[#D6BCFA]">RSI Analysis</span>
            </button>
          </HoverCardTrigger>
          <HoverCardContent className="w-80 bg-[#1A1F2C] border border-[#9b87f5]/30 text-white p-4">
            <p className="text-sm">The Relative Strength Index (RSI) measures momentum and helps identify overbought or oversold conditions. Values above 70 suggest overbought conditions, while values below 30 suggest oversold conditions.</p>
          </HoverCardContent>
        </HoverCard>
        <HoverCard>
          <HoverCardTrigger asChild>
            <button className="inline-flex items-center gap-1 text-[#9b87f5] hover:text-[#D6BCFA] transition-all duration-200 hover:scale-105 group">
              <Info size={14} className="group-hover:rotate-12 transition-transform duration-200" />
              <span className="text-xs border-b border-[#9b87f5]/30 group-hover:border-[#D6BCFA]">Risk/Reward Explained</span>
            </button>
          </HoverCardTrigger>
          <HoverCardContent className="w-80 bg-[#1A1F2C] border border-[#9b87f5]/30 text-white p-4">
            <p className="text-sm">The Risk/Reward ratio compares potential losses to potential gains. A ratio of 1:3 means you're risking $1 to potentially gain $3. Higher ratios generally indicate better trading opportunities.</p>
          </HoverCardContent>
        </HoverCard>
      </div>
    </div>
  );
};
