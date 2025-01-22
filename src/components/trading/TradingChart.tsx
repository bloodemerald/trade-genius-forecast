import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "@/components/ui/card";

interface TradingChartProps {
  data: {
    name: string;
    value: number;
  }[];
}

export const TradingChart = ({ data }: TradingChartProps) => {
  return (
    <Card className="p-6 bg-trading-card border-trading-border">
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="name" 
              stroke="#9CA3AF"
              fontSize={12}
            />
            <YAxis 
              stroke="#9CA3AF"
              fontSize={12}
              tickFormatter={(value) => `$${value.toFixed(4)}`}
            />
            <CartesianGrid 
              strokeDasharray="3 3" 
              vertical={false}
              stroke="rgba(255, 255, 255, 0.1)"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1A1F2C',
                border: '1px solid rgba(155, 135, 245, 0.2)',
                borderRadius: '8px',
                color: '#fff'
              }}
              labelStyle={{ color: '#9CA3AF' }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#22c55e"
              fillOpacity={1}
              fill="url(#colorValue)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};