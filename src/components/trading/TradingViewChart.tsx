
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
      widget: new (config: any) => { remove: () => void };
    };
  }
}

export const TradingViewChart = ({ symbol, onChartLoad }: TradingViewChartProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const widgetRef = useRef<{ remove: () => void } | null>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    const containerId = 'tradingview_widget';
    
    const loadTradingViewWidget = () => {
      if (!window.TradingView || !containerRef.current || !isMounted.current) return;

      try {
        // Clean up previous widget if it exists
        if (widgetRef.current) {
          widgetRef.current.remove();
          widgetRef.current = null;
        }

        // Create new widget
        widgetRef.current = new window.TradingView.widget({
          symbol: symbol,
          interval: 'D',
          container_id: containerId,
          width: '100%',
          height: '500',
          theme: 'dark',
          style: '1',
          toolbar_bg: '#f1f3f6',
          enable_publishing: false,
          allow_symbol_change: true,
          save_image: false,
          studies: [
            "MASimple@tv-basicstudies",
            "RSI@tv-basicstudies",
            "MACD@tv-basicstudies"
          ],
          locale: 'en'
        });

        setIsLoading(false);
        onChartLoad?.();
      } catch (error) {
        console.error('Error creating TradingView widget:', error);
        toast.error('Failed to load chart. Please refresh the page.');
      }
    };

    // Load TradingView script
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = loadTradingViewWidget;
    script.onerror = () => toast.error('Failed to load chart. Please check your connection.');
    document.head.appendChild(script);

    return () => {
      if (widgetRef.current) {
        try {
          widgetRef.current.remove();
          widgetRef.current = null;
        } catch (e) {
          console.error('Error removing widget:', e);
        }
      }
      
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [symbol, onChartLoad]);

  return (
    <div className="relative w-full h-[500px] rounded-lg overflow-hidden bg-trading-card border border-trading-border">
      <div 
        ref={containerRef}
        id="tradingview_widget"
        className="w-full h-full"
      />
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
