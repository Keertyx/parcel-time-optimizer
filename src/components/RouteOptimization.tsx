
import React, { useState, useEffect } from 'react';
import { Parcel } from '@/context/ParcelContext';
import { mockApi } from '@/services/mockApi';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from '@/components/ui/use-toast';
import LoadingSpinner from './LoadingSpinner';

interface RouteProps {
  parcels: Parcel[];
}

const RouteOptimization: React.FC<RouteProps> = ({ parcels }) => {
  const [optimizedRoute, setOptimizedRoute] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const inTransitParcels = parcels.filter((p) => p.status === 'in-transit');
  
  const optimizeRoute = async () => {
    if (inTransitParcels.length === 0) {
      toast({
        title: "No parcels to optimize",
        description: "There are no parcels in transit to optimize the route for.",
      });
      return;
    }
    
    try {
      setLoading(true);
      const parcelIds = inTransitParcels.map((p) => p.id);
      const optimized = await mockApi.getOptimalDeliveryRoute(parcelIds);
      setOptimizedRoute(optimized);
      
      toast({
        title: "Route optimized",
        description: "Delivery route has been optimized for maximum efficiency.",
      });
    } catch (error) {
      toast({
        title: "Failed to optimize route",
        description: "An error occurred while optimizing the route.",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  const getParcelById = (id: string) => {
    return parcels.find((p) => p.id === id);
  };
  
  // Clear optimized route when parcels list changes
  useEffect(() => {
    setOptimizedRoute([]);
  }, [parcels]);
  
  if (inTransitParcels.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Route Optimization</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center p-4 text-muted-foreground">
            No parcels in transit to optimize.
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Delivery Route Optimization</CardTitle>
          <Button onClick={optimizeRoute} disabled={loading}>
            {loading ? <LoadingSpinner size={20} /> : "Optimize Route"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center p-8">
            <LoadingSpinner />
          </div>
        ) : optimizedRoute.length > 0 ? (
          <div>
            <h3 className="font-medium mb-4">Optimized Delivery Sequence</h3>
            <ol className="space-y-4">
              {optimizedRoute.map((id, index) => {
                const parcel = getParcelById(id);
                return (
                  <li key={id} className="flex items-start gap-3">
                    <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="border rounded-md p-3 flex-grow">
                      <p className="font-medium">{parcel?.description}</p>
                      <p className="text-sm">
                        To: {parcel?.receiver.name} ({parcel?.receiver.address.city}, {parcel?.receiver.address.state})
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Tracking: {parcel?.trackingNumber}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        ) : (
          <div className="border border-dashed rounded-lg p-6 text-center">
            <p className="text-muted-foreground">
              Click "Optimize Route" to calculate the most efficient delivery sequence.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RouteOptimization;
