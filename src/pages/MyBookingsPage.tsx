import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { format } from 'date-fns';
import { Calendar, Clock, MapPin, Users, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from '@/components/ui/use-toast';

// Mock booking data - would be fetched from Firestore in a real implementation
const myBookings = [
  {
    id: '1',
    facilityId: '1',
    facilityName: 'Main Auditorium',
    facilityImage: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=1469',
    facilityLocation: 'Main Campus, Building A',
    date: '2025-04-15',
    timeSlot: '14:00 - 16:00',
    purpose: 'Department Presentation',
    attendees: 120,
    status: 'approved',
    notes: 'Please ensure AV equipment is set up.',
    approvedBy: 'Dr. Johnson',
    approvedAt: '2025-04-08T14:32:00Z',
  },
  {
    id: '2',
    facilityId: '3',
    facilityName: 'Tennis Court',
    facilityImage: 'https://images.unsplash.com/photo-1564769662533-4f00a87b4056?auto=format&fit=crop&q=80&w=1029',
    facilityLocation: 'Sports Complex',
    date: '2025-04-12',
    timeSlot: '16:00 - 18:00',
    purpose: 'Tennis Club Practice',
    attendees: 4,
    status: 'pending',
    notes: 'Will need rackets and balls.',
  },
  {
    id: '3',
    facilityId: '2',
    facilityName: 'Conference Room A',
    facilityImage: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&q=80&w=1025',
    facilityLocation: 'Main Campus, Building B',
    date: '2025-04-08',
    timeSlot: '10:00 - 12:00',
    purpose: 'Project Meeting',
    attendees: 15,
    status: 'rejected',
    notes: 'Discussing semester project progress.',
    rejectedBy: 'Dr. Smith',
    rejectedAt: '2025-04-05T09:15:00Z',
    rejectionReason: 'Room already reserved for faculty meeting.',
  },
  {
    id: '4',
    facilityId: '1',
    facilityName: 'Main Auditorium',
    facilityImage: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=1469',
    facilityLocation: 'Main Campus, Building A',
    date: '2025-03-25',
    timeSlot: '10:00 - 14:00',
    purpose: 'Engineering Department Seminar',
    attendees: 200,
    status: 'completed',
    notes: 'Annual engineering research seminar.',
    approvedBy: 'Dr. Johnson',
    approvedAt: '2025-03-15T11:20:00Z',
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'approved':
      return 'bg-green-100 text-green-800 border-green-100';
    case 'pending':
      return 'bg-amber-100 text-amber-800 border-amber-100';
    case 'rejected':
      return 'bg-red-100 text-red-800 border-red-100';
    case 'completed':
      return 'bg-blue-100 text-blue-800 border-blue-100';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-100';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'approved':
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    case 'pending':
      return <Clock className="h-5 w-5 text-amber-600" />;
    case 'rejected':
      return <XCircle className="h-5 w-5 text-red-600" />;
    case 'completed':
      return <CheckCircle className="h-5 w-5 text-blue-600" />;
    default:
      return null;
  }
};

const formatDate = (dateString: string) => {
  const [year, month, day] = dateString.split('-').map(Number);
  return format(new Date(year, month - 1, day), 'MMMM d, yyyy');
};

const MyBookingsPage = () => {
  const { toast } = useToast();
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [bookings, setBookings] = useState(myBookings);
  
  const handleViewDetails = (booking: any) => {
    setSelectedBooking(booking);
    setDetailsDialogOpen(true);
  };
  
  const handleCancelRequest = (booking: any) => {
    setSelectedBooking(booking);
    setCancelDialogOpen(true);
  };

  const handleCancelBooking = (bookingId: string) => {
    setCancellingId(bookingId);
    
    // Using Appwrite functions instead of Firebase Cloud Functions
    setTimeout(() => {
      // Update the booking list after successful cancellation
      setBookings((current) => current.filter((booking) => booking.id !== bookingId));
      
      setCancellingId(null);
      toast({
        title: "Booking Cancelled",
        description: "Your facility booking has been cancelled successfully."
      });
    }, 1000);
  };
  
  const pendingBookings = bookings.filter(booking => booking.status === 'pending');
  const approvedBookings = bookings.filter(booking => booking.status === 'approved');
  const otherBookings = bookings.filter(booking => !['pending', 'approved'].includes(booking.status));
  
  const BookingCard = ({ booking }: { booking: any }) => (
    <Card className="overflow-hidden h-full">
      <div className="h-32 overflow-hidden">
        <img 
          src={booking.facilityImage} 
          alt={booking.facilityName}
          className="w-full h-full object-cover"
        />
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base font-semibold">{booking.facilityName}</CardTitle>
          <Badge className={getStatusColor(booking.status)}>
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2 text-sm">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1 text-gray-500" />
            <span>{formatDate(booking.date)}</span>
          </div>
          
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1 text-gray-500" />
            <span>{booking.timeSlot}</span>
          </div>
          
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-1 text-gray-500" />
            <span>{booking.facilityLocation}</span>
          </div>
        </div>
        
        <div className="flex flex-col space-y-1">
          <p className="text-sm font-medium">Purpose:</p>
          <p className="text-sm text-gray-600 line-clamp-2">{booking.purpose}</p>
        </div>
        
        <div className="flex justify-between">
          <Button variant="outline" size="sm" onClick={() => handleViewDetails(booking)}>
            View Details
          </Button>
          
          {booking.status === 'pending' && (
            <Button 
              variant="outline" 
              size="sm" 
              className="text-red-600 hover:text-red-700"
              onClick={() => handleCancelRequest(booking)}
            >
              Cancel
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
  
  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">My Facility Bookings</h1>
        <p className="text-muted-foreground">View and manage your facility booking requests.</p>
      </div>
      
      <Tabs defaultValue="pending" className="mb-6">
        <TabsList>
          <TabsTrigger value="pending">Pending ({pendingBookings.length})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({approvedBookings.length})</TabsTrigger>
          <TabsTrigger value="all">All Bookings ({bookings.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending">
          {pendingBookings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {pendingBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </div>
          ) : (
            <Alert className="mt-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>No pending bookings</AlertTitle>
              <AlertDescription>
                You don't have any pending booking requests at the moment.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>
        
        <TabsContent value="approved">
          {approvedBookings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {approvedBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </div>
          ) : (
            <Alert className="mt-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>No approved bookings</AlertTitle>
              <AlertDescription>
                You don't have any approved booking requests at the moment.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>
        
        <TabsContent value="all">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {bookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Booking Details Dialog */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        {selectedBooking && (
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Booking Details</DialogTitle>
              <DialogDescription>
                Details for your booking at {selectedBooking.facilityName}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <img 
                  src={selectedBooking.facilityImage} 
                  alt={selectedBooking.facilityName}
                  className="w-full rounded-lg object-cover h-40"
                />
                
                <div className="mt-4 space-y-3">
                  <div className="flex justify-between">
                    <h3 className="font-medium">Facility:</h3>
                    <p>{selectedBooking.facilityName}</p>
                  </div>
                  
                  <div className="flex justify-between">
                    <h3 className="font-medium">Location:</h3>
                    <p>{selectedBooking.facilityLocation}</p>
                  </div>
                  
                  <div className="flex justify-between">
                    <h3 className="font-medium">Date:</h3>
                    <p>{formatDate(selectedBooking.date)}</p>
                  </div>
                  
                  <div className="flex justify-between">
                    <h3 className="font-medium">Time:</h3>
                    <p>{selectedBooking.timeSlot}</p>
                  </div>
                  
                  <div className="flex justify-between">
                    <h3 className="font-medium">Attendees:</h3>
                    <p>{selectedBooking.attendees}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-1">Purpose:</h3>
                  <p className="text-gray-700">{selectedBooking.purpose}</p>
                </div>
                
                {selectedBooking.notes && (
                  <div>
                    <h3 className="font-medium mb-1">Additional Notes:</h3>
                    <p className="text-gray-700">{selectedBooking.notes}</p>
                  </div>
                )}
                
                <div className="pt-4">
                  <div className="flex items-center mb-2">
                    {getStatusIcon(selectedBooking.status)}
                    <h3 className="font-medium ml-2">Status: <span className="font-normal">{selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}</span></h3>
                  </div>
                  
                  {selectedBooking.status === 'approved' && (
                    <div className="text-sm text-gray-600">
                      <p>Approved by {selectedBooking.approvedBy}</p>
                      <p>on {format(new Date(selectedBooking.approvedAt), 'MMMM d, yyyy h:mm a')}</p>
                    </div>
                  )}
                  
                  {selectedBooking.status === 'rejected' && (
                    <div>
                      <p className="text-sm text-gray-600">Rejected by {selectedBooking.rejectedBy}</p>
                      <p className="text-sm text-gray-600">on {format(new Date(selectedBooking.rejectedAt), 'MMMM d, yyyy h:mm a')}</p>
                      <p className="mt-2 text-red-600">Reason: {selectedBooking.rejectionReason}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setDetailsDialogOpen(false)}>
                Close
              </Button>
              
              {selectedBooking.status === 'pending' && (
                <Button 
                  variant="destructive" 
                  onClick={() => {
                    setDetailsDialogOpen(false);
                    handleCancelRequest(selectedBooking);
                  }}
                >
                  Cancel Booking
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
      
      {/* Cancel Confirmation Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        {selectedBooking && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cancel Booking Request</DialogTitle>
              <DialogDescription>
                Are you sure you want to cancel your booking request for {selectedBooking.facilityName} on {formatDate(selectedBooking.date)} at {selectedBooking.timeSlot}?
              </DialogDescription>
            </DialogHeader>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setCancelDialogOpen(false)} disabled={cancellingId === selectedBooking.id}>
                No, Keep Reservation
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => handleCancelBooking(selectedBooking.id)}
                disabled={cancellingId === selectedBooking.id}
              >
                {cancellingId === selectedBooking.id ? (
                  <>
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                    Cancelling...
                  </>
                ) : (
                  'Yes, Cancel Booking'
                )}
              </Button>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </Layout>
  );
};

export default MyBookingsPage;
