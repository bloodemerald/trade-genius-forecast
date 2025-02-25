
import { TradingCard } from "@/components/TradingCard";
import { ArrowUpCircle, ArrowDownCircle, MinusCircle } from "lucide-react";

interface TradingCardsGridProps {
  currentPrice: number;
  previousPrice: number;
  volume: number;
  rsi: number;
  sentiment: number;
  aiAnalysis?: {
    chartObservations?: string[];
    tradeSignals?: string[];
    priceAction?: string[];
  };
}

export const TradingCardsGrid = ({
  currentPrice,
  previousPrice,
  volume,
  rsi,
  sentiment,
  aiAnalysis = {}
}: TradingCardsGridProps) => {
  const calculateChange = (current: number, previous: number) => {
    return ((current - previous) / previous) * 100;
  };

  const priceChange = calculateChange(currentPrice, previousPrice);

  const PriceChangeIcon = () => {
    if (priceChange > 0) {
      return <ArrowUpCircle className="w-6 h-6 text-profit" />;
    }
    if (priceChange < 0) {
      return <ArrowDownCircle className="w-6 h-6 text-loss" />;
    }
    return <MinusCircle className="w-6 h-6 text-neutral" />;
  };

  const chartObservations = aiAnalysis.chartObservations?.join("\n") || [
    "Support level at 0.0525",
    "Resistance at 0.0535",
    "Rising wedge pattern forming"
  ].join("\n");

  const tradeSignals = aiAnalysis.tradeSignals?.join("\n") || [
    "Bullish MACD crossover",
    "RSI showing oversold",
    "Volume spike detected"
  ].join("\n");

  const priceAction = aiAnalysis.priceAction?.join("\n") || [
    "Higher lows in last 4 candles",
    "Avg daily range: 2.3%",
    "Bullish engulfing pattern"
  ].join("\n");

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-1">
        <TradingCard
          title="Current Price"
          value={currentPrice}
          change={priceChange}
          isPrice
          showPercentage
          customClasses="bg-gradient 
            from-trading-card/80 
            to-trading-card 
            border-2 
            border-trading-border 
            hover:border-primary/50 
            transition-all 
            duration-300"
          icon={<PriceChangeIcon />}
          valueClasses="text-3xl md:text-4xl font-bold text-foreground"
          changeClasses="text-lg font-semibold flex items-center gap-2"
        />
      </div>
      <TradingCard
        title="Key Chart Observations"
        value={null}
        change={0}
        customContent={chartObservations}
      />
      <TradingCard
        title="Trade Signals"
        value={null}
        change={0}
        customContent={tradeSignals}
      />
      <TradingCard
        title="Price Action Summary"
        value={null}
        change={0}
        customContent={priceAction}
      />
    </div>
  );
};
