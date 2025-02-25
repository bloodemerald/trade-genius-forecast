
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface PotentialGainProps {
  potential: number;
}

export const PotentialGain = ({ potential }: PotentialGainProps) => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <div className="mt-6 pt-4 border-t border-[#9b87f5]/20 relative">
          <div className="absolute -top-[1px] -left-6 w-4 h-4 border-t border-l border-[#9b87f5]/30" />
          <div className="absolute -top-[1px] -right-6 w-4 h-4 border-t border-r border-[#9b87f5]/30" />
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#D6BCFA]/70">Potential Gain</span>
            <span className="text-2xl font-bold text-profit bg-profit/10 px-4 py-2 rounded-lg border border-profit/20 shadow-sm shadow-profit/5">
              {potential.toFixed(2)}%
            </span>
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <p>Expected percentage gain if take profit is reached</p>
      </TooltipContent>
    </Tooltip>
  );
};
