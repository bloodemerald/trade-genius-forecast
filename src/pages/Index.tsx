import { useState, useEffect } from "react";
import { TradingCard } from "@/components/TradingCard";
import { TradeScenario } from "@/components/TradeScenario";
import { motion } from "framer-motion";

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

  const scenarios = [
    {
      entry: 0.05297,
      stopLoss: 0.05265,
      takeProfit: 0.05516,
      riskReward: 2.5,
      potential: 4.13,
    },
    {
      entry: 0.05300,
      stopLoss: 0.05250,
      takeProfit: 0.05600,
      riskReward: 3.0,
      potential: 5.66,
    },
    {
      entry: 0.05280,
      stopLoss: 0.05240,
      takeProfit: 0.05550,
      riskReward: 3.375,
      potential: 5.11,
    },
  ];

  const calculateChange = (current: number, previous: number) => {
    return ((current - previous) / previous) * 100;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">{data.symbol}</h1>
            <p className="text-gray-400 mt-1">Technical Analysis Dashboard</p>
          </div>
          <div className="text-sm text-gray-400">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

        <h2 className="text-xl font-semibold mb-6">Trading Scenarios</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scenarios.map((scenario, index) => (
            <TradeScenario key={index} {...scenario} index={index} />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Index;