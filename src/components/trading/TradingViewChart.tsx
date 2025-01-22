import { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';

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
        const response = await fetch(`https://api.dexscreener.com/latest/dex/search?q=${symbol}`);
        const data = await response.json();
        
        if (data.pairs && data.pairs.length > 0) {
          const pair = data.pairs[0];
          setPairAddress(pair.pairAddress);
          
          const tradingViewSymbol = `${pair.baseToken.symbol}${pair.quoteToken.symbol}`;
          
          const script = document.createElement('script');
          script.src = 'https://s3.tradingview.com/tv.js';
          script.async = true;
          script.onload = () => {
            if (containerRef.current) {
              new window.TradingView.widget({
                width: '100%',
                height: 500,
                symbol: tradingViewSymbol,
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
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching pair data:', error);
        setLoading(false);
      }
    };

    if (symbol) {
      fetchPairData();
    }

    return () => {
      const scriptElement = document.querySelector('script[src="https://s3.tradingview.com/tv.js"]');
      if (scriptElement) {
        scriptElement.remove();
      }
    };
  }, [symbol]);

  if (loading) {
    return (
      <div className="w-full h-[500px] bg-trading-card border border-trading-border rounded-lg flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Loading chart...</span>
        </div>
      </div>
    );
  }

  return (
    <div id="trading-chart-container" className="w-full bg-trading-card border border-trading-border rounded-lg overflow-hidden">
      <div
        id={`tradingview_${symbol.toLowerCase().replace('/', '_')}`}
        ref={containerRef}
        className="w-full"
      />
    </div>
  );
};