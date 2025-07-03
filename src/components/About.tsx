import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Users, Home, Award } from "lucide-react";

const About = () => {
  const services = [
    {
      icon: Home,
      title: "Property Management",
      description: "Comprehensive property management services for landlords and investors"
    },
    {
      icon: Users,
      title: "Buy & Sell",
      description: "Expert guidance for property buyers and sellers across Lagos"
    },
    {
      icon: Star,
      title: "Lease & Rent",
      description: "Flexible leasing and rental solutions for residential and commercial properties"
    },
    {
      icon: Award,
      title: "Land Sales",
      description: "Premium land acquisition services in Lagos' developing areas"
    }
  ];

  const stats = [
    { number: "15+", label: "Years Experience" },
    { number: "500+", label: "Properties Sold" },
    { number: "1000+", label: "Happy Clients" },
    { number: "₦50B+", label: "Assets Managed" }
  ];

  return (
    <section id="about" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* About Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            About <span className="text-transparent bg-gradient-secondary bg-clip-text">Sunwealth Ltd</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            RC: 1739523 | Your No.1 Trusted and Reliable Realtor in Lagos
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Company Story */}
          <div className="space-y-6 animate-slide-up">
            <h3 className="text-3xl font-bold text-foreground">
              Lagos Real Estate Experts Since 2009
            </h3>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Sunwealth Ltd has been at the forefront of Lagos' real estate transformation, 
                specializing in premium properties across Ikoyi, Victoria Island, and Lekki. 
                Our deep understanding of Nigeria's business capital makes us the trusted choice 
                for discerning property investors and homeowners.
              </p>
              <p>
                From luxury penthouses to commercial developments, we've facilitated over ₦50 billion 
                worth of property transactions, earning our reputation as Lagos' most reliable real estate partner.
              </p>
              <p>
                Our registered company (RC: 1739523) operates with full transparency and regulatory compliance, 
                ensuring every transaction is secure and professionally handled.
              </p>
            </div>
            
            <div className="flex space-x-4">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary-glow"
                onClick={() => window.open("https://wa.me/2349038379755")}
              >
                Contact Us Today
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => window.open("tel:+2349038379755")}
              >
                Call: +234 903 837 9755
              </Button>
            </div>
          </div>

          {/* Statistics */}
          <div className="space-y-8 animate-scale-in">
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <Card key={index} className="text-center p-6 hover:shadow-card transition-shadow">
                  <CardContent className="p-0">
                    <div className="text-3xl font-bold text-primary mb-2">{stat.number}</div>
                    <div className="text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* Location Badge */}
            <Card className="bg-gradient-primary text-primary-foreground p-6">
              <CardContent className="p-0 text-center">
                <h4 className="text-xl font-semibold mb-2">Prime Lagos Locations</h4>
                <p className="opacity-90">Ikoyi • Victoria Island • Lekki • Lagos Island</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Services Grid */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center text-foreground mb-12">
            Our <span className="text-transparent bg-gradient-secondary bg-clip-text">Services</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <Card 
                key={index} 
                className="group text-center p-6 hover:shadow-luxury hover:-translate-y-2 transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-0">
                  <div className="w-16 h-16 bg-gradient-secondary rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <service.icon className="w-8 h-8 text-secondary-foreground" />
                  </div>
                  <h4 className="text-xl font-semibold text-foreground mb-3">{service.title}</h4>
                  <p className="text-muted-foreground">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Social Media */}
        <div className="text-center bg-muted/30 rounded-2xl p-8 animate-fade-in">
          <h3 className="text-2xl font-bold text-foreground mb-4">Follow Our Journey</h3>
          <p className="text-muted-foreground mb-6">Stay updated with the latest property listings and market insights</p>
          <div className="flex justify-center space-x-4">
            <Button variant="outline" size="lg" className="font-semibold">
              @sunwealth_rent.ng
            </Button>
            <Button variant="outline" size="lg" className="font-semibold">
              @sunwealth_landandacres
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;