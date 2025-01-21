import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenerativeAI } from "@google/generative-ai";

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

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
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
    `;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: imageData,
          mimeType: "image/jpeg"
        }
      }
    ]);

    const response = await result.response;
    const text = response.text();
    
    try {
      const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
      console.log('Raw AI response:', cleanedText);
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