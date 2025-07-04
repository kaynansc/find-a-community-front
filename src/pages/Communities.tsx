import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { 
  Search, 
  MapPin, 
  Users, 
  Calendar, 
  Filter,
  Heart,
  Smile,
  Palette,
  Music,
  Film,
  BookOpen,
  Briefcase,
  Code,
  Cpu,
  Gamepad2,
  Pizza,
  Plane,
  Dumbbell,
  Mountain,
  TreePine,
  PawPrint,
  Handshake,
  GraduationCap,
  Church,
  Star,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useDebounce } from '@/hooks/use-debounce';

interface Community {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  categoryId: string;
  location: string;
  latitude: number;
  longitude: number;
  organizerId: string;
  createdAt: string;
  category: {
    id: string;
    name: string;
    description: string;
  };
  _count: {
    memberships: number;
  };
}

interface CommunitiesResponse {
  data: Community[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    limit: number;
  };
}

interface Category {
  id: string;
  name: string;
  description: string;
}

const Communities = () => {
  const categoryIcons: { [key: string]: React.ElementType } = {
    'Technology': Code,
    'Business': Briefcase,
    'Art & Culture': Palette,
    'Music': Music,
    'Movies & Film': Film,
    'Books & Writing': BookOpen,
    'Gaming': Gamepad2,
    'Food & Drink': Pizza,
    'Travel & Outdoors': Plane,
    'Health & Wellness': Dumbbell,
    'Sports & Fitness': Dumbbell,
    'Nature & Adventure': Mountain,
    'Science & Education': GraduationCap,
    'Social & Networking': Handshake,
    'Spirituality & Religion': Church,
    'Pets & Animals': PawPrint,
    'Hobbies & Crafts': Palette,
    'Default': Star, // A default icon
  };
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500); // 500ms delay
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [suggestedCategories, setSuggestedCategories] = useState<string[]>([]);
  const { token } = useAuth();

  // Set initial category from URL params
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  const fetchCommunities = async (): Promise<CommunitiesResponse> => {
    const params = new URLSearchParams({
      page: currentPage.toString(),
      limit: '12',
    });

    if (debouncedSearchTerm) {
      params.append('search', debouncedSearchTerm);
    }

    if (selectedCategory !== 'all') {
      params.append('category', selectedCategory);
    }

    const response = await fetch(`http://localhost:3000/api/communities?${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch communities');
    }

    return response.json();
  };

  const { data: communitiesResponse, isLoading, error } = useQuery({
    queryKey: ['communities', debouncedSearchTerm, selectedCategory, currentPage],
    queryFn: fetchCommunities,
    enabled: !!token,
  });

  const communities = communitiesResponse?.data || [];
  const pagination = communitiesResponse?.pagination;

  const fetchCategories = async (): Promise<Category[]> => {
    const response = await fetch('http://localhost:3000/api/categories');
    return response.json();
  };

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  // Fetch user profile to get interests
  const fetchUserProfile = async () => {
    if (!token) return null;
    
    const response = await fetch('http://localhost:3000/api/users/me', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }

    return response.json();
  };

  const { data: userProfile } = useQuery({
    queryKey: ['userProfile'],
    queryFn: fetchUserProfile,
    enabled: !!token,
  });

  // Set suggested categories based on user interests
  useEffect(() => {
    if (userProfile?.interests && categories) {
      const userInterestNames = userProfile.interests.map(interest => interest.name);
      const matchedCategoryIds = categories
        .filter(category => userInterestNames.includes(category.name))
        .map(category => category.id);
      
      setSuggestedCategories(matchedCategoryIds);
    }
  }, [userProfile, categories]);

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleLocationClick = (location: string, latitude?: number, longitude?: number) => {
    let mapsUrl;
    if (latitude && longitude) {
      // Use coordinates if available for more precise location
      mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
    } else {
      // Fallback to search by location name
      mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(location)}`;
    }
    window.open(mapsUrl, '_blank');
  };

  if (!token) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Join Amazing Communities</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Discover and connect with local communities that share your interests. 
            Create an account to start exploring!
          </p>
          <div className="space-y-3">
            <Button asChild size="lg">
              <Link to="/register">Create Account</Link>
            </Button>
            <div>
              <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link to="/login" className="text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading communities...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-red-500">Error loading communities. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Explore Communities</h1>
        <p className="text-muted-foreground mb-6">
          Find and join ongoing communities that match your interests.
        </p>

        {/* Suggested Categories */}
        {suggestedCategories.length > 0 && (
          <div className="mb-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
            <h3 className="text-sm font-medium mb-3 text-primary">Based on your interests</h3>
            <div className="flex flex-wrap gap-2">
              {suggestedCategories.map((categoryId) => {
                const category = categories?.find(cat => cat.id === categoryId);
                if (!category) return null;
                
                const Icon = categoryIcons[category.name] || categoryIcons['Default'];

                const isSelected = selectedCategory === categoryId;

                return (
                  <button
                    key={categoryId}
                    onClick={() => handleCategoryChange(categoryId)}
                    className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
                      isSelected
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{category.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search communities..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to first page when searching
              }}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-full md:w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories?.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Communities Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {communities.map((community) => (
          <Card key={community.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5">
              {community.imageUrl && (
                <img 
                  src={community.imageUrl} 
                  alt={community.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <Badge className="absolute top-3 left-3 z-10">
                {community.category.name}
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
                  {community._count.memberships}
                </div>
                <button
                  onClick={() => handleLocationClick(community.location, community.latitude, community.longitude)}
                  className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer"
                  title="View on Google Maps"
                >
                  <MapPin className="h-4 w-4" />
                  {community.location}
                </button>
              </div>
              
              <div className="flex items-center gap-2 mb-4 p-2 bg-primary/10 rounded">
                <Calendar className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">
                  Created: {new Date(community.createdAt).toLocaleDateString()}
                </span>
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

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <Pagination className="mb-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
            
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => handlePageChange(page)}
                  isActive={currentPage === page}
                  className="cursor-pointer"
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => handlePageChange(Math.min(pagination.totalPages, currentPage + 1))}
                className={currentPage === pagination.totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {communities.length === 0 && !isLoading && (
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
