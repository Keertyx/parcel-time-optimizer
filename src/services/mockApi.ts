
import { Person, Parcel, TimeSlot } from '../context/ParcelContext';

// Generate a random tracking number
const generateTrackingNumber = (): string => {
  return `PD-${Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, '0')}`;
};

// Generate a random ID
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};

// Mock users data
const mockUsers: Person[] = [
  {
    id: 'user1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '555-1234',
    address: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'USA',
    },
  },
  {
    id: 'user2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '555-5678',
    address: {
      street: '456 Elm St',
      city: 'Boston',
      state: 'MA',
      postalCode: '02108',
      country: 'USA',
    },
  },
  {
    id: 'user3',
    name: 'Robert Johnson',
    email: 'robert@example.com',
    phone: '555-9012',
    address: {
      street: '789 Oak St',
      city: 'Chicago',
      state: 'IL',
      postalCode: '60007',
      country: 'USA',
    },
  },
];

// Mock parcels data
const mockParcels: Parcel[] = [
  {
    id: 'parcel1',
    trackingNumber: 'PD-123456',
    sender: mockUsers[0],
    receiver: mockUsers[1],
    weight: 2.5,
    dimensions: {
      length: 10,
      width: 15,
      height: 5,
    },
    description: 'Books and documents',
    status: 'pending',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    deliverySlot: null,
    acceptedTimeSlot: false,
  },
  {
    id: 'parcel2',
    trackingNumber: 'PD-234567',
    sender: mockUsers[1],
    receiver: mockUsers[2],
    weight: 5.2,
    dimensions: {
      length: 20,
      width: 25,
      height: 15,
    },
    description: 'Electronic equipment',
    status: 'in-transit',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
    deliverySlot: null,
    acceptedTimeSlot: false,
  },
  {
    id: 'parcel3',
    trackingNumber: 'PD-345678',
    sender: mockUsers[2],
    receiver: mockUsers[0],
    weight: 1.1,
    dimensions: {
      length: 8,
      width: 10,
      height: 3,
    },
    description: 'Clothing items',
    status: 'delivered',
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(), // 7 days ago
    deliverySlot: {
      id: 'slot1',
      date: '2025-05-01',
      startTime: '14:00',
      endTime: '16:00',
    },
    acceptedTimeSlot: true,
  },
];

// Mock time slot data based on user's past behavior
const mockUserTimeSlotPreferences: {
  [userId: string]: { day: number; hour: number; count: number }[];
} = {
  user1: [
    { day: 1, hour: 10, count: 5 }, // Monday 10AM
    { day: 3, hour: 14, count: 8 }, // Wednesday 2PM
    { day: 5, hour: 16, count: 3 }, // Friday 4PM
  ],
  user2: [
    { day: 2, hour: 9, count: 7 },  // Tuesday 9AM
    { day: 4, hour: 13, count: 4 }, // Thursday 1PM
    { day: 6, hour: 11, count: 6 }, // Saturday 11AM
  ],
  user3: [
    { day: 1, hour: 15, count: 2 }, // Monday 3PM
    { day: 2, hour: 17, count: 9 }, // Tuesday 5PM
    { day: 5, hour: 10, count: 4 }, // Friday 10AM
  ],
};

// Mock API functions
export const mockApi = {
  // Get all users
  getUsers: async (): Promise<Person[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockUsers);
      }, 300);
    });
  },

  // Get all parcels
  getParcels: async (): Promise<Parcel[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockParcels);
      }, 500);
    });
  },

  // Get parcels by receiver ID
  getParcelsByReceiverId: async (receiverId: string): Promise<Parcel[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filteredParcels = mockParcels.filter((p) => p.receiver.id === receiverId);
        resolve(filteredParcels);
      }, 400);
    });
  },

  // Create a new parcel
  createParcel: async (parcelData: Omit<Parcel, 'id' | 'trackingNumber' | 'createdAt' | 'acceptedTimeSlot'>): Promise<Parcel> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newParcel: Parcel = {
          ...parcelData,
          id: generateId(),
          trackingNumber: generateTrackingNumber(),
          createdAt: new Date().toISOString(),
          acceptedTimeSlot: false,
        };
        mockParcels.push(newParcel);
        resolve(newParcel);
      }, 600);
    });
  },

  // Update parcel status
  updateParcelStatus: async (parcelId: string, status: Parcel['status']): Promise<Parcel> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const parcelIndex = mockParcels.findIndex((p) => p.id === parcelId);
        if (parcelIndex !== -1) {
          mockParcels[parcelIndex] = {
            ...mockParcels[parcelIndex],
            status,
          };
          resolve(mockParcels[parcelIndex]);
        } else {
          reject(new Error('Parcel not found'));
        }
      }, 400);
    });
  },

  // Update parcel delivery slot
  updateParcelDeliverySlot: async (parcelId: string, timeSlot: TimeSlot): Promise<Parcel> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const parcelIndex = mockParcels.findIndex((p) => p.id === parcelId);
        if (parcelIndex !== -1) {
          mockParcels[parcelIndex] = {
            ...mockParcels[parcelIndex],
            deliverySlot: timeSlot,
            acceptedTimeSlot: true,
          };
          resolve(mockParcels[parcelIndex]);
        } else {
          reject(new Error('Parcel not found'));
        }
      }, 400);
    });
  },

  // Get recommended time slots based on receiver's history
  getRecommendedTimeSlots: async (receiverId: string): Promise<TimeSlot[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const preferences = mockUserTimeSlotPreferences[receiverId] || [];
        // Sort by preference count
        const sortedPreferences = [...preferences].sort((a, b) => b.count - a.count);
        
        // Generate time slots for the next 7 days based on preferences
        const today = new Date();
        const recommendedSlots: TimeSlot[] = sortedPreferences.slice(0, 3).map((pref, index) => {
          // Find the next occurrence of the preferred day
          const targetDay = pref.day;
          const currentDay = today.getDay() || 7; // Convert Sunday (0) to 7 for easier calculation
          const daysToAdd = (targetDay - currentDay + 7) % 7 || 7; // If it's the same day, go to next week
          
          const slotDate = new Date(today);
          slotDate.setDate(today.getDate() + daysToAdd);
          
          // Format the date and time
          const formattedDate = slotDate.toISOString().split('T')[0];
          const startHour = pref.hour;
          const endHour = startHour + 2;
          
          const startTime = `${startHour}:00`;
          const endTime = `${endHour}:00`;
          
          return {
            id: `slot-${index + 1}`,
            date: formattedDate,
            startTime,
            endTime,
          };
        });
        
        resolve(recommendedSlots);
      }, 700);
    });
  },

  // Get optimal delivery routes
  getOptimalDeliveryRoute: async (parcelIds: string[]): Promise<string[]> => {
    // This is a mock implementation of a route optimization algorithm
    // In a real system, this would use actual geocoordinates and a proper algorithm
    return new Promise((resolve) => {
      setTimeout(() => {
        // Just return the IDs in a slightly different order to simulate optimization
        const shuffled = [...parcelIds].sort(() => Math.random() - 0.5);
        resolve(shuffled);
      }, 800);
    });
  },
};
