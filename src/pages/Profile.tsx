import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  User, 
  Mail, 
  MapPin, 
  Heart, 
  Edit,
  Save,
  X,
  Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface ApiUser {
  id: string;
  name: string;
  email: string;
  bio?: string;
  interests: Array<{
    id: string;
    name: string;
  }>;
  role: string;
  createdAt: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
  _count: {
    communities: number;
    interests: number;
  };
}

const Profile = () => {
  const { user: authUser } = useAuth();
  const { toast } = useToast();
  const [user, setUser] = useState<ApiUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    interests: [] as string[] // This will store category IDs
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!authUser) return;
      
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await fetch('http://localhost:3000/api/users/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user profile');
        }

        const userData = await response.json();
        console.log('User data loaded:', userData);
        setUser(userData);
        
        // Initialize form data with user's current data, including selected interests
        const initialFormData = {
          name: userData.name || '',
          email: userData.email || '',
          bio: userData.bio || '',
          interests: userData.interests.map((interest: any) => interest.id) || []
        };
        console.log('Setting initial form data:', initialFormData);
        setFormData(initialFormData);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        toast({
          title: "Error loading profile",
          description: "Failed to load your profile data.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [authUser, toast]);

  const fetchCategories = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch('http://localhost:3000/api/categories', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }

      const categoriesData = await response.json();
      console.log('Categories loaded:', categoriesData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: "Error loading categories",
        description: "Failed to load available interests.",
        variant: "destructive",
      });
    }
  };

  const handleEditToggle = () => {
    if (!isEditing) {
      setIsEditing(true);
      fetchCategories();
    } else {
      setIsEditing(false);
      // Reset form data to current user data when canceling
      if (user) {
        setFormData({
          name: user.name || '',
          email: user.email || '',
          bio: user.bio || '',
          interests: user.interests.map(interest => interest.id) || []
        });
      }
    }
  };

  const handleSave = async () => {
    if (!user) return;
    
    setIsSaving(true);
    const token = localStorage.getItem('token');
    
    if (!token) {
      toast({
        title: "Error",
        description: "Authentication token not found. Please log in again.",
        variant: "destructive",
      });
      setIsSaving(false);
      return;
    }

    try {
      console.log('Saving profile with data:', {
        name: formData.name,
        bio: formData.bio,
        interests: formData.interests
      });

      const response = await fetch('http://localhost:3000/api/users/me', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          bio: formData.bio,
          interests: formData.interests
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedUserData = await response.json();
      console.log('Profile updated, response:', updatedUserData);
      
      // Update local state with the response data
      // Note: The API returns interests as empty array, so we need to reconstruct it
      const updatedUser = {
        ...updatedUserData,
        interests: formData.interests.map(categoryId => {
          const category = categories.find(cat => cat.id === categoryId);
          return { id: categoryId, name: category?.name || '' };
        })
      };
      
      setUser(updatedUser);
      setIsEditing(false);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error updating profile",
        description: "Failed to save your changes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || '',
        interests: user.interests.map(interest => interest.id) || []
      });
    }
    setIsEditing(false);
  };

  const toggleInterest = (categoryId: string) => {
    console.log('Toggling interest:', categoryId);
    setFormData(prev => {
      const newInterests = prev.interests.includes(categoryId)
        ? prev.interests.filter(id => id !== categoryId)
        : [...prev.interests, categoryId];
      console.log('New interests array:', newInterests);
      return {
        ...prev,
        interests: newInterests
      };
    });
  };

  if (!authUser) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Please sign in to view your profile.
            </p>
            <Button asChild className="w-full">
              <Link to="/login">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading profile...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Profile Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Unable to load your profile data.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-10 w-10 text-primary" />
              </div>
              <CardTitle>{user.name}</CardTitle>
              <p className="text-muted-foreground">{user.email}</p>
              {user.role === 'organizer' && (
                <Badge className="mt-2">Community Organizer</Badge>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>Vancouver, BC</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Heart className="h-4 w-4" />
                  <span>{user.interests.length} interests</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Profile Details</CardTitle>
                {!isEditing ? (
                  <Button variant="outline" onClick={handleEditToggle}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={isSaving}>
                      {isSaving ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4 mr-2" />
                      )}
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="font-semibold">Basic Information</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    {isEditing ? (
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          name: e.target.value
                        }))}
                        disabled={isSaving}
                      />
                    ) : (
                      <p className="text-sm p-3 bg-muted rounded-md">{user.name}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <p className="text-sm p-3 bg-muted rounded-md text-muted-foreground">
                      {user.email} (cannot be changed)
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  {isEditing ? (
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        bio: e.target.value
                      }))}
                      placeholder="Tell us about yourself..."
                      rows={3}
                      disabled={isSaving}
                    />
                  ) : (
                    <p className="text-sm p-3 bg-muted rounded-md">
                      {user.bio || 'No bio provided'}
                    </p>
                  )}
                </div>
              </div>

              <Separator />

              {/* Interests */}
              <div className="space-y-4">
                <h3 className="font-semibold">Interests</h3>
                {isEditing ? (
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Select your interests to help us recommend relevant communities:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category) => {
                        const isSelected = formData.interests.includes(category.id);
                        console.log(`Category ${category.name} (${category.id}) selected:`, isSelected);
                        return (
                          <Badge
                            key={category.id}
                            variant={isSelected ? 'default' : 'outline'}
                            className="cursor-pointer"
                            onClick={() => !isSaving && toggleInterest(category.id)}
                          >
                            {category.name}
                          </Badge>
                        );
                      })}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Selected: {formData.interests.length} interests
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {user.interests.map((interest) => (
                      <Badge key={interest.id} variant="secondary">
                        {interest.name}
                      </Badge>
                    ))}
                    {user.interests.length === 0 && (
                      <p className="text-sm text-muted-foreground">No interests selected</p>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
