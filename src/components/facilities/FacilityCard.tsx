
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';

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
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800 border-green-100';
      case 'booked':
        return 'bg-red-100 text-red-800 border-red-100';
      case 'maintenance':
        return 'bg-amber-100 text-amber-800 border-amber-100';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-100';
    }
  };

  return (
    <Card className="overflow-hidden h-full">
      <div className="h-48 overflow-hidden">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" 
        />
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold">{name}</CardTitle>
          <Badge className={getStatusColor(status)}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{location}</p>
      </CardHeader>
      
      <CardContent className="py-2">
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{description}</p>
        
        <div className="flex items-center text-sm">
          <span>Capacity: {capacity} people</span>
        </div>
        
        {status !== 'available' && nextAvailable && (
          <div className="flex items-center mt-2 text-sm">
            <Calendar className="h-4 w-4 mr-1 text-gray-500" />
            <span>Next Available: {nextAvailable}</span>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-2">
        <Button 
          asChild 
          className="w-full" 
          variant={status === 'available' ? 'default' : 'outline'}
          disabled={status !== 'available'}
        >
          <Link to={`/facilities/${id}`}>
            {status === 'available' ? 'Book Now' : 'View Details'}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FacilityCard;
