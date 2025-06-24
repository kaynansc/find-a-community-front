
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { 
  MapPin, 
  Users, 
  Calendar, 
  Clock,
  ArrowLeft,
  Heart,
  Share2
} from 'lucide-react';

const CommunityDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();

  // Mock data - in real app, would fetch based on id
  const community = {
    id: 1,
    name: 'Vancouver Brazilian Community',
    category: 'Cultural',
    members: 234,
    location: 'Downtown Vancouver',
    address: '123 Main St, Vancouver, BC V6B 1A1',
    description: 'Welcome to the Vancouver Brazilian Community! We are a vibrant group of Brazilians and Brazilian culture enthusiasts living in the beautiful city of Vancouver. Our community organizes weekly gatherings, cultural events, and provides a strong support network for newcomers and long-time residents alike.',
    longDescription: 'Founded in 2018, our community has grown to over 200 active members who participate in various activities throughout the year. We host weekly Portuguese conversation circles, monthly cultural celebrations, and quarterly community service projects. Whether you\'re homesick for Brazilian culture, want to practice Portuguese, or simply enjoy the warmth of Brazilian hospitality, you\'ll find a home here.',
    organizer: 'Maria Silva',
    contactEmail: 'maria@vancouverbrazilian.com',
    image: 'https://images.unsplash.com/photo-1523712999610-f77fbcfc3843',
    isJoined: false
  };

  const upcomingEvents = [
    {
      id: 1,
      title: 'Sunday Service & Fellowship',
      date: '2024-03-03',
      time: '10:00 AM',
      location: 'Community Center Downtown',
      description: 'Join us for our weekly Sunday service followed by coffee and fellowship.'
    },
    {
      id: 2,
      title: 'Brazilian Cooking Class',
      date: '2024-03-10',
      time: '2:00 PM',
      location: 'Community Kitchen',
      description: 'Learn to make traditional feijoada with our experienced cooks.'
    },
    {
      id: 3,
      title: 'Portuguese Language Circle',
      date: '2024-03-12',
      time: '7:00 PM',
      location: 'Library Meeting Room',
      description: 'Practice Portuguese conversation in a friendly, supportive environment.'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Button variant="ghost" asChild className="mb-6">
        <Link to="/communities" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Communities
        </Link>
      </Button>

      {/* Hero Section */}
      <div className="grid lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2">
          <div className="relative h-64 md:h-80 rounded-lg overflow-hidden mb-6">
            <img 
              src={community.image} 
              alt={community.name}
              className="w-full h-full object-cover"
            />
            <Badge className="absolute top-4 left-4">
              {community.category}
            </Badge>
          </div>

          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{community.name}</h1>
              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {community.members} members
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {community.location}
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <Heart className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <p className="text-lg mb-6">{community.description}</p>
          <p className="text-muted-foreground">{community.longDescription}</p>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Join Community</CardTitle>
            </CardHeader>
            <CardContent>
              {user ? (
                <Button className="w-full" size="lg">
                  {community.isJoined ? 'Leave Community' : 'Join Community'}
                </Button>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Sign in to join this community
                  </p>
                  <Button asChild className="w-full">
                    <Link to="/login">Sign In</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Community Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-1">Organizer</h4>
                <p className="text-sm text-muted-foreground">{community.organizer}</p>
              </div>
              <Separator />
              <div>
                <h4 className="font-medium mb-1">Location</h4>
                <p className="text-sm text-muted-foreground">{community.address}</p>
              </div>
              <Separator />
              <div>
                <h4 className="font-medium mb-1">Contact</h4>
                <p className="text-sm text-muted-foreground">{community.contactEmail}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Upcoming Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Upcoming Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="flex items-start gap-4 p-4 border rounded-lg">
                <div className="text-center min-w-[60px]">
                  <div className="text-sm font-medium text-primary">
                    {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                  </div>
                  <div className="text-2xl font-bold">
                    {new Date(event.date).getDate()}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{event.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {event.time}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {event.location}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{event.description}</p>
                </div>
                <Button variant="outline" size="sm">
                  RSVP
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommunityDetail;
