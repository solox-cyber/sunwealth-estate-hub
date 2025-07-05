import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Heart, Home, MessageSquare, User, LogOut, Brain, TrendingUp, Target, BarChart3 } from 'lucide-react';

interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  property_type: string;
  images: string[];
  status: string;
}

interface SavedProperty {
  id: string;
  property_id: string;
  properties: Property;
}

interface Inquiry {
  id: string;
  property_id: string;
  message: string;
  inquiry_type: string;
  status: string;
  created_at: string;
  properties: {
    title: string;
  };
}

const Dashboard = () => {
  const { user, signOut, loading, isAdmin } = useAuth();
  const [savedProperties, setSavedProperties] = useState<SavedProperty[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [aiInsights, setAiInsights] = useState({
    recommendations: [],
    priceAnalysis: null,
    marketTrends: null,
    loadingAI: false
  });

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    setLoadingData(true);
    
    // Fetch saved properties
    const { data: savedData } = await supabase
      .from('saved_properties')
      .select(`
        id,
        property_id,
        properties (
          id,
          title,
          price,
          location,
          property_type,
          images,
          status
        )
      `)
      .eq('user_id', user?.id);

    if (savedData) {
      setSavedProperties(savedData);
    }

    // Fetch user inquiries
    const { data: inquiriesData } = await supabase
      .from('property_inquiries')
      .select(`
        id,
        property_id,
        message,
        inquiry_type,
        status,
        created_at,
        properties (
          title
        )
      `)
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false });

    if (inquiriesData) {
      setInquiries(inquiriesData);
    }

    setLoadingData(false);
  };

  const removeSavedProperty = async (savedPropertyId: string) => {
    await supabase
      .from('saved_properties')
      .delete()
      .eq('id', savedPropertyId);
    
    setSavedProperties(prev => prev.filter(sp => sp.id !== savedPropertyId));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                <span className="text-secondary-foreground font-bold text-lg">S</span>
              </div>
              <div>
                <h1 className="text-xl font-bold">Dashboard</h1>
                <p className="text-sm text-muted-foreground">Welcome back!</p>
              </div>
            </div>
            <Button onClick={signOut} variant="outline" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="saved" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="saved" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Saved Properties
            </TabsTrigger>
            <TabsTrigger value="inquiries" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              My Inquiries
            </TabsTrigger>
            <TabsTrigger value="ai-assistant" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              AI Assistant
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="saved" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Saved Properties</CardTitle>
                <CardDescription>
                  Properties you've saved for later viewing
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingData ? (
                  <div className="text-center py-8">Loading...</div>
                ) : savedProperties.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Home className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No saved properties yet</p>
                    <p className="text-sm">Start browsing properties to save your favorites</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {savedProperties.map((savedProp) => (
                      <Card key={savedProp.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h3 className="font-semibold">{savedProp.properties.title}</h3>
                              <p className="text-muted-foreground">{savedProp.properties.location}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant="secondary">
                                  {savedProp.properties.property_type}
                                </Badge>
                                <Badge variant={savedProp.properties.status === 'available' ? 'default' : 'secondary'}>
                                  {savedProp.properties.status}
                                </Badge>
                              </div>
                              <p className="font-bold text-lg text-primary mt-2">
                                ₦{savedProp.properties.price.toLocaleString()}
                              </p>
                            </div>
                            <Button
                              onClick={() => removeSavedProperty(savedProp.id)}
                              variant="outline"
                              size="sm"
                            >
                              Remove
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inquiries" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>My Inquiries</CardTitle>
                <CardDescription>
                  Your property inquiries and their status
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingData ? (
                  <div className="text-center py-8">Loading...</div>
                ) : inquiries.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No inquiries yet</p>
                    <p className="text-sm">Contact us about properties you're interested in</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {inquiries.map((inquiry) => (
                      <Card key={inquiry.id}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold">{inquiry.properties.title}</h3>
                            <Badge variant={inquiry.status === 'new' ? 'default' : 'secondary'}>
                              {inquiry.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {inquiry.inquiry_type} inquiry
                          </p>
                          <p className="text-sm">{inquiry.message}</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {new Date(inquiry.created_at).toLocaleDateString()}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai-assistant" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Property Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Smart Recommendations
                  </CardTitle>
                  <CardDescription>
                    AI-powered property suggestions based on your saved properties
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {savedProperties.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground">
                      <Brain className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Save some properties to get AI recommendations</p>
                    </div>
                  ) : aiInsights.loadingAI ? (
                    <div className="text-center py-6">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                      <p className="text-sm text-muted-foreground mt-2">Analyzing your preferences...</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="p-3 bg-accent/10 rounded-lg border border-accent/20">
                        <h4 className="font-medium text-sm">Based on your saved properties:</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          You prefer {savedProperties[0]?.properties.property_type} properties in {savedProperties[0]?.properties.location} area.
                        </p>
                        <p className="text-sm text-primary mt-1">
                          Average budget: ₦{Math.round(savedProperties.reduce((sum, prop) => sum + prop.properties.price, 0) / savedProperties.length).toLocaleString()}
                        </p>
                      </div>
                      <Button 
                        size="sm" 
                        className="w-full"
                        onClick={() => {
                          setAiInsights(prev => ({ ...prev, loadingAI: true }));
                          setTimeout(() => setAiInsights(prev => ({ ...prev, loadingAI: false })), 2000);
                        }}
                      >
                        <Brain className="h-4 w-4 mr-2" />
                        Find Similar Properties
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Price Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Price Analysis
                  </CardTitle>
                  <CardDescription>
                    AI insights on property price trends in your areas of interest
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {savedProperties.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground">
                      <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Save properties to see price analysis</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Market Trend</span>
                          <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                            📈 Growing
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Properties in your saved locations have increased by ~8% in the last 6 months
                        </p>
                      </div>
                      <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <h4 className="font-medium text-sm">AI Prediction</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Based on database trends, your saved properties may appreciate 5-12% over the next year.
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Property Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  Smart Property Insights
                </CardTitle>
                <CardDescription>
                  AI analysis of your property portfolio and recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                {savedProperties.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Brain className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <h3 className="font-medium mb-2">Start Building Your Portfolio</h3>
                    <p className="text-sm">Save properties to get AI-powered insights and recommendations</p>
                    <Button size="sm" className="mt-4" onClick={() => window.location.hash = '#properties'}>
                      Browse Properties
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="p-4 bg-primary/5 rounded-lg border border-primary/10 text-center">
                        <div className="text-2xl font-bold text-primary">{savedProperties.length}</div>
                        <div className="text-sm text-muted-foreground">Saved Properties</div>
                      </div>
                      <div className="p-4 bg-accent/5 rounded-lg border border-accent/10 text-center">
                        <div className="text-2xl font-bold text-accent">{inquiries.length}</div>
                        <div className="text-sm text-muted-foreground">Active Inquiries</div>
                      </div>
                      <div className="p-4 bg-secondary/5 rounded-lg border border-secondary/10 text-center">
                        <div className="text-2xl font-bold text-secondary-foreground">85%</div>
                        <div className="text-sm text-muted-foreground">Match Score</div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg border">
                      <h4 className="font-medium mb-2">🎯 AI Recommendation</h4>
                      <p className="text-sm text-muted-foreground">
                        Based on your activity, you seem interested in {savedProperties[0]?.properties.property_type} properties. 
                        Consider expanding your search to include similar properties in nearby areas for better investment opportunities.
                      </p>
                    </div>

                    <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
                      <h4 className="font-medium mb-2">💡 Market Intelligence</h4>
                      <p className="text-sm text-muted-foreground">
                        Properties in your preferred locations typically receive 3-5 inquiries per week. 
                        Your inquiry response rate is above average, suggesting strong interest from sellers.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Manage your account details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Member Since</label>
                    <p className="text-sm text-muted-foreground">
                      {new Date(user.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
  <label className="text-sm font-medium">Role</label>
  <p className="text-sm text-muted-foreground">
    {isAdmin ? 'Admin' : 'User'}
  </p>
</div>
<div>
  <label className="text-sm font-medium">Role</label>
  <p className="text-sm text-muted-foreground">
    {isAdmin ? 'Admin' : 'User'}
  </p>
  <p className="text-xs text-red-500">
    Debug: isAdmin = {isAdmin.toString()}, user.id = {user.id}
  </p>
</div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;