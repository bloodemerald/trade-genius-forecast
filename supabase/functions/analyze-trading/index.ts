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
    const { imageData } = await req.json();
    const apiKey = Deno.env.get('GEMINI_API_KEY');

    if (!apiKey) {
      throw new Error('API key not found');
    }

    console.log('Calling Gemini API...');

    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Analyze this trading chart screenshot and extract:
              1. Find any Solana token address (Base58 string, 32-44 chars)
              2. Analyze the chart data
              3. Identify key chart observations (support/resistance levels, patterns)
              4. Identify trading signals
              5. Analyze price action

              Return ONLY this JSON:
              {
                "symbol": "string (e.g., 'BTC/USD')",
                "tokenAddress": "string or null",
                "price": [number, number, number, number],
                "volume": number,
                "indicators": {
                  "EMA_9": number,
                  "MA_10": number,
                  "MACD": [number, number, number],
                  "RSI_14": number
                },
                "chartObservations": ["string", "string", "string"],
                "tradeSignals": ["string", "string", "string"],
                "priceAction": ["string", "string", "string"]
              }`
          }, {
            inline_data: {
              mime_type: "image/jpeg",
              data: imageData
            }
          }]
        }],
        generationConfig: {
          temperature: 0.1,
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

    const text = result.candidates[0].content.parts[0].text;
    console.log('Raw text from Gemini:', text);
    
    try {
      const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
      console.log('Cleaned text:', cleanedText);
      const parsedData = JSON.parse(cleanedText);
      
      if (!parsedData.symbol || !Array.isArray(parsedData.price) || !parsedData.indicators) {
        console.error('Invalid data structure:', parsedData);
        throw new Error('Invalid data structure received from AI');
      }

      return new Response(JSON.stringify(parsedData), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (parseError) {
      console.error('Parse error:', parseError);
      throw new Error('Failed to parse AI response');
    }
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