
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
  const [isLoading, setIsLoading] = useState(true);
  const isMounted = useRef(true);
  const widgetContainerId = `trading-chart-container-${symbol}`;

  useEffect(() => {
    const script = document.createElement('script');
    let widget: { remove: () => void } | null = null;

    const loadTradingViewWidget = () => {
      if (!isMounted.current) return;
      
      try {
        if (window.TradingView && containerRef.current) {
          widget = new window.TradingView.MediumWidget({
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
            whereToShow: widgetContainerId,
            container_id: widgetContainerId,
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

    const initializeWidget = () => {
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
    };

    initializeWidget();

    // Cleanup function
    return () => {
      isMounted.current = false;
      setIsLoading(true);

      // Cleanup widget
      if (widget) {
        try {
          widget.remove();
        } catch (e) {
          console.error('Error removing widget:', e);
        }
      }

      // Remove script tag if it exists in document
      if (script && document.head.contains(script)) {
        document.head.removeChild(script);
      }

      // Clean up any leftover elements
      const container = document.getElementById(widgetContainerId);
      if (container) {
        while (container.firstChild) {
          container.removeChild(container.firstChild);
        }
      }
    };
  }, [symbol, onChartLoad, widgetContainerId]);

  return (
    <div 
      ref={containerRef} 
      id={widgetContainerId}
      className="relative w-full h-[500px] rounded-lg overflow-hidden bg-trading-card border border-trading-border"
    >
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
