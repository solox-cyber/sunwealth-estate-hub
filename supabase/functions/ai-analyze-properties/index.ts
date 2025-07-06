import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (!openAIApiKey) {
    return new Response(
      JSON.stringify({ error: 'OpenAI API key not configured' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const { properties } = await req.json();

    if (!properties || properties.length === 0) {
      return new Response(
        JSON.stringify({ analysis: 'No properties provided for analysis' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Prepare property data for analysis
    const propertyData = properties.map(p => ({
      id: p.id,
      title: p.title,
      price: p.price,
      type: p.property_type,
      location: p.location,
      bedrooms: p.bedrooms,
      bathrooms: p.bathrooms,
      area: p.area_sqm,
      features: p.features
    }));

    const prompt = `Analyze these real estate properties and provide insights:

Properties Data:
${JSON.stringify(propertyData, null, 2)}

Please provide:
1. Market trends based on the property types and locations
2. Price analysis and value assessment
3. Investment recommendations
4. Popular features and amenities
5. Location insights

Keep the response professional and under 400 words.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'You are a professional real estate market analyst. Provide concise, actionable insights based on property data.' 
          },
          { role: 'user', content: prompt }
        ],
        max_tokens: 600,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const analysis = data.choices[0].message.content;

    return new Response(
      JSON.stringify({ analysis }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in ai-analyze-properties function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});