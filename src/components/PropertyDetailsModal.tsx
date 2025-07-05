import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Bed, Bath, Square, Calendar, User } from "lucide-react";

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

interface PropertyDetailsModalProps {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
}

const PropertyDetailsModal = ({ property, isOpen, onClose }: PropertyDetailsModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{property.title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Image Gallery */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {property.images?.slice(0, 4).map((image, index) => (
              <div key={index} className="aspect-video relative overflow-hidden rounded-lg">
                <img
                  src={image || "/placeholder.svg"}
                  alt={`${property.title} - Image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>

          {/* Price and Basic Info */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-3xl font-bold text-primary">₦{property.price.toLocaleString()}</p>
              <div className="flex items-center text-muted-foreground mt-1">
                <MapPin className="w-4 h-4 mr-2" />
                <span>{property.location}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Badge className="bg-secondary text-secondary-foreground">
                {property.property_type}
              </Badge>
              <Badge variant={property.status === 'available' ? 'default' : 'secondary'}>
                {property.status}
              </Badge>
            </div>
          </div>

          {/* Property Details */}
          {(property.bedrooms || property.bathrooms || property.area_sqm) && (
            <div className="flex items-center space-x-6 p-4 bg-muted/30 rounded-lg">
              {property.bedrooms && (
                <div className="flex items-center">
                  <Bed className="w-5 h-5 mr-2 text-primary" />
                  <span className="font-semibold">{property.bedrooms}</span>
                  <span className="text-muted-foreground ml-1">Bedrooms</span>
                </div>
              )}
              {property.bathrooms && (
                <div className="flex items-center">
                  <Bath className="w-5 h-5 mr-2 text-primary" />
                  <span className="font-semibold">{property.bathrooms}</span>
                  <span className="text-muted-foreground ml-1">Bathrooms</span>
                </div>
              )}
              {property.area_sqm && (
                <div className="flex items-center">
                  <Square className="w-5 h-5 mr-2 text-primary" />
                  <span className="font-semibold">{property.area_sqm}</span>
                  <span className="text-muted-foreground ml-1">sqm</span>
                </div>
              )}
            </div>
          )}

          {/* Description */}
          {property.description && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground leading-relaxed">{property.description}</p>
            </div>
          )}

          {/* Address */}
          {property.address && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Address</h3>
              <p className="text-muted-foreground">{property.address}</p>
            </div>
          )}

          {/* Features */}
          {property.features && property.features.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Features & Amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {property.features.map((feature, idx) => (
                  <Badge key={idx} variant="outline" className="justify-start">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Additional Info */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground pt-4 border-t">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Listed {new Date(property.created_at).toLocaleDateString()}
            </div>
            <div className="flex items-center">
              <User className="w-4 h-4 mr-2" />
              Property ID: {property.id.slice(0, 8)}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button 
              className="flex-1 bg-primary hover:bg-primary-glow"
              onClick={() => window.open(`https://wa.me/2349038379755?text=I'm interested in ${property.title} (ID: ${property.id.slice(0, 8)})`)}
            >
              Contact Agent
            </Button>
            <Button variant="outline" className="flex-1">
              Schedule Viewing
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PropertyDetailsModal;