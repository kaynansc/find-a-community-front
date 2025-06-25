import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  MapPin, 
  Users, 
  Calendar, 
  Clock,
  ArrowLeft,
  Heart,
  Share2
} from 'lucide-react';

interface Community {
  id: string;
  name: string;
  description: string;
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
  organizer: {
    id: string;
    name: string;
  };
  events: Array<{
    id: string;
    title: string;
    date: string;
  }>;
  _count: {
    memberships: number;
  };
  memberships?: Array<{
    id: string;
  }>;
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
  _count: {
    participants: number;
  };
  participants?: Array<{
    id: string;
  }>;
}

interface EventsResponse {
  data: Event[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

const CommunityDetail = () => {
  const { id } = useParams();
  const { user, token } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const fetchCommunity = async (): Promise<Community> => {
    const response = await fetch(`http://localhost:3000/api/communities/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch community');
    }

    return response.json();
  };

  const fetchEvents = async (): Promise<EventsResponse> => {
    const response = await fetch(`http://localhost:3000/api/communities/${id}/events`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch events');
    }

    return response.json();
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

  const { data: community, isLoading: communityLoading, error: communityError } = useQuery({
    queryKey: ['community', id],
    queryFn: fetchCommunity,
    enabled: !!token && !!id,
  });

  const { data: eventsResponse, isLoading: eventsLoading } = useQuery({
    queryKey: ['communityEvents', id],
    queryFn: fetchEvents,
    enabled: !!token && !!id,
  });

  // Check if user is already a member based on memberships array
  const isJoined = community?.memberships && community.memberships.length > 0;

  const joinCommunityMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`http://localhost:3000/api/communities/${id}/join`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok && response.status !== 204) {
        throw new Error('Failed to join community');
      }

      return response.status === 204 ? null : response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community', id] });
      toast({
        title: "Joined successfully!",
        description: "Welcome to the community!",
      });
    },
    onError: () => {
      toast({
        title: "Failed to join",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const leaveCommunityMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`http://localhost:3000/api/communities/${id}/leave`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok && response.status !== 204) {
        throw new Error('Failed to leave community');
      }

      return response.status === 204 ? null : response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community', id] });
      toast({
        title: "Left community",
        description: "You've successfully left the community.",
      });
    },
    onError: () => {
      toast({
        title: "Failed to leave",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const attendEventMutation = useMutation({
    mutationFn: async (eventId: string) => {
      const response = await fetch(`http://localhost:3000/api/events/${eventId}/attendance`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok && response.status !== 204) {
        throw new Error('Failed to attend event');
      }

      return response.status === 204 ? null : response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communityEvents', id] });
      toast({
        title: "RSVP confirmed!",
        description: "You're attending this event.",
      });
    },
    onError: () => {
      toast({
        title: "Failed to RSVP",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const cancelAttendanceMutation = useMutation({
    mutationFn: async (eventId: string) => {
      const response = await fetch(`http://localhost:3000/api/events/${eventId}/attendance`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok && response.status !== 204) {
        throw new Error('Failed to cancel attendance');
      }

      return response.status === 204 ? null : response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communityEvents', id] });
      toast({
        title: "RSVP cancelled",
        description: "Your attendance has been cancelled.",
      });
    },
    onError: () => {
      toast({
        title: "Failed to cancel",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleJoinLeave = () => {
    if (isJoined) {
      leaveCommunityMutation.mutate();
    } else {
      joinCommunityMutation.mutate();
    }
  };

  const handleEventRSVP = (eventId: string, isAttending: boolean) => {
    if (isAttending) {
      cancelAttendanceMutation.mutate(eventId);
    } else {
      attendEventMutation.mutate(eventId);
    }
  };

  if (!token) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">Please sign in to view community details.</p>
          <Button asChild>
            <Link to="/login">Sign In</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (communityLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading community details...</p>
        </div>
      </div>
    );
  }

  if (communityError || !community) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-red-500">Error loading community details. Please try again.</p>
        </div>
      </div>
    );
  }

  const events = eventsResponse?.data || [];

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
          <div className="relative h-64 md:h-80 rounded-lg overflow-hidden mb-6 bg-gradient-to-br from-primary/20 to-primary/5">
            <Badge className="absolute top-4 left-4">
              {community.category.name}
            </Badge>
          </div>

          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{community.name}</h1>
              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {community._count.memberships} members
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
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Join Community</CardTitle>
            </CardHeader>
            <CardContent>
              {user ? (
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={handleJoinLeave}
                  disabled={joinCommunityMutation.isPending || leaveCommunityMutation.isPending}
                >
                  {joinCommunityMutation.isPending || leaveCommunityMutation.isPending 
                    ? 'Processing...' 
                    : isJoined ? 'Leave Community' : 'Join Community'
                  }
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
                <p className="text-sm text-muted-foreground">{community.organizer.name}</p>
              </div>
              <Separator />
              <div>
                <h4 className="font-medium mb-1">Location</h4>
                <p className="text-sm text-muted-foreground">{community.location}</p>
              </div>
              <Separator />
              <div>
                <h4 className="font-medium mb-1">Created</h4>
                <p className="text-sm text-muted-foreground">
                  {new Date(community.createdAt).toLocaleDateString()}
                </p>
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
          {eventsLoading ? (
            <p className="text-muted-foreground">Loading events...</p>
          ) : events.length > 0 ? (
            <div className="space-y-4">
              {events.map((event) => {
                // Check if user is already attending this event
                const isAttending = event.participants && event.participants.length > 0;
                
                return (
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
                          {new Date(event.date).toLocaleTimeString('en-US', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                        <button
                          onClick={() => handleLocationClick(event.location, event.latitude, event.longitude)}
                          className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer"
                          title="View on Google Maps"
                        >
                          <MapPin className="h-3 w-3" />
                          {event.location}
                        </button>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {event._count.participants} attending
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                    </div>
                    <Button 
                      variant={isAttending ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleEventRSVP(event.id, isAttending)}
                      disabled={attendEventMutation.isPending || cancelAttendanceMutation.isPending}
                    >
                      {attendEventMutation.isPending || cancelAttendanceMutation.isPending 
                        ? 'Processing...' 
                        : isAttending ? 'Cancel RSVP' : 'RSVP'
                      }
                    </Button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No upcoming events scheduled.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CommunityDetail;
