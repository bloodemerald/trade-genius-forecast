
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
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const isMounted = useRef(true);
  
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);
  
  useEffect(() => {
    const loadTradingViewWidget = () => {
      if (!isMounted.current) return;
      
      if (typeof window.TradingView !== 'undefined' && containerRef.current) {
        try {
          if (window.tvWidget) {
            window.tvWidget.remove();
            window.tvWidget = null;
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

          if (isMounted.current) {
            onChartLoad?.();
          }
        } catch (error) {
          console.error('Error initializing TradingView widget:', error);
          if (isMounted.current) {
            toast.error("Failed to initialize chart. Please refresh the page.");
          }
        }
      } else {
        console.error('TradingView library not loaded');
        if (isMounted.current) {
          toast.error("Chart failed to load. Please refresh the page.");
        }
      }
    };

    // Remove existing script if any
    if (scriptRef.current && scriptRef.current.parentNode) {
      scriptRef.current.parentNode.removeChild(scriptRef.current);
      scriptRef.current = null;
    }

    // Create and load new script
    const script = document.createElement('script');
    scriptRef.current = script;
    script.type = 'text/javascript';
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = loadTradingViewWidget;
    script.onerror = () => {
      console.error('Failed to load TradingView script');
      if (isMounted.current) {
        toast.error("Failed to load chart. Please check your internet connection.");
      }
    };

    document.head.appendChild(script);

    // Cleanup function
    return () => {
      try {
        if (window.tvWidget) {
          window.tvWidget.remove();
          window.tvWidget = null;
        }
        
        if (scriptRef.current && document.head.contains(scriptRef.current)) {
          document.head.removeChild(scriptRef.current);
        }
        scriptRef.current = null;
      } catch (error) {
        console.error('Error during cleanup:', error);
      }
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
