
import React, { useEffect } from 'react';
import { useParcelContext } from '@/context/ParcelContext';
import { mockApi } from '@/services/mockApi';
import ParcelForm from '@/components/ParcelForm';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useAuth } from '@/context/AuthContext';

const SenderModule = () => {
  const { state, dispatch } = useParcelContext();
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const users = await mockApi.getUsers();
        dispatch({ type: 'SET_USERS', payload: users });
      } catch (error) {
        console.error('Failed to fetch users', error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load users' });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };
    
    fetchData();
  }, [dispatch]);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Send a Parcel</h1>
          <p className="text-muted-foreground">
            Fill out the form below to send a parcel. As a logged-in sender, you only need to specify the receiver details.
          </p>
        </div>
        
        {state.loading ? (
          <div className="flex justify-center p-16">
            <LoadingSpinner size={50} />
          </div>
        ) : (
          <ParcelForm hideSenderForm={true} currentUser={user} />
        )}
      </div>
    </div>
  );
};

export default SenderModule;
