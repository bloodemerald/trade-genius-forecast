import { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TradingViewChartProps {
  symbol: string;
}

declare global {
  interface Window {
    TradingView: any;
  }
}

export const TradingViewChart = ({ symbol }: TradingViewChartProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pairAddress, setPairAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPairData = async () => {
      try {
        setLoading(true);
        // For Coinbase pairs, directly use COINBASE:SOLUSD format
        if (symbol === "SOL/USD") {
          if (containerRef.current) {
            new window.TradingView.widget({
              width: '100%',
              height: 500,
              symbol: "COINBASE:SOLUSD",
              interval: 'D',
              timezone: 'Etc/UTC',
              theme: 'dark',
              style: '1',
              locale: 'en',
              toolbar_bg: '#1A1F2C',
              enable_publishing: false,
              hide_side_toolbar: false,
              allow_symbol_change: true,
              container_id: containerRef.current.id,
              backgroundColor: '#1A1F2C',
              gridColor: 'rgba(155, 135, 245, 0.2)',
              studies: [
                'RSI@tv-basicstudies',
                'MASimple@tv-basicstudies',
                'MACD@tv-basicstudies'
              ]
            });
            setTimeout(() => setLoading(false), 1000); // Add a small delay to ensure chart loads
            return;
          }
        }

        // For other pairs, use DexScreener API
        const response = await fetch(`https://api.dexscreener.com/latest/dex/search?q=${symbol}`);
        const data = await response.json();
        
        if (data.pairs && data.pairs.length > 0) {
          const pair = data.pairs[0];
          setPairAddress(pair.pairAddress);
          
          if (containerRef.current) {
            new window.TradingView.widget({
              width: '100%',
              height: 500,
              symbol: `${pair.baseToken.symbol}${pair.quoteToken.symbol}`,
              interval: 'D',
              timezone: 'Etc/UTC',
              theme: 'dark',
              style: '1',
              locale: 'en',
              toolbar_bg: '#1A1F2C',
              enable_publishing: false,
              hide_side_toolbar: false,
              allow_symbol_change: true,
              container_id: containerRef.current.id,
              backgroundColor: '#1A1F2C',
              gridColor: 'rgba(155, 135, 245, 0.2)',
              studies: [
                'RSI@tv-basicstudies',
                'MASimple@tv-basicstudies',
                'MACD@tv-basicstudies'
              ]
            });
            setTimeout(() => setLoading(false), 1000); // Add a small delay to ensure chart loads
          }
        }
      } catch (error) {
        console.error('Error fetching pair data:', error);
        setLoading(false);
      }
    };

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      if (symbol) {
        fetchPairData();
      }
    };
    document.head.appendChild(script);

    return () => {
      const scriptElement = document.querySelector('script[src="https://s3.tradingview.com/tv.js"]');
      if (scriptElement) {
        scriptElement.remove();
      }
    };
  }, [symbol]);

  return (
    <AnimatePresence mode="wait">
      {loading ? (
        <motion.div 
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="w-full h-[500px] bg-trading-card border border-trading-border rounded-lg flex items-center justify-center"
        >
          <motion.div 
            className="flex items-center gap-2"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Loading chart...</span>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          key="chart"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          id="trading-chart-container" 
          className="w-full h-[500px] bg-trading-card border border-trading-border rounded-lg overflow-hidden"
        >
          <div
            id={`tradingview_${symbol.toLowerCase().replace('/', '_')}`}
            ref={containerRef}
            className="w-full h-full"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};