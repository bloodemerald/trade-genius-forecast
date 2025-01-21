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

    // Using fetch directly since we can't import the Google AI SDK in Deno
    const response = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-1.0-pro-vision-latest:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `
              You are a trading chart analysis expert. Look at this trading chart screenshot and extract the following information:
              1. Most importantly, find the Solana token address. It might be in the URL, title, or somewhere in the interface.
                 Look for a string that looks like a Solana address (Base58-encoded string, typically 32-44 characters long).
              2. Also analyze the chart and provide the following data.

              Return the data in this strict JSON format:
              {
                "symbol": "string (e.g., 'BTC/USD')",
                "tokenAddress": "string (the Solana token address - IMPORTANT: look carefully for this)",
                "price": [number, number, number, number] (open, high, low, close),
                "volume": number (24h volume),
                "indicators": {
                  "EMA_9": number,
                  "MA_10": number,
                  "MACD": [number, number, number],
                  "RSI_14": number
                }
              }

              If you find multiple potential token addresses, choose the one that appears to be the main token being traded.
              If you absolutely cannot find a token address after thorough inspection, set it to null.
              Only return the JSON data, no additional text.
            `
          }, {
            inlineData: {
              mimeType: "image/jpeg",
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
      const error = await response.text();
      console.error('Gemini API error:', error);
      throw new Error('Failed to analyze image with Gemini API');
    }

    const result = await response.json();
    console.log('Raw Gemini response:', JSON.stringify(result, null, 2));

    // Extract the text content from the response
    const text = result.candidates[0].content.parts[0].text;
    
    try {
      const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
      console.log('Cleaned text:', cleanedText);
      const parsedData = JSON.parse(cleanedText);
      
      if (!parsedData.symbol || !Array.isArray(parsedData.price) || !parsedData.indicators) {
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