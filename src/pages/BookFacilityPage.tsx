import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { CalendarIcon, Clock, Users, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

// Booking time slots
const timeSlots = [
  "08:00 - 10:00",
  "10:00 - 12:00",
  "12:00 - 14:00",
  "14:00 - 16:00",
  "16:00 - 18:00",
  "18:00 - 20:00"
];

// Mock facility data - would be fetched from Firestore in a real implementation
const facilityData = {
  "1": {
    id: '1',
    name: 'Main Auditorium',
    description: 'Fully equipped auditorium with stage, sound system, and seating for 300 people.',
    image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=1469',
    location: 'Main Campus, Building A',
    capacity: 300,
    status: 'available',
    rules: [
      'No food or drinks inside the auditorium',
      'Equipment must be returned in original condition',
      'Setup and cleanup must be handled by organizers',
      'Maximum capacity must be strictly observed'
    ]
  },
  "2": {
    id: '2',
    name: 'Conference Room A',
    description: 'Modern conference room with projector, whiteboard, and seating for 30 people.',
    image: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&q=80&w=1025',
    location: 'Main Campus, Building B',
    capacity: 30,
    status: 'available',
    rules: [
      'Whiteboard must be cleaned after use',
      'Return chairs and tables to original arrangement',
      'Report any technical issues immediately',
      'No affixing materials to walls'
    ]
  },
  "3": {
    id: '3',
    name: 'Tennis Court',
    description: 'Outdoor tennis court with proper lighting for evening play.',
    image: 'https://images.unsplash.com/photo-1564769662533-4f00a87b4056?auto=format&fit=crop&q=80&w=1029',
    location: 'Sports Complex',
    capacity: 4,
    status: 'available',
    rules: [
      'Proper tennis shoes required',
      'Maximum booking duration is 2 hours',
      'Equipment can be borrowed from sports office',
      'Court must be left clean'
    ]
  }
};

// Booked slots - would be fetched from Firestore in a real implementation
const bookedSlots = [
  { facilityId: '1', date: '2025-04-10', timeSlot: '14:00 - 16:00' },
  { facilityId: '1', date: '2025-04-10', timeSlot: '16:00 - 18:00' },
  { facilityId: '2', date: '2025-04-08', timeSlot: '10:00 - 12:00' },
];

interface BookingFormData {
  purpose: string;
  date: Date;
  timeSlot: string;
  attendees: number;
  additionalNotes: string;
}

const BookFacilityPage = () => {
  const { facilityId } = useParams<{ facilityId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [facility, setFacility] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dateSelected, setDateSelected] = useState<Date | undefined>(undefined);
  const [unavailableSlots, setUnavailableSlots] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<BookingFormData>({
    defaultValues: {
      purpose: '',
      date: new Date(),
      timeSlot: '',
      attendees: 1,
      additionalNotes: ''
    }
  });
  
  const selectedDate = watch('date');
  const selectedTimeSlot = watch('timeSlot');
  
  // Fetch facility data
  useEffect(() => {
    if (facilityId) {
      // In a real implementation, this would be a Firestore fetch
      setFacility(facilityData[facilityId as keyof typeof facilityData]);
      setLoading(false);
    }
  }, [facilityId]);
  
  // Update unavailable slots when date changes
  useEffect(() => {
    if (selectedDate) {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      const unavailable = bookedSlots
        .filter(slot => slot.facilityId === facilityId && slot.date === formattedDate)
        .map(slot => slot.timeSlot);
      setUnavailableSlots(unavailable);
    }
  }, [selectedDate, facilityId]);
  
  const onSubmit = (data: BookingFormData) => {
    setSubmitting(true);
    
    // Using Appwrite functions instead of Firebase Cloud Functions
    console.log('Booking request:', {
      facilityId,
      ...data,
      date: format(data.date, 'yyyy-MM-dd'),
    });
    
    // Simulate API call delay
    setTimeout(() => {
      setSubmitting(false);
      toast({
        title: "Booking Requested",
        description: "Your booking request has been submitted and is awaiting approval.",
      });
      
      // Redirect to my bookings page
      navigate('/facilities');
    }, 1500);
  };
  
  if (loading) return (
    <Layout>
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    </Layout>
  );
  
  if (!facility) return (
    <Layout>
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Facility not found. Please select a valid facility.</AlertDescription>
      </Alert>
      <Button onClick={() => navigate('/facilities')} className="mt-4">
        Back to Facilities
      </Button>
    </Layout>
  );
  
  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Book a Facility</h1>
        <p className="text-muted-foreground">Complete the form to request a booking for your selected facility.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Card>
              <CardHeader>
                <CardTitle>Booking Details</CardTitle>
                <CardDescription>
                  Please provide information about your booking request.
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="purpose">Purpose of Booking <span className="text-red-500">*</span></Label>
                  <Input 
                    id="purpose"
                    placeholder="e.g., Department Meeting, Student Event"
                    {...register('purpose', { required: 'Purpose is required' })}
                  />
                  {errors.purpose && (
                    <p className="text-sm text-red-500">{errors.purpose.message}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Date <span className="text-red-500">*</span></Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !selectedDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? format(selectedDate, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={(date) => {
                            setValue('date', date as Date);
                            setDateSelected(date);
                          }}
                          initialFocus
                          disabled={(date) => 
                            date < new Date(new Date().setHours(0, 0, 0, 0)) ||
                            date > new Date(new Date().setMonth(new Date().getMonth() + 3))
                          }
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Time Slot <span className="text-red-500">*</span></Label>
                    <RadioGroup
                      value={selectedTimeSlot}
                      onValueChange={(value) => setValue('timeSlot', value)}
                    >
                      <div className="grid grid-cols-2 gap-2">
                        {timeSlots.map((slot) => {
                          const isDisabled = unavailableSlots.includes(slot);
                          return (
                            <div key={slot} className="flex items-center">
                              <RadioGroupItem
                                value={slot}
                                id={`slot-${slot}`}
                                disabled={isDisabled}
                              />
                              <Label
                                htmlFor={`slot-${slot}`}
                                className={cn(
                                  "ml-2",
                                  isDisabled && "text-muted-foreground line-through"
                                )}
                              >
                                {slot}
                                {isDisabled && " (Booked)"}
                              </Label>
                            </div>
                          );
                        })}
                      </div>
                    </RadioGroup>
                    {errors.timeSlot && (
                      <p className="text-sm text-red-500">{errors.timeSlot.message}</p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="attendees">Expected Attendees <span className="text-red-500">*</span></Label>
                  <div className="flex items-center">
                    <Input 
                      id="attendees"
                      type="number"
                      min={1}
                      max={facility.capacity}
                      {...register('attendees', { 
                        required: 'Number of attendees is required',
                        min: {
                          value: 1,
                          message: 'At least 1 attendee is required'
                        },
                        max: {
                          value: facility.capacity,
                          message: `Maximum capacity is ${facility.capacity}`
                        }
                      })}
                    />
                    <p className="ml-2 text-sm text-muted-foreground">
                      Max: {facility.capacity}
                    </p>
                  </div>
                  {errors.attendees && (
                    <p className="text-sm text-red-500">{errors.attendees.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="additionalNotes">Additional Notes</Label>
                  <Textarea 
                    id="additionalNotes"
                    placeholder="Any special requirements or additional information..."
                    {...register('additionalNotes')}
                  />
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between">
                <Button variant="outline" type="button" onClick={() => navigate('/facilities')}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? (
                    <>
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                      Submitting...
                    </>
                  ) : (
                    'Submit Booking Request'
                  )}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </div>
        
        <div>
          <Card>
            <div className="aspect-video overflow-hidden rounded-t-lg">
              <img 
                src={facility.image} 
                alt={facility.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            <CardHeader>
              <CardTitle>{facility.name}</CardTitle>
              <CardDescription>{facility.location}</CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p>{facility.description}</p>
              
              <div className="flex items-center text-sm">
                <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                <span>Capacity: {facility.capacity} people</span>
              </div>
              
              <div className="flex items-center text-sm">
                <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                <span>Available Time Slots: 8:00 AM - 8:00 PM</span>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="font-medium mb-2">Facility Rules</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  {facility.rules.map((rule: string, index: number) => (
                    <li key={index}>{rule}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default BookFacilityPage;
