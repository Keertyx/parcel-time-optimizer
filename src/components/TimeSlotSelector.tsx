
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TimeSlot } from '@/context/ParcelContext';
import { formatDate, formatTime, getDayName, generateTimeSlots, getNext7Days } from '@/utils/timeUtils';

interface TimeSlotSelectorProps {
  recommendedSlots: TimeSlot[];
  onSelectTimeSlot: (timeSlot: TimeSlot) => void;
}

const TimeSlotSelector: React.FC<TimeSlotSelectorProps> = ({ 
  recommendedSlots, 
  onSelectTimeSlot 
}) => {
  const [selectedTab, setSelectedTab] = useState<string>("recommended");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  
  const next7Days = getNext7Days();
  const customTimeSlots = selectedDate ? generateTimeSlots(selectedDate) : [];
  
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedTimeSlot(null);
  };
  
  const handleTimeSlotSelect = (slot: TimeSlot) => {
    setSelectedTimeSlot(slot);
  };
  
  const handleConfirm = () => {
    if (selectedTab === "recommended" && recommendedSlots.length > 0) {
      onSelectTimeSlot(selectedTimeSlot || recommendedSlots[0]);
    } else if (selectedTab === "custom" && selectedTimeSlot) {
      onSelectTimeSlot(selectedTimeSlot);
    }
  };
  
  return (
    <div className="w-full max-w-3xl mx-auto">
      <Tabs 
        defaultValue="recommended" 
        value={selectedTab}
        onValueChange={setSelectedTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="recommended">Recommended Slots</TabsTrigger>
          <TabsTrigger value="custom">Custom Selection</TabsTrigger>
        </TabsList>
        
        <TabsContent value="recommended" className="space-y-4">
          <div className="grid gap-4">
            {recommendedSlots.length > 0 ? (
              recommendedSlots.map((slot) => (
                <Card 
                  key={slot.id}
                  className={`cursor-pointer transition-all ${
                    (selectedTimeSlot?.id === slot.id || (!selectedTimeSlot && slot.id === recommendedSlots[0].id)) 
                    ? "border-primary" 
                    : ""
                  }`}
                  onClick={() => handleTimeSlotSelect(slot)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">
                      {formatDate(slot.date)}
                    </CardTitle>
                    <CardDescription>
                      AI recommended based on your past deliveries
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-center items-center p-3 bg-muted rounded-md font-medium">
                      {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center p-8">
                <p>No recommended slots available.</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="custom">
          <Card>
            <CardHeader>
              <CardTitle>Choose Your Delivery Date</CardTitle>
              <CardDescription>Select a convenient day for delivery</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex overflow-x-auto pb-2 mb-4 gap-2">
                {next7Days.map((date, index) => (
                  <Button
                    key={index}
                    variant={selectedDate?.toDateString() === date.toDateString() ? "default" : "outline"}
                    className="flex-shrink-0 min-w-[80px]"
                    onClick={() => handleDateSelect(date)}
                  >
                    <div className="flex flex-col text-center">
                      <span className="text-xs">{getDayName(date)}</span>
                      <span className="font-bold">{date.getDate()}</span>
                    </div>
                  </Button>
                ))}
              </div>
              
              {selectedDate && (
                <div className="mt-4">
                  <h3 className="font-medium mb-3">Available Time Slots</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {customTimeSlots.map((slot) => (
                      <div
                        key={slot.id}
                        className={`p-3 border rounded-md cursor-pointer text-center transition-colors ${
                          selectedTimeSlot?.id === slot.id
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted"
                        }`}
                        onClick={() => handleTimeSlotSelect(slot)}
                      >
                        {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="mt-6 flex justify-end">
        <Button 
          size="lg" 
          disabled={
            (selectedTab === "recommended" && recommendedSlots.length === 0) || 
            (selectedTab === "custom" && !selectedTimeSlot)
          }
          onClick={handleConfirm}
        >
          Confirm Selection
        </Button>
      </div>
    </div>
  );
};

export default TimeSlotSelector;
