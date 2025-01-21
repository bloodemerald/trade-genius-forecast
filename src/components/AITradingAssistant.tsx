import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Brain, TrendingUp } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";

interface MarketCondition {
  price: number;
  volume: number;
  rsi: number;
  macd: number[];
}

export const AITradingAssistant = ({ marketCondition }: { marketCondition: MarketCondition }) => {
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const { toast } = useToast();

  const analyzeMarket = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://wadzjfyhpalchlhidlyk.supabase.co/functions/v1/ai-trading-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          marketData: {
            price: marketCondition.price,
            volume: marketCondition.volume,
            rsi: marketCondition.rsi,
            macd: marketCondition.macd.join(', ')
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI suggestion');
      }

      const data = await response.json();
      setSuggestion(data.suggestion);
    } catch (error) {
      console.error('Error getting AI suggestion:', error);
      toast({
        title: "Error",
        description: "Failed to get AI trading suggestion. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 backdrop-blur-md bg-[#1A1F2C]/90 border border-[#9b87f5]/20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Brain className="text-[#9b87f5]" size={24} />
          <h2 className="text-xl font-semibold text-[#D6BCFA]">AI Trading Assistant</h2>
        </div>
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button variant="ghost" size="icon">
              <TrendingUp className="h-4 w-4" />
            </Button>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <p className="text-sm">
              The AI assistant analyzes current market conditions including price, volume, RSI, and MACD 
              to provide trading suggestions. These are recommendations only - always do your own research.
            </p>
          </HoverCardContent>
        </HoverCard>
      </div>

      <div className="space-y-4">
        <Button 
          onClick={analyzeMarket} 
          disabled={loading}
          className="w-full bg-[#9b87f5] hover:bg-[#8b77e5] text-white"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            'Get Trading Suggestion'
          )}
        </Button>

        {suggestion && (
          <div className="mt-4 p-4 rounded-lg bg-background/50 border border-[#9b87f5]/20">
            <p className="text-sm text-[#D6BCFA]">{suggestion}</p>
          </div>
        )}
      </div>
    </Card>
  );
};