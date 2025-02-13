
import { useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface TradingViewChartProps {
  symbol: string;
  onChartLoad?: () => void;
}

export const TradingViewChart = ({ symbol, onChartLoad }: TradingViewChartProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const loadTradingViewWidget = () => {
      if (typeof window.TradingView !== 'undefined' && containerRef.current) {
        if (window.tvWidget) {
          window.tvWidget.remove();
        }

        window.tvWidget = new window.TradingView.MediumWidget({
          symbols: [[symbol]],
          chartOnly: true,
          width: '100%',
          height: '500',
          locale: 'en',
          colorTheme: 'dark',
          autosize: false,
          showVolume: true,
          hideDateRanges: false,
          hideMarketStatus: false,
          scalePosition: 'right',
          scaleMode: 'Normal',
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
          fontSize: '12',
          noTimeScale: false,
          valuesTracking: '1',
          whereToShow: 'trading-chart-container',
          container_id: 'trading-chart-container',
        });

        onChartLoad?.();
      } else {
        console.error('TradingView library not loaded');
        toast.error("Chart failed to load. Please refresh the page.");
      }
    };

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = loadTradingViewWidget;
    script.onerror = () => {
      console.error('Failed to load TradingView script');
      toast.error("Failed to load chart. Please check your internet connection.");
    };

    document.head.appendChild(script);

    return () => {
      if (window.tvWidget) {
        window.tvWidget.remove();
      }
      document.head.removeChild(script);
    };
  }, [symbol, onChartLoad]);

  return (
    <div ref={containerRef} id="trading-chart-container" className="relative w-full h-[500px] rounded-lg overflow-hidden bg-trading-card border border-trading-border">
      <AnimatePresence>
        {!window.tvWidget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-trading-card"
          >
            <Loader2 className="w-8 h-8 animate-spin text-trading-accent" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
