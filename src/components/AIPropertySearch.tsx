import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Search, Home, MapPin, DollarSign } from 'lucide-react';
import { useOpenAI } from '@/hooks/useOpenAI';
import { useToast } from '@/hooks/use-toast';

interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  property_type: string;
  bedrooms?: number;
  bathrooms?: number;
  area_sqm?: number;
  location: string;
  address?: string;
  features?: string[];
  status: string;
}

interface AIPropertySearchProps {
  properties: Property[];
  onClose: () => void;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  suggestedProperties?: Property[];
}

export const AIPropertySearch = ({ properties, onClose }: AIPropertySearchProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: "Hi! I'm your AI property search assistant. I can help you find the perfect property based on your preferences. What are you looking for today?",
    },
  ]);
  const [userInput, setUserInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const { generateContent } = useOpenAI();
  const { toast } = useToast();

  const searchProperties = (query: string): Property[] => {
    const searchTerms = query.toLowerCase();
    return properties.filter(property => {
      const searchableText = [
        property.title,
        property.description,
        property.location,
        property.property_type,
        property.address,
        ...(property.features || [])
      ].join(' ').toLowerCase();

      return searchableText.includes(searchTerms) ||
        (searchTerms.includes('bedroom') && property.bedrooms) ||
        (searchTerms.includes('bathroom') && property.bathrooms) ||
        (searchTerms.includes(property.property_type.toLowerCase())) ||
        (searchTerms.includes(property.location.toLowerCase()));
    });
  };

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: userInput,
    };

    setMessages(prev => [...prev, userMessage]);
    setIsSearching(true);
    setUserInput('');

    try {
      // Search for relevant properties
      const relevantProperties = searchProperties(userInput);
      
      // Generate AI response with context
      const aiPrompt = `
        You are a helpful property search assistant. A user is asking: "${userInput}"
        
        Available properties that might match their search:
        ${relevantProperties.map(p => `
          - ${p.title} in ${p.location}: ₦${p.price.toLocaleString()} 
            Type: ${p.property_type}, ${p.bedrooms || 'N/A'} bedrooms, ${p.bathrooms || 'N/A'} bathrooms
            ${p.area_sqm ? `Area: ${p.area_sqm}sqm` : ''}
            Features: ${p.features?.join(', ') || 'Standard amenities'}
        `).join('')}
        
        Respond naturally and helpfully. If properties match their criteria, mention specific ones. 
        If no properties match exactly, suggest alternatives or ask clarifying questions.
        Keep your response conversational and under 150 words.
      `;

      const aiResponse = await generateContent(aiPrompt, {
        userQuery: userInput,
        properties: relevantProperties.slice(0, 5) // Limit to top 5 matches
      });

      if (aiResponse) {
        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content: aiResponse,
          suggestedProperties: relevantProperties.slice(0, 3) // Show top 3 property cards
        };

        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (error) {
      toast({
        title: "Search Error",
        description: "Failed to process your search. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatPrice = (price: number) => {
    return `₦${price.toLocaleString()}`;
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            AI Property Search Assistant
          </CardTitle>
          <CardDescription>
            Find your perfect property with AI-powered search
          </CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={onClose}>
          Close
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Chat Messages */}
        <div className="h-96 overflow-y-auto space-y-4 p-4 border rounded-lg bg-muted/20">
          {messages.map((message, index) => (
            <div key={index} className="space-y-3">
              <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-lg ${
                  message.role === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-background border'
                }`}>
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
              
              {/* Property Suggestions */}
              {message.suggestedProperties && message.suggestedProperties.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
                  {message.suggestedProperties.map((property) => (
                    <Card key={property.id} className="border-dashed">
                      <CardContent className="p-4">
                        <h4 className="font-medium text-sm mb-2">{property.title}</h4>
                        <div className="space-y-1 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span>{property.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            <span>{formatPrice(property.price)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Home className="h-3 w-3" />
                            <span>{property.property_type}</span>
                          </div>
                          {property.bedrooms && (
                            <div className="flex gap-2">
                              <Badge variant="secondary" className="text-xs">
                                {property.bedrooms} bed
                              </Badge>
                              {property.bathrooms && (
                                <Badge variant="secondary" className="text-xs">
                                  {property.bathrooms} bath
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          ))}
          
          {isSearching && (
            <div className="flex justify-start">
              <div className="bg-background border p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  <span className="text-sm text-muted-foreground">Searching properties...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="flex gap-2">
          <Input
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about properties... (e.g., '3 bedroom apartment in Victoria Island')"
            disabled={isSearching}
            className="flex-1"
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={!userInput.trim() || isSearching}
            size="sm"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>

        {/* Quick Search Suggestions */}
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-muted-foreground">Try asking:</span>
          {['2 bedroom apartment', 'houses in Lekki', 'luxury properties', 'under 50 million'].map((suggestion) => (
            <Button
              key={suggestion}
              variant="outline"
              size="sm"
              className="text-xs h-6"
              onClick={() => setUserInput(suggestion)}
              disabled={isSearching}
            >
              {suggestion}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};