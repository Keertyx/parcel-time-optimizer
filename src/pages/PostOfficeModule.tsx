
import React, { useEffect, useState } from 'react';
import { useParcelContext } from '@/context/ParcelContext';
import { mockApi } from '@/services/mockApi';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Parcel } from '@/context/ParcelContext';
import ParcelCard from '@/components/ParcelCard';
import RouteOptimization from '@/components/RouteOptimization';
import DeliveryPerformance from '@/components/DeliveryPerformance';
import LoadingSpinner from '@/components/LoadingSpinner';

const PostOfficeModule = () => {
  const { state, dispatch } = useParcelContext();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const parcels = await mockApi.getParcels();
        dispatch({ type: 'SET_PARCELS', payload: parcels });
      } catch (error) {
        console.error('Failed to fetch parcels', error);
        toast({
          title: 'Error',
          description: 'Failed to load parcels. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [dispatch, toast]);
  
  const handleStatusChange = async (parcel: Parcel, newStatus: Parcel['status']) => {
    try {
      setLoading(true);
      const updatedParcel = await mockApi.updateParcelStatus(parcel.id, newStatus);
      dispatch({ type: 'UPDATE_PARCEL', payload: updatedParcel });
      
      toast({
        title: 'Status Updated',
        description: `Parcel ${parcel.trackingNumber} is now ${newStatus === 'in-transit' ? 'in transit' : 'delivered'}.`,
      });
    } catch (error) {
      console.error('Failed to update status', error);
      toast({
        title: 'Error',
        description: 'Failed to update parcel status.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const pendingParcels = state.parcels.filter((p) => p.status === 'pending');
  const inTransitParcels = state.parcels.filter((p) => p.status === 'in-transit');
  const deliveredParcels = state.parcels.filter((p) => p.status === 'delivered');
  
  const filteredParcels = activeTab === 'all' 
    ? state.parcels
    : activeTab === 'pending' 
    ? pendingParcels
    : activeTab === 'in-transit' 
    ? inTransitParcels
    : deliveredParcels;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Post Office Management</h1>
          <p className="text-muted-foreground">
            Track, manage, and optimize parcel deliveries.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Parcels</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{state.parcels.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Pending Delivery</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-500">{pendingParcels.length + inTransitParcels.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Successfully Delivered</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{deliveredParcels.length}</div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Parcel Management</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="mb-6">
                    <TabsTrigger value="all">
                      All Parcels ({state.parcels.length})
                    </TabsTrigger>
                    <TabsTrigger value="pending">
                      Pending ({pendingParcels.length})
                    </TabsTrigger>
                    <TabsTrigger value="in-transit">
                      In Transit ({inTransitParcels.length})
                    </TabsTrigger>
                    <TabsTrigger value="delivered">
                      Delivered ({deliveredParcels.length})
                    </TabsTrigger>
                  </TabsList>
                  
                  {loading ? (
                    <div className="flex justify-center p-8">
                      <LoadingSpinner />
                    </div>
                  ) : filteredParcels.length > 0 ? (
                    <div className="space-y-4">
                      {filteredParcels.map((parcel) => (
                        <ParcelCard 
                          key={parcel.id} 
                          parcel={parcel} 
                          onStatusChange={handleStatusChange}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-8 border rounded-lg">
                      <p className="text-muted-foreground">No parcels found.</p>
                    </div>
                  )}
                </Tabs>
              </CardContent>
            </Card>
            
            <RouteOptimization parcels={state.parcels} />
          </div>
          
          <div className="lg:col-span-5">
            <DeliveryPerformance parcels={state.parcels} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostOfficeModule;
