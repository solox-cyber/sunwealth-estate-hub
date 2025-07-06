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
      const { data, error } = await supabase.functions.invoke('check-openai-key');
      if (data && !error) {
        setConfig({ apiKey: null, isConfigured: data.isConfigured });
      }
    } catch (error) {
      console.error('Error checking API key status:', error);
    }
  };

  const saveAPIKey = async (apiKey: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('save-openai-key', {
        body: { apiKey }
      });

      if (error) throw error;

      setConfig({ apiKey: null, isConfigured: true });
      toast({
        title: "API Key Saved",
        description: "OpenAI API key has been configured successfully"
      });
      return true;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save API key",
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
        description: "Please configure your OpenAI API key first",
        variant: "destructive"
      });
      return null;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-generate-content', {
        body: { prompt, context }
      });

      if (error) throw error;
      return data.content;
    } catch (error: any) {
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate content",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const analyzeProperties = async (properties: any[]) => {
    if (!config.isConfigured) {
      return null;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-analyze-properties', {
        body: { properties }
      });

      if (error) throw error;
      return data.analysis;
    } catch (error: any) {
      console.error('Property analysis failed:', error);
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