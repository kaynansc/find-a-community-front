
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Calendar, 
  Users, 
  MapPin, 
  Clock,
  Search,
  Plus
} from 'lucide-react';

const UserDashboard = () => {
  const { user } = useAuth();

  const joinedCommunities = [
    {
      id: 1,
      name: 'Vancouver Brazilian Community',
      category: 'Cultural',
      nextEvent: 'Sunday Service - March 3rd',
      image: 'https://images.unsplash.com/photo-1523712999610-f77fbcfc3843'
    },
    {
      id: 2,
      name: 'Tech Professionals Meetup',
      category: 'Professional',
      nextEvent: 'Networking Night - March 5th',
      image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6'
    }
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: 'Sunday Service & Fellowship',
      community: 'Vancouver Brazilian Community',
      date: '2024-03-03',
      time: '10:00 AM',
      location: 'Community Center Downtown',
      status: 'confirmed'
    },
    {
      id: 2,
      title: 'Networking Night',
      community: 'Tech Professionals Meetup',
      date: '2024-03-05',
      time: '6:00 PM',
      location: 'Tech Hub Vancouver',
      status: 'pending'
    },
    {
      id: 3,
      title: 'Grouse Grind Hike',
      community: 'Hiking Enthusiasts',
      date: '2024-03-08',
      time: '8:00 AM',
      location: 'Grouse Mountain',
      status: 'confirmed'
    }
  ];

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Please sign in to access your dashboard.
            </p>
            <Button asChild className="w-full">
              <Link to="/login">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}!</h1>
        <p className="text-muted-foreground">
          Stay connected with your communities and upcoming events.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <Button asChild className="h-auto p-6 justify-start">
          <Link to="/communities" className="flex items-center gap-3">
            <Search className="h-6 w-6" />
            <div className="text-left">
              <div className="font-semibold">Discover Communities</div>
              <div className="text-sm opacity-80">Find new groups to join</div>
            </div>
          </Link>
        </Button>
        <Button variant="outline" asChild className="h-auto p-6 justify-start">
          <Link to="/organizer" className="flex items-center gap-3">
            <Plus className="h-6 w-6" />
            <div className="text-left">
              <div className="font-semibold">Create Community</div>
              <div className="text-sm opacity-80">Start your own group</div>
            </div>
          </Link>
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* My Communities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              My Communities ({joinedCommunities.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {joinedCommunities.length > 0 ? (
              <div className="space-y-4">
                {joinedCommunities.map((community) => (
                  <div key={community.id} className="flex items-center gap-4 p-3 border rounded-lg">
                    <img 
                      src={community.image} 
                      alt={community.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{community.name}</h3>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {community.category}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          Next: {community.nextEvent}
                        </span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/community/${community.id}`}>View</Link>
                    </Button>
                  </div>
                ))}
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/communities">Find More Communities</Link>
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">
                  You haven't joined any communities yet.
                </p>
                <Button asChild>
                  <Link to="/communities">Explore Communities</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

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
                <div key={event.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold">{event.title}</h3>
                    <Badge variant={event.status === 'confirmed' ? 'default' : 'secondary'}>
                      {event.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {event.community}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(event.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {event.time}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {event.location}
                    </div>
                  </div>
                </div>
              ))}
              
              {upcomingEvents.length === 0 && (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    No upcoming events scheduled.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserDashboard;
