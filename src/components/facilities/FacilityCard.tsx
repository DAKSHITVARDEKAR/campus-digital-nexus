
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, MapPin, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface FacilityCardProps {
  id: string;
  name: string;
  description: string;
  image: string;
  location: string;
  capacity: number;
  status: 'available' | 'booked' | 'maintenance';
  nextAvailable?: string;
}

export const FacilityCard = ({
  id,
  name,
  description,
  image,
  location,
  capacity,
  status,
  nextAvailable,
}: FacilityCardProps) => {
  const navigate = useNavigate();
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800 border-green-100';
      case 'booked':
        return 'bg-amber-100 text-amber-800 border-amber-100';
      case 'maintenance':
        return 'bg-red-100 text-red-800 border-red-100';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-100';
    }
  };

  const handleBookClick = () => {
    navigate(`/facilities/book/${id}`);
  };

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="aspect-video overflow-hidden">
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold">{name}</CardTitle>
          <Badge className={getStatusColor(status)}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="py-2 flex-grow">
        <p className="text-sm text-gray-600 line-clamp-2 mb-4">{description}</p>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-1 text-gray-500" />
            <span>{location}</span>
          </div>
          
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1 text-gray-500" />
            <span>Capacity: {capacity}</span>
          </div>
          
          {status === 'booked' && nextAvailable && (
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1 text-gray-500" />
              <span>Next Available: {nextAvailable}</span>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="pt-2">
        <Button 
          onClick={handleBookClick}
          disabled={status !== 'available'} 
          className="w-full"
        >
          {status === 'available' ? 'Book Now' : 'View Details'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FacilityCard;
