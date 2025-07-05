import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Phone, MessageSquare, MapPin, Clock, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    propertyType: "",
    budget: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    toast({
      title: "Message Sent!",
      description: "Thank you for your inquiry. We'll get back to you within 24 hours.",
    });
    
    // WhatsApp integration with form data
    const whatsappMessage = `Hi Sunwealth! I'm interested in:\n\nName: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nProperty Type: ${formData.propertyType}\nBudget: ${formData.budget}\n\nMessage: ${formData.message}`;
    window.open(`https://wa.me/2347055144347?text=${encodeURIComponent(whatsappMessage)}`);
  };

  const contactMethods = [
    {
      icon: Phone,
      title: "Call Us",
      subtitle: "Speak directly with our experts",
      value: "+234 705 514 4347",
      action: () => window.open("tel:+2347055144347"),
      bgColor: "bg-primary"
    },
    {
      icon: MessageSquare,
      title: "WhatsApp",
      subtitle: "Quick responses via WhatsApp",
      value: "Chat with us now",
      action: () => window.open("https://wa.me/2347055144347"),
      bgColor: "bg-accent"
    },
    {
      icon: MapPin,
      title: "Visit Our Office",
      subtitle: "Meet us at our Lagos office",
      value: "Victoria Island, Lagos",
      action: () => {},
      bgColor: "bg-secondary"
    }
  ];

  const businessHours = [
    { day: "Monday - Friday", hours: "9:00 AM - 6:00 PM" },
    { day: "Saturday", hours: "10:00 AM - 4:00 PM" },
    { day: "Sunday", hours: "By Appointment" }
  ];

  return (
    <section id="contact" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Contact <span className="text-transparent bg-gradient-secondary bg-clip-text">Sunwealth</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Ready to find your dream property? Get in touch with Lagos' most trusted real estate experts
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="animate-slide-up">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-foreground mb-6">Send us a Message</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
                    <Input
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
                    <Input
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Phone Number</label>
                    <Input
                      placeholder="+234 xxx xxx xxxx"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Property Type</label>
                    <Select onValueChange={(value) => setFormData({...formData, propertyType: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select property type" />
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
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Budget Range</label>
                  <Select onValueChange={(value) => setFormData({...formData, budget: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your budget range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-50m">₦0 - ₦50 Million</SelectItem>
                      <SelectItem value="50m-100m">₦50M - ₦100 Million</SelectItem>
                      <SelectItem value="100m-200m">₦100M - ₦200 Million</SelectItem>
                      <SelectItem value="200m-500m">₦200M - ₦500 Million</SelectItem>
                      <SelectItem value="500m+">₦500 Million+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Message</label>
                  <Textarea
                    placeholder="Tell us about your property requirements..."
                    className="min-h-[120px]"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    required
                  />
                </div>

                <Button type="submit" size="lg" className="w-full bg-cta hover:bg-cta/90">
                  Send Message & Connect via WhatsApp
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-8 animate-scale-in">
            {/* Contact Methods */}
            <div className="space-y-4">
              {contactMethods.map((method, index) => (
                <Card 
                  key={index} 
                  className="group cursor-pointer hover:shadow-card transition-all duration-300 hover:-translate-y-1"
                  onClick={method.action}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 ${method.bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <method.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {method.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">{method.subtitle}</p>
                        <p className="text-primary font-medium">{method.value}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Business Hours */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <h4 className="text-lg font-semibold text-foreground">Business Hours</h4>
                </div>
                <div className="space-y-2">
                  {businessHours.map((schedule, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{schedule.day}</span>
                      <span className="text-foreground font-medium">{schedule.hours}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Trust Indicators */}
            <Card className="bg-gradient-card">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center space-x-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-secondary text-secondary" />
                  ))}
                </div>
                <h4 className="font-semibold text-foreground mb-2">Trusted by 1000+ Clients</h4>
                <p className="text-sm text-muted-foreground">
                  RC: 1739523 | Licensed & Regulated Real Estate Company
                </p>
                <div className="mt-4 flex justify-center space-x-4 text-xs text-muted-foreground">
                  <span>• 15+ Years Experience</span>
                  <span>• ₦50B+ Transactions</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;