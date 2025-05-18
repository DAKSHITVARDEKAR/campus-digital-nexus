import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAppwriteAuth } from './useAppwriteAuth';
import { Facility, BookingRequest, getFacilities, getFacility, createBookingRequest, getUserBookings, approveBooking, rejectBooking, getPendingBookings } from '@/services/facilityService';

interface UseFacilityBookingProps {
  facilityId?: string;
}

export const useFacilityBooking = ({ facilityId }: UseFacilityBookingProps = {}) => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [facility, setFacility] = useState<Facility | null>(null);
  const [userBookings, setUserBookings] = useState<BookingRequest[]>([]);
  const [pendingBookings, setPendingBookings] = useState<BookingRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAppwriteAuth();
  
  // Fetch all facilities
  const fetchAllFacilities = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await getFacilities();
      setFacilities(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch facilities');
      toast({
        title: 'Error',
        description: err.message || 'Failed to fetch facilities',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch a single facility by ID
  const fetchFacility = async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await getFacility(id);
      setFacility(data);
    } catch (err: any) {
      setError(err.message || `Failed to fetch facility with ID: ${id}`);
      toast({
        title: 'Error',
        description: err.message || `Failed to fetch facility with ID: ${id}`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch bookings for the current user
  const fetchUserBookings = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await getUserBookings(user.$id);
      setUserBookings(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch your bookings');
      toast({
        title: 'Error',
        description: err.message || 'Failed to fetch your bookings',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch pending bookings (for faculty/admin)
  const fetchPendingBookings = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await getPendingBookings();
      setPendingBookings(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch pending bookings');
      toast({
        title: 'Error',
        description: err.message || 'Failed to fetch pending bookings',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Create a new booking request
  const createBooking = async (bookingData: Omit<BookingRequest, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    setError(null);
    
    try {
      const newBooking = await createBookingRequest(bookingData);
      
      // Update user bookings
      setUserBookings(prev => [newBooking, ...prev]);
      
      toast({
        title: 'Booking Request Submitted',
        description: 'Your booking request has been submitted for approval.',
      });
      
      return newBooking;
    } catch (err: any) {
      setError(err.message || 'Failed to create booking request');
      toast({
        title: 'Error',
        description: err.message || 'Failed to create booking request',
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Approve a booking request (faculty/admin)
  const approveBookingRequest = async (bookingId: string, notes?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedBooking = await approveBooking(bookingId, notes);
      
      // Update pending bookings
      setPendingBookings(prev => prev.filter(booking => booking.id !== bookingId));
      
      toast({
        title: 'Booking Approved',
        description: 'The booking request has been approved.',
      });
      
      return updatedBooking;
    } catch (err: any) {
      setError(err.message || `Failed to approve booking ${bookingId}`);
      toast({
        title: 'Error',
        description: err.message || `Failed to approve booking ${bookingId}`,
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Reject a booking request (faculty/admin)
  const rejectBookingRequest = async (bookingId: string, reason: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedBooking = await rejectBooking(bookingId, reason);
      
      // Update pending bookings
      setPendingBookings(prev => prev.filter(booking => booking.id !== bookingId));
      
      toast({
        title: 'Booking Rejected',
        description: 'The booking request has been rejected.',
      });
      
      return updatedBooking;
    } catch (err: any) {
      setError(err.message || `Failed to reject booking ${bookingId}`);
      toast({
        title: 'Error',
        description: err.message || `Failed to reject booking ${bookingId}`,
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch data on initial render
  useEffect(() => {
    // If facilityId is provided, fetch that specific facility
    if (facilityId) {
      fetchFacility(facilityId);
    } else {
      // Otherwise fetch all facilities
      fetchAllFacilities();
    }
    
    // If user is logged in, fetch their bookings
    if (user) {
      fetchUserBookings();
    }
  }, [facilityId, user]);
  
  return {
    facilities,
    facility,
    userBookings,
    pendingBookings,
    loading,
    error,
    fetchAllFacilities,
    fetchFacility,
    fetchUserBookings,
    fetchPendingBookings,
    createBooking,
    approveBookingRequest,
    rejectBookingRequest
  };
};
