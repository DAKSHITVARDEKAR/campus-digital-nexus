
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
import { Button } from '@/components/ui/button';
import { 
  Calendar as CalendarIcon, 
  ClipboardList, 
  Filter, 
  Search, 
  MapPin, 
  Users, 
  Building, 
  CalendarDays,
  CheckCircle2, 
  XCircle,
  Clock,
  ListFilter
} from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { format } from 'date-fns';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

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
    amenities: ['Projector', 'Sound System', 'Stage Lighting', 'Microphones', 'Air Conditioning'],
    category: 'Event Space',
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
    amenities: ['Projector', 'Whiteboard', 'Video Conferencing', 'Air Conditioning'],
    category: 'Meeting Room',
  },
  {
    id: '3',
    name: 'Tennis Court',
    description: 'Outdoor tennis court with proper lighting for evening play.',
    image: 'https://images.unsplash.com/photo-1564769662533-4f00a87b4056?auto=format&fit=crop&q=80&w=1029',
    location: 'Sports Complex',
    capacity: 4,
    status: 'available' as const,
    amenities: ['Floodlights', 'Equipment Rental', 'Changing Rooms', 'Water Fountain'],
    category: 'Sports Facility',
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
    amenities: ['High-Speed Internet', 'Printing Services', 'Specialized Software', 'Projector'],
    category: 'Academic',
  },
  {
    id: '5',
    name: 'Basketball Court',
    description: 'Indoor basketball court with seating for spectators.',
    image: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?auto=format&fit=crop&q=80&w=1169',
    location: 'Sports Complex',
    capacity: 20,
    status: 'available' as const,
    amenities: ['Scoreboard', 'Spectator Seating', 'Equipment Rental', 'Changing Rooms'],
    category: 'Sports Facility',
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
    amenities: ['Projector', 'Sound System', 'Podium', 'Air Conditioning', 'Flexible Seating'],
    category: 'Event Space',
  },
  {
    id: '7',
    name: 'Chemistry Lab',
    description: 'Fully equipped chemistry laboratory for academic and research purposes.',
    image: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&q=80&w=1587',
    location: 'Science Building, 3rd Floor',
    capacity: 25,
    status: 'available' as const,
    amenities: ['Chemical Storage', 'Fume Hoods', 'Emergency Shower', 'Safety Equipment'],
    category: 'Academic',
  },
  {
    id: '8',
    name: 'Dance Studio',
    description: 'Spacious studio with mirrors, sound system, and sprung floor for dance practice.',
    image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80&w=1469',
    location: 'Arts Building, 1st Floor',
    capacity: 30,
    status: 'available' as const,
    amenities: ['Mirrors', 'Sound System', 'Sprung Floor', 'Changing Rooms', 'Water Fountain'],
    category: 'Arts',
  },
];

// Booking data
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

// Calendar data - mocked bookings for calendar view
const calendarBookings = [
  { id: 1, facilityId: '1', title: 'Engineering Department Seminar', date: '2025-04-10', time: '10:00 - 14:00' },
  { id: 2, facilityId: '2', title: 'Project Meeting', date: '2025-04-08', time: '10:00 - 12:00' },
  { id: 3, facilityId: '3', title: 'Tennis Club Practice', date: '2025-04-10', time: '16:00 - 18:00' },
  { id: 4, facilityId: '1', title: 'Freshers Welcome', date: '2025-04-15', time: '14:00 - 17:00' },
  { id: 5, facilityId: '5', title: 'Basketball Tournament', date: '2025-04-12', time: '09:00 - 18:00' },
  { id: 6, facilityId: '6', title: 'Career Fair', date: '2025-04-14', time: '10:00 - 16:00' },
];

// Facility categories
const facilityCategories = [
  'All Categories',
  'Event Space',
  'Meeting Room',
  'Sports Facility',
  'Academic',
  'Arts',
];

// Locations
const facilityLocations = [
  'All Locations',
  'Main Campus, Building A',
  'Main Campus, Building B',
  'Main Campus, Building C',
  'Sports Complex',
  'Tech Building, 2nd Floor',
  'Science Building, 3rd Floor',
  'Arts Building, 1st Floor',
];

// Amenities
const facilityAmenities = [
  'Projector',
  'Sound System',
  'Whiteboard',
  'Air Conditioning',
  'Video Conferencing',
  'Equipment Rental',
  'Changing Rooms',
  'High-Speed Internet',
  'Flexible Seating',
];

