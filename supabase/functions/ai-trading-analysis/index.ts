
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

    // Calculate initial sentiment based on RSI
    let initialSentiment = 50; // Neutral base
    if (marketData.indicators?.RSI_14 > 70) initialSentiment = 85;
    else if (marketData.indicators?.RSI_14 > 60) initialSentiment = 70;
    else if (marketData.indicators?.RSI_14 > 50) initialSentiment = 60;
    else if (marketData.indicators?.RSI_14 < 30) initialSentiment = 15;
    else if (marketData.indicators?.RSI_14 < 40) initialSentiment = 30;
    else if (marketData.indicators?.RSI_14 < 50) initialSentiment = 40;

    // Calculate initial confidence based on technical indicators
    let initialConfidence = 50;
    const volumeStrength = marketData.volume > 1000000 ? 20 : marketData.volume > 500000 ? 15 : 10;
    const trendStrength = Math.abs(marketData.indicators?.MACD?.[0] ?? 0) > 0.001 ? 20 : 10;
    const rsiStrength = (marketData.indicators?.RSI_14 > 70 || marketData.indicators?.RSI_14 < 30) ? 20 : 10;
    initialConfidence = Math.min(95, volumeStrength + trendStrength + rsiStrength);

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
              Current Price: ${marketData.price?.[3] ?? 'N/A'}
              Price Change: ${marketData.priceChange}%
              24h Volume: ${marketData.volume}
              Technical Indicators:
              - RSI(14): ${marketData.indicators?.RSI_14 ?? 'N/A'}
              - MACD: ${marketData.indicators?.MACD?.join(', ') ?? 'N/A'}
              
              Initial Technical Analysis:
              - Market Sentiment Score: ${initialSentiment}
              - Confidence Score: ${initialConfidence}

              Analyze this data and provide a trading suggestion in exactly this JSON format (no markdown, no backticks):
              {
                "suggestion": "4-5 sentences of analysis",
                "sentiment": number between 0-100,
                "confidence": number between 0-100
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

    // Clean the response text by removing any markdown formatting
    const cleanText = result.candidates[0].content.parts[0].text
      .replace(/```json\s*/g, '')
      .replace(/```\s*/g, '')
      .trim();

    console.log('Cleaned text:', cleanText);

    // Parse the AI response and combine with our technical analysis
    const aiResponse = JSON.parse(cleanText);
    
    // Blend AI sentiment with technical sentiment
    const finalSentiment = Math.round((aiResponse.sentiment + initialSentiment) / 2);
    
    // Blend AI confidence with technical confidence
    const finalConfidence = Math.round((aiResponse.confidence + initialConfidence) / 2);

    const finalResponse = {
      suggestion: aiResponse.suggestion,
      sentiment: finalSentiment,
      confidence: finalConfidence
    };

    console.log('Final analysis response:', finalResponse);

    return new Response(JSON.stringify(finalResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Analysis error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        suggestion: "Unable to analyze market conditions at this time.",
        sentiment: 50,  // Neutral sentiment as fallback
        confidence: 0   // Zero confidence when error occurs
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
