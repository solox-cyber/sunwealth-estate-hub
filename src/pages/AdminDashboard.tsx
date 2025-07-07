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
import { Upload, X } from 'lucide-react';
import { useOpenAI } from '@/hooks/useOpenAI';

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
  const [uploadingImages, setUploadingImages] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const { config: openAIConfig, loading: aiLoading, saveAPIKey, generateContent } = useOpenAI();
  
  // AI Tools state
  const [chatInput, setChatInput] = useState('');
  const [chatResponse, setChatResponse] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [contentPrompt, setContentPrompt] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [showChatTest, setShowChatTest] = useState(false);
  const [showContentGenerator, setShowContentGenerator] = useState(false);
  const [showMortgageCalculator, setShowMortgageCalculator] = useState(false);
  const [showValuationTool, setShowValuationTool] = useState(false);

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

  const uploadImages = async (propertyId: string): Promise<string[]> => {
    const imageUrls: string[] = [];
    
    for (const file of selectedImages) {
      const fileName = `${propertyId}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('property-images')
        .upload(fileName, file);

      if (uploadError) {
        throw new Error(`Failed to upload ${file.name}: ${uploadError.message}`);
      }

      const { data: { publicUrl } } = supabase.storage
        .from('property-images')
        .getPublicUrl(fileName);
      
      imageUrls.push(publicUrl);
    }
    
    return imageUrls;
  };

  const handleAddProperty = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploadingImages(true);
    
    try {
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

      // Insert property first
      const { data: propertyResult, error: propertyError } = await supabase
        .from('properties')
        .insert([propertyData])
        .select('id')
        .single();

      if (propertyError) throw propertyError;

      // Upload images if any
      let imageUrls: string[] = [];
      if (selectedImages.length > 0) {
        imageUrls = await uploadImages(propertyResult.id);
        
        // Update property with image URLs
        const { error: updateError } = await supabase
          .from('properties')
          .update({ images: imageUrls })
          .eq('id', propertyResult.id);
          
        if (updateError) throw updateError;
      }

      toast({
        title: "Property added successfully",
        description: "The property has been added to the listings.",
      });
      
      setShowAddProperty(false);
      setSelectedImages([]);
      fetchAdminData();
    } catch (error: any) {
      toast({
        title: "Error adding property",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploadingImages(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedImages(Array.from(e.target.files));
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const deleteProperty = async (propertyId: string) => {
    if (!confirm('Are you sure you want to delete this property?')) {
      return;
    }

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

  const handleEditProperty = (property: Property) => {
    setEditingProperty(property);
    setShowAddProperty(true);
  };

  const handleSaveAPIKey = async () => {
    if (!apiKeyInput.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter your OpenAI API key",
        variant: "destructive"
      });
      return;
    }

    const success = await saveAPIKey(apiKeyInput);
    if (success) {
      setApiKeyInput('');
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

  // AI Tools handlers
  const handleTestChatbot = async () => {
    setIsGenerating(true);
    setChatInput('Looking for a 3 bedroom apartment in Victoria Island');
    
    const response = await generateContent(
      `Act as a property search assistant. A user is asking: "Looking for a 3 bedroom apartment in Victoria Island". 
      Respond helpfully based on our available properties: ${JSON.stringify(properties.slice(0, 3))}`,
      { properties: properties.slice(0, 3) }
    );
    
    if (response) {
      setChatResponse(response);
      setShowChatTest(true);
    }
    setIsGenerating(false);
  };

  const handleConfigureChatbot = () => {
    toast({
      title: "Chatbot Configuration",
      description: "Configure chatbot responses, personality, and data sources here.",
    });
  };

  const handleLaunchMortgageCalculator = () => {
    setShowMortgageCalculator(true);
    toast({
      title: "Mortgage Calculator",
      description: "Interactive mortgage calculator launched.",
    });
  };

  const handleMortgageSettings = () => {
    toast({
      title: "Mortgage Settings",
      description: "Configure interest rates, loan terms, and calculation parameters.",
    });
  };

  const handleTestValuation = async () => {
    if (properties.length === 0) {
      toast({
        title: "No Properties",
        description: "Add some properties first to test the valuation tool.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    const sampleProperty = properties[0];
    
    const response = await generateContent(
      `Provide a property valuation analysis for: ${sampleProperty.title} in ${sampleProperty.location}, 
      Price: ₦${sampleProperty.price.toLocaleString()}, Type: ${sampleProperty.property_type}, 
      ${sampleProperty.bedrooms} bed, ${sampleProperty.bathrooms} bath. 
      Include market comparison, value factors, and investment potential.`,
      { property: sampleProperty, market_data: properties }
    );
    
    if (response) {
      setGeneratedContent(response);
      setShowValuationTool(true);
    }
    setIsGenerating(false);
  };

  const handleCustomizeValuation = () => {
    toast({
      title: "Valuation Customization",
      description: "Customize valuation parameters, market data sources, and analysis criteria.",
    });
  };

  const handleGenerateContent = async () => {
    if (properties.length === 0) {
      toast({
        title: "No Properties",
        description: "Add some properties first to generate content.",
        variant: "destructive"
      });
      return;
    }

    setContentPrompt('Generate compelling property description');
    setShowContentGenerator(true);
  };

  const handleTemplates = () => {
    toast({
      title: "Content Templates",
      description: "Access pre-built templates for property descriptions, social media posts, and marketing copy.",
    });
  };

  const handleGenerateSpecificContent = async () => {
    if (!contentPrompt.trim()) return;
    
    setIsGenerating(true);
    const sampleProperty = properties[0];
    
    const response = await generateContent(
      `${contentPrompt} for this property: ${sampleProperty.title} in ${sampleProperty.location}, 
      Price: ₦${sampleProperty.price.toLocaleString()}, Type: ${sampleProperty.property_type}, 
      Features: ${sampleProperty.features?.join(', ') || 'Modern amenities'}`,
      { property: sampleProperty }
    );
    
    if (response) {
      setGeneratedContent(response);
    }
    setIsGenerating(false);
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
          <TabsList className="grid w-full grid-cols-4">
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
            <TabsTrigger value="ai-tools" className="flex items-center gap-2">
              <span className="h-4 w-4">🤖</span>
              AI Tools
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
                      <Label htmlFor="images">Property Images</Label>
                      <div className="space-y-4">
                        <div className="flex items-center justify-center w-full">
                          <label htmlFor="images" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
                            <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                            <p className="text-sm text-muted-foreground">Click to upload property images</p>
                            <input
                              id="images"
                              type="file"
                              multiple
                              accept="image/*"
                              className="hidden"
                              onChange={handleImageSelect}
                            />
                          </label>
                        </div>
                        {selectedImages.length > 0 && (
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {selectedImages.map((file, index) => (
                              <div key={index} className="relative">
                                <img
                                  src={URL.createObjectURL(file)}
                                  alt={`Property ${index + 1}`}
                                  className="w-full h-24 object-cover rounded-lg"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeImage(index)}
                                  className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 h-6 w-6 flex items-center justify-center text-xs"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
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
                      <Button type="submit" disabled={uploadingImages}>
                        {uploadingImages ? "Adding Property..." : "Add Property"}
                      </Button>
                      <Button type="button" variant="outline" onClick={() => {
                        setShowAddProperty(false);
                        setSelectedImages([]);
                      }}>
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
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditProperty(property)}
                          >
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

          <TabsContent value="ai-tools" className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl font-semibold">AI Tools & Automation</h2>
                <Card className="p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">API Status:</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      openAIConfig.isConfigured 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {openAIConfig.isConfigured ? 'Configured' : 'Not Configured'}
                    </span>
                  </div>
                </Card>
              </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Property Search Assistant */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Property Search Assistant
                  </CardTitle>
                  <CardDescription>
                    Intelligent chatbot for property search and lead capture
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">Preview Response:</p>
                    <p className="text-sm italic">
                      "Hi! I'm your personal property finder. What's your dream home like?"
                    </p>
                  </div>
                   <div className="flex gap-2">
                     <Button 
                       variant="outline" 
                       size="sm" 
                       disabled={!openAIConfig.isConfigured || isGenerating}
                       onClick={handleTestChatbot}
                     >
                       {isGenerating ? 'Testing...' : 'Test Chatbot'}
                     </Button>
                     <Button 
                       variant="outline" 
                       size="sm" 
                       disabled={!openAIConfig.isConfigured}
                       onClick={handleConfigureChatbot}
                     >
                       Configure
                     </Button>
                   </div>
                  <div className="text-xs text-muted-foreground">
                    {openAIConfig.isConfigured ? 'AI tools are ready to use' : 'Requires OpenAI API key to activate'}
                  </div>
                </CardContent>
              </Card>

              {/* Mortgage Calculator AI */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="h-5 w-5">🏦</span>
                    Mortgage Calculator AI
                  </CardTitle>
                  <CardDescription>
                    Interactive mortgage calculator with AI guidance
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">Sample Interaction:</p>
                    <p className="text-sm italic">
                      "How much home can you afford? Let me help you figure that out!"
                    </p>
                  </div>
                   <div className="flex gap-2">
                     <Button 
                       variant="outline" 
                       size="sm" 
                       disabled={!openAIConfig.isConfigured}
                       onClick={handleLaunchMortgageCalculator}
                     >
                       Launch Tool
                     </Button>
                     <Button 
                       variant="outline" 
                       size="sm" 
                       disabled={!openAIConfig.isConfigured}
                       onClick={handleMortgageSettings}
                     >
                       Settings
                     </Button>
                   </div>
                  <div className="text-xs text-muted-foreground">
                    {openAIConfig.isConfigured ? 'AI tools are ready to use' : 'Requires OpenAI API key to activate'}
                  </div>
                </CardContent>
              </Card>

              {/* Home Valuation Tool */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="h-5 w-5">🏠</span>
                    Smart Property Valuation
                  </CardTitle>
                  <CardDescription>
                    AI-powered home valuation and market analysis
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">User Prompt:</p>
                    <p className="text-sm italic">
                      "Curious about your home's value? Get an instant estimate!"
                    </p>
                  </div>
                   <div className="flex gap-2">
                     <Button 
                       variant="outline" 
                       size="sm" 
                       disabled={!openAIConfig.isConfigured || isGenerating}
                       onClick={handleTestValuation}
                     >
                       {isGenerating ? 'Analyzing...' : 'Test Valuation'}
                     </Button>
                     <Button 
                       variant="outline" 
                       size="sm" 
                       disabled={!openAIConfig.isConfigured}
                       onClick={handleCustomizeValuation}
                     >
                       Customize
                     </Button>
                   </div>
                  <div className="text-xs text-muted-foreground">
                    {openAIConfig.isConfigured ? 'AI tools are ready to use' : 'Requires OpenAI API key to activate'}
                  </div>
                </CardContent>
              </Card>

              {/* Content Generation */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Edit className="h-5 w-5" />
                    Content Generation
                  </CardTitle>
                  <CardDescription>
                    Auto-generate property descriptions and marketing content
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">Features:</p>
                    <ul className="text-sm space-y-1">
                      <li>• Property descriptions</li>
                      <li>• Social media captions</li>
                      <li>• Email marketing copy</li>
                    </ul>
                  </div>
                   <div className="flex gap-2">
                     <Button 
                       variant="outline" 
                       size="sm" 
                       disabled={!openAIConfig.isConfigured}
                       onClick={handleGenerateContent}
                     >
                       Generate Content
                     </Button>
                     <Button 
                       variant="outline" 
                       size="sm" 
                       disabled={!openAIConfig.isConfigured}
                       onClick={handleTemplates}
                     >
                       Templates
                     </Button>
                   </div>
                  <div className="text-xs text-muted-foreground">
                    {openAIConfig.isConfigured ? 'AI tools are ready to use' : 'Requires OpenAI API key to activate'}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* AI Configuration Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="h-5 w-5">⚙️</span>
                  AI Configuration
                </CardTitle>
                <CardDescription>
                  Configure your OpenAI API key to activate AI features
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="openai-key">OpenAI API Key</Label>
                    <Input 
                      id="openai-key" 
                      type="password" 
                      placeholder="sk-..." 
                      value={apiKeyInput}
                      onChange={(e) => setApiKeyInput(e.target.value)}
                      disabled={aiLoading}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Your API key will be validated and you'll need to add it to Supabase Edge Function secrets
                    </p>
                  </div>
                  <div className="flex flex-col justify-end">
                    <Button 
                      onClick={handleSaveAPIKey}
                      disabled={aiLoading || !apiKeyInput.trim()}
                    >
                      {aiLoading ? 'Validating...' : 'Validate & Save'}
                    </Button>
                    <p className="text-xs text-muted-foreground mt-1">
                      This will validate your key and enable AI features
                    </p>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Available AI Models</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                    <div className="p-2 bg-muted rounded">
                      <strong>GPT-4o Mini</strong><br/>
                      <span className="text-muted-foreground">Fast & cost-effective</span>
                    </div>
                    <div className="p-2 bg-muted rounded">
                      <strong>GPT-4o</strong><br/>
                      <span className="text-muted-foreground">Advanced reasoning</span>
                    </div>
                    <div className="p-2 bg-muted rounded">
                      <strong>GPT-4.1-2025</strong><br/>
                      <span className="text-muted-foreground">Latest flagship</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

             {/* AI Performance Metrics */}
             <Card>
               <CardHeader>
                 <CardTitle>AI Performance Metrics</CardTitle>
                 <CardDescription>
                   Track the effectiveness of your AI tools
                 </CardDescription>
               </CardHeader>
               <CardContent>
                 <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                   <div className="text-center p-4 bg-muted rounded-lg">
                     <div className="text-2xl font-bold text-muted-foreground">--</div>
                     <div className="text-sm text-muted-foreground">Chat Conversations</div>
                   </div>
                   <div className="text-center p-4 bg-muted rounded-lg">
                     <div className="text-2xl font-bold text-muted-foreground">--</div>
                     <div className="text-sm text-muted-foreground">Leads Generated</div>
                   </div>
                   <div className="text-center p-4 bg-muted rounded-lg">
                     <div className="text-2xl font-bold text-muted-foreground">--%</div>
                     <div className="text-sm text-muted-foreground">Conversion Rate</div>
                   </div>
                   <div className="text-center p-4 bg-muted rounded-lg">
                     <div className="text-2xl font-bold text-muted-foreground">--</div>
                     <div className="text-sm text-muted-foreground">Content Generated</div>
                   </div>
                 </div>
                 <p className="text-xs text-muted-foreground mt-4 text-center">
                   Metrics will populate once AI features are configured and active
                 </p>
               </CardContent>
             </Card>

             {/* AI Tool Results Display */}
             {showChatTest && (
               <Card>
                 <CardHeader>
                   <CardTitle className="flex items-center justify-between">
                     Chatbot Test Results
                     <Button 
                       variant="ghost" 
                       size="sm" 
                       onClick={() => setShowChatTest(false)}
                     >
                       <X className="h-4 w-4" />
                     </Button>
                   </CardTitle>
                 </CardHeader>
                 <CardContent className="space-y-4">
                   <div className="bg-blue-50 p-3 rounded-lg">
                     <p className="text-sm font-medium text-blue-900">User Query:</p>
                     <p className="text-sm text-blue-800">{chatInput}</p>
                   </div>
                   <div className="bg-green-50 p-3 rounded-lg">
                     <p className="text-sm font-medium text-green-900">AI Response:</p>
                     <p className="text-sm text-green-800 whitespace-pre-wrap">{chatResponse}</p>
                   </div>
                 </CardContent>
               </Card>
             )}

             {showContentGenerator && (
               <Card>
                 <CardHeader>
                   <CardTitle className="flex items-center justify-between">
                     Content Generator
                     <Button 
                       variant="ghost" 
                       size="sm" 
                       onClick={() => setShowContentGenerator(false)}
                     >
                       <X className="h-4 w-4" />
                     </Button>
                   </CardTitle>
                 </CardHeader>
                 <CardContent className="space-y-4">
                   <div>
                     <Label htmlFor="content-prompt">Content Prompt</Label>
                     <Textarea
                       id="content-prompt"
                       placeholder="e.g., Generate a compelling property description"
                       value={contentPrompt}
                       onChange={(e) => setContentPrompt(e.target.value)}
                       rows={3}
                     />
                   </div>
                   <div className="flex gap-2">
                     <Button 
                       onClick={handleGenerateSpecificContent}
                       disabled={isGenerating || !contentPrompt.trim()}
                     >
                       {isGenerating ? 'Generating...' : 'Generate Content'}
                     </Button>
                   </div>
                   {generatedContent && (
                     <div className="bg-muted p-4 rounded-lg">
                       <p className="text-sm font-medium mb-2">Generated Content:</p>
                       <p className="text-sm whitespace-pre-wrap">{generatedContent}</p>
                     </div>
                   )}
                 </CardContent>
               </Card>
             )}

             {showMortgageCalculator && (
               <Card>
                 <CardHeader>
                   <CardTitle className="flex items-center justify-between">
                     Mortgage Calculator
                     <Button 
                       variant="ghost" 
                       size="sm" 
                       onClick={() => setShowMortgageCalculator(false)}
                     >
                       <X className="h-4 w-4" />
                     </Button>
                   </CardTitle>
                 </CardHeader>
                 <CardContent className="space-y-4">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                       <Label>Loan Amount (₦)</Label>
                       <Input type="number" placeholder="5,000,000" />
                     </div>
                     <div>
                       <Label>Interest Rate (%)</Label>
                       <Input type="number" placeholder="15" />
                     </div>
                     <div>
                       <Label>Loan Term (years)</Label>
                       <Input type="number" placeholder="25" />
                     </div>
                     <div>
                       <Label>Down Payment (₦)</Label>
                       <Input type="number" placeholder="1,000,000" />
                     </div>
                   </div>
                   <Button variant="outline" className="w-full">
                     Calculate Monthly Payment
                   </Button>
                   <div className="bg-muted p-4 rounded-lg">
                     <p className="text-sm text-muted-foreground">This is a demo mortgage calculator. Full functionality would include AI-powered recommendations and market insights.</p>
                   </div>
                 </CardContent>
               </Card>
             )}

             {showValuationTool && (
               <Card>
                 <CardHeader>
                   <CardTitle className="flex items-center justify-between">
                     Property Valuation Analysis
                     <Button 
                       variant="ghost" 
                       size="sm" 
                       onClick={() => setShowValuationTool(false)}
                     >
                       <X className="h-4 w-4" />
                     </Button>
                   </CardTitle>
                 </CardHeader>
                 <CardContent className="space-y-4">
                   <div className="bg-muted p-4 rounded-lg">
                     <p className="text-sm font-medium mb-2">AI Valuation Analysis:</p>
                     <p className="text-sm whitespace-pre-wrap">{generatedContent}</p>
                   </div>
                 </CardContent>
               </Card>
             )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;