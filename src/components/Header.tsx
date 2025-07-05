import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Phone, MessageSquare, User } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAdmin } = useAuth();

  const navItems = [
    { name: "Home", href: "#home" },
    { name: "Properties", href: "#properties" },
    { name: "Services", href: "#services" },
    { name: "About", href: "#about" },
    { name: "Contact", href: "#contact" }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-secondary rounded-lg flex items-center justify-center">
              <span className="text-secondary-foreground font-bold text-lg">S</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Sunwealth Ltd</h1>
              <p className="text-xs text-muted-foreground">No.1 Trusted Realtor</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-foreground hover:text-primary transition-colors duration-300 font-medium"
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* Contact & Auth Buttons */}
          <div className="flex items-center space-x-3">
            <Button 
              variant="outline" 
              size="sm" 
              className="hidden sm:flex items-center space-x-2"
              onClick={() => window.open("tel:+2347055144347")}
            >
              <Phone className="w-4 h-4" />
              <span>Call Now</span>
            </Button>
            <Button 
              variant="default" 
              size="sm"
              className="bg-accent hover:bg-accent-glow transition-colors hidden sm:flex"
              onClick={() => window.open("https://wa.me/2347055144347")}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              WhatsApp
            </Button>
            
            {user ? (
              <Button size="sm" asChild>
                <Link to={isAdmin ? "/admin" : "/dashboard"} className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">{isAdmin ? "Admin" : "Dashboard"}</span>
                </Link>
              </Button>
            ) : (
              <Button size="sm" asChild>
                <Link to="/auth">Sign In</Link>
              </Button>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span className={`block w-5 h-0.5 bg-foreground transition-transform duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
                <span className={`block w-5 h-0.5 bg-foreground mt-1 transition-opacity duration-300 ${isMenuOpen ? 'opacity-0' : ''}`} />
                <span className={`block w-5 h-0.5 bg-foreground mt-1 transition-transform duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="block py-3 text-foreground hover:text-primary transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </a>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;