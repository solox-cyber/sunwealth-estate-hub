import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Camera, Heart, Home } from "lucide-react";

const FeaturedProperties = () => {
  const properties = [
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
          {properties.map((property, index) => (
            <Card 
              key={property.id} 
              className="group overflow-hidden hover:shadow-luxury transition-all duration-500 hover:-translate-y-2 bg-gradient-card border-0 animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative overflow-hidden">
                {/* Property Image */}
                <div className="h-64 bg-gradient-to-br from-primary/20 to-accent/20 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />
                  
                  {/* Type Badge */}
                  <div className="absolute top-4 left-4 z-20">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      property.type === 'For Sale' 
                        ? 'bg-cta text-cta-foreground' 
                        : 'bg-accent text-accent-foreground'
                    }`}>
                      {property.type}
                    </span>
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

                  {/* Placeholder for property image */}
                  <div className="absolute inset-0 flex items-center justify-center text-white/60">
                    <Home className="w-16 h-16" />
                  </div>
                </div>

                <CardContent className="p-6">
                  {/* Price */}
                  <div className="mb-3">
                    <p className="text-2xl font-bold text-primary">{property.price}</p>
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
                  {(property.beds || property.baths || property.sqft) && (
                    <div className="flex items-center space-x-4 mb-4 text-sm text-muted-foreground">
                      {property.beds && (
                        <span className="flex items-center">
                          <span className="font-semibold text-foreground">{property.beds}</span> beds
                        </span>
                      )}
                      {property.baths && (
                        <span className="flex items-center">
                          <span className="font-semibold text-foreground">{property.baths}</span> baths
                        </span>
                      )}
                      {property.sqft && (
                        <span className="flex items-center">
                          <span className="font-semibold text-foreground">{property.sqft}</span> sqft
                        </span>
                      )}
                    </div>
                  )}

                  {/* Features */}
                  <div className="mb-6">
                    <div className="flex flex-wrap gap-2">
                      {property.features.slice(0, 3).map((feature, idx) => (
                        <span 
                          key={idx}
                          className="px-2 py-1 bg-muted rounded-full text-xs text-muted-foreground"
                        >
                          {feature}
                        </span>
                      ))}
                      {property.features.length > 3 && (
                        <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                          +{property.features.length - 3} more
                        </span>
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
          ))}
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