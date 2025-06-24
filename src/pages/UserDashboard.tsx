
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
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

interface Community {
  id: string;
  name: string;
  category: {
    id: string;
    name: string;
  };
  nextEvent: {
    title: string;
    date: string;
  };
}

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  latitude: number;
  longitude: number;
  communityId: string;
  participants: Array<{
    id: string;
  }>;
}

interface DashboardData {
  data: Community[];
  upcomingEvents: Event[][];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    limit: number;
  };
}

const UserDashboard = () => {
  const { user, token } = useAuth();

  const fetchDashboardData = async (): Promise<DashboardData> => {
    const response = await fetch('http://localhost:3000/api/communities/me?page=1&limit=10', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch dashboard data');
    }

    return response.json();
  };

  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ['userDashboard'],
    queryFn: fetchDashboardData,
    enabled: !!token && !!user,
  });

  const joinedCommunities = dashboardData?.data || [];
  const upcomingEvents = dashboardData?.upcomingEvents?.flat() || [];

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
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Loading your communities...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-500">Error loading communities. Please try again.</p>
              </div>
            ) : joinedCommunities.length > 0 ? (
              <div className="space-y-4">
                {joinedCommunities.map((community) => (
                  <div key={community.id} className="flex items-center gap-4 p-3 border rounded-lg">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{community.name}</h3>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {community.category.name}
                        </Badge>
                        {community.nextEvent && (
                          <span className="text-sm text-muted-foreground">
                            Next: {community.nextEvent.title}
                          </span>
                        )}
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
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Loading events...</p>
              </div>
            ) : upcomingEvents.length > 0 ? (
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold">{event.title}</h3>
                      <Badge variant={event.participants.length > 0 ? 'default' : 'secondary'}>
                        {event.participants.length > 0 ? 'attending' : 'not attending'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {event.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(event.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(event.date).toLocaleTimeString('en-US', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {event.location}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  No upcoming events scheduled.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserDashboard;
