import { useEffect, useRef } from 'react';

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

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      if (containerRef.current) {
        new window.TradingView.widget({
          width: '100%',
          height: 500,
          symbol: symbol,
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
      }
    };
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, [symbol]);

  return (
    <div className="w-full bg-trading-card border border-trading-border rounded-lg overflow-hidden">
      <div
        id={`tradingview_${symbol.toLowerCase().replace('/', '_')}`}
        ref={containerRef}
        className="w-full"
      />
    </div>
  );
};