const Facilities = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [selectedCapacity, setSelectedCapacity] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [viewMode, setViewMode] = useState<'calendar' | 'grid'>('grid');
  const [selectedFacility, setSelectedFacility] = useState<any>(null);
  const [facilityDetailsOpen, setFacilityDetailsOpen] = useState(false);

  // Filter facilities based on search query and filters
  const filteredFacilities = allFacilities.filter(facility => {
    const matchesSearch = facility.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        facility.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        facility.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All Categories' || facility.category === selectedCategory;
    
    const matchesLocation = selectedLocation === 'All Locations' || facility.location === selectedLocation;
    
    const matchesCapacity = selectedCapacity === '' ||
                          (selectedCapacity === '1-30' && facility.capacity <= 30) ||
                          (selectedCapacity === '31-100' && facility.capacity > 30 && facility.capacity <= 100) ||
                          (selectedCapacity === '101+' && facility.capacity > 100);
    
    const matchesAmenities = selectedAmenities.length === 0 ||
                          selectedAmenities.every(amenity => facility.amenities.includes(amenity));
    
    return matchesSearch && matchesCategory && matchesLocation && matchesCapacity && matchesAmenities;
  });

  // Get bookings for a selected date
  const getBookingsForDate = (date: Date) => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    return calendarBookings.filter(booking => booking.date === formattedDate);
  };

  // Handle facility details
  const handleViewFacilityDetails = (facility: any) => {
    setSelectedFacility(facility);
    setFacilityDetailsOpen(true);
  };

  // Reset filters
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All Categories');
    setSelectedLocation('All Locations');
    setSelectedCapacity('');
    setSelectedAmenities([]);
  };

  // Toggle amenity selection
  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(current =>
      current.includes(amenity)
        ? current.filter(a => a !== amenity)
        : [...current, amenity]
    );
  };

  return (
    <Layout>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Campus Facilities</h1>
          <p className="text-muted-foreground">Browse and book campus facilities for your events and activities.</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
          <Button asChild variant="outline" className="flex items-center gap-1">
            <Link to="/facilities/my-bookings">
              <ClipboardList className="h-4 w-4" />
              <span>My Bookings</span>
            </Link>
          </Button>
          
          <Button 
            variant="outline" 
            className="flex items-center gap-1"
            onClick={() => setViewMode(viewMode === 'grid' ? 'calendar' : 'grid')}
          >
            {viewMode === 'grid' ? (
              <>
                <CalendarDays className="h-4 w-4" />
                <span>Calendar View</span>
              </>
            ) : (
              <>
                <Building className="h-4 w-4" />
                <span>Grid View</span>
              </>
            )}
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search facilities..."
            className="w-full pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4" />
            <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
          </Button>
          
          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              {facilityLocations.map(location => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {selectedAmenities.length > 0 && (
            <Badge variant="outline" className="gap-1 px-2 py-1">
              <span>{selectedAmenities.length} Amenities</span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-4 w-4 p-0 ml-1"
                onClick={() => setSelectedAmenities([])}
              >
                <XCircle className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <CalendarIcon className="h-4 w-4" />
                <span>{selectedDate ? format(selectedDate, 'PPP') : 'Select Date'}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          
          {(searchQuery || selectedCategory !== 'All Categories' || selectedLocation !== 'All Locations' || 
            selectedCapacity || selectedAmenities.length > 0 || selectedDate) && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={resetFilters}
              className="text-muted-foreground"
            >
              Clear All
            </Button>
          )}
        </div>
      </div>
      
      {showFilters && (
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Advanced Filters</CardTitle>
            <CardDescription>
              Refine your search with these additional filters
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-sm font-medium mb-3">Category</h3>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {facilityCategories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-3">Capacity</h3>
                <Select value={selectedCapacity} onValueChange={setSelectedCapacity}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select capacity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any capacity</SelectItem>
                    <SelectItem value="1-30">1-30 people</SelectItem>
                    <SelectItem value="31-100">31-100 people</SelectItem>
                    <SelectItem value="101+">101+ people</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-3">Availability</h3>
                <Select defaultValue="all">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="available">Available Now</SelectItem>
                    <SelectItem value="today">Available Today</SelectItem>
                    <SelectItem value="this-week">Available This Week</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-sm font-medium mb-3">Amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {facilityAmenities.map(amenity => (
                  <div key={amenity} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`amenity-${amenity}`} 
                      checked={selectedAmenities.includes(amenity)}
                      onCheckedChange={() => toggleAmenity(amenity)}
                    />
                    <label 
                      htmlFor={`amenity-${amenity}`}
                      className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {amenity}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <Tabs defaultValue="all" className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All Facilities</TabsTrigger>
          <TabsTrigger value="available">Available Now</TabsTrigger>
          <TabsTrigger value="mybookings">Quick Booking Status</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {filteredFacilities.length > 0 ? (
                filteredFacilities.map((facility) => (
                  <div key={facility.id} className="group" onClick={() => handleViewFacilityDetails(facility)}>
                    <FacilityCard 
                      id={facility.id}
                      name={facility.name}
                      description={facility.description}
                      image={facility.image}
                      location={facility.location}
                      capacity={facility.capacity}
                      status={facility.status}
                      nextAvailable={facility.nextAvailable}
                    />
                  </div>
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-10 text-center">
                  <ListFilter className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No facilities found</h3>
                  <p className="text-muted-foreground mt-1">
                    Try adjusting your search or filters to find what you're looking for.
                  </p>
                  <Button onClick={resetFilters} className="mt-4">
                    Reset Filters
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="mt-6 bg-gray-50 rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">
                  {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Today'}
                </h2>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                {selectedDate ? (
                  getBookingsForDate(selectedDate).length > 0 ? (
                    getBookingsForDate(selectedDate).map(booking => {
                      const facility = allFacilities.find(f => f.id === booking.facilityId);
                      return (
                        <Card key={booking.id} className="overflow-hidden">
                          <div className="flex flex-col md:flex-row">
                            <div className="w-full md:w-1/4 h-full">
                              <img 
                                src={facility?.image} 
                                alt={facility?.name}
                                className="w-full h-32 md:h-full object-cover"
                              />
                            </div>
                            <div className="p-4 flex-1">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-medium">{booking.title}</h3>
                                  <p className="text-sm text-muted-foreground">{facility?.name}</p>
                                </div>
                                <Badge className="bg-blue-100 text-blue-800 border-blue-100">
                                  Booked
                                </Badge>
                              </div>
                              <div className="mt-4 grid grid-cols-2 gap-y-2 text-sm">
                                <div className="flex items-center">
                                  <Clock className="h-4 w-4 mr-1 text-gray-500" />
                                  <span>{booking.time}</span>
                                </div>
                                <div className="flex items-center">
                                  <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                                  <span>{facility?.location}</span>
                                </div>
                                {facility && (
                                  <div className="flex items-center">
                                    <Users className="h-4 w-4 mr-1 text-gray-500" />
                                    <span>Capacity: {facility.capacity}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </Card>
                      );
                    })
                  ) : (
                    <div className="text-center py-10">
                      <CalendarIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                      <h3 className="mt-2 text-lg font-medium">No bookings on this date</h3>
                      <p className="text-muted-foreground">
                        There are no facility bookings for {format(selectedDate, 'MMMM d, yyyy')}.
                      </p>
                    </div>
                  )
                ) : (
                  <div className="text-center py-10">
                    <CalendarIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-2 text-lg font-medium">Select a date</h3>
                    <p className="text-muted-foreground">
                      Please select a date to view facility bookings.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="available">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {filteredFacilities
              .filter(facility => facility.status === 'available')
              .map((facility) => (
                <div key={facility.id} className="group" onClick={() => handleViewFacilityDetails(facility)}>
                  <FacilityCard 
                    id={facility.id}
                    name={facility.name}
                    description={facility.description}
                    image={facility.image}
                    location={facility.location}
                    capacity={facility.capacity}
                    status={facility.status}
                    nextAvailable={facility.nextAvailable}
                  />
                </div>
              ))
            }
          </div>
        </TabsContent>
        
        <TabsContent value="mybookings">
          <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">My Recent Bookings</h2>
              <Button variant="outline" asChild>
                <Link to="/facilities/my-bookings">View All Bookings</Link>
              </Button>
            </div>
            
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
      
      {/* Facility Details Dialog */}
      <Dialog open={facilityDetailsOpen} onOpenChange={setFacilityDetailsOpen}>
        {selectedFacility && (
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{selectedFacility.name}</DialogTitle>
              <DialogDescription>
                {selectedFacility.location}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="aspect-video overflow-hidden rounded-md">
                  <img 
                    src={selectedFacility.image} 
                    alt={selectedFacility.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="mt-4 space-y-2">
                  <Badge className={cn(
                    selectedFacility.status === 'available' ? 'bg-green-100 text-green-800 border-green-100' :
                    selectedFacility.status === 'booked' ? 'bg-amber-100 text-amber-800 border-amber-100' :
                    'bg-red-100 text-red-800 border-red-100'
                  )}>
                    {selectedFacility.status.charAt(0).toUpperCase() + selectedFacility.status.slice(1)}
                  </Badge>
                  
                  <p className="text-sm text-muted-foreground">{selectedFacility.description}</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-2">Facility Details</h3>
                  <dl className="grid grid-cols-2 gap-1 text-sm">
                    <dt className="text-gray-500">Category:</dt>
                    <dd>{selectedFacility.category}</dd>
                    
                    <dt className="text-gray-500">Location:</dt>
                    <dd>{selectedFacility.location}</dd>
                    
                    <dt className="text-gray-500">Capacity:</dt>
                    <dd>{selectedFacility.capacity} people</dd>
                    
                    {selectedFacility.nextAvailable && (
                      <>
                        <dt className="text-gray-500">Next Available:</dt>
                        <dd>{selectedFacility.nextAvailable}</dd>
                      </>
                    )}
                  </dl>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedFacility.amenities.map((amenity: string) => (
                      <Badge key={amenity} variant="outline">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="pt-4">
                  {selectedFacility.status === 'available' ? (
                    <Button asChild className="w-full">
                      <Link to={`/facilities/book/${selectedFacility.id}`}>
                        Book This Facility
                      </Link>
                    </Button>
                  ) : selectedFacility.status === 'booked' ? (
                    <Button disabled className="w-full">
                      Currently Booked
                    </Button>
                  ) : (
                    <Button disabled className="w-full">
                      Under Maintenance
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
      
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
