
import { cn } from "@/lib/utils";
import { DecorativeElements } from "@/components/trading/DecorativeElements";

interface TradingCardProps {
  title: string;
  value: number | null;
  change?: number;
  isPrice?: boolean;
  showPercentage?: boolean;
  customContent?: string;
  customClasses?: string;
  icon?: React.ReactNode;
  valueClasses?: string;
  changeClasses?: string;
}

export const TradingCard = ({
  title,
  value,
  change = 0,
  isPrice = false,
  showPercentage = false,
  customContent,
  customClasses,
  icon,
  valueClasses,
  changeClasses,
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
      <div className={cn(
        "bg-trading-card p-6 rounded-lg border border-trading-border backdrop-blur-sm",
        customClasses
      )}>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">{title}</h3>
        
        {customContent ? (
          <div className="space-y-2 text-sm">
            {customContent.split('\n').map((line, index) => (
              <p key={index} className="text-foreground">{line}</p>
            ))}
          </div>
        ) : (
          <div className="space-y-1">
            <div className={cn("text-2xl font-semibold", valueClasses)}>
              {value !== null && formatValue(value)}
            </div>
            {showPercentage && (
              <div className={cn(
                "text-sm font-medium flex items-center gap-2",
                getChangeColor(change),
                changeClasses
              )}>
                {icon}
                <span>
                  {change > 0 ? "+" : ""}{change.toFixed(2)}%
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </DecorativeElements>
  );
};
