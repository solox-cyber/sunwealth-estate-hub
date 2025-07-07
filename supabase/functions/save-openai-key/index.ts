
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
    const requestBody = await req.json()
    console.log('Save API key request received')
    
    const { apiKey } = requestBody
    
    if (!apiKey || typeof apiKey !== 'string') {
      throw new Error('API key is required and must be a string')
    }
    
    if (!apiKey.startsWith('sk-')) {
      throw new Error('Invalid OpenAI API key format. API key should start with "sk-"')
    }

    console.log('Validating API key with OpenAI...')

    // Test the API key by making a simple request to OpenAI
    const testResponse = await fetch('https://api.openai.com/v1/models', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      }
    })

    console.log('OpenAI validation response status:', testResponse.status)

    if (!testResponse.ok) {
      const errorText = await testResponse.text()
      console.error('API key validation failed:', testResponse.status, errorText)
      throw new Error('Invalid API key - unable to authenticate with OpenAI. Please check that your API key is correct and active.')
    }

    console.log('API key validation successful')

    // Note: In a real implementation, this would save to Supabase secrets
    // For now, we'll just validate and return success with instructions
    
    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'API key validated successfully! To complete the setup:\n\n1. Go to your Supabase Dashboard\n2. Navigate to Edge Functions → Settings\n3. Add a new secret named "OPENAI_API_KEY"\n4. Paste your API key as the value\n5. Refresh this page\n\nOnce added, all AI features will be activated.',
        nextSteps: [
          'Add OPENAI_API_KEY to Supabase Edge Function secrets',
          'Refresh the page to activate AI features'
        ]
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  } catch (error) {
    console.error('Error in save-openai-key function:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
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
