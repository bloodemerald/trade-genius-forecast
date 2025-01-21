import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface TradingCardProps {
  title: string;
  value: number;
  change: number;
  isPrice?: boolean;
}

export const TradingCard = ({ title, value, change, isPrice = false }: TradingCardProps) => {
  const formatValue = (val: number) => {
    return isPrice
      ? val.toLocaleString("en-US", {
          minimumFractionDigits: 8,
          maximumFractionDigits: 8,
        })
      : val.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="backdrop-blur-md bg-white/10 rounded-xl p-6 shadow-lg border border-gray-200/20"
    >
      <h3 className="text-sm font-medium text-gray-500 mb-2">{title}</h3>
      <div className="flex items-end gap-2">
        <span className="text-2xl font-semibold">{formatValue(value)}</span>
        <div
          className={`flex items-center ${
            change >= 0 ? "text-profit" : "text-loss"
          } text-sm font-medium`}
        >
          {change >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
          {Math.abs(change)}%
        </div>
      </div>
    </motion.div>
  );
};