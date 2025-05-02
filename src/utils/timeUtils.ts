
import { TimeSlot } from '../context/ParcelContext';

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

export const formatTime = (timeString: string): string => {
  // Parse time string (e.g., "14:00")
  const [hours, minutes] = timeString.split(':').map(Number);
  
  // Create a date object for today with the specified time
  const date = new Date();
  date.setHours(hours, minutes);
  
  // Format the time with AM/PM
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }).format(date);
};

export const formatTimeSlot = (slot: TimeSlot): string => {
  const formattedDate = formatDate(slot.date);
  const formattedStartTime = formatTime(slot.startTime);
  const formattedEndTime = formatTime(slot.endTime);
  
  return `${formattedDate}, ${formattedStartTime} - ${formattedEndTime}`;
};

export const generateTimeSlots = (date: Date, startHour: number = 8, endHour: number = 18): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const dateStr = date.toISOString().split('T')[0];
  
  for (let hour = startHour; hour < endHour; hour += 2) {
    slots.push({
      id: `slot-${dateStr}-${hour}`,
      date: dateStr,
      startTime: `${hour}:00`,
      endTime: `${hour + 2}:00`,
    });
  }
  
  return slots;
};

export const getNext7Days = (): Date[] => {
  const dates: Date[] = [];
  const today = new Date();
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push(date);
  }
  
  return dates;
};

export const getDayName = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date);
};
