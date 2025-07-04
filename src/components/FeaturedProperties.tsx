import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Camera, Heart, Home, Bed, Bath, Square } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';

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

const FeaturedProperties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    const { data } = await supabase
      .from('properties')
      .select('*')
      .eq('status', 'available')
      .order('created_at', { ascending: false })
      .limit(3);

    if (data) {
      setProperties(data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <section id="properties" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Properties</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Loading our latest property listings...</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
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
        </div>
      </section>
    );
  }

  const mockProperties = [
    {
      id: 1,
      title: "Luxury Penthouse in Ikoyi",
      location: "Ikoyi, Lagos",
      price: "₦450,000,000",
      beds: 4,
      baths: 5,
      sqft: "3,500",
      image: "/api/placeholder/400/300",
      type: "For Sale",
      features: ["Swimming Pool", "Generator", "Security", "Parking"]
    },
    {
      id: 2,
      title: "Modern 3BR Apartment",
      location: "Victoria Island, Lagos",
      price: "₦85,000,000",
      beds: 3,
      baths: 4,
      sqft: "2,200",
      image: "/api/placeholder/400/300",
      type: "For Sale",
      features: ["Ocean View", "Gym", "24/7 Security", "Parking"]
    },
    {
      id: 3,
      title: "Executive Duplex",
      location: "Lekki Phase 1, Lagos",
      price: "₦180,000,000",
      beds: 5,
      baths: 6,
      sqft: "4,000",
      image: "/api/placeholder/400/300",
      type: "For Sale",
      features: ["Garden", "Generator", "BQ", "Gate House"]
    },
    {
      id: 4,
      title: "Waterfront Mansion",
      location: "Banana Island, Lagos",
      price: "₦750,000,000",
      beds: 6,
      baths: 7,
      sqft: "5,500",
      image: "/api/placeholder/400/300",
      type: "For Sale",
      features: ["Private Jetty", "Cinema", "Wine Cellar", "Staff Quarters"]
    },
    {
      id: 5,
      title: "Commercial Land",
      location: "Lekki Free Zone, Lagos",
      price: "₦25,000/sqm",
      beds: null,
      baths: null,
      sqft: "5,000",
      image: "/api/placeholder/400/300",
      type: "For Sale",
      features: ["C of O", "Survey Plan", "Fenced", "Road Access"]
    },
    {
      id: 6,
      title: "Serviced Apartment",
      location: "Victoria Island, Lagos",
      price: "₦8,500,000/year",
      beds: 2,
      baths: 3,
      sqft: "1,800",
      image: "/api/placeholder/400/300",
      type: "For Rent",
      features: ["Furnished", "24/7 Power", "Cleaning Service", "Security"]
    }
  ];

  return (
    <section id="properties" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Featured <span className="text-transparent bg-gradient-secondary bg-clip-text">Properties</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover our handpicked selection of premium properties across Lagos' most prestigious locations
          </p>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Home className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No properties available at the moment.</p>
            </div>
          ) : (
            properties.map((property, index) => (
              <Card 
                key={property.id} 
                className="group overflow-hidden hover:shadow-luxury transition-all duration-500 hover:-translate-y-2 bg-gradient-card border-0 animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative overflow-hidden">
                  {/* Property Image */}
                  <div className="h-64 bg-gradient-to-br from-primary/20 to-accent/20 relative overflow-hidden">
                    <img 
                      src={property.images?.[0] || "/placeholder.svg"} 
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />
                    
                    {/* Type Badge */}
                    <div className="absolute top-4 left-4 z-20">
                      <Badge className="bg-secondary text-secondary-foreground">
                        {property.property_type}
                      </Badge>
                    </div>

                    {/* Action Buttons */}
                    <div className="absolute top-4 right-4 z-20 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button size="sm" variant="secondary" className="rounded-full p-2">
                        <Heart className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="secondary" className="rounded-full p-2">
                        <Camera className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    {/* Price */}
                    <div className="mb-3">
                      <p className="text-2xl font-bold text-primary">₦{property.price.toLocaleString()}</p>
                    </div>

                    {/* Title & Location */}
                    <div className="mb-4">
                      <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {property.title}
                      </h3>
                      <div className="flex items-center text-muted-foreground">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span>{property.location}</span>
                      </div>
                    </div>

                    {/* Property Details */}
                    {(property.bedrooms || property.bathrooms || property.area_sqm) && (
                      <div className="flex items-center space-x-4 mb-4 text-sm text-muted-foreground">
                        {property.bedrooms && (
                          <span className="flex items-center">
                            <Bed className="w-4 h-4 mr-1" />
                            <span className="font-semibold text-foreground">{property.bedrooms}</span> bed
                          </span>
                        )}
                        {property.bathrooms && (
                          <span className="flex items-center">
                            <Bath className="w-4 h-4 mr-1" />
                            <span className="font-semibold text-foreground">{property.bathrooms}</span> bath
                          </span>
                        )}
                        {property.area_sqm && (
                          <span className="flex items-center">
                            <Square className="w-4 h-4 mr-1" />
                            <span className="font-semibold text-foreground">{property.area_sqm}</span> sqm
                          </span>
                        )}
                      </div>
                    )}

                    {/* Features */}
                    <div className="mb-6">
                      <div className="flex flex-wrap gap-2">
                        {property.features?.slice(0, 3).map((feature, idx) => (
                          <Badge 
                            key={idx}
                            variant="outline"
                            className="text-xs"
                          >
                            {feature}
                          </Badge>
                        ))}
                        {property.features && property.features.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{property.features.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                      <Button className="flex-1 bg-primary hover:bg-primary-glow">
                        View Details
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => window.open("https://wa.me/2349038379755?text=I'm interested in " + property.title)}
                      >
                        Contact
                      </Button>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button size="lg" variant="outline" className="px-8 py-3">
            View All Properties
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;