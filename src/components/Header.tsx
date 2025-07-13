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
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2 min-w-0 flex-shrink-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-secondary rounded-lg flex items-center justify-center">
              <span className="text-secondary-foreground font-bold text-sm sm:text-lg">S</span>
            </div>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl font-bold text-foreground truncate">Sunwealth Ltd</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">No.1 Trusted Realtor</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-foreground hover:text-primary transition-colors duration-300 font-medium whitespace-nowrap"
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* Contact & Auth Buttons */}
          <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3">
            <Button 
              variant="outline" 
              size="sm" 
              className="hidden md:flex items-center space-x-2 text-xs lg:text-sm"
              onClick={() => window.open("tel:+2347055144347")}
            >
              <Phone className="w-3 h-3 lg:w-4 lg:h-4" />
              <span className="hidden lg:inline">Call Now</span>
            </Button>
            <Button 
              variant="default" 
              size="sm"
              className="bg-accent hover:bg-accent-glow transition-colors px-2 sm:px-3 text-xs sm:text-sm"
              onClick={() => window.open("https://wa.me/2347055144347")}
            >
              <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
              <span className="hidden sm:inline">WhatsApp</span>
            </Button>
            
            {user ? (
              <Button size="sm" asChild className="text-xs sm:text-sm px-2 sm:px-3">
                <Link to={isAdmin ? "/admin" : "/dashboard"} className="flex items-center space-x-1 sm:space-x-2">
                  <User className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">{isAdmin ? "Admin" : "Dashboard"}</span>
                </Link>
              </Button>
            ) : (
              <Button size="sm" asChild className="text-xs sm:text-sm px-2 sm:px-3">
                <Link to="/auth">
                  <span className="hidden sm:inline">Sign In</span>
                  <span className="sm:hidden">Sign</span>
                </Link>
              </Button>
            )}

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 ml-1 sm:ml-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <div className="w-5 h-5 sm:w-6 sm:h-6 flex flex-col justify-center items-center">
                <span className={`block w-4 h-0.5 sm:w-5 sm:h-0.5 bg-foreground transition-transform duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
                <span className={`block w-4 h-0.5 sm:w-5 sm:h-0.5 bg-foreground mt-1 transition-opacity duration-300 ${isMenuOpen ? 'opacity-0' : ''}`} />
                <span className={`block w-4 h-0.5 sm:w-5 sm:h-0.5 bg-foreground mt-1 transition-transform duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="lg:hidden mt-4 pb-4 border-t">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="block py-3 px-2 text-foreground hover:text-primary transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </a>
            ))}
            
            {/* Mobile-only call button */}
            <div className="pt-4 border-t mt-4 md:hidden">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full flex items-center justify-center space-x-2"
                onClick={() => {
                  window.open("tel:+2347055144347");
                  setIsMenuOpen(false);
                }}
              >
                <Phone className="w-4 h-4" />
                <span>Call Now</span>
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;