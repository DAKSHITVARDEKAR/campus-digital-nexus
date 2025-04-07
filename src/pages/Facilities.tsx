
import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { FacilityCard } from '@/components/facilities/FacilityCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

// Mock data
const allFacilities = [
  {
    id: '1',
    name: 'Main Auditorium',
    description: 'Fully equipped auditorium with stage, sound system, and seating for 300 people.',
    image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=1469',
    location: 'Main Campus, Building A',
    capacity: 300,
    status: 'available' as const,
  },
  {
    id: '2',
    name: 'Conference Room A',
    description: 'Modern conference room with projector, whiteboard, and seating for 30 people.',
    image: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&q=80&w=1025',
    location: 'Main Campus, Building B',
    capacity: 30,
    status: 'booked' as const,
    nextAvailable: 'Apr 10, 2023',
  },
  {
    id: '3',
    name: 'Tennis Court',
    description: 'Outdoor tennis court with proper lighting for evening play.',
    image: 'https://images.unsplash.com/photo-1564769662533-4f00a87b4056?auto=format&fit=crop&q=80&w=1029',
    location: 'Sports Complex',
    capacity: 4,
    status: 'available' as const,
  },
  {
    id: '4',
    name: 'Computer Lab',
    description: 'Computer lab with 50 workstations and high-speed internet.',
    image: 'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&q=80&w=1170',
    location: 'Tech Building, 2nd Floor',
    capacity: 50,
    status: 'maintenance' as const,
    nextAvailable: 'Apr 15, 2023',
  },
  {
    id: '5',
    name: 'Basketball Court',
    description: 'Indoor basketball court with seating for spectators.',
    image: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?auto=format&fit=crop&q=80&w=1169',
    location: 'Sports Complex',
    capacity: 20,
    status: 'available' as const,
  },
  {
    id: '6',
    name: 'Seminar Hall',
    description: 'Spacious seminar hall for large gatherings and presentations.',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1170',
    location: 'Main Campus, Building C',
    capacity: 150,
    status: 'booked' as const,
    nextAvailable: 'Apr 12, 2023',
  },
];

const myBookings = [
  {
    id: '1',
    facility: 'Conference Room A',
    date: 'Apr 8, 2023',
    time: '10:00 AM - 12:00 PM',
    purpose: 'Project Meeting',
    status: 'approved',
  },
  {
    id: '2',
    facility: 'Main Auditorium',
    date: 'Apr 15, 2023',
    time: '2:00 PM - 5:00 PM',
    purpose: 'Department Presentation',
    status: 'pending',
  },
  {
    id: '3',
    facility: 'Tennis Court',
    date: 'Apr 10, 2023',
    time: '4:00 PM - 6:00 PM',
    purpose: 'Tennis Club Practice',
    status: 'rejected',
    reason: 'Facility already booked for maintenance',
  },
];

const Facilities = () => {
  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Campus Facilities</h1>
        <p className="text-muted-foreground">Browse and book campus facilities for your events and activities.</p>
      </div>
      
      <Tabs defaultValue="all" className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All Facilities</TabsTrigger>
          <TabsTrigger value="available">Available Now</TabsTrigger>
          <TabsTrigger value="mybookings">My Bookings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {allFacilities.map((facility) => (
              <FacilityCard 
                key={facility.id}
                id={facility.id}
                name={facility.name}
                description={facility.description}
                image={facility.image}
                location={facility.location}
                capacity={facility.capacity}
                status={facility.status}
                nextAvailable={facility.nextAvailable}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="available">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {allFacilities
              .filter(facility => facility.status === 'available')
              .map((facility) => (
                <FacilityCard 
                  key={facility.id}
                  id={facility.id}
                  name={facility.name}
                  description={facility.description}
                  image={facility.image}
                  location={facility.location}
                  capacity={facility.capacity}
                  status={facility.status}
                  nextAvailable={facility.nextAvailable}
                />
              ))
            }
          </div>
        </TabsContent>
        
        <TabsContent value="mybookings">
          <div className="mt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Facility</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {myBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">{booking.facility}</TableCell>
                    <TableCell>{booking.date}</TableCell>
                    <TableCell>{booking.time}</TableCell>
                    <TableCell>{booking.purpose}</TableCell>
                    <TableCell>
                      <Badge className={
                        booking.status === 'approved' 
                          ? 'bg-green-100 text-green-800 border-green-100' 
                          : booking.status === 'pending'
                            ? 'bg-amber-100 text-amber-800 border-amber-100'
                            : 'bg-red-100 text-red-800 border-red-100'
                      }>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {booking.status === 'pending' && (
                        <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                          Cancel
                        </button>
                      )}
                      {booking.status === 'rejected' && booking.reason && (
                        <span className="text-sm text-gray-500" title={booking.reason}>
                          View Reason
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-green-800 mb-2">Facility Booking Guidelines</h2>
        <ul className="list-disc pl-5 text-green-700 space-y-1">
          <li>Bookings must be made at least 48 hours in advance</li>
          <li>Cancellations should be made at least 24 hours before the scheduled time</li>
          <li>Facilities must be left in the same condition as they were found</li>
          <li>For special requirements, please mention in the booking purpose</li>
          <li>Recurring bookings need approval from the respective department head</li>
        </ul>
      </div>
    </Layout>
  );
};

export default Facilities;
