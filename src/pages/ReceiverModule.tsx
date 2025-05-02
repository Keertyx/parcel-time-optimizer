
import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useParcelContext } from '@/context/ParcelContext';
import { mockApi } from '@/services/mockApi';
import { Parcel, TimeSlot } from '@/context/ParcelContext';
import ParcelCard from '@/components/ParcelCard';
import TimeSlotSelector from '@/components/TimeSlotSelector';
import LoadingSpinner from '@/components/LoadingSpinner';

const ReceiverModule = () => {
  const { state, dispatch } = useParcelContext();
  const { toast } = useToast();
  const [receiverId, setReceiverId] = useState<string>('user1'); // Default to first user for demo
  const [recommendedSlots, setRecommendedSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectingSlotForParcel, setSelectingSlotForParcel] = useState<Parcel | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch users if not already loaded
        if (state.users.length === 0) {
          const users = await mockApi.getUsers();
          dispatch({ type: 'SET_USERS', payload: users });
          
          if (users.length > 0) {
            setReceiverId(users[0].id);
          }
        }
        
        // Fetch parcels for this receiver
        const parcels = await mockApi.getParcelsByReceiverId(receiverId);
        dispatch({ type: 'SET_PARCELS', payload: parcels });
        
        // Get recommended time slots
        const slots = await mockApi.getRecommendedTimeSlots(receiverId);
        setRecommendedSlots(slots);
      } catch (error) {
        console.error('Failed to fetch data', error);
        toast({
          title: 'Error',
          description: 'Failed to load data. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [dispatch, receiverId, toast]);
  
  const handleUserChange = (userId: string) => {
    setReceiverId(userId);
  };
  
  const pendingParcels = state.parcels.filter((p) => 
    p.status === 'pending' && !p.acceptedTimeSlot && p.receiver.id === receiverId
  );
  
  const scheduledParcels = state.parcels.filter((p) => 
    p.receiver.id === receiverId && (p.acceptedTimeSlot || p.status !== 'pending')
  );
  
  const handleSelectParcelForTimeSlot = (parcel: Parcel) => {
    setSelectingSlotForParcel(parcel);
  };
  
  const handleTimeSlotSelection = async (timeSlot: TimeSlot) => {
    if (!selectingSlotForParcel) return;
    
    try {
      setLoading(true);
      const updatedParcel = await mockApi.updateParcelDeliverySlot(selectingSlotForParcel.id, timeSlot);
      
      dispatch({ 
        type: 'UPDATE_DELIVERY_SLOT', 
        payload: { parcelId: selectingSlotForParcel.id, timeSlot } 
      });
      
      toast({
        title: 'Time Slot Confirmed',
        description: 'Your delivery time slot has been scheduled.',
      });
      
      setSelectingSlotForParcel(null);
    } catch (error) {
      console.error('Failed to update time slot', error);
      toast({
        title: 'Error',
        description: 'Failed to schedule time slot. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  if (loading && state.users.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center p-16">
          <LoadingSpinner size={50} />
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Receive Parcels</h1>
          <p className="text-muted-foreground">
            View and manage incoming parcels and schedule delivery times.
          </p>
        </div>
        
        {/* User Selection */}
        <Card className="mb-8 p-6">
          <h2 className="text-lg font-medium mb-4">Selected Receiver</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {state.users.map((user) => (
              <div 
                key={user.id}
                className={`p-3 border rounded-md cursor-pointer transition-colors ${
                  user.id === receiverId ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                }`}
                onClick={() => handleUserChange(user.id)}
              >
                <div className="font-medium">{user.name}</div>
                <div className="text-sm">{user.email}</div>
              </div>
            ))}
          </div>
        </Card>
        
        {selectingSlotForParcel ? (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Schedule Delivery Time</h2>
              <button 
                className="text-muted-foreground hover:text-foreground"
                onClick={() => setSelectingSlotForParcel(null)}
              >
                Cancel
              </button>
            </div>
            
            <div className="mb-4">
              <ParcelCard parcel={selectingSlotForParcel} showActions={false} />
            </div>
            
            <TimeSlotSelector 
              recommendedSlots={recommendedSlots}
              onSelectTimeSlot={handleTimeSlotSelection}
            />
          </div>
        ) : (
          <Tabs defaultValue="pending">
            <TabsList className="mb-6">
              <TabsTrigger value="pending">
                Pending Parcels ({pendingParcels.length})
              </TabsTrigger>
              <TabsTrigger value="scheduled">
                Scheduled & Delivered ({scheduledParcels.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="pending">
              {loading ? (
                <div className="flex justify-center p-8">
                  <LoadingSpinner />
                </div>
              ) : pendingParcels.length > 0 ? (
                <div className="space-y-6">
                  {pendingParcels.map((parcel) => (
                    <ParcelCard 
                      key={parcel.id} 
                      parcel={parcel} 
                      onSelect={handleSelectParcelForTimeSlot}
                      showActions={true}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center p-16 border rounded-lg">
                  <h3 className="text-xl font-medium mb-2">No Pending Parcels</h3>
                  <p className="text-muted-foreground">
                    You don't have any parcels awaiting scheduling.
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="scheduled">
              {loading ? (
                <div className="flex justify-center p-8">
                  <LoadingSpinner />
                </div>
              ) : scheduledParcels.length > 0 ? (
                <div className="space-y-6">
                  {scheduledParcels.map((parcel) => (
                    <ParcelCard 
                      key={parcel.id} 
                      parcel={parcel} 
                      showActions={false}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center p-16 border rounded-lg">
                  <h3 className="text-xl font-medium mb-2">No Scheduled Parcels</h3>
                  <p className="text-muted-foreground">
                    You don't have any scheduled or delivered parcels.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default ReceiverModule;
