
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// User Types
export type UserRole = 'sender' | 'receiver' | 'post-office' | null;

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  signup: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check for existing user session on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('parcelUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Mock login function - in a real app, this would connect to your backend
  const login = async (email: string, password: string, role: UserRole) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Simple validation for demo purposes
      if (!email || !password || !role) {
        throw new Error('Please fill in all fields');
      }
      
      // Create a mock user (in a real app, this would be returned from your backend)
      const mockUser: User = {
        id: Math.random().toString(36).substring(2, 15),
        name: email.split('@')[0], // Extract name from email for demo
        email,
        role,
      };
      
      // Save user to localStorage
      localStorage.setItem('parcelUser', JSON.stringify(mockUser));
      setUser(mockUser);
      
      // Redirect based on role
      navigateByRole(role);
      toast.success('Login successful!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Login failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Mock signup function - in a real app, this would connect to your backend
  const signup = async (name: string, email: string, password: string, role: UserRole) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simple validation for demo purposes
      if (!name || !email || !password || !role) {
        throw new Error('Please fill in all fields');
      }
      
      // In a real app, you would save the user to your database here
      
      toast.success('Account created successfully! Please sign in.');
      return Promise.resolve();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Registration failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = () => {
    localStorage.removeItem('parcelUser');
    setUser(null);
    navigate('/auth');
    toast.success('Logged out successfully');
  };
  
  const navigateByRole = (role: UserRole) => {
    switch(role) {
      case 'sender':
        navigate('/sender');
        break;
      case 'receiver':
        navigate('/receiver');
        break;
      case 'post-office':
        navigate('/post-office');
        break;
      default:
        navigate('/');
    }
  };
  
  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      isLoading, 
      login, 
      signup, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
