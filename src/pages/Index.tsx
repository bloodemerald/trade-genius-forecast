import { useState } from "react";
import { TradingCard } from "@/components/TradingCard";
import { TradeScenario } from "@/components/TradeScenario";
import { motion } from "framer-motion";
import ImageUploader from "@/components/ImageUploader";

interface TradingData {
  symbol: string;
  price: number[];
  volume: number;
  indicators: {
    EMA_9: number;
    MA_10: number;
    MACD: number[];
    RSI_14: number;
  };
}

const Index = () => {
  const [data, setData] = useState<TradingData>({
    symbol: "BARRON/SOL",
    price: [0.05265, 0.05516, 0.05265, 0.05297],
    volume: 198947,
    indicators: {
      EMA_9: 0.05764,
      MA_10: 0.05865,
      MACD: [-0.001757, 0.008922, 0.002650],
      RSI_14: 46.49,
    },
  });

  const calculateScenarios = (currentPrice: number) => {
    const volatility = Math.abs(data.price[1] - data.price[2]) / data.price[3] * 100; // Using high-low range
    
    return [
      {
        entry: currentPrice,
        stopLoss: currentPrice * (1 - volatility * 0.5 / 100),
        takeProfit: currentPrice * (1 + volatility * 1.25 / 100),
        get riskReward() {
          return (this.takeProfit - this.entry) / (this.entry - this.stopLoss);
        },
        get potential() {
          return ((this.takeProfit - this.entry) / this.entry) * 100;
        }
      },
      {
        entry: currentPrice,
        stopLoss: currentPrice * (1 - volatility * 0.75 / 100),
        takeProfit: currentPrice * (1 + volatility * 2.25 / 100),
        get riskReward() {
          return (this.takeProfit - this.entry) / (this.entry - this.stopLoss);
        },
        get potential() {
          return ((this.takeProfit - this.entry) / this.entry) * 100;
        }
      },
      {
        entry: currentPrice,
        stopLoss: currentPrice * (1 - volatility / 100),
        takeProfit: currentPrice * (1 + volatility * 3.375 / 100),
        get riskReward() {
          return (this.takeProfit - this.entry) / (this.entry - this.stopLoss);
        },
        get potential() {
          return ((this.takeProfit - this.entry) / this.entry) * 100;
        }
      }
    ];
  };

  const scenarios = calculateScenarios(data.price[3]);

  const calculateChange = (current: number, previous: number) => {
    return ((current - previous) / previous) * 100;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1F2C] to-[#2C1A2F] text-white p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#9b87f5] to-[#D6BCFA]">
              {data.symbol}
            </h1>
            <p className="text-gray-400 mt-1">Technical Analysis Dashboard</p>
          </div>
          <div className="text-sm text-gray-400">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>

        <div className="backdrop-blur-lg bg-white/5 rounded-2xl p-6 border border-white/10">
          <h2 className="text-xl font-semibold mb-4 text-[#9b87f5]">Image Analysis</h2>
          <ImageUploader onAnalysisComplete={setData} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <TradingCard
            title="Current Price"
            value={data.price[3]}
            change={calculateChange(data.price[3], data.price[0])}
            isPrice
          />
          <TradingCard
            title="24h Volume"
            value={data.volume}
            change={0}
          />
          <TradingCard
            title="RSI (14)"
            value={data.indicators.RSI_14}
            change={0}
          />
          <TradingCard
            title="MACD"
            value={data.indicators.MACD[2]}
            change={calculateChange(data.indicators.MACD[2], data.indicators.MACD[1])}
          />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-6 text-[#9b87f5]">Trading Scenarios</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scenarios.map((scenario, index) => (
              <TradeScenario key={index} {...scenario} index={index} />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Index;