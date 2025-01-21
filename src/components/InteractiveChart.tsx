import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface InteractiveChartProps {
  price: number[];
  indicators: {
    EMA_9: number;
    MA_10: number;
    MACD: number[];
  };
  tokenAddress?: string | null;
}

export const InteractiveChart = ({ tokenAddress }: InteractiveChartProps) => {
  const [chartUrl, setChartUrl] = useState<string>("");

  useEffect(() => {
    if (tokenAddress) {
      // Clean the token address to ensure it's properly formatted
      const cleanAddress = tokenAddress.trim().toLowerCase();
      const url = `https://dexscreener.com/ethereum/${cleanAddress}?embed=1&theme=dark`;
      console.log('Setting chart URL:', url); // Debug log
      setChartUrl(url);
    } else {
      toast.info("No token address detected in the image. Please try another screenshot.");
    }
  }, [tokenAddress]);

  if (!chartUrl) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative backdrop-blur-md bg-[#1A1F2C]/80 rounded-xl p-6 shadow-lg border border-[#9b87f5]/20 overflow-hidden group hover:border-[#9b87f5]/40 transition-all duration-300 h-[600px] flex items-center justify-center"
      >
        <p className="text-white/70">Upload a trading chart to view live data</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative backdrop-blur-md bg-[#1A1F2C]/80 rounded-xl p-6 shadow-lg border border-[#9b87f5]/20 overflow-hidden group hover:border-[#9b87f5]/40 transition-all duration-300 h-[600px]"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#9b87f5]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <iframe
        title="DexScreener Chart"
        src={chartUrl}
        className="w-full h-full border-0 rounded-lg"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
      />

      {/* Decorative corner elements */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-[#9b87f5]/30" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-[#9b87f5]/30" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-[#9b87f5]/30" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-[#9b87f5]/30" />
    </motion.div>
  );
};