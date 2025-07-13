import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Instagram, ExternalLink } from 'lucide-react';

interface InstagramPost {
  id: string;
  caption: string;
  media_url: string;
  media_type: string;
  timestamp: string;
  permalink: string;
}

const InstagramFeed = () => {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock Instagram posts for demo purposes
  // In production, you would integrate with Instagram Basic Display API
  useEffect(() => {
    const mockPosts: InstagramPost[] = [
      {
        id: '1',
        caption: 'Beautiful 3-bedroom apartment in Victoria Island! 🏠✨ Contact us for viewing. #SunwealthRentNG #LagosProperty',
        media_url: '/placeholder.svg',
        media_type: 'IMAGE',
        timestamp: '2024-01-15T10:30:00Z',
        permalink: 'https://instagram.com/p/example1'
      },
      {
        id: '2',
        caption: 'Prime land for sale in Lekki! Perfect for your dream home 🌟 #SunwealthLandandAcres #RealEstate',
        media_url: '/placeholder.svg',
        media_type: 'IMAGE',
        timestamp: '2024-01-14T08:15:00Z',
        permalink: 'https://instagram.com/p/example2'
      },
      {
        id: '3',
        caption: 'Luxury penthouse with amazing city views! Book a tour today 🏙️ #LuxuryLiving #LagosRealEstate',
        media_url: '/placeholder.svg',
        media_type: 'IMAGE',
        timestamp: '2024-01-13T16:45:00Z',
        permalink: 'https://instagram.com/p/example3'
      },
      {
        id: '4',
        caption: 'Just sold! Another happy family in their new home 🎉 #SoldProperty #HappyClients',
        media_url: '/placeholder.svg',
        media_type: 'IMAGE',
        timestamp: '2024-01-12T12:20:00Z',
        permalink: 'https://instagram.com/p/example4'
      }
    ];

    // Simulate API call delay
    setTimeout(() => {
      setPosts(mockPosts);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <section className="py-12 md:py-20 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-12">
            <div className="flex items-center justify-center mb-4">
              <Instagram className="h-6 w-6 sm:h-8 sm:w-8 text-accent mr-2 sm:mr-3" />
              <h2 className="text-2xl sm:text-3xl font-bold">Follow Us on Instagram</h2>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base px-4">
              Stay updated with our latest properties and success stories
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="aspect-square bg-muted animate-pulse" />
                <CardContent className="p-3 md:p-4">
                  <div className="h-4 bg-muted rounded animate-pulse mb-2" />
                  <div className="h-3 bg-muted rounded animate-pulse w-3/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-20 bg-muted/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-12">
          <div className="flex items-center justify-center mb-4">
            <Instagram className="h-6 w-6 sm:h-8 sm:w-8 text-accent mr-2 sm:mr-3" />
            <h2 className="text-2xl sm:text-3xl font-bold">Follow Us on Instagram</h2>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base px-4">
            Stay updated with our latest properties and success stories
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          {posts.map((post) => (
            <Card key={post.id} className="overflow-hidden hover:shadow-card transition-shadow group">
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={post.media_url}
                  alt="Instagram post"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <button
                  onClick={() => window.open(post.permalink, '_blank')}
                  className="absolute top-2 right-2 md:top-4 md:right-4 bg-white/20 backdrop-blur-sm rounded-full p-1.5 md:p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white/30"
                >
                  <ExternalLink className="h-3 w-3 md:h-4 md:w-4 text-white" />
                </button>
              </div>
              <CardContent className="p-3 md:p-4">
                <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                  {post.caption}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {new Date(post.timestamp).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6">
            <button
              onClick={() => window.open('https://instagram.com/', '_blank')}
              className="flex items-center justify-center space-x-2 bg-gradient-secondary text-secondary-foreground px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:shadow-glow transition-all duration-300 w-full sm:w-auto text-sm sm:text-base"
            >
              <Instagram className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>@sunwealth_rent.ng</span>
            </button>
            <button
              onClick={() => window.open('https://instagram.com/', '_blank')}
              className="flex items-center justify-center space-x-2 bg-gradient-secondary text-secondary-foreground px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:shadow-glow transition-all duration-300 w-full sm:w-auto text-sm sm:text-base"
            >
              <Instagram className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>@sunwealth_landandacres</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InstagramFeed;