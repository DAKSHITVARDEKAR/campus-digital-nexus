
import { databases, DB_ID, FACILITIES_COLLECTION, BOOKINGS_COLLECTION } from './appwriteService';
import { ID, Query } from 'appwrite';

export interface Facility {
  id: string;
  name: string;
  description: string;
  location: string;
  capacity: number;
  amenities: string[];
  imageUrl?: string;
  availableFrom: string; // Time format: "HH:MM"
  availableTo: string;   // Time format: "HH:MM"
  isActive: boolean;
}

export interface BookingRequest {
  id: string;
  facilityId: string;
  userId: string;
  userName: string;
  userEmail: string;
  date: string;  // Format: "YYYY-MM-DD"
  startTime: string; // Format: "HH:MM"
  endTime: string;   // Format: "HH:MM"
  purpose: string;
  attendees: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
  notes?: string;
  rejectionReason?: string;
}

export const mapFacilityFromDocument = (doc: any): Facility => {
  return {
    id: doc.$id,
    name: doc.name,
    description: doc.description,
    location: doc.location,
    capacity: doc.capacity,
    amenities: doc.amenities || [],
    imageUrl: doc.imageUrl,
    availableFrom: doc.availableFrom,
    availableTo: doc.availableTo,
    isActive: doc.isActive
  };
};

export const mapBookingFromDocument = (doc: any): BookingRequest => {
  return {
    id: doc.$id,
    facilityId: doc.facilityId,
    userId: doc.userId,
    userName: doc.userName,
    userEmail: doc.userEmail,
    date: doc.date,
    startTime: doc.startTime,
    endTime: doc.endTime,
    purpose: doc.purpose,
    attendees: doc.attendees,
    status: doc.status,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
    notes: doc.notes,
    rejectionReason: doc.rejectionReason
  };
};

export const getFacilities = async (): Promise<Facility[]> => {
  try {
    const response = await databases.listDocuments(
      DB_ID,
      FACILITIES_COLLECTION,
      [
        Query.equal('isActive', true),
        Query.orderAsc('name')
      ]
    );
    
    return response.documents.map(mapFacilityFromDocument);
  } catch (error) {
    console.error('Error fetching facilities:', error);
    throw error;
  }
};

export const getFacility = async (facilityId: string): Promise<Facility> => {
  try {
    const response = await databases.getDocument(
      DB_ID,
      FACILITIES_COLLECTION,
      facilityId
    );
    
    return mapFacilityFromDocument(response);
  } catch (error) {
    console.error(`Error fetching facility ${facilityId}:`, error);
    throw error;
  }
};

export const createBookingRequest = async (
  booking: Omit<BookingRequest, 'id' | 'status' | 'createdAt' | 'updatedAt'>
): Promise<BookingRequest> => {
  try {
    // First check for conflicts
    const conflicts = await checkBookingConflicts(
      booking.facilityId,
      booking.date,
      booking.startTime,
      booking.endTime
    );
    
    if (conflicts) {
      throw new Error('This facility is already booked during the requested time slot');
    }
    
    const now = new Date().toISOString();
    
    const response = await databases.createDocument(
      DB_ID,
      BOOKINGS_COLLECTION,
      ID.unique(),
      {
        ...booking,
        status: 'pending',
        createdAt: now,
        updatedAt: now
      }
    );
    
    return mapBookingFromDocument(response);
  } catch (error) {
    console.error('Error creating booking request:', error);
    throw error;
  }
};

export const getUserBookings = async (userId: string): Promise<BookingRequest[]> => {
  try {
    const response = await databases.listDocuments(
      DB_ID,
      BOOKINGS_COLLECTION,
      [
        Query.equal('userId', userId),
        Query.orderDesc('$createdAt')
      ]
    );
    
    return response.documents.map(mapBookingFromDocument);
  } catch (error) {
    console.error(`Error fetching bookings for user ${userId}:`, error);
    throw error;
  }
};

export const approveBooking = async (bookingId: string, approverNotes?: string): Promise<BookingRequest> => {
  try {
    const response = await databases.updateDocument(
      DB_ID,
      BOOKINGS_COLLECTION,
      bookingId,
      {
        status: 'approved',
        notes: approverNotes || '',
        updatedAt: new Date().toISOString()
      }
    );
    
    return mapBookingFromDocument(response);
  } catch (error) {
    console.error(`Error approving booking ${bookingId}:`, error);
    throw error;
  }
};

export const rejectBooking = async (bookingId: string, rejectionReason: string): Promise<BookingRequest> => {
  try {
    const response = await databases.updateDocument(
      DB_ID,
      BOOKINGS_COLLECTION,
      bookingId,
      {
        status: 'rejected',
        rejectionReason,
        updatedAt: new Date().toISOString()
      }
    );
    
    return mapBookingFromDocument(response);
  } catch (error) {
    console.error(`Error rejecting booking ${bookingId}:`, error);
    throw error;
  }
};

export const checkBookingConflicts = async (
  facilityId: string,
  date: string,
  startTime: string,
  endTime: string
): Promise<boolean> => {
  try {
    const response = await databases.listDocuments(
      DB_ID,
      BOOKINGS_COLLECTION,
      [
        Query.equal('facilityId', facilityId),
        Query.equal('date', date),
        Query.equal('status', 'approved')
      ]
    );
    
    // Check for time conflicts
    for (const booking of response.documents) {
      const bookingStart = booking.startTime;
      const bookingEnd = booking.endTime;
      
      // Check if requested time overlaps with existing booking
      if (
        (startTime >= bookingStart && startTime < bookingEnd) || // Start time is within existing booking
        (endTime > bookingStart && endTime <= bookingEnd) ||     // End time is within existing booking
        (startTime <= bookingStart && endTime >= bookingEnd)     // Request completely overlaps existing booking
      ) {
        return true; // Conflict found
      }
    }
    
    return false; // No conflicts
  } catch (error) {
    console.error(`Error checking booking conflicts for facility ${facilityId}:`, error);
    throw error;
  }
};

export const getPendingBookings = async (): Promise<BookingRequest[]> => {
  try {
    const response = await databases.listDocuments(
      DB_ID,
      BOOKINGS_COLLECTION,
      [
        Query.equal('status', 'pending'),
        Query.orderAsc('date')
      ]
    );
    
    return response.documents.map(mapBookingFromDocument);
  } catch (error) {
    console.error('Error fetching pending bookings:', error);
    throw error;
  }
};
