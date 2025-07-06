import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Camera, Heart, Home, Bed, Bath, Square, Search, Filter } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import PropertyDetailsModal from '@/components/PropertyDetailsModal';
import PropertyImageGallery from '@/components/PropertyImageGallery';
import Header from '@/components/Header';

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
  images: string[];
  created_at: string;
}

const Properties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [savedProperties, setSavedProperties] = useState<Set<string>>(new Set());
  const [searchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  
  const { user } = useAuth();
  const { toast } = useToast();
  
  const itemsPerPage = 9;

  useEffect(() => {
    fetchProperties();
    if (user) {
      fetchSavedProperties();
    }
  }, [user, currentPage, searchTerm, filterType, sortBy]);

  const fetchProperties = async () => {
    setLoading(true);
    
    let query = supabase
      .from('properties')
      .select('*', { count: 'exact' })
      .eq('status', 'available');

    // Apply search filter
    if (searchTerm) {
      query = query.or(`title.ilike.%${searchTerm}%,location.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
    }

    // Apply property type filter
    if (filterType !== 'all') {
      query = query.eq('property_type', filterType);
    }

    // Apply sorting
    switch (sortBy) {
      case 'newest':
        query = query.order('created_at', { ascending: false });
        break;
      case 'oldest':
        query = query.order('created_at', { ascending: true });
        break;
      case 'price_low':
        query = query.order('price', { ascending: true });
        break;
      case 'price_high':
        query = query.order('price', { ascending: false });
        break;
    }

    // Apply pagination
    const from = (currentPage - 1) * itemsPerPage;
    const to = from + itemsPerPage - 1;
    query = query.range(from, to);

    const { data, count } = await query;

    if (data) {
      setProperties(data);
      setTotalCount(count || 0);
    }
    setLoading(false);
  };

  const fetchSavedProperties = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from('saved_properties')
      .select('property_id')
      .eq('user_id', user.id);

    if (data) {
      setSavedProperties(new Set(data.map(item => item.property_id)));
    }
  };

  const handleSaveProperty = async (propertyId: string) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save properties",
        variant: "destructive"
      });
      return;
    }

    const isSaved = savedProperties.has(propertyId);

    if (isSaved) {
      const { error } = await supabase
        .from('saved_properties')
        .delete()
        .eq('user_id', user.id)
        .eq('property_id', propertyId);

      if (!error) {
        setSavedProperties(prev => {
          const newSet = new Set(prev);
          newSet.delete(propertyId);
          return newSet;
        });
        toast({
          title: "Property removed",
          description: "Property removed from your favorites"
        });
      }
    } else {
      const { error } = await supabase
        .from('saved_properties')
        .insert({
          user_id: user.id,
          property_id: propertyId
        });

      if (!error) {
        setSavedProperties(prev => new Set([...prev, propertyId]));
        toast({
          title: "Property saved",
          description: "Property added to your favorites"
        });
      }
    }
  };

  const handleViewDetails = (property: Property) => {
    setSelectedProperty(property);
    setShowDetails(true);
  };

  const handleViewGallery = (property: Property) => {
    setSelectedProperty(property);
    setShowGallery(true);
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-hero py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
                All Properties
              </h1>
              <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto">
                Discover your perfect property from our extensive collection
              </p>
            </div>
          </div>
        </section>

        {/* Filters Section */}
        <section className="py-8 bg-card border-b">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search properties..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-full sm:w-48">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Property Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="house">House</SelectItem>
                    <SelectItem value="land">Land</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="price_low">Price: Low to High</SelectItem>
                    <SelectItem value="price_high">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="text-sm text-muted-foreground">
                {totalCount} properties found
              </div>
            </div>
          </div>
        </section>

        {/* Properties Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(9)].map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <div className="aspect-video bg-muted animate-pulse" />
                    <CardContent className="p-6">
                      <div className="h-6 bg-muted rounded animate-pulse mb-4" />
                      <div className="h-4 bg-muted rounded animate-pulse mb-2" />
                      <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : properties.length === 0 ? (
              <div className="text-center py-16">
                <Home className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No properties found</h3>
                <p className="text-muted-foreground">Try adjusting your search criteria</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {properties.map((property, index) => (
                  <Card 
                    key={property.id} 
                    className="group overflow-hidden hover:shadow-luxury transition-all duration-500 hover:-translate-y-2 bg-gradient-card border-0"
                  >
                    <div className="relative overflow-hidden">
                      <div className="h-48 sm:h-64 bg-gradient-to-br from-primary/20 to-accent/20 relative overflow-hidden">
                        <img 
                          src={property.images?.[0] || "/placeholder.svg"} 
                          alt={property.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />
                        
                        <div className="absolute top-4 left-4 z-20">
                          <Badge className="bg-secondary text-secondary-foreground">
                            {property.property_type}
                          </Badge>
                        </div>

                        <div className="absolute top-4 right-4 z-20 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <Button 
                            size="sm" 
                            variant="secondary" 
                            className="rounded-full p-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSaveProperty(property.id);
                            }}
                          >
                            <Heart className={`w-4 h-4 ${savedProperties.has(property.id) ? 'fill-red-500 text-red-500' : ''}`} />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="secondary" 
                            className="rounded-full p-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewGallery(property);
                            }}
                          >
                            <Camera className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <CardContent className="p-4 sm:p-6">
                        <div className="mb-3">
                          <p className="text-xl sm:text-2xl font-bold text-primary">₦{property.price.toLocaleString()}</p>
                        </div>

                        <div className="mb-4">
                          <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-1">
                            {property.title}
                          </h3>
                          <div className="flex items-center text-muted-foreground">
                            <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                            <span className="line-clamp-1">{property.location}</span>
                          </div>
                        </div>

                        {(property.bedrooms || property.bathrooms || property.area_sqm) && (
                          <div className="flex items-center space-x-4 mb-4 text-sm text-muted-foreground">
                            {property.bedrooms && (
                              <span className="flex items-center">
                                <Bed className="w-4 h-4 mr-1" />
                                <span className="font-semibold text-foreground">{property.bedrooms}</span>
                              </span>
                            )}
                            {property.bathrooms && (
                              <span className="flex items-center">
                                <Bath className="w-4 h-4 mr-1" />
                                <span className="font-semibold text-foreground">{property.bathrooms}</span>
                              </span>
                            )}
                            {property.area_sqm && (
                              <span className="flex items-center">
                                <Square className="w-4 h-4 mr-1" />
                                <span className="font-semibold text-foreground">{property.area_sqm}</span>
                              </span>
                            )}
                          </div>
                        )}

                        <div className="mb-6">
                          <div className="flex flex-wrap gap-2">
                            {property.features?.slice(0, 2).map((feature, idx) => (
                              <Badge 
                                key={idx}
                                variant="outline"
                                className="text-xs"
                              >
                                {feature}
                              </Badge>
                            ))}
                            {property.features && property.features.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{property.features.length - 2} more
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                          <Button 
                            className="flex-1 bg-primary hover:bg-primary-glow"
                            onClick={() => handleViewDetails(property)}
                          >
                            View Details
                          </Button>
                          <Button 
                            variant="outline" 
                            className="flex-1"
                            onClick={() => window.open("https://wa.me/2347055144347?text=I'm interested in " + property.title)}
                          >
                            Contact
                          </Button>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-12 space-x-2">
                <Button
                  variant="outline"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                >
                  Previous
                </Button>
                
                <div className="flex space-x-1">
                  {[...Array(Math.min(5, totalPages))].map((_, i) => {
                    const pageNum = i + Math.max(1, Math.min(currentPage - 2, totalPages - 4));
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                
                <Button
                  variant="outline"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Modals */}
      {selectedProperty && (
        <PropertyDetailsModal
          property={selectedProperty}
          isOpen={showDetails}
          onClose={() => setShowDetails(false)}
        />
      )}
      
      {selectedProperty && (
        <PropertyImageGallery
          images={selectedProperty.images || []}
          title={selectedProperty.title}
          isOpen={showGallery}
          onClose={() => setShowGallery(false)}
        />
      )}
    </div>
  );
};

export default Properties;