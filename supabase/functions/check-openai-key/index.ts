
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
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    console.log('Checking OpenAI API key status:', openaiApiKey ? 'Present' : 'Missing')
    
    return new Response(
      JSON.stringify({ 
        isConfigured: !!openaiApiKey,
        timestamp: new Date().toISOString(),
        message: openaiApiKey ? 'API key is configured' : 'API key is not configured'
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  } catch (error) {
    console.error('Error in check-openai-key function:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        isConfigured: false 
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})
