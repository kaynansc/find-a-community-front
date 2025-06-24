
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, MapPin, Users, Calendar, Filter } from 'lucide-react';

const Communities = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const communities = [
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
    },
    {
      id: 4,
      name: 'Language Exchange Group',
      category: 'Learning',
      members: 145,
      location: 'West Vancouver',
      description: 'Practice languages with native speakers. English, Spanish, French, and more.',
      nextEvent: 'Coffee Chat - March 6th',
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173'
    }
  ];

  const categories = ['all', 'Cultural', 'Professional', 'Sports & Outdoor', 'Learning', 'Social'];

  const filteredCommunities = communities.filter(community => {
    const matchesSearch = community.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         community.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || community.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Explore Communities</h1>
        <p className="text-muted-foreground mb-6">
          Find and join ongoing communities that match your interests.
        </p>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search communities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Communities Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCommunities.map((community) => (
          <Card key={community.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-48 overflow-hidden">
              <img 
                src={community.image} 
                alt={community.name}
                className="w-full h-full object-cover"
              />
              <Badge className="absolute top-3 left-3">
                {community.category}
              </Badge>
            </div>
            <CardHeader>
              <CardTitle className="text-lg">{community.name}</CardTitle>
            </CardHeader>
            <CardContent>
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
                  View Details
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCommunities.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No communities found matching your criteria.</p>
          <Button variant="outline" className="mt-4" onClick={() => {
            setSearchTerm('');
            setSelectedCategory('all');
          }}>
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default Communities;
