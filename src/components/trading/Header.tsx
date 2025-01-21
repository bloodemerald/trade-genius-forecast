import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/ThemeToggle";

interface HeaderProps {
  symbol: string;
}

export const Header = ({ symbol }: HeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#9b87f5] to-[#D6BCFA]"
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
          className="text-sm text-muted-foreground bg-background/50 px-4 py-2 rounded-full border border-[#9b87f5]/20"
        >
          Last updated: {new Date().toLocaleTimeString()}
        </motion.div>
        <ThemeToggle />
      </div>
    </div>
  );
};