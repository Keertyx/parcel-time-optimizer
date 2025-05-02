import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useParcelContext } from '@/context/ParcelContext';
import { mockApi } from '@/services/mockApi';
import { Parcel, TimeSlot, Person } from '@/context/ParcelContext';
import ParcelCard from '@/components/ParcelCard';
import TimeSlotSelector from '@/components/TimeSlotSelector';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/context/AuthContext';

const ReceiverModule = () => {
  const { state, dispatch } = useParcelContext();
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [selectingSlotForParcel, setSelectingSlotForParcel] = useState<Parcel | null>(null);
  const [receiverId, setReceiverId] = useState<string | null>(null);
  const [recommendedSlots, setRecommendedSlots] = useState<TimeSlot[]>([]);
  const [currentUserAddedToReceivers, setCurrentUserAddedToReceivers] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch all users (receivers)
        const users = await mockApi.getUsers();
        
        // Add current user to users list if not already present
        if (user) {
          const currentUserExists = users.some(u => u.id === user.id);
          
          if (!currentUserExists && !currentUserAddedToReceivers) {
            // Create a mock user object for the current logged-in user if they're not in the list
            const currentUserAsReceiver: Person = {
              id: user.id,
              name: user.name,
              email: user.email,
              phone: "N/A", // Placeholder as we don't have this in auth user
              address: {
                street: "N/A",
                city: "N/A",
                state: "N/A",
                postalCode: "N/A",
                country: "N/A"
              }
            };
            
            users.push(currentUserAsReceiver);
            setCurrentUserAddedToReceivers(true);
          }
        }
        
        dispatch({ type: 'SET_USERS', payload: users });
        
        // Fetch all parcels
        const parcels = await mockApi.getParcels();
        dispatch({ type: 'SET_PARCELS', payload: parcels });
        
        // Set initial receiver to current logged-in user
        if (user && !receiverId) {
          setReceiverId(user.id);
          
          // Get recommended time slots for the current user
          const slots = await mockApi.getRecommendedTimeSlots(user.id);
          setRecommendedSlots(slots);
        }
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
  }, [dispatch, receiverId, toast, user, currentUserAddedToReceivers]);
  
  const handleReceiverChange = async (userId: string) => {
    try {
      setLoading(true);
      setReceiverId(userId);
      
      // Get recommended time slots for the selected receiver
      const slots = await mockApi.getRecommendedTimeSlots(userId);
      setRecommendedSlots(slots);
    } catch (error) {
      console.error('Failed to load time slots', error);
      toast({
        title: 'Error',
        description: 'Failed to load recommended time slots.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const getParcelsForReceiver = (id: string | null) => {
    if (!id) return { pending: [], scheduled: [] };
    
    const pending = state.parcels.filter(
      (p) => p.receiver.id === id && p.status === 'pending' && !p.acceptedTimeSlot
    );
    
    const scheduled = state.parcels.filter(
      (p) => p.receiver.id === id && (p.acceptedTimeSlot || p.status !== 'pending')
    );
    
    return { pending, scheduled };
  };
  
  const handleSelectParcelForTimeSlot = (parcel: Parcel) => {
    setSelectingSlotForParcel(parcel);
  };
  
  const handleTimeSlotSelection = async (timeSlot: TimeSlot) => {
    if (!selectingSlotForParcel) return;
    
    try {
      setLoading(true);
      await mockApi.updateParcelDeliverySlot(selectingSlotForParcel.id, timeSlot);
      
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
        
        {/* Receiver Selection */}
        <Card className="mb-8 p-6">
          <h2 className="text-lg font-medium mb-4">Select Receiver</h2>
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {state.users.map((user) => (
                  <TableRow key={user.id} className={receiverId === user.id ? "bg-muted" : ""}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.address.city}, {user.address.state}</TableCell>
                    <TableCell>
                      <button
                        onClick={() => handleReceiverChange(user.id)}
                        className={`px-3 py-1 rounded-md ${
                          user.id === receiverId 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                        }`}
                      >
                        {user.id === receiverId ? 'Selected' : 'Select'}
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
        ) : receiverId ? (
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
                    There are no parcels awaiting scheduling for this receiver.
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
                    There are no scheduled or delivered parcels for this receiver.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        ) : (
          <div className="text-center p-16 border rounded-lg">
            <h3 className="text-xl font-medium mb-2">Select a Receiver</h3>
            <p className="text-muted-foreground">
              Please select a receiver from the list above to view their parcels.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReceiverModule;
