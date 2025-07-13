import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Phone, MessageSquare, MapPin, Clock, Star } from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    propertyType: "",
    budget: "",
    message: ""
  });

  const handleSubmit = () => {
    // Simulate form submission with toast-like alert
    alert("Message Sent! Thank you for your inquiry. We'll get back to you within 24 hours.");
    
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
      bgColor: "bg-blue-600"
    },
    {
      icon: MessageSquare,
      title: "WhatsApp",
      subtitle: "Quick responses via WhatsApp",
      value: "Chat with us now",
      action: () => window.open("https://wa.me/2347055144347"),
      bgColor: "bg-green-600"
    },
    {
      icon: MapPin,
      title: "Visit Our Office",
      subtitle: "Meet us at our Lagos office",
      value: "Victoria Island, Lagos",
      action: () => {},
      bgColor: "bg-purple-600"
    }
  ];

  const businessHours = [
    { day: "Monday - Friday", hours: "9:00 AM - 6:00 PM" },
    { day: "Saturday", hours: "10:00 AM - 4:00 PM" },
    { day: "Sunday", hours: "By Appointment" }
  ];

  return (
    <section id="contact" className="py-12 sm:py-16 lg:py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
            Contact <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Sunwealth</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            Ready to find your dream property? Get in touch with Lagos' most trusted real estate experts
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact Form */}
          <Card className="order-2 lg:order-1">
            <CardContent className="p-4 sm:p-6 lg:p-8">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Send us a Message</h3>
              <div className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <Input
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <Input
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <Input
                      placeholder="+234 xxx xxx xxxx"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      required
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
                    <Select onValueChange={(value) => setFormData({...formData, propertyType: value})}>
                      <SelectTrigger className="w-full">
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Budget Range</label>
                  <Select onValueChange={(value) => setFormData({...formData, budget: value})}>
                    <SelectTrigger className="w-full">
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <Textarea
                    placeholder="Tell us about your property requirements..."
                    className="min-h-[100px] sm:min-h-[120px] w-full resize-none"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    required
                  />
                </div>

                <Button 
                  onClick={handleSubmit}
                  size="lg" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 sm:py-4 text-base sm:text-lg"
                >
                  Send Message & Connect via WhatsApp
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6 sm:space-y-8 order-1 lg:order-2">
            {/* Contact Methods */}
            <div className="space-y-4">
              {contactMethods.map((method, index) => (
                <Card 
                  key={index} 
                  className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  onClick={method.action}
                >
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 ${method.bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shrink-0`}>
                        <method.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors text-sm sm:text-base">
                          {method.title}
                        </h4>
                        <p className="text-xs sm:text-sm text-gray-500 truncate sm:whitespace-normal">{method.subtitle}</p>
                        <p className="text-blue-600 font-medium text-sm sm:text-base truncate sm:whitespace-normal">{method.value}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Business Hours */}
            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <h4 className="text-base sm:text-lg font-semibold text-gray-900">Business Hours</h4>
                </div>
                <div className="space-y-2">
                  {businessHours.map((schedule, index) => (
                    <div key={index} className="flex justify-between text-xs sm:text-sm">
                      <span className="text-gray-500">{schedule.day}</span>
                      <span className="text-gray-900 font-medium">{schedule.hours}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Trust Indicators */}
            <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
              <CardContent className="p-4 sm:p-6 text-center">
                <div className="flex items-center justify-center space-x-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Trusted by 1000+ Clients</h4>
                <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                  RC: 1739523 | Licensed & Regulated Real Estate Company
                </p>
                <div className="flex flex-col sm:flex-row justify-center sm:space-x-4 space-y-1 sm:space-y-0 text-xs text-gray-500">
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