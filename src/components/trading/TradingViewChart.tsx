
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
    TradingView?: {
      MediumWidget: new (config: any) => { remove: () => void };
    };
    tvWidget?: { remove: () => void } | null;
  }
}

export const TradingViewChart = ({ symbol, onChartLoad }: TradingViewChartProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const isMounted = useRef(true);
  const [isLoading, setIsLoading] = useState(true);
  
  // Reset mounted state on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);
  
  // Handle TradingView widget
  useEffect(() => {
    let scriptElement: HTMLScriptElement | null = null;

    const loadTradingViewWidget = () => {
      if (!isMounted.current) return;
      
      try {
        if (window.TradingView && containerRef.current) {
          // Safely remove existing widget if it exists
          if (window.tvWidget) {
            try {
              window.tvWidget.remove();
            } catch (e) {
              console.error('Error removing existing widget:', e);
            }
            window.tvWidget = null;
          }

          // Create new widget instance
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
            setIsLoading(false);
            onChartLoad?.();
          }
        } else {
          console.error('TradingView library not loaded');
          if (isMounted.current) {
            toast.error("Chart failed to load. Please refresh the page.");
          }
        }
      } catch (error) {
        console.error('Error initializing TradingView widget:', error);
        if (isMounted.current) {
          toast.error("Failed to initialize chart. Please refresh the page.");
        }
      }
    };

    const createScript = () => {
      // Create new script element
      scriptElement = document.createElement('script');
      scriptElement.type = 'text/javascript';
      scriptElement.src = 'https://s3.tradingview.com/tv.js';
      scriptElement.async = true;
      scriptElement.onload = loadTradingViewWidget;
      scriptElement.onerror = () => {
        console.error('Failed to load TradingView script');
        if (isMounted.current) {
          toast.error("Failed to load chart. Please check your internet connection.");
        }
      };

      // Store reference and append to document
      scriptRef.current = scriptElement;
      document.head.appendChild(scriptElement);
    };

    createScript();

    // Cleanup function
    return () => {
      // Cleanup in reverse order of creation
      if (isMounted.current) {
        setIsLoading(true);
      }

      // 1. Remove widget if it exists
      if (window.tvWidget) {
        try {
          window.tvWidget.remove();
        } catch (e) {
          console.error('Error removing widget during cleanup:', e);
        }
        window.tvWidget = null;
      }

      // 2. Remove script element if it exists
      if (scriptRef.current && document.head.contains(scriptRef.current)) {
        try {
          document.head.removeChild(scriptRef.current);
        } catch (e) {
          console.error('Error removing script during cleanup:', e);
        }
      }

      // 3. Clear references
      scriptRef.current = null;
      scriptElement = null;
    };
  }, [symbol, onChartLoad]);

  return (
    <div ref={containerRef} id="trading-chart-container" className="relative w-full h-[500px] rounded-lg overflow-hidden bg-trading-card border border-trading-border">
      <AnimatePresence>
        {isLoading && (
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
