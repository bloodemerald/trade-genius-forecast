
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

    const loadTradingViewScript = () => {
      return new Promise<void>((resolve, reject) => {
        if (window.TradingView) {
          resolve();
          return;
        }

        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://s3.tradingview.com/tv.js';
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load TradingView script'));
        document.head.appendChild(script);
      });
    };

    const initializeWidget = () => {
      if (!window.TradingView || !containerRef.current) return;

      try {
        const widgetOptions = {
          autosize: true,
          symbol: symbol === "SOL/USD" ? "COINBASE:SOLUSD" : symbol,
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
          library_path: '/charting_library/',
          studies: [
            'RSI@tv-basicstudies',
            'MASimple@tv-basicstudies',
            'MACD@tv-basicstudies'
          ],
          disabled_features: ["use_localstorage_for_settings"],
          enabled_features: ["study_templates"],
          overrides: {
            "mainSeriesProperties.style": 1,
            "symbolWatermarkProperties.color": "rgba(0, 0, 0, 0)",
            "paneProperties.background": "#1A1F2C",
            "paneProperties.gridProperties.color": "rgba(155, 135, 245, 0.2)"
          },
          custom_css_url: '/chart.css',
          onChartReady: () => {
            if (isMounted) {
              setLoading(false);
              onChartLoad?.();
            }
          }
        };

        const container = document.getElementById(containerId);
        if (container) {
          container.innerHTML = '';
          const widget = new window.TradingView.widget(widgetOptions);
          window.tvWidget = widget;
        }
      } catch (error) {
        console.error('Error initializing TradingView widget:', error);
        toast.error('Failed to initialize chart');
        setLoading(false);
      }
    };

    const initialize = async () => {
      try {
        await loadTradingViewScript();
        if (isMounted) {
          initializeWidget();
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
      if (window.tvWidget) {
        try {
          window.tvWidget.remove();
          window.tvWidget = null;
        } catch (error) {
          console.error('Error cleaning up widget:', error);
        }
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
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
};
