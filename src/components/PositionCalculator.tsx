import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Info } from "lucide-react";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";

interface PositionCalculatorProps {
  entryPrice: number;
  stopLoss: number;
}

export const PositionCalculator = ({ entryPrice, stopLoss }: PositionCalculatorProps) => {
  const [accountBalance, setAccountBalance] = useState<string>("");
  const [riskPercentage, setRiskPercentage] = useState<string>("1");

  const calculatePosition = () => {
    if (!accountBalance || !riskPercentage) return null;

    const balance = parseFloat(accountBalance);
    const risk = parseFloat(riskPercentage);
    
    if (isNaN(balance) || isNaN(risk)) return null;

    const riskAmount = (balance * risk) / 100;
    const stopDistance = Math.abs(entryPrice - stopLoss);
    const positionSize = (riskAmount / stopDistance);
    
    return {
      riskAmount,
      positionSize,
      stopDistance
    };
  };

  const position = calculatePosition();

  return (
    <div className="space-y-4 p-4 bg-[#1A1F2C]/50 rounded-lg border border-[#9b87f5]/20">
      <div className="flex items-center justify-between">
        <h4 className="text-[#D6BCFA] font-semibold">Position Calculator</h4>
        <HoverCard>
          <HoverCardTrigger asChild>
            <button className="text-[#9b87f5] hover:text-[#D6BCFA]">
              <Info size={16} />
            </button>
          </HoverCardTrigger>
          <HoverCardContent className="w-80 bg-[#1A1F2C] border border-[#9b87f5]/30 text-white p-4">
            <p className="text-sm">
              This calculator helps you determine the appropriate position size based on your account balance and risk tolerance.
              It's recommended to risk no more than 1-2% of your account on any single trade.
            </p>
          </HoverCardContent>
        </HoverCard>
      </div>

      <div className="space-y-3">
        <div>
          <Label htmlFor="balance" className="text-[#D6BCFA]/70">Account Balance</Label>
          <Input
            id="balance"
            type="number"
            placeholder="Enter your account balance"
            value={accountBalance}
            onChange={(e) => setAccountBalance(e.target.value)}
            className="bg-[#1A1F2C] border-[#9b87f5]/30 text-white"
          />
        </div>

        <div>
          <Label htmlFor="risk" className="text-[#D6BCFA]/70">Risk Percentage</Label>
          <Input
            id="risk"
            type="number"
            placeholder="Enter risk percentage"
            value={riskPercentage}
            onChange={(e) => setRiskPercentage(e.target.value)}
            className="bg-[#1A1F2C] border-[#9b87f5]/30 text-white"
            min="0.1"
            max="100"
            step="0.1"
          />
        </div>

        {position && (
          <div className="space-y-2 mt-4 p-3 bg-[#1A1F2C] rounded border border-[#9b87f5]/30">
            <div className="flex justify-between">
              <span className="text-[#D6BCFA]/70">Risk Amount:</span>
              <span className="text-white font-mono">${position.riskAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#D6BCFA]/70">Position Size:</span>
              <span className="text-white font-mono">{position.positionSize.toFixed(8)} units</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#D6BCFA]/70">Stop Distance:</span>
              <span className="text-white font-mono">{position.stopDistance.toFixed(8)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};