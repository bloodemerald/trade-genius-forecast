
import { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface TradingViewChartProps {
  symbol: string;
  onChartLoad?: () => void;
}

declare global {
  interface Window {
    TradingView: any;
    tvWidget: any;
  }
}

export const TradingViewChart = ({ symbol, onChartLoad }: TradingViewChartProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const containerId = 'trading-chart-container';

  useEffect(() => {
    let isMounted = true;

    const initializeWidget = () => {
      if (!containerRef.current) return;

      try {
        const container = document.getElementById(containerId);
        if (container) {
          container.innerHTML = `
            <div class="tradingview-widget-container">
              <div id="tradingview_${containerId}"></div>
            </div>
          `;

          new TradingView.MediumWidget({
            symbols: [[symbol === "SOL/USD" ? "COINBASE:SOLUSD" : symbol]],
            chartOnly: false,
            width: "100%",
            height: "100%",
            locale: "en",
            colorTheme: "dark",
            autosize: true,
            showVolume: true,
            hideDateRanges: false,
            hideMarketStatus: true,
            scalePosition: "right",
            scaleMode: "Normal",
            fontFamily: "-apple-system, BlinkMacSystemFont, Trebuchet MS, Roboto, Ubuntu, sans-serif",
            fontSize: "10",
            noTimeScale: false,
            valuesTracking: "1",
            whereToShow: `tradingview_${containerId}`,
            container_id: `tradingview_${containerId}`,
          });

          if (isMounted) {
            setLoading(false);
            onChartLoad?.();
          }
        }
      } catch (error) {
        console.error('Error initializing TradingView widget:', error);
        toast.error('Failed to initialize chart');
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
        script.src = "https://s3.tradingview.com/tv.js";
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load TradingView script'));
        document.head.appendChild(script);
      });
    };

    const initialize = async () => {
      try {
        await loadTradingViewScript();
        if (isMounted) {
          // Add a small delay to ensure TradingView is fully loaded
          setTimeout(initializeWidget, 100);
        }
      } catch (error) {
        console.error('Error loading TradingView:', error);
        toast.error('Failed to load trading chart');
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initialize();

    return () => {
      isMounted = false;
      const container = document.getElementById(containerId);
      if (container) {
        container.innerHTML = '';
      }
    };
  }, [symbol, onChartLoad]);

  return (
    <div className="relative w-full h-[500px] rounded-lg overflow-hidden">
      <AnimatePresence mode="wait">
        {loading && (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-trading-card border border-trading-border rounded-lg flex items-center justify-center z-10"
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
        )}
      </AnimatePresence>
      <div
        id={containerId}
        ref={containerRef}
        className="absolute inset-0 w-full h-full bg-trading-card"
      />
    </div>
  );
};
