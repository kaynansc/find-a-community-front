
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  name: string;
  email: string;
  bio?: string;
  interests: string[];
  isOrganizer: boolean;
  isAdmin: boolean;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      
      // Transform the API response to match our User interface
      const transformedUser: User = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        bio: 'Welcome to Find a Community!',
        interests: [],
        isOrganizer: data.user.role === 'organizer',
        isAdmin: data.user.role === 'admin',
        role: data.user.role
      };
      
      setUser(transformedUser);
      setToken(data.token);
      localStorage.setItem('user', JSON.stringify(transformedUser));
      localStorage.setItem('token', data.token);
      
      toast({
        title: "Welcome back!",
        description: "You've successfully logged in.",
      });
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    toast({
      title: "Logged out",
      description: "See you soon!",
    });
  };

  const updateProfile = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      toast({
        title: "Profile updated",
        description: "Your changes have been saved.",
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateProfile, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
