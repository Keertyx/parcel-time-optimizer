
import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// Types
export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Person {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: Address;
}

export interface TimeSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
}

export interface Parcel {
  id: string;
  trackingNumber: string;
  sender: Person;
  receiver: Person;
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  description: string;
  status: 'pending' | 'in-transit' | 'delivered';
  createdAt: string;
  deliverySlot: TimeSlot | null;
  acceptedTimeSlot: boolean;
}

// State
interface ParcelState {
  parcels: Parcel[];
  users: Person[];
  loading: boolean;
  error: string | null;
  selectedParcel: Parcel | null;
}

// Initial State
const initialState: ParcelState = {
  parcels: [],
  users: [],
  loading: false,
  error: null,
  selectedParcel: null,
};

// Actions
type ParcelAction =
  | { type: 'SET_PARCELS'; payload: Parcel[] }
  | { type: 'ADD_PARCEL'; payload: Parcel }
  | { type: 'UPDATE_PARCEL'; payload: Parcel }
  | { type: 'SET_USERS'; payload: Person[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SELECT_PARCEL'; payload: Parcel | null }
  | { type: 'UPDATE_DELIVERY_SLOT'; payload: { parcelId: string; timeSlot: TimeSlot } };

// Reducer
const parcelReducer = (state: ParcelState, action: ParcelAction): ParcelState => {
  switch (action.type) {
    case 'SET_PARCELS':
      return { ...state, parcels: action.payload };
    case 'ADD_PARCEL':
      return { ...state, parcels: [...state.parcels, action.payload] };
    case 'UPDATE_PARCEL':
      return {
        ...state,
        parcels: state.parcels.map((p) => (p.id === action.payload.id ? action.payload : p)),
      };
    case 'SET_USERS':
      return { ...state, users: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SELECT_PARCEL':
      return { ...state, selectedParcel: action.payload };
    case 'UPDATE_DELIVERY_SLOT':
      return {
        ...state,
        parcels: state.parcels.map((p) =>
          p.id === action.payload.parcelId
            ? { ...p, deliverySlot: action.payload.timeSlot, acceptedTimeSlot: true }
            : p
        ),
      };
    default:
      return state;
  }
};

// Context
interface ParcelContextType {
  state: ParcelState;
  dispatch: React.Dispatch<ParcelAction>;
}

const ParcelContext = createContext<ParcelContextType | undefined>(undefined);

// Provider
export const ParcelProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(parcelReducer, initialState);

  return (
    <ParcelContext.Provider value={{ state, dispatch }}>
      {children}
    </ParcelContext.Provider>
  );
};

// Custom Hook
export const useParcelContext = (): ParcelContextType => {
  const context = useContext(ParcelContext);
  if (!context) {
    throw new Error('useParcelContext must be used within a ParcelProvider');
  }
  return context;
};
