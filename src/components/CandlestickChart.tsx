import React from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Line,
  ReferenceLine,
} from "recharts";
import { motion } from "framer-motion";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";

interface CandleData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface CandlestickChartProps {
  data: CandleData[];
}

const CandlestickChart = ({ data }: CandlestickChartProps) => {
  const chartConfig = {
    price: {
      theme: {
        light: "#1e293b",
        dark: "#e2e8f0",
      },
    },
    profit: {
      theme: {
        light: "#22c55e",
        dark: "#16a34a",
      },
    },
    loss: {
      theme: {
        light: "#ef4444",
        dark: "#dc2626",
      },
    },
  };

  const formatPrice = (value: number) => value.toFixed(6);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full h-[400px] p-4 rounded-xl border border-border bg-card"
    >
      <ChartContainer config={chartConfig}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}>
            <XAxis
              dataKey="date"
              scale="band"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              yAxisId="price"
              orientation="right"
              tickFormatter={formatPrice}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              yAxisId="volume"
              orientation="left"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;

                const data = payload[0].payload;
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-md">
                    <div className="grid gap-2">
                      <div className="flex items-center justify-between gap-8">
                        <span className="text-sm font-medium">Date</span>
                        <span className="text-sm text-muted-foreground">
                          {data.date}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-8">
                        <span className="text-sm font-medium">Open</span>
                        <span className="text-sm text-muted-foreground">
                          {formatPrice(data.open)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-8">
                        <span className="text-sm font-medium">High</span>
                        <span className="text-sm text-muted-foreground">
                          {formatPrice(data.high)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-8">
                        <span className="text-sm font-medium">Low</span>
                        <span className="text-sm text-muted-foreground">
                          {formatPrice(data.low)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-8">
                        <span className="text-sm font-medium">Close</span>
                        <span className="text-sm text-muted-foreground">
                          {formatPrice(data.close)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-8">
                        <span className="text-sm font-medium">Volume</span>
                        <span className="text-sm text-muted-foreground">
                          {data.volume.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              }}
            />
            <Bar
              yAxisId="volume"
              dataKey="volume"
              fill="currentColor"
              opacity={0.2}
              className="fill-muted-foreground"
            />
            <Bar
              yAxisId="price"
              dataKey="low"
              fill="transparent"
              stroke="currentColor"
            >
              {data.map((entry, index) => (
                <React.Fragment key={`candle-${index}`}>
                  <ReferenceLine
                    yAxisId="price"
                    y={entry.high}
                    stroke={entry.close >= entry.open ? "#22c55e" : "#ef4444"}
                    strokeWidth={2}
                  />
                  <ReferenceLine
                    yAxisId="price"
                    y={entry.low}
                    stroke={entry.close >= entry.open ? "#22c55e" : "#ef4444"}
                    strokeWidth={2}
                  />
                </React.Fragment>
              ))}
            </Bar>
            <Line
              yAxisId="price"
              type="monotone"
              dataKey="close"
              stroke="currentColor"
              dot={false}
              strokeWidth={2}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </ChartContainer>
    </motion.div>
  );
};

export default CandlestickChart;