
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Plus, 
  Users, 
  Calendar, 
  Settings,
  BarChart3,
  MapPin,
  Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { CreateCommunityForm } from '@/components/CreateCommunityForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface OrganizerCommunity {
  id: string;
  name: string;
  memberCount: number;
  pendingEventCount: number;
}

interface OrganizerCommunitiesResponse {
  data: OrganizerCommunity[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

const OrganizerDashboard = () => {
  const { user, token } = useAuth();
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [communities, setCommunities] = useState<OrganizerCommunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch organizer communities
  const fetchOrganizerCommunities = async () => {
    if (!token) return;
    
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:3000/api/platform/organizer/communities', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch communities');
      }

      const data: OrganizerCommunitiesResponse = await response.json();
      setCommunities(data.data);
    } catch (error) {
      console.error('Error fetching organizer communities:', error);
      toast({
        title: "Error",
        description: "Failed to fetch your communities.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizerCommunities();
  }, [token]);

  const upcomingEvents = [
    {
      id: 1,
      title: 'Sunday Service & Fellowship',
      community: 'Vancouver Brazilian Community',
      date: '2024-03-03',
      time: '10:00 AM',
      location: 'Community Center Downtown',
      rsvps: 45,
      capacity: 80
    },
    {
      id: 2,
      title: 'Portuguese Conversation Practice',
      community: 'Portuguese Language Circle',
      date: '2024-03-05',
      time: '7:00 PM',
      location: 'Library Meeting Room',
      rsvps: 12,
      capacity: 20
    }
  ];

  const stats = {
    totalCommunities: communities.length,
    totalMembers: communities.reduce((sum, community) => sum + community.memberCount, 0),
    totalEvents: communities.reduce((sum, community) => sum + community.pendingEventCount, 0),
    avgAttendance: 85
  };

  if (!user?.isOrganizer && !user?.isAdmin) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Organizer Access Required</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              You need organizer privileges to access this dashboard.
            </p>
            <Button asChild className="w-full">
              <Link to="/dashboard">Go to User Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleCreateSuccess = () => {
    setIsCreateDialogOpen(false);
    fetchOrganizerCommunities(); // Refresh the communities list
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Organizer Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your communities and events.
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Community
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div className="ml-2">
                <p className="text-sm font-medium leading-none">Communities</p>
                <p className="text-2xl font-bold">{stats.totalCommunities}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div className="ml-2">
                <p className="text-sm font-medium leading-none">Total Members</p>
                <p className="text-2xl font-bold">{stats.totalMembers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div className="ml-2">
                <p className="text-sm font-medium leading-none">Pending Events</p>
                <p className="text-2xl font-bold">{stats.totalEvents}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
              <div className="ml-2">
                <p className="text-sm font-medium leading-none">Avg Attendance</p>
                <p className="text-2xl font-bold">{stats.avgAttendance}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="communities" className="space-y-6">
        <TabsList>
          <TabsTrigger value="communities">My Communities</TabsTrigger>
          <TabsTrigger value="events">Upcoming Events</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="communities" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">My Communities</h2>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create New
            </Button>
          </div>
          
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading your communities...</p>
            </div>
          ) : communities.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">You haven't created any communities yet.</p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Community
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {communities.map((community) => (
                <Card key={community.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{community.name}</CardTitle>
                      <Badge>active</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Members:</span>
                        <span>{community.memberCount}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Pending Events:</span>
                        <span>{community.pendingEventCount}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Settings className="h-3 w-3 mr-1" />
                        Manage
                      </Button>
                      <Button size="sm" className="flex-1" asChild>
                        <Link to={`/community/${community.id}`}>View</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="events" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Upcoming Events</h2>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Event
            </Button>
          </div>

          <div className="space-y-4">
            {upcomingEvents.map((event) => (
              <Card key={event.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{event.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{event.community}</p>
                      
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
                    
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">RSVPs</div>
                      <div className="text-2xl font-bold">
                        {event.rsvps}/{event.capacity}
                      </div>
                      <div className="flex gap-2 mt-2">
                        <Button variant="outline" size="sm">
                          <Settings className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button size="sm">View</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <h2 className="text-2xl font-bold">Analytics</h2>
          <Card>
            <CardHeader>
              <CardTitle>Coming Soon</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Analytics dashboard with community growth, event attendance, and engagement metrics will be available soon.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Community Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Community</DialogTitle>
          </DialogHeader>
          <CreateCommunityForm
            onSuccess={handleCreateSuccess}
            onCancel={() => setIsCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrganizerDashboard;
