
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { 
  MapPin, 
  Users, 
  Calendar, 
  Search,
  Heart,
  Globe,
  Coffee,
  BookOpen
} from 'lucide-react';

const Index = () => {
  const { user } = useAuth();

  const featuredCommunities = [
    {
      id: 1,
      name: 'Vancouver Brazilian Community',
      category: 'Cultural',
      members: 234,
      location: 'Downtown Vancouver',
      description: 'Connect with fellow Brazilians in Vancouver. Weekly gatherings, cultural events, and support network.',
      nextEvent: 'Sunday Service - March 3rd',
      image: 'https://images.unsplash.com/photo-1523712999610-f77fbcfc3843'
    },
    {
      id: 2,
      name: 'Tech Professionals Meetup',
      category: 'Professional',
      members: 567,
      location: 'South Vancouver',
      description: 'Weekly networking events for tech professionals. Share knowledge and build connections.',
      nextEvent: 'Networking Night - March 5th',
      image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6'
    },
    {
      id: 3,
      name: 'Hiking Enthusiasts',
      category: 'Sports & Outdoor',
      members: 189,
      location: 'North Vancouver',
      description: 'Explore beautiful BC trails together. All skill levels welcome for weekend adventures.',
      nextEvent: 'Grouse Grind - March 8th',
      image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05'
    }
  ];

  const categories = [
    { name: 'Sports & Fitness', icon: Heart, count: 45 },
    { name: 'Cultural', icon: Globe, count: 32 },
    { name: 'Social', icon: Coffee, count: 67 },
    { name: 'Professional', icon: Users, count: 28 },
    { name: 'Learning', icon: BookOpen, count: 41 }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Find Your Community in Vancouver
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
            Connect with ongoing local communities, not just one-time events. 
            Join groups that meet regularly and build lasting friendships.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" asChild className="text-lg px-8 py-6">
              <Link to="/communities">
                <Search className="mr-2 h-5 w-5" />
                Explore Communities
              </Link>
            </Button>
            {!user && (
              <Button variant="outline" size="lg" asChild className="text-lg px-8 py-6">
                <Link to="/login">
                  <Users className="mr-2 h-5 w-5" />
                  Join Now
                </Link>
              </Button>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">150+</div>
              <div className="text-sm text-muted-foreground">Communities</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">2.5k+</div>
              <div className="text-sm text-muted-foreground">Members</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">50+</div>
              <div className="text-sm text-muted-foreground">Events/Week</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">Browse by Interest</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {categories.map((category) => (
              <Card key={category.name} className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardContent className="p-6 text-center">
                  <category.icon className="h-8 w-8 mx-auto mb-3 text-primary group-hover:scale-110 transition-transform" />
                  <h3 className="font-semibold mb-1">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">{category.count} communities</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Communities */}
      <section className="py-16 px-4 bg-secondary/20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Communities</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Popular groups that newcomers love. These communities have active members and regular meetups.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {featuredCommunities.map((community) => (
              <Card key={community.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={community.image} 
                    alt={community.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge className="absolute top-3 left-3">
                    {community.category}
                  </Badge>
                </div>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-2">{community.name}</h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {community.description}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {community.members}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {community.location}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-4 p-2 bg-primary/10 rounded">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Next: {community.nextEvent}</span>
                  </div>
                  
                  <Button asChild className="w-full">
                    <Link to={`/community/${community.id}`}>
                      View Community
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">1. Search & Discover</h3>
              <p className="text-muted-foreground">
                Find communities by interests, location, or keywords. Filter by what matters to you.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">2. Join Communities</h3>
              <p className="text-muted-foreground">
                Connect with like-minded people in your area. Join groups that meet regularly.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">3. Attend & Connect</h3>
              <p className="text-muted-foreground">
                Track your communities and never miss an event. Build lasting friendships.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your Tribe?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of people who've found their community in Vancouver.
          </p>
          <Button size="lg" variant="secondary" asChild className="text-lg px-8 py-6">
            <Link to="/communities">
              Start Exploring Communities
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
