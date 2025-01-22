import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/ThemeToggle";

interface HeaderProps {
  symbol: string;
}

export const Header = ({ symbol }: HeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-3xl font-bold text-foreground"
        >
          {symbol}
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground mt-1"
        >
          Technical Analysis Dashboard
        </motion.p>
      </div>
      <div className="flex items-center gap-4">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-sm text-muted-foreground bg-trading-card px-4 py-2 rounded-lg border border-trading-border"
        >
          Last updated: {new Date().toLocaleTimeString()}
        </motion.div>
        <ThemeToggle />
      </div>
    </div>
  );
};