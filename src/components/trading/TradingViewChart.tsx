
import { useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps
} from 'recharts';

interface TradingViewChartProps {
  symbol: string;
  onChartLoad?: () => void;
  data?: { time: string; price: number }[];
}

export const TradingViewChart = ({ symbol, onChartLoad, data = [] }: TradingViewChartProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (containerRef.current) {
      onChartLoad?.();
    }
  }, [onChartLoad]);

  const chartData = data.length > 0 ? data : [
    { time: '9:30', price: 101.25 },
    { time: '10:00', price: 102.30 },
    { time: '10:30', price: 100.80 },
    { time: '11:00', price: 101.50 },
    { time: '11:30', price: 101.25 }
  ];

  const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      return (
        <div className="bg-trading-card border border-trading-border p-2 rounded-lg">
          <p className="text-sm text-foreground">{`$${typeof value === 'number' ? value.toFixed(2) : value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div ref={containerRef} id="trading-chart-container" className="relative w-full h-[500px] rounded-lg overflow-hidden bg-trading-card border border-trading-border">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis 
            dataKey="time" 
            stroke="#9CA3AF"
            fontSize={12}
          />
          <YAxis 
            stroke="#9CA3AF"
            fontSize={12}
            domain={['auto', 'auto']}
            tickFormatter={(value: number) => `$${value.toFixed(2)}`}
          />
          <Tooltip content={CustomTooltip} />
          <Bar 
            dataKey="price" 
            fill="#9b87f5"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
