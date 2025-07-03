import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Heart, Home, MessageSquare, User, LogOut } from 'lucide-react';

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
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="saved" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Saved Properties
            </TabsTrigger>
            <TabsTrigger value="inquiries" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              My Inquiries
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