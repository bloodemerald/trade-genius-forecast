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
            text: `As an expert crypto trading analyst, provide a detailed trading suggestion based on this market data:
              Symbol: ${marketData.symbol}
              Current Price: ${marketData.price[3]}
              Price Change: ${marketData.priceChange}%
              24h Volume: ${marketData.volume}
              Technical Indicators:
              - RSI(14): ${marketData.indicators.RSI_14}
              - MACD: ${marketData.indicators.MACD.join(', ')}

              Provide a concise but detailed trading suggestion that includes:
              1. Clear directional bias (bullish/bearish/neutral)
              2. Key price levels to watch (support/resistance)
              3. Specific entry conditions
              4. Stop loss placement recommendation
              5. Take profit targets
              6. Risk management advice

              Format the response as a clear, actionable trading plan in 3-4 sentences maximum.
              Be specific about price levels and conditions.`
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

    const suggestion = result.candidates[0].content.parts[0].text.trim();
    console.log('Generated suggestion:', suggestion);

    return new Response(JSON.stringify({ suggestion }), {
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