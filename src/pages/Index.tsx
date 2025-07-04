import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeaturedProperties from "@/components/FeaturedProperties";
import About from "@/components/About";
import Contact from "@/components/Contact";
import InstagramFeed from "@/components/InstagramFeed";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <FeaturedProperties />
      <About />
      <InstagramFeed />
      <Contact />
      
      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                  <span className="text-secondary-foreground font-bold text-lg">S</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold">Sunwealth Ltd</h3>
                  <p className="text-sm opacity-80">No.1 Trusted Realtor</p>
                </div>
              </div>
              <p className="text-sm opacity-80">
                Premier real estate services in Lagos. RC: 1739523
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li><a href="#home" className="hover:opacity-100">Home</a></li>
                <li><a href="#properties" className="hover:opacity-100">Properties</a></li>
                <li><a href="#about" className="hover:opacity-100">About</a></li>
                <li><a href="#contact" className="hover:opacity-100">Contact</a></li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li>Property Management</li>
                <li>Buy & Sell</li>
                <li>Lease & Rent</li>
                <li>Land Sales</li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li>+234 903 837 9755</li>
                <li>Victoria Island, Lagos</li>
                <li>@sunwealth_rent.ng</li>
                <li>@sunwealth_landandacres</li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm opacity-80">
            <p>&copy; 2024 Sunwealth Ltd. All rights reserved. RC: 1739523</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
