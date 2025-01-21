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
    const { question } = await req.json();
    const apiKey = Deno.env.get('GEMINI_API_KEY');

    if (!apiKey) {
      throw new Error('API key not found');
    }

    console.log('Processing trading education question:', question);

    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are a professional trading educator. Explain this trading concept in a clear, concise way:
              Question: ${question}
              
              Rules for your response:
              1. Keep it under 3 paragraphs
              2. Use simple language
              3. Include a practical example if relevant
              4. Focus on how to apply this knowledge in real trading
              5. Mention any risks or common mistakes`
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
      throw new Error('Invalid response structure from Gemini API');
    }

    const explanation = result.candidates[0].content.parts[0].text.trim();
    console.log('Generated explanation:', explanation);

    return new Response(JSON.stringify({ explanation }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Trading tutor error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});