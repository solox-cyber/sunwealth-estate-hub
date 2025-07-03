import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Home, 
  Users, 
  MessageSquare, 
  Plus, 
  LogOut, 
  BarChart3,
  Edit,
  Trash2 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  property_type: string;
  bedrooms: number;
  bathrooms: number;
  area_sqm: number;
  location: string;
  address: string;
  features: string[];
  status: string;
  created_at: string;
}

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  inquiry_type: string;
  status: string;
  created_at: string;
  properties: {
    title: string;
  };
}

const AdminDashboard = () => {
  const { user, signOut, loading, isAdmin } = useAuth();
  const { toast } = useToast();
  const [properties, setProperties] = useState<Property[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [showAddProperty, setShowAddProperty] = useState(false);

  useEffect(() => {
    if (user && isAdmin) {
      fetchAdminData();
    }
  }, [user, isAdmin]);

  const fetchAdminData = async () => {
    setLoadingData(true);
    
    // Fetch all properties
    const { data: propertiesData } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false });

    if (propertiesData) {
      setProperties(propertiesData);
    }

    // Fetch all inquiries
    const { data: inquiriesData } = await supabase
      .from('property_inquiries')
      .select(`
        id,
        name,
        email,
        phone,
        message,
        inquiry_type,
        status,
        created_at,
        properties (
          title
        )
      `)
      .order('created_at', { ascending: false });

    if (inquiriesData) {
      setInquiries(inquiriesData);
    }

    setLoadingData(false);
  };

  const handleAddProperty = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const propertyData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      price: parseFloat(formData.get('price') as string),
      property_type: formData.get('property_type') as string,
      bedrooms: parseInt(formData.get('bedrooms') as string) || null,
      bathrooms: parseInt(formData.get('bathrooms') as string) || null,
      area_sqm: parseFloat(formData.get('area_sqm') as string) || null,
      location: formData.get('location') as string,
      address: formData.get('address') as string,
      features: (formData.get('features') as string).split(',').map(f => f.trim()).filter(f => f),
      status: formData.get('status') as string,
      created_by: user?.id,
    };

    const { error } = await supabase
      .from('properties')
      .insert([propertyData]);

    if (error) {
      toast({
        title: "Error adding property",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Property added successfully",
        description: "The property has been added to the listings.",
      });
      setShowAddProperty(false);
      fetchAdminData();
    }
  };

  const deleteProperty = async (propertyId: string) => {
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', propertyId);

    if (error) {
      toast({
        title: "Error deleting property",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Property deleted",
        description: "The property has been removed from listings.",
      });
      fetchAdminData();
    }
  };

  const updateInquiryStatus = async (inquiryId: string, newStatus: string) => {
    const { error } = await supabase
      .from('property_inquiries')
      .update({ status: newStatus })
      .eq('id', inquiryId);

    if (error) {
      toast({
        title: "Error updating inquiry",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Inquiry updated",
        description: "The inquiry status has been updated.",
      });
      fetchAdminData();
    }
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

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
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
                <h1 className="text-xl font-bold">Admin Dashboard</h1>
                <p className="text-sm text-muted-foreground">Manage your real estate platform</p>
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
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{properties.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Available</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {properties.filter(p => p.status === 'available').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Inquiries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inquiries.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">New Inquiries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {inquiries.filter(i => i.status === 'new').length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="properties" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="properties" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Properties
            </TabsTrigger>
            <TabsTrigger value="inquiries" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Inquiries
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="properties" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Property Management</h2>
              <Button onClick={() => setShowAddProperty(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Property
              </Button>
            </div>

            {showAddProperty && (
              <Card>
                <CardHeader>
                  <CardTitle>Add New Property</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddProperty} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" name="title" required />
                      </div>
                      <div>
                        <Label htmlFor="price">Price (₦)</Label>
                        <Input id="price" name="price" type="number" required />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea id="description" name="description" rows={3} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="property_type">Property Type</Label>
                        <Select name="property_type" required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="apartment">Apartment</SelectItem>
                            <SelectItem value="house">House</SelectItem>
                            <SelectItem value="land">Land</SelectItem>
                            <SelectItem value="commercial">Commercial</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="bedrooms">Bedrooms</Label>
                        <Input id="bedrooms" name="bedrooms" type="number" />
                      </div>
                      <div>
                        <Label htmlFor="bathrooms">Bathrooms</Label>
                        <Input id="bathrooms" name="bathrooms" type="number" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input id="location" name="location" placeholder="e.g., Victoria Island" required />
                      </div>
                      <div>
                        <Label htmlFor="area_sqm">Area (sqm)</Label>
                        <Input id="area_sqm" name="area_sqm" type="number" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="address">Full Address</Label>
                      <Input id="address" name="address" />
                    </div>
                    <div>
                      <Label htmlFor="features">Features (comma separated)</Label>
                      <Input id="features" name="features" placeholder="Pool, Gym, Security, Parking" />
                    </div>
                    <div>
                      <Label htmlFor="status">Status</Label>
                      <Select name="status" defaultValue="available">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="available">Available</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="sold">Sold</SelectItem>
                          <SelectItem value="rented">Rented</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit">Add Property</Button>
                      <Button type="button" variant="outline" onClick={() => setShowAddProperty(false)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            <div className="grid gap-4">
              {loadingData ? (
                <div className="text-center py-8">Loading...</div>
              ) : properties.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Home className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No properties yet</p>
                </div>
              ) : (
                properties.map((property) => (
                  <Card key={property.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold">{property.title}</h3>
                          <p className="text-muted-foreground">{property.location}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="secondary">{property.property_type}</Badge>
                            <Badge variant={property.status === 'available' ? 'default' : 'secondary'}>
                              {property.status}
                            </Badge>
                          </div>
                          <p className="font-bold text-lg text-primary mt-2">
                            ₦{property.price.toLocaleString()}
                          </p>
                          {property.bedrooms && property.bathrooms && (
                            <p className="text-sm text-muted-foreground">
                              {property.bedrooms} bed • {property.bathrooms} bath
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => deleteProperty(property.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="inquiries" className="space-y-4">
            <h2 className="text-xl font-semibold">Customer Inquiries</h2>
            
            <div className="space-y-4">
              {loadingData ? (
                <div className="text-center py-8">Loading...</div>
              ) : inquiries.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No inquiries yet</p>
                </div>
              ) : (
                inquiries.map((inquiry) => (
                  <Card key={inquiry.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="font-semibold">{inquiry.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {inquiry.email} • {inquiry.phone}
                          </p>
                          <p className="text-sm font-medium mt-1">
                            Property: {inquiry.properties.title}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={inquiry.status === 'new' ? 'default' : 'secondary'}>
                            {inquiry.status}
                          </Badge>
                          <Select 
                            value={inquiry.status} 
                            onValueChange={(value) => updateInquiryStatus(inquiry.id, value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="new">New</SelectItem>
                              <SelectItem value="contacted">Contacted</SelectItem>
                              <SelectItem value="scheduled">Scheduled</SelectItem>
                              <SelectItem value="closed">Closed</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="bg-muted p-3 rounded">
                        <p className="text-sm">{inquiry.message}</p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(inquiry.created_at).toLocaleDateString()} • {inquiry.inquiry_type} inquiry
                      </p>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <h2 className="text-xl font-semibold">Analytics Overview</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Property Types Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {['apartment', 'house', 'land', 'commercial'].map(type => {
                      const count = properties.filter(p => p.property_type === type).length;
                      const percentage = properties.length > 0 ? (count / properties.length) * 100 : 0;
                      return (
                        <div key={type} className="flex justify-between items-center">
                          <span className="capitalize">{type}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-muted rounded-full h-2">
                              <div 
                                className="bg-primary h-2 rounded-full" 
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-sm text-muted-foreground">{count}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Inquiry Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {['new', 'contacted', 'scheduled', 'closed'].map(status => {
                      const count = inquiries.filter(i => i.status === status).length;
                      const percentage = inquiries.length > 0 ? (count / inquiries.length) * 100 : 0;
                      return (
                        <div key={status} className="flex justify-between items-center">
                          <span className="capitalize">{status}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-muted rounded-full h-2">
                              <div 
                                className="bg-secondary h-2 rounded-full" 
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-sm text-muted-foreground">{count}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;