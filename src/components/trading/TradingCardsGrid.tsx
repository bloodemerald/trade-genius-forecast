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
        title="24h Volume"
        value={volume}
        change={0}
      />
      <TradingCard
        title="RSI (14)"
        value={rsi}
        change={0}
      />
      <TradingCard
        title="Market Sentiment"
        value={sentiment}
        change={0}
      />
    </div>
  );
};