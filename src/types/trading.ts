export interface TradingData {
  symbol: string;
  tokenAddress: string | null;
  price: number[];
  volume: number;
  indicators: {
    EMA_9: number;
    MA_10: number;
    MACD: number[];
    RSI_14: number;
  };
}

export interface AIResponse {
  suggestion: string;
  sentiment: number;
  confidence: number;
}