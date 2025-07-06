import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { apiKey } = await req.json()
    
    if (!apiKey || !apiKey.startsWith('sk-')) {
      throw new Error('Invalid OpenAI API key format')
    }

    // Test the API key by making a simple request
    const testResponse = await fetch('https://api.openai.com/v1/models', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      }
    })

    if (!testResponse.ok) {
      throw new Error('Invalid API key - unable to authenticate with OpenAI')
    }

    // Note: In a real implementation, this would save to Supabase secrets
    // For now, we'll just validate and return success
    // The key would need to be manually added to the Edge Function secrets
    
    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'API key validated successfully. Please add it to your Supabase Edge Function secrets as OPENAI_API_KEY.'
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})