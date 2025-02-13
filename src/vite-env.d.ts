
/// <reference types="vite/client" />

interface TradingViewMediumWidget {
  new (config: {
    symbols: string[][];
    chartOnly: boolean;
    width: string;
    height: string;
    locale: string;
    colorTheme: string;
    autosize: boolean;
    showVolume: boolean;
    hideDateRanges: boolean;
    hideMarketStatus: boolean;
    scalePosition: string;
    scaleMode: string;
    fontFamily: string;
    fontSize: string;
    noTimeScale: boolean;
    valuesTracking: string;
    whereToShow: string;
    container_id: string;
  }): {
    remove: () => void;
  };
}

interface TradingViewStatic {
  MediumWidget: TradingViewMediumWidget;
}

declare global {
  interface Window {
    TradingView: TradingViewStatic;
    tvWidget: { remove: () => void } | null;
  }
}
