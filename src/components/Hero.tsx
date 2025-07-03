import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Home } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

const Hero = () => {
  const [searchData, setSearchData] = useState({
    location: "",
    propertyType: "",
    priceRange: ""
  });

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="Lagos Premium Real Estate" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-hero" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Hero Text */}
          <div className="mb-8 animate-fade-in">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Discover Your
              <span className="text-transparent bg-gradient-secondary bg-clip-text block">
                Dream Property
              </span>
              in Lagos
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
              Premium real estate in Ikoyi, Victoria Island, and Lekki. 
              Your trusted partner for luxury properties in Nigeria's business capital.
            </p>
          </div>

          {/* Property Search Card */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-luxury animate-slide-up">
            <div className="flex items-center justify-center mb-6">
              <div className="flex items-center space-x-2 text-primary">
                <Search className="w-6 h-6" />
                <h3 className="text-xl font-semibold">Find Your Perfect Property</h3>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              {/* Location */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  Location
                </label>
                <Select onValueChange={(value) => setSearchData({...searchData, location: value})}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select area" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ikoyi">Ikoyi</SelectItem>
                    <SelectItem value="victoria-island">Victoria Island</SelectItem>
                    <SelectItem value="lekki">Lekki</SelectItem>
                    <SelectItem value="lagos-island">Lagos Island</SelectItem>
                    <SelectItem value="surulere">Surulere</SelectItem>
                    <SelectItem value="ikeja">Ikeja</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Property Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center">
                  <Home className="w-4 h-4 mr-1" />
                  Property Type
                </label>
                <Select onValueChange={(value) => setSearchData({...searchData, propertyType: value})}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Property type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="house">House</SelectItem>
                    <SelectItem value="duplex">Duplex</SelectItem>
                    <SelectItem value="penthouse">Penthouse</SelectItem>
                    <SelectItem value="land">Land</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Price Range (₦)
                </label>
                <Select onValueChange={(value) => setSearchData({...searchData, priceRange: value})}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Budget" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-50m">₦0 - ₦50M</SelectItem>
                    <SelectItem value="50m-100m">₦50M - ₦100M</SelectItem>
                    <SelectItem value="100m-200m">₦100M - ₦200M</SelectItem>
                    <SelectItem value="200m-500m">₦200M - ₦500M</SelectItem>
                    <SelectItem value="500m+">₦500M+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Search Button */}
              <div className="flex items-end">
                <Button className="w-full h-12 bg-cta hover:bg-cta/90 text-cta-foreground font-semibold">
                  <Search className="w-5 h-5 mr-2" />
                  Search Properties
                </Button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">500+</p>
                <p className="text-sm text-muted-foreground">Properties Sold</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">1000+</p>
                <p className="text-sm text-muted-foreground">Happy Clients</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">15+</p>
                <p className="text-sm text-muted-foreground">Years Experience</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">₦50B+</p>
                <p className="text-sm text-muted-foreground">Properties Managed</p>
              </div>
            </div>
          </div>

          {/* Floating Action Buttons */}
          <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-3 animate-float">
            <Button
              size="lg"
              className="rounded-full bg-accent hover:bg-accent-glow shadow-glow"
              onClick={() => window.open("https://wa.me/2349038379755")}
            >
              WhatsApp
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full bg-white/90 backdrop-blur-sm"
              onClick={() => window.open("tel:+2349038379755")}
            >
              Call Now
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;