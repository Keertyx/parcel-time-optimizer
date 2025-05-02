
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Package } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-4">
            <Package size={40} className="text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Smart Parcel Delivery System
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            An intelligent platform to optimize parcel delivery for senders, receivers, and post offices.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="dashboard-card flex flex-col">
            <CardContent className="flex flex-col flex-grow items-center text-center p-6">
              <div className="p-3 bg-primary/10 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <path d="m22 10-10.1 5.1a2 2 0 0 1-1.8 0L0 10l10.1-5.1a2 2 0 0 1 1.8 0Z" />
                  <path d="M22 20V10" />
                  <path d="m0 10 10.1 5.1a2 2 0 0 0 1.8 0" />
                  <path d="M0 20V10" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-3">Send Parcels</h2>
              <p className="text-muted-foreground mb-6 flex-grow">
                Enter sender and receiver details, parcel information, and submit for delivery.
              </p>
              <Link to="/sender">
                <Button className="w-full">Sender Module</Button>
              </Link>
            </CardContent>
          </Card>
          
          <Card className="dashboard-card flex flex-col">
            <CardContent className="flex flex-col flex-grow items-center text-center p-6">
              <div className="p-3 bg-primary/10 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <rect width="16" height="13" x="4" y="2" rx="2" />
                  <path d="m22 22-5-5" />
                  <circle cx="13" cy="13" r="4" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-3">Receive Parcels</h2>
              <p className="text-muted-foreground mb-6 flex-grow">
                View incoming parcels and select AI-recommended or custom delivery time slots.
              </p>
              <Link to="/receiver">
                <Button className="w-full">Receiver Module</Button>
              </Link>
            </CardContent>
          </Card>
          
          <Card className="dashboard-card flex flex-col">
            <CardContent className="flex flex-col flex-grow items-center text-center p-6">
              <div className="p-3 bg-primary/10 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <path d="M8 7H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3" />
                  <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                  <path d="M9 12h6" />
                  <path d="M12 15h3" />
                  <path d="M12 9h3" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-3">Post Office</h2>
              <p className="text-muted-foreground mb-6 flex-grow">
                Manage parcels, optimize delivery routes, and track performance metrics.
              </p>
              <Link to="/post-office">
                <Button className="w-full">Post Office Module</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
        
        <div className="bg-muted rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold mb-2">How It Works</h2>
          <p className="text-muted-foreground mb-6">
            Our smart delivery system connects senders and receivers with intelligent delivery optimization.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <div className="p-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold mb-3 mx-auto">1</div>
              <h3 className="font-medium">Send Package</h3>
              <p className="text-sm text-muted-foreground">Enter parcel details and recipient information.</p>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold mb-3 mx-auto">2</div>
              <h3 className="font-medium">Select Delivery Time</h3>
              <p className="text-sm text-muted-foreground">AI recommends optimal delivery slots for recipients.</p>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold mb-3 mx-auto">3</div>
              <h3 className="font-medium">Optimized Delivery</h3>
              <p className="text-sm text-muted-foreground">Smart routing algorithms ensure efficient deliveries.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
