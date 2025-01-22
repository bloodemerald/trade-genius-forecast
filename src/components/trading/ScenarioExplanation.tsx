import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { Info } from "lucide-react";

interface ScenarioExplanationProps {
  explanation: string;
}

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

export const ScenarioExplanation = ({ explanation }: ScenarioExplanationProps) => {
  return (
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
  );
};