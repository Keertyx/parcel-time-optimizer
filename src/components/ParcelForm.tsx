
import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useParcelContext } from '@/context/ParcelContext';
import { mockApi } from '@/services/mockApi';
import { Person, Parcel } from '@/context/ParcelContext';
import { User } from '@/context/AuthContext';

interface ParcelFormProps {
  onSubmitSuccess?: () => void;
  hideSenderForm?: boolean;
  currentUser?: User | null;
}

const ParcelForm: React.FC<ParcelFormProps> = ({ 
  onSubmitSuccess, 
  hideSenderForm = false,
  currentUser = null 
}) => {
  const { state, dispatch } = useParcelContext();
  const { toast } = useToast();
  
  const [senderSelected, setSenderSelected] = useState<Person | null>(null);
  const [receiverSelected, setReceiverSelected] = useState<Person | null>(null);
  const [isNewSender, setIsNewSender] = useState(!hideSenderForm);
  const [isNewReceiver, setIsNewReceiver] = useState(false);
  
  // Form data states
  const [formData, setFormData] = useState({
    // Sender info (if new)
    senderName: '',
    senderEmail: '',
    senderPhone: '',
    senderStreet: '',
    senderCity: '',
    senderState: '',
    senderPostalCode: '',
    senderCountry: 'USA',
    
    // Receiver info (if new)
    receiverName: '',
    receiverEmail: '',
    receiverPhone: '',
    receiverStreet: '',
    receiverCity: '',
    receiverState: '',
    receiverPostalCode: '',
    receiverCountry: 'USA',
    
    // Parcel info
    weight: '',
    length: '',
    width: '',
    height: '',
    description: '',
  });
  
  // When currentUser is provided, use it as the sender
  useEffect(() => {
    if (currentUser && hideSenderForm) {
      // Create a sender from the current user
      const userAsSender: Person = {
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
        phone: '', // We don't have this in the User type
        address: {
          street: '',
          city: '',
          state: '',
          postalCode: '',
          country: 'USA'
        }
      };
      
      setSenderSelected(userAsSender);
      setIsNewSender(false);
    }
  }, [currentUser, hideSenderForm]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create sender object
    let sender: Person;
    if (isNewSender) {
      sender = {
        id: `new-${Date.now()}`,
        name: formData.senderName,
        email: formData.senderEmail,
        phone: formData.senderPhone,
        address: {
          street: formData.senderStreet,
          city: formData.senderCity,
          state: formData.senderState,
          postalCode: formData.senderPostalCode,
          country: formData.senderCountry,
        },
      };
    } else {
      if (!senderSelected) {
        toast({
          title: "Error",
          description: "Please select a sender",
          variant: "destructive",
        });
        return;
      }
      sender = senderSelected;
    }
    
    // Create receiver object
    let receiver: Person;
    if (isNewReceiver) {
      receiver = {
        id: `new-${Date.now() + 1}`,
        name: formData.receiverName,
        email: formData.receiverEmail,
        phone: formData.receiverPhone,
        address: {
          street: formData.receiverStreet,
          city: formData.receiverCity,
          state: formData.receiverState,
          postalCode: formData.receiverPostalCode,
          country: formData.receiverCountry,
        },
      };
    } else {
      if (!receiverSelected) {
        toast({
          title: "Error",
          description: "Please select a receiver",
          variant: "destructive",
        });
        return;
      }
      receiver = receiverSelected;
    }
    
    // Create parcel object
    const parcelData: Omit<Parcel, 'id' | 'trackingNumber' | 'createdAt' | 'acceptedTimeSlot'> = {
      sender,
      receiver,
      weight: parseFloat(formData.weight) || 0,
      dimensions: {
        length: parseFloat(formData.length) || 0,
        width: parseFloat(formData.width) || 0,
        height: parseFloat(formData.height) || 0,
      },
      description: formData.description,
      status: 'pending',
      deliverySlot: null,
    };
    
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Create parcel
      const newParcel = await mockApi.createParcel(parcelData);
      dispatch({ type: 'ADD_PARCEL', payload: newParcel });
      
      toast({
        title: "Success",
        description: `Parcel created with tracking number: ${newParcel.trackingNumber}`,
      });
      
      // Reset form
      setFormData({
        senderName: '',
        senderEmail: '',
        senderPhone: '',
        senderStreet: '',
        senderCity: '',
        senderState: '',
        senderPostalCode: '',
        senderCountry: 'USA',
        receiverName: '',
        receiverEmail: '',
        receiverPhone: '',
        receiverStreet: '',
        receiverCity: '',
        receiverState: '',
        receiverPostalCode: '',
        receiverCountry: 'USA',
        weight: '',
        length: '',
        width: '',
        height: '',
        description: '',
      });
      setSenderSelected(null);
      setReceiverSelected(null);
      setIsNewSender(false);
      setIsNewReceiver(false);
      
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create parcel. Please try again.",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className={`grid ${hideSenderForm ? '' : 'md:grid-cols-2'} gap-6`}>
        {/* Sender Information - only show if not hidden */}
        {!hideSenderForm && (
          <Card>
            <CardHeader>
              <CardTitle>Sender Information</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs 
                defaultValue={isNewSender ? "new" : "existing"}
                onValueChange={(value) => setIsNewSender(value === "new")}
              >
                <TabsList className="grid grid-cols-2 mb-4">
                  <TabsTrigger value="existing">Existing Sender</TabsTrigger>
                  <TabsTrigger value="new">New Sender</TabsTrigger>
                </TabsList>
                
                <TabsContent value="existing">
                  <div className="space-y-4">
                    {state.users.length > 0 ? (
                      <div className="grid grid-cols-1 gap-2">
                        {state.users.map((user) => (
                          <div 
                            key={user.id}
                            className={`p-3 border rounded-md cursor-pointer transition-colors ${
                              senderSelected?.id === user.id ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                            }`}
                            onClick={() => setSenderSelected(user)}
                          >
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm">{user.email}</div>
                            <div className="text-sm">{user.address.city}, {user.address.state}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center p-4">
                        <p>No existing users. Create a new sender.</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="new">
                  <div className="space-y-3">
                    <div className="grid gap-2">
                      <Label htmlFor="senderName">Name</Label>
                      <Input 
                        id="senderName" 
                        name="senderName" 
                        value={formData.senderName} 
                        onChange={handleChange} 
                        required={isNewSender}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label htmlFor="senderEmail">Email</Label>
                        <Input 
                          id="senderEmail" 
                          name="senderEmail" 
                          type="email" 
                          value={formData.senderEmail} 
                          onChange={handleChange} 
                          required={isNewSender}
                        />
                      </div>
                      <div>
                        <Label htmlFor="senderPhone">Phone</Label>
                        <Input 
                          id="senderPhone" 
                          name="senderPhone" 
                          value={formData.senderPhone} 
                          onChange={handleChange} 
                          required={isNewSender}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="senderStreet">Street Address</Label>
                      <Input 
                        id="senderStreet" 
                        name="senderStreet" 
                        value={formData.senderStreet} 
                        onChange={handleChange} 
                        required={isNewSender}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label htmlFor="senderCity">City</Label>
                        <Input 
                          id="senderCity" 
                          name="senderCity" 
                          value={formData.senderCity} 
                          onChange={handleChange} 
                          required={isNewSender}
                        />
                      </div>
                      <div>
                        <Label htmlFor="senderState">State</Label>
                        <Input 
                          id="senderState" 
                          name="senderState" 
                          value={formData.senderState} 
                          onChange={handleChange} 
                          required={isNewSender}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label htmlFor="senderPostalCode">Postal Code</Label>
                        <Input 
                          id="senderPostalCode" 
                          name="senderPostalCode" 
                          value={formData.senderPostalCode} 
                          onChange={handleChange} 
                          required={isNewSender}
                        />
                      </div>
                      <div>
                        <Label htmlFor="senderCountry">Country</Label>
                        <Input 
                          id="senderCountry" 
                          name="senderCountry" 
                          value={formData.senderCountry} 
                          onChange={handleChange} 
                          required={isNewSender}
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
        
        {/* Receiver Information - always show */}
        <Card className={hideSenderForm ? "max-w-xl mx-auto w-full" : ""}>
          <CardHeader>
            <CardTitle>Receiver Information</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs 
              defaultValue={isNewReceiver ? "new" : "existing"}
              onValueChange={(value) => setIsNewReceiver(value === "new")}
            >
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="existing">Existing Receiver</TabsTrigger>
                <TabsTrigger value="new">New Receiver</TabsTrigger>
              </TabsList>
              
              <TabsContent value="existing">
                <div className="space-y-4">
                  {state.users.length > 0 ? (
                    <div className="grid grid-cols-1 gap-2">
                      {state.users.map((user) => (
                        <div 
                          key={user.id}
                          className={`p-3 border rounded-md cursor-pointer transition-colors ${
                            receiverSelected?.id === user.id ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                          }`}
                          onClick={() => setReceiverSelected(user)}
                        >
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm">{user.email}</div>
                          <div className="text-sm">{user.address.city}, {user.address.state}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-4">
                      <p>No existing users. Create a new receiver.</p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="new">
                <div className="space-y-3">
                  <div className="grid gap-2">
                    <Label htmlFor="receiverName">Name</Label>
                    <Input 
                      id="receiverName" 
                      name="receiverName" 
                      value={formData.receiverName} 
                      onChange={handleChange} 
                      required={isNewReceiver}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="receiverEmail">Email</Label>
                      <Input 
                        id="receiverEmail" 
                        name="receiverEmail" 
                        type="email" 
                        value={formData.receiverEmail} 
                        onChange={handleChange} 
                        required={isNewReceiver}
                      />
                    </div>
                    <div>
                      <Label htmlFor="receiverPhone">Phone</Label>
                      <Input 
                        id="receiverPhone" 
                        name="receiverPhone" 
                        value={formData.receiverPhone} 
                        onChange={handleChange} 
                        required={isNewReceiver}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="receiverStreet">Street Address</Label>
                    <Input 
                      id="receiverStreet" 
                      name="receiverStreet" 
                      value={formData.receiverStreet} 
                      onChange={handleChange} 
                      required={isNewReceiver}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="receiverCity">City</Label>
                      <Input 
                        id="receiverCity" 
                        name="receiverCity" 
                        value={formData.receiverCity} 
                        onChange={handleChange} 
                        required={isNewReceiver}
                      />
                    </div>
                    <div>
                      <Label htmlFor="receiverState">State</Label>
                      <Input 
                        id="receiverState" 
                        name="receiverState" 
                        value={formData.receiverState} 
                        onChange={handleChange} 
                        required={isNewReceiver}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="receiverPostalCode">Postal Code</Label>
                      <Input 
                        id="receiverPostalCode" 
                        name="receiverPostalCode" 
                        value={formData.receiverPostalCode} 
                        onChange={handleChange} 
                        required={isNewReceiver}
                      />
                    </div>
                    <div>
                      <Label htmlFor="receiverCountry">Country</Label>
                      <Input 
                        id="receiverCountry" 
                        name="receiverCountry" 
                        value={formData.receiverCountry} 
                        onChange={handleChange} 
                        required={isNewReceiver}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      
      {/* Parcel Details */}
      <Card className={hideSenderForm ? "max-w-xl mx-auto w-full" : ""}>
        <CardHeader>
          <CardTitle>Parcel Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4">
              <div>
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input 
                  id="weight" 
                  name="weight" 
                  type="number" 
                  min="0.1" 
                  step="0.1" 
                  value={formData.weight} 
                  onChange={handleChange} 
                  required
                />
              </div>
              <div>
                <Label htmlFor="length">Length (cm)</Label>
                <Input 
                  id="length" 
                  name="length" 
                  type="number" 
                  min="1" 
                  value={formData.length} 
                  onChange={handleChange} 
                  required
                />
              </div>
              <div>
                <Label htmlFor="width">Width (cm)</Label>
                <Input 
                  id="width" 
                  name="width" 
                  type="number" 
                  min="1" 
                  value={formData.width} 
                  onChange={handleChange} 
                  required
                />
              </div>
              <div>
                <Label htmlFor="height">Height (cm)</Label>
                <Input 
                  id="height" 
                  name="height" 
                  type="number" 
                  min="1" 
                  value={formData.height} 
                  onChange={handleChange} 
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="description">Parcel Description</Label>
              <Textarea 
                id="description" 
                name="description" 
                value={formData.description} 
                onChange={handleChange} 
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button type="submit" size="lg">
          Send Parcel
        </Button>
      </div>
    </form>
  );
};

export default ParcelForm;
