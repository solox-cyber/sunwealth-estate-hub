
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface OpenAIConfig {
  apiKey: string | null;
  isConfigured: boolean;
}

export const useOpenAI = () => {
  const [config, setConfig] = useState<OpenAIConfig>({ apiKey: null, isConfigured: false });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkAPIKeyStatus();
  }, []);

  const checkAPIKeyStatus = async () => {
    try {
      console.log('Checking API key status...');
      const { data, error } = await supabase.functions.invoke('check-openai-key');
      
      if (error) {
        console.error('Error checking API key status:', error);
        toast({
          title: "Connection Error",
          description: "Unable to check API key status. Please try again.",
          variant: "destructive"
        });
        return;
      }

      console.log('API key status response:', data);
      
      if (data) {
        setConfig({ apiKey: null, isConfigured: data.isConfigured });
        
        if (data.isConfigured) {
          toast({
            title: "API Key Configured",
            description: "OpenAI API key is active and ready to use"
          });
        }
      }
    } catch (error) {
      console.error('Error checking API key status:', error);
      toast({
        title: "Error",
        description: "Failed to check API key status",
        variant: "destructive"
      });
    }
  };

  const saveAPIKey = async (apiKey: string) => {
    if (!apiKey.trim()) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid OpenAI API key",
        variant: "destructive"
      });
      return false;
    }

    setLoading(true);
    try {
      console.log('Saving API key...');
      const { data, error } = await supabase.functions.invoke('save-openai-key', {
        body: { apiKey: apiKey.trim() }
      });

      if (error) {
        console.error('Error saving API key:', error);
        throw new Error(error.message || 'Failed to save API key');
      }

      console.log('API key save response:', data);

      if (data?.success) {
        toast({
          title: "API Key Validated",
          description: data.message || "API key has been validated successfully",
          duration: 8000
        });
        
        // Don't automatically set as configured since user needs to add to Supabase secrets
        return true;
      } else {
        throw new Error(data?.error || 'Failed to validate API key');
      }
    } catch (error: any) {
      console.error('Error saving API key:', error);
      toast({
        title: "Validation Failed",
        description: error.message || "Failed to validate API key. Please check your key and try again.",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const generateContent = async (prompt: string, context?: any) => {
    if (!config.isConfigured) {
      toast({
        title: "API Key Required",
        description: "Please configure your OpenAI API key in the Edge Function secrets first",
        variant: "destructive"
      });
      return null;
    }

    if (!prompt.trim()) {
      toast({
        title: "Invalid Input",
        description: "Please provide a prompt for content generation",
        variant: "destructive"
      });
      return null;
    }

    setLoading(true);
    try {
      console.log('Generating content with prompt:', prompt.substring(0, 50) + '...');
      
      const { data, error } = await supabase.functions.invoke('ai-generate-content', {
        body: { prompt: prompt.trim(), context }
      });

      if (error) {
        console.error('Edge function error:', error);
        throw new Error(error.message || 'Failed to generate content');
      }

      console.log('Content generation response:', data);

      if (data?.error) {
        throw new Error(data.error);
      }

      if (data?.content) {
        toast({
          title: "Content Generated",
          description: "AI content has been generated successfully"
        });
        return data.content;
      } else {
        throw new Error('No content was generated');
      }
    } catch (error: any) {
      console.error('Content generation error:', error);
      
      let errorMessage = "Failed to generate content";
      if (error.message.includes('API key')) {
        errorMessage = "API key issue. Please check your OpenAI API key configuration.";
      } else if (error.message.includes('401')) {
        errorMessage = "Invalid API key. Please verify your OpenAI API key.";
      } else if (error.message.includes('quota')) {
        errorMessage = "API quota exceeded. Please check your OpenAI account.";
      }
      
      toast({
        title: "Generation Failed",
        description: errorMessage,
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const analyzeProperties = async (properties: any[]) => {
    if (!config.isConfigured) {
      toast({
        title: "API Key Required",
        description: "Please configure your OpenAI API key first",
        variant: "destructive"
      });
      return null;
    }

    if (!properties || properties.length === 0) {
      toast({
        title: "No Properties",
        description: "No properties available for analysis",
        variant: "destructive"
      });
      return null;
    }

    setLoading(true);
    try {
      console.log('Analyzing properties...', properties.length, 'properties');
      
      const { data, error } = await supabase.functions.invoke('ai-analyze-properties', {
        body: { properties }
      });

      if (error) {
        console.error('Analysis error:', error);
        throw new Error(error.message || 'Failed to analyze properties');
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      return data?.analysis || null;
    } catch (error: any) {
      console.error('Property analysis failed:', error);
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to analyze properties",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    config,
    loading,
    saveAPIKey,
    generateContent,
    analyzeProperties,
    checkAPIKeyStatus
  };
};
