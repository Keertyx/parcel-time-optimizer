
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const HomePage = () => {
  const { isAuthenticated, user } = useAuth();
  
  // Determine where to redirect the user based on their role
  const getStartedUrl = () => {
    if (!isAuthenticated) return '/auth';
    
    switch (user?.role) {
      case 'sender': return '/sender';
      case 'receiver': return '/receiver';
      case 'post-office': return '/post-office';
      default: return '/auth';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-primary/5">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto text-center">
          <div className="flex justify-center mb-4">
            <Package className="h-20 w-20 text-primary" />
          </div>
          
          <h1 className="text-5xl font-bold mb-4">ParcelTime</h1>
          <p className="text-xl text-muted-foreground mb-8">
            A smart parcel delivery system with AI-powered time slot recommendations and route optimization
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center mb-12">
            <Link to={getStartedUrl()}>
              <Button size="lg" className="text-lg px-8">
                {isAuthenticated ? 'Go to Dashboard' : 'Sign In / Sign Up'}
              </Button>
            </Link>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-3">For Senders</h2>
              <p className="text-muted-foreground mb-4">
                Easily send parcels to anyone, anywhere. Track your packages in real-time and get delivery notifications.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-3">For Receivers</h2>
              <p className="text-muted-foreground mb-4">
                Choose your preferred delivery times with our AI-powered time slot recommendation system based on your preferences.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-3">For Post Office</h2>
              <p className="text-muted-foreground mb-4">
                Optimize delivery routes, manage parcels efficiently, and access delivery performance analytics.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
