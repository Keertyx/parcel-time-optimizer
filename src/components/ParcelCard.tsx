
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate, formatTimeSlot } from '@/utils/timeUtils';
import { Parcel } from '@/context/ParcelContext';

interface ParcelCardProps {
  parcel: Parcel;
  onSelect?: (parcel: Parcel) => void;
  onStatusChange?: (parcel: Parcel, status: Parcel['status']) => void;
  showActions?: boolean;
}

const ParcelCard: React.FC<ParcelCardProps> = ({ 
  parcel, 
  onSelect, 
  onStatusChange,
  showActions = true 
}) => {
  const getStatusClassName = () => {
    switch (parcel.status) {
      case 'pending': return 'status-pending';
      case 'in-transit': return 'status-in-transit';
      case 'delivered': return 'status-delivered';
      default: return '';
    }
  };
  
  return (
    <Card className="mb-4 animate-fade-in border-l-4 hover:shadow-lg transition-all" style={{ 
      borderLeftColor: parcel.status === 'pending' 
        ? 'hsl(var(--pending))' 
        : parcel.status === 'in-transit' 
        ? 'hsl(var(--in-transit))' 
        : 'hsl(var(--delivered))' 
    }}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">{parcel.description}</CardTitle>
          <Badge className={getStatusClassName()}>
            {parcel.status === 'pending' ? 'Pending' : 
             parcel.status === 'in-transit' ? 'In Transit' : 'Delivered'}
          </Badge>
        </div>
        <CardDescription>
          Tracking #: <span className="font-medium">{parcel.trackingNumber}</span>
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">From</p>
            <p className="font-medium">{parcel.sender.name}</p>
            <p>{parcel.sender.address.city}, {parcel.sender.address.state}</p>
          </div>
          <div>
            <p className="text-muted-foreground">To</p>
            <p className="font-medium">{parcel.receiver.name}</p>
            <p>{parcel.receiver.address.city}, {parcel.receiver.address.state}</p>
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Weight</p>
            <p>{parcel.weight} kg</p>
          </div>
          <div>
            <p className="text-muted-foreground">Created</p>
            <p>{formatDate(parcel.createdAt)}</p>
          </div>
        </div>
        
        {parcel.deliverySlot && (
          <div className="mt-4 text-sm">
            <p className="text-muted-foreground">Delivery Slot</p>
            <p>{formatTimeSlot(parcel.deliverySlot)}</p>
          </div>
        )}
      </CardContent>
      
      {showActions && (
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => onSelect && onSelect(parcel)}>
            Details
          </Button>
          
          {parcel.status !== 'delivered' && onStatusChange && (
            <Button 
              variant="default" 
              onClick={() => {
                const newStatus = parcel.status === 'pending' ? 'in-transit' : 'delivered';
                onStatusChange(parcel, newStatus);
              }}
            >
              {parcel.status === 'pending' ? 'Mark as In Transit' : 'Mark as Delivered'}
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

export default ParcelCard;
