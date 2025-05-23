
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Users, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { Election } from '@/models/election';

export interface ElectionCardProps {
  data: Election;
}

export const ElectionCard: React.FC<ElectionCardProps> = ({ data }) => {
  // Format date from ISO string to readable format
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy');
  };
  
  // Get background color based on status
  const getBgColor = () => {
    switch (data.status) {
      case 'active':
        return 'bg-green-50 border-green-200';
      case 'upcoming':
        return 'bg-blue-50 border-blue-200';
      case 'closed':
      case 'completed':
        return 'bg-gray-50 border-gray-200';
      case 'cancelled':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-white border-gray-200';
    }
  };
  
  // Get status badge style
  const getStatusStyle = () => {
    switch (data.status) {
      case 'active':
        return 'text-white bg-green-600';
      case 'upcoming':
        return 'text-white bg-blue-600';
      case 'closed':
      case 'completed':
        return 'text-white bg-gray-600';
      case 'cancelled':
        return 'text-white bg-red-600';
      default:
        return 'text-gray-800 bg-gray-100';
    }
  };

  return (
    <Card className={`border-2 ${getBgColor()}`}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold leading-tight">{data.title}</CardTitle>
          <span className={`px-2 py-1 text-xs font-semibold rounded-full uppercase ${getStatusStyle()}`}>
            {data.status}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 py-1">
        <p className="text-gray-700 text-base">{data.description}</p>
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4" />
          <span>
            {formatDate(data.startDate)} - {formatDate(data.endDate)}
          </span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Users className="h-4 w-4" />
          <span>{data.positions.length} Position{data.positions.length !== 1 ? 's' : ''}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="default" className="w-full" size="lg">
          <ExternalLink className="h-4 w-4 mr-2" />
          View Election Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ElectionCard;
