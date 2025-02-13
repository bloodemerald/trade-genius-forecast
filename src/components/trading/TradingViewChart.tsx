
import { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface TradingViewChartProps {
  symbol: string;
}

declare global {
  interface Window {
    TradingView: any;
    tvWidget: any;
  }
}

export const TradingViewChart = ({ symbol }: TradingViewChartProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pairAddress, setPairAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const containerId = `tradingview_${symbol.toLowerCase().replace('/', '_')}`;

  useEffect(() => {
    let widget: any = null;
    const fetchPairData = async () => {
      try {
        if (!containerRef.current) {
          console.error('Container ref is not available');
          return;
        }

        // For Coinbase pairs, directly use COINBASE:SOLUSD format
        if (symbol === "SOL/USD") {
          widget = new window.TradingView.widget({
            autosize: true,
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
            container_id: containerId,
            backgroundColor: '#1A1F2C',
            gridColor: 'rgba(155, 135, 245, 0.2)',
            studies: [
              'RSI@tv-basicstudies',
              'MASimple@tv-basicstudies',
              'MACD@tv-basicstudies'
            ],
            onChartReady: () => {
              window.tvWidget = widget;
              setLoading(false);
            }
          });
          return;
        }

        // For other pairs, use DexScreener API
        const response = await fetch(`https://api.dexscreener.com/latest/dex/search?q=${symbol}`);
        const data = await response.json();
        
        if (data.pairs && data.pairs.length > 0) {
          const pair = data.pairs[0];
          setPairAddress(pair.pairAddress);
          
          widget = new window.TradingView.widget({
            autosize: true,
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
            container_id: containerId,
            backgroundColor: '#1A1F2C',
            gridColor: 'rgba(155, 135, 245, 0.2)',
            studies: [
              'RSI@tv-basicstudies',
              'MASimple@tv-basicstudies',
              'MACD@tv-basicstudies'
            ],
            onChartReady: () => {
              window.tvWidget = widget;
              setLoading(false);
            }
          });
        } else {
          toast.error('No trading pair found');
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching pair data:', error);
        toast.error('Failed to load trading chart');
        setLoading(false);
      }
    };

    const loadTradingViewScript = () => {
      return new Promise<void>((resolve, reject) => {
        if (window.TradingView) {
          resolve();
          return;
        }

        const script = document.createElement('script');
        script.src = 'https://s3.tradingview.com/tv.js';
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => {
          reject(new Error('Failed to load TradingView script'));
          toast.error('Failed to load TradingView script');
          setLoading(false);
        };
        document.head.appendChild(script);
      });
    };

    const initializeChart = async () => {
      try {
        await loadTradingViewScript();
        await fetchPairData();
      } catch (error) {
        console.error('Error initializing chart:', error);
        toast.error('Failed to initialize chart');
        setLoading(false);
      }
    };

    initializeChart();

    return () => {
      if (window.tvWidget) {
        window.tvWidget.remove();
        window.tvWidget = null;
      }
    };
  }, [symbol, containerId]);

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
          className="w-full h-[500px] bg-trading-card border border-trading-border rounded-lg overflow-hidden"
        >
          <div
            id={containerId}
            ref={containerRef}
            className="w-full h-full"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
