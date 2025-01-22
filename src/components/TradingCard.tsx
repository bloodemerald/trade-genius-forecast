import { cn } from "@/lib/utils";
import { DecorativeElements } from "@/components/trading/DecorativeElements";

interface TradingCardProps {
  title: string;
  value: number | null;
  change?: number;
  isPrice?: boolean;
  showPercentage?: boolean;
  customContent?: string;
}

export const TradingCard = ({
  title,
  value,
  change = 0,
  isPrice = false,
  showPercentage = false,
  customContent,
}: TradingCardProps) => {
  const formatValue = (val: number) => {
    if (isPrice) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 8
      }).format(val);
    }
    return val.toFixed(2);
  };

  const getChangeColor = (changeValue: number) => {
    if (changeValue > 0) return "text-profit";
    if (changeValue < 0) return "text-loss";
    return "text-neutral";
  };

  return (
    <DecorativeElements>
      <div className="bg-trading-card p-6 rounded-lg border border-trading-border backdrop-blur-sm">
        <h3 className="text-sm font-medium text-muted-foreground mb-3">{title}</h3>
        
        {customContent ? (
          <div className="space-y-2 text-sm">
            {customContent.split('\n').map((line, index) => (
              <p key={index} className="text-foreground">{line}</p>
            ))}
          </div>
        ) : (
          <div className="space-y-1">
            <div className="text-2xl font-semibold">
              {value !== null && formatValue(value)}
            </div>
            {showPercentage && (
              <div className={cn("text-sm font-medium", getChangeColor(change))}>
                {change > 0 ? "+" : ""}{change.toFixed(2)}%
              </div>
            )}
          </div>
        )}
      </div>
    </DecorativeElements>
  );
};