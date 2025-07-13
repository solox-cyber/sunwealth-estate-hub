import { useState } from "react";
import { Search, MapPin, Home, Phone, MessageCircle } from "lucide-react";

const Hero = () => {
  const [searchData, setSearchData] = useState({
    location: "",
    propertyType: "",
    priceRange: ""
  });

  return (
   <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 sm:pt-24 lg:pt-28">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <div className="w-full h-full bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900" />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-6xl mx-auto">
          {/* Hero Text */}
          <div className="mb-8 sm:mb-12 animate-fade-in">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight">
              Discover Your
              <span className="text-transparent bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text block mt-2">
                Dream Property
              </span>
              in Lagos
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed px-4">
              Premium real estate in Ikoyi, Victoria Island, and Lekki. 
              Your trusted partner for luxury properties in Nigeria's business capital.
            </p>
          </div>

          {/* Property Search Card */}
          <div className="bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl animate-slide-up mx-4 sm:mx-0">
            <div className="flex items-center justify-center mb-4 sm:mb-6">
              <div className="flex items-center space-x-2 text-blue-600">
                <Search className="w-5 h-5 sm:w-6 sm:h-6" />
                <h3 className="text-lg sm:text-xl font-semibold">Find Your Perfect Property</h3>
              </div>
            </div>

            {/* Mobile-First Grid Layout */}
            <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-4 mb-6">
              {/* Location */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600 flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  Location
                </label>
                <select 
                  className="w-full h-12 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onChange={(e) => setSearchData({...searchData, location: e.target.value})}
                >
                  <option value="">Select area</option>
                  <option value="ikoyi">Ikoyi</option>
                  <option value="victoria-island">Victoria Island</option>
                  <option value="lekki">Lekki</option>
                  <option value="lagos-island">Lagos Island</option>
                  <option value="surulere">Surulere</option>
                  <option value="ikeja">Ikeja</option>
                </select>
              </div>

              {/* Property Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600 flex items-center">
                  <Home className="w-4 h-4 mr-1" />
                  Property Type
                </label>
                <select 
                  className="w-full h-12 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onChange={(e) => setSearchData({...searchData, propertyType: e.target.value})}
                >
                  <option value="">Property type</option>
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="duplex">Duplex</option>
                  <option value="penthouse">Penthouse</option>
                  <option value="land">Land</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>

              {/* Price Range */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">
                  Price Range (₦)
                </label>
                <select 
                  className="w-full h-12 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onChange={(e) => setSearchData({...searchData, priceRange: e.target.value})}
                >
                  <option value="">Budget</option>
                  <option value="0-50m">₦0 - ₦50M</option>
                  <option value="50m-100m">₦50M - ₦100M</option>
                  <option value="100m-200m">₦100M - ₦200M</option>
                  <option value="200m-500m">₦200M - ₦500M</option>
                  <option value="500m+">₦500M+</option>
                </select>
              </div>

              {/* Search Button */}
              <div className="sm:flex sm:items-end">
                <button className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center">
                  <Search className="w-5 h-5 mr-2" />
                  Search Properties
                </button>
              </div>
            </div>

            {/* Quick Stats - Mobile Responsive */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-4 sm:pt-6 border-t">
              <div className="text-center p-2">
                <p className="text-xl sm:text-2xl font-bold text-blue-600">500+</p>
                <p className="text-xs sm:text-sm text-gray-600">Properties Sold</p>
              </div>
              <div className="text-center p-2">
                <p className="text-xl sm:text-2xl font-bold text-blue-600">1000+</p>
                <p className="text-xs sm:text-sm text-gray-600">Happy Clients</p>
              </div>
              <div className="text-center p-2">
                <p className="text-xl sm:text-2xl font-bold text-blue-600">15+</p>
                <p className="text-xs sm:text-sm text-gray-600">Years Experience</p>
              </div>
              <div className="text-center p-2">
                <p className="text-xl sm:text-2xl font-bold text-blue-600">₦50B+</p>
                <p className="text-xs sm:text-sm text-gray-600">Properties Managed</p>
              </div>
            </div>
          </div>

          {/* Mobile-Optimized Floating Action Buttons */}
          <div className="fixed bottom-4 right-4 z-50 flex flex-col space-y-3">
            <button
              className="w-12 h-12 sm:w-14 sm:h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg transition-all duration-200 flex items-center justify-center"
              onClick={() => window.open("https://wa.me/2347055144347")}
              aria-label="WhatsApp"
            >
              <MessageCircle className="w-6 h-6" />
            </button>
            <button
              className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg transition-all duration-200 flex items-center justify-center"
              onClick={() => window.open("tel:+2347055144347")}
              aria-label="Call Now"
            >
              <Phone className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.8s ease-out 0.3s both;
        }

        @media (max-width: 640px) {
          .container {
            padding-left: 1rem;
            padding-right: 1rem;
          }
        }
      `}</style>
    </section>
  );
};

export default Hero;