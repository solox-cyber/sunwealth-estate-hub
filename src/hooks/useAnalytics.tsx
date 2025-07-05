import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface AnalyticsEvent {
  event_type: string;
  page_url?: string;
  property_id?: string;
  user_id?: string;
  metadata?: Record<string, any>;
}

export const useAnalytics = () => {
  const { user } = useAuth();

  const trackEvent = async (eventData: Omit<AnalyticsEvent, 'user_id'>) => {
    try {
      // TODO: Uncomment once analytics_events table is created
      // await supabase.from('analytics_events').insert([{
      //   ...eventData,
      //   user_id: user?.id,
      //   created_at: new Date().toISOString()
      // }]);
      
      console.log('Analytics event:', eventData.event_type, eventData);
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
  };

  const trackPageView = (pagePath: string) => {
    trackEvent({
      event_type: 'page_view',
      page_url: pagePath
    });
  };

  const trackPropertyView = (propertyId: string) => {
    trackEvent({
      event_type: 'property_view',
      property_id: propertyId
    });
  };

  const trackInquiry = (propertyId: string, inquiryType: string) => {
    trackEvent({
      event_type: 'inquiry_submitted',
      property_id: propertyId,
      metadata: { inquiry_type: inquiryType }
    });
  };

  const trackPhoneCall = (propertyId?: string) => {
    trackEvent({
      event_type: 'phone_call_initiated',
      property_id: propertyId
    });
  };

  // Track time on page
  useEffect(() => {
    const startTime = Date.now();
    const currentPath = window.location.pathname;
    
    trackPageView(currentPath);

    return () => {
      const timeSpent = Date.now() - startTime;
      trackEvent({
        event_type: 'time_on_page',
        page_url: currentPath,
        metadata: { duration_ms: timeSpent }
      });
    };
  }, []);

  return {
    trackEvent,
    trackPageView,
    trackPropertyView,
    trackInquiry,
    trackPhoneCall
  };
};