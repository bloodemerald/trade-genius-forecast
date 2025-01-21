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
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('PERPLEXITY_API_KEY')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-small-128k-online',
          messages: [
            {
              role: 'system',
              content: 'You are a professional trading assistant. Analyze the market conditions and provide concise, actionable trading suggestions.'
            },
            {
              role: 'user',
              content: `Analyze these market conditions and provide trading suggestions:
                Price: ${marketCondition.price}
                Volume: ${marketCondition.volume}
                RSI: ${marketCondition.rsi}
                MACD: ${marketCondition.macd.join(', ')}
              `
            }
          ],
          temperature: 0.2,
          max_tokens: 500
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI suggestion');
      }

      const data = await response.json();
      setSuggestion(data.choices[0].message.content);
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
        {!localStorage.getItem('PERPLEXITY_API_KEY') && (
          <div className="mb-4">
            <input
              type="password"
              placeholder="Enter your Perplexity API key"
              className="w-full p-2 rounded bg-background border border-[#9b87f5]/30 text-foreground"
              onChange={(e) => localStorage.setItem('PERPLEXITY_API_KEY', e.target.value)}
            />
          </div>
        )}

        <Button 
          onClick={analyzeMarket} 
          disabled={loading || !localStorage.getItem('PERPLEXITY_API_KEY')}
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