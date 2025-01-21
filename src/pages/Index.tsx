import { useState } from "react";
import { TradingCard } from "@/components/TradingCard";
import { TradeScenario } from "@/components/TradeScenario";
import { motion } from "framer-motion";
import ImageUploader from "@/components/ImageUploader";

interface TradingData {
  symbol: string;
  tokenAddress: string | null;
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
    tokenAddress: null,
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
    const volatility = Math.abs(data.price[1] - data.price[2]) / data.price[3] * 100;
    const averageVolume = data.volume;
    const isOverbought = data.indicators.RSI_14 > 70;
    const isOversold = data.indicators.RSI_14 < 30;
    const trendStrength = Math.abs(data.indicators.MACD[2]);
    
    const riskMultiplier = isOversold ? 0.8 : isOverbought ? 1.2 : 1;
    const rewardMultiplier = trendStrength > 0.005 ? 1.5 : 1;
    
    return [
      {
        entry: currentPrice,
        stopLoss: currentPrice * (1 - volatility * 0.5 * riskMultiplier / 100),
        takeProfit: currentPrice * (1 + volatility * 1.25 * rewardMultiplier / 100),
        get riskReward() {
          return (this.takeProfit - this.entry) / (this.entry - this.stopLoss);
        },
        get potential() {
          return ((this.takeProfit - this.entry) / this.entry) * 100;
        }
      },
      {
        entry: currentPrice,
        stopLoss: currentPrice * (1 - volatility * 0.75 * riskMultiplier / 100),
        takeProfit: currentPrice * (1 + volatility * 2.25 * rewardMultiplier / 100),
        get riskReward() {
          return (this.takeProfit - this.entry) / (this.entry - this.stopLoss);
        },
        get potential() {
          return ((this.takeProfit - this.entry) / this.entry) * 100;
        }
      },
      {
        entry: currentPrice,
        stopLoss: currentPrice * (1 - volatility * riskMultiplier / 100),
        takeProfit: currentPrice * (1 + volatility * 3.375 * rewardMultiplier / 100),
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
    <div className="min-h-screen bg-gradient-to-br from-[#1A1F2C] via-[#2C1A2F] to-[#1A1F2C] text-white p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#9b87f5] to-[#D6BCFA]"
            >
              {data.symbol}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-[#D6BCFA]/70 mt-1"
            >
              Technical Analysis Dashboard
            </motion.p>
          </div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-sm text-[#D6BCFA]/70 bg-[#1A1F2C]/50 px-4 py-2 rounded-full border border-[#9b87f5]/20"
          >
            Last updated: {new Date().toLocaleTimeString()}
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="backdrop-blur-lg bg-[#1A1F2C]/50 rounded-2xl p-6 border border-[#9b87f5]/20 relative overflow-hidden group hover:border-[#9b87f5]/40 transition-all duration-300"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#9b87f5]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <h2 className="text-xl font-semibold mb-4 text-[#9b87f5] relative z-10">Image Analysis</h2>
          <div className="relative z-10">
            <ImageUploader onAnalysisComplete={setData} />
          </div>
          
          {/* Decorative corner elements */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-[#9b87f5]/30" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-[#9b87f5]/30" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-[#9b87f5]/30" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-[#9b87f5]/30" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <TradingCard
            title="Current Price"
            value={data.price[3]}
            change={calculateChange(data.price[3], data.price[0])}
            isPrice
            showPercentage
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
            showPercentage
          />
        </div>

        <div>
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xl font-semibold mb-6 text-[#9b87f5]"
          >
            Trading Scenarios
          </motion.h2>
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