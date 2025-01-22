import { TradingCard } from "@/components/TradingCard";

interface TradingCardsGridProps {
  currentPrice: number;
  previousPrice: number;
  volume: number;
  rsi: number;
  sentiment: number;
}

export const TradingCardsGrid = ({
  currentPrice,
  previousPrice,
  volume,
  rsi,
  sentiment
}: TradingCardsGridProps) => {
  const calculateChange = (current: number, previous: number) => {
    return ((current - previous) / previous) * 100;
  };

  // Simulated chart analysis data (replace with actual analysis logic)
  const chartObservations = [
    "Support level at 0.0525",
    "Resistance at 0.0535",
    "Rising wedge pattern forming"
  ].join("\n");

  const tradeSignals = [
    "Bullish MACD crossover",
    "RSI showing oversold",
    "Volume spike detected"
  ].join("\n");

  const priceAction = [
    "Higher lows in last 4 candles",
    "Avg daily range: 2.3%",
    "Bullish engulfing pattern"
  ].join("\n");

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <TradingCard
        title="Current Price"
        value={currentPrice}
        change={calculateChange(currentPrice, previousPrice)}
        isPrice
        showPercentage
      />
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