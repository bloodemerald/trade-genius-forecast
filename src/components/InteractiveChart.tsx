import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { motion } from "framer-motion";
import { Eye, EyeOff, ExternalLink } from "lucide-react";
import { Button } from "./ui/button";

interface ChartData {
  name: string;
  price: number;
  EMA_9?: number;
  MA_10?: number;
  MACD?: number;
}

interface InteractiveChartProps {
  price: number[];
  indicators: {
    EMA_9: number;
    MA_10: number;
    MACD: number[];
  };
}

export const InteractiveChart = ({ price, indicators }: InteractiveChartProps) => {
  const [showEMA, setShowEMA] = useState(true);
  const [showMA, setShowMA] = useState(true);
  const [showMACD, setShowMACD] = useState(true);

  // Transform data for Recharts with proper time labels
  const data: ChartData[] = [
    { name: "Open", price: price[0], EMA_9: indicators.EMA_9, MA_10: indicators.MA_10, MACD: indicators.MACD[0] },
    { name: "High", price: price[1], EMA_9: indicators.EMA_9, MA_10: indicators.MA_10, MACD: indicators.MACD[1] },
    { name: "Low", price: price[2], EMA_9: indicators.EMA_9, MA_10: indicators.MA_10, MACD: indicators.MACD[2] },
    { name: "Close", price: price[3], EMA_9: indicators.EMA_9, MA_10: indicators.MA_10, MACD: indicators.MACD[2] },
  ];

  // Calculate support and resistance levels
  const support = Math.min(...price);
  const resistance = Math.max(...price);

  // Function to open DexScreener
  const openDexScreener = () => {
    // Extract token address from chart data or use a default
    // This is a placeholder - you would need to get the actual token address from your data
    const tokenAddress = "YOUR_TOKEN_ADDRESS"; // This should come from your data
    window.open(`https://dexscreener.com/ethereum/${tokenAddress}`, '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative backdrop-blur-md bg-[#1A1F2C]/80 rounded-xl p-6 shadow-lg border border-[#9b87f5]/20 overflow-hidden group hover:border-[#9b87f5]/40 transition-all duration-300"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#9b87f5]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="flex justify-between items-center mb-4 relative z-10">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowEMA(!showEMA)}
            className={`${showEMA ? 'bg-[#9b87f5]/20' : ''}`}
          >
            {showEMA ? <Eye className="w-4 h-4 mr-2" /> : <EyeOff className="w-4 h-4 mr-2" />}
            EMA-9
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowMA(!showMA)}
            className={`${showMA ? 'bg-[#9b87f5]/20' : ''}`}
          >
            {showMA ? <Eye className="w-4 h-4 mr-2" /> : <EyeOff className="w-4 h-4 mr-2" />}
            MA-10
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowMACD(!showMACD)}
            className={`${showMACD ? 'bg-[#9b87f5]/20' : ''}`}
          >
            {showMACD ? <Eye className="w-4 h-4 mr-2" /> : <EyeOff className="w-4 h-4 mr-2" />}
            MACD
          </Button>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={openDexScreener}
          className="flex items-center gap-2"
        >
          <ExternalLink className="w-4 h-4" />
          View on DexScreener
        </Button>
      </div>

      <div className="h-[400px] relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-[#9b87f5]/20" />
            <XAxis 
              dataKey="name" 
              className="text-[#D6BCFA]"
            />
            <YAxis 
              className="text-[#D6BCFA]"
              domain={['auto', 'auto']}
              tickFormatter={(value) => value.toFixed(8)}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1A1F2C', 
                border: '1px solid rgba(155, 135, 245, 0.2)',
                borderRadius: '8px',
                color: '#D6BCFA'
              }}
              formatter={(value: number) => [value.toFixed(8), '']}
            />
            <Legend />
            
            {/* Support and Resistance Lines */}
            <ReferenceLine 
              y={support} 
              stroke="#4ECDC4" 
              strokeDasharray="3 3" 
              label={{ value: 'Support', position: 'right', fill: '#4ECDC4' }} 
            />
            <ReferenceLine 
              y={resistance} 
              stroke="#FF6B6B" 
              strokeDasharray="3 3" 
              label={{ value: 'Resistance', position: 'right', fill: '#FF6B6B' }} 
            />

            <Line
              type="monotone"
              dataKey="price"
              stroke="#D6BCFA"
              strokeWidth={2}
              dot={{ fill: '#D6BCFA' }}
              name="Price"
            />
            {showEMA && (
              <Line
                type="monotone"
                dataKey="EMA_9"
                stroke="#FF6B6B"
                strokeWidth={2}
                dot={false}
                name="EMA-9"
              />
            )}
            {showMA && (
              <Line
                type="monotone"
                dataKey="MA_10"
                stroke="#4ECDC4"
                strokeWidth={2}
                dot={false}
                name="MA-10"
              />
            )}
            {showMACD && (
              <Line
                type="monotone"
                dataKey="MACD"
                stroke="#FFE66D"
                strokeWidth={2}
                dot={false}
                name="MACD"
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Decorative corner elements */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-[#9b87f5]/30" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-[#9b87f5]/30" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-[#9b87f5]/30" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-[#9b87f5]/30" />
    </motion.div>
  );
};