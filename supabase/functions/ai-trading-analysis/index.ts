import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { marketData } = await req.json();
    const apiKey = Deno.env.get('GEMINI_API_KEY');

    if (!apiKey) {
      throw new Error('API key not found');
    }

    console.log('Analyzing market data:', marketData);

    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are an expert cryptocurrency trading analyst. Based on this market data, provide a detailed analysis:

              Symbol: ${marketData.symbol}
              Current Price: ${marketData.price[3]}
              Price Change: ${marketData.priceChange}%
              24h Volume: ${marketData.volume}
              Technical Indicators:
              - RSI(14): ${marketData.indicators.RSI_14}
              - MACD: ${marketData.indicators.MACD.join(', ')}

              Analyze this data and provide:
              1. Market Sentiment Score (0-100):
                - 0-20: Strongly Bearish
                - 21-40: Moderately Bearish
                - 41-45: Slightly Bearish
                - 46-55: Neutral
                - 56-60: Slightly Bullish
                - 61-80: Moderately Bullish
                - 81-100: Strongly Bullish

              2. Confidence Score (0-100):
                Based on:
                - Technical indicator alignment
                - Volume confirmation
                - Price action strength
                - Overall market conditions

              3. Trading Plan:
                - Entry Strategy
                - Risk Management (Stop Loss)
                - Take Profit Targets
                - Position Sizing

              Return ONLY this JSON:
              {
                "suggestion": "string (4-5 sentences of analysis)",
                "sentiment": number (0-100),
                "confidence": number (0-100)
              }`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 1,
          topP: 1,
        },
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error response:', errorText);
      throw new Error(`Gemini API returned ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    console.log('Gemini API response:', JSON.stringify(result, null, 2));

    if (!result.candidates?.[0]?.content?.parts?.[0]?.text) {
      console.error('Unexpected Gemini API response structure:', result);
      throw new Error('Invalid response structure from Gemini API');
    }

    const aiResponse = JSON.parse(result.candidates[0].content.parts[0].text.trim());
    console.log('Parsed AI response:', aiResponse);

    return new Response(JSON.stringify(aiResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Analysis error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});