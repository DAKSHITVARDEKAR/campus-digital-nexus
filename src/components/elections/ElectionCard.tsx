
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ElectionCardProps {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'active' | 'completed';
  candidateCount: number;
  votesCount?: number;
}

export const ElectionCard = ({
  id,
  title,
  description,
  startDate,
  endDate,
  status,
  candidateCount,
  votesCount,
}: ElectionCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800 border-blue-100';
      case 'active':
        return 'bg-green-100 text-green-800 border-green-100';
      case 'completed':
        return 'bg-gray-100 text-gray-800 border-gray-100';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-100';
    }
  };

  return (
    <Card className="overflow-hidden h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          <Badge className={getStatusColor(status)}>
            {status === 'active' ? 'Ongoing' : status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="py-2">
        <p className="text-sm text-gray-600 line-clamp-2 mb-4">{description}</p>
        
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-gray-500">Start Date</p>
            <p className="font-medium">{startDate}</p>
          </div>
          <div>
            <p className="text-gray-500">End Date</p>
            <p className="font-medium">{endDate}</p>
          </div>
        </div>
        
        <div className="flex items-center mt-3 text-sm">
          <Users className="h-4 w-4 mr-1 text-gray-500" />
          <span>{candidateCount} Candidates</span>
          {votesCount !== undefined && (
            <span className="ml-4">{votesCount} Votes Cast</span>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="pt-2">
        <Button asChild className="w-full">
          <Link to={`/elections/${id}`}>
            {status === 'active' ? 'Vote Now' : status === 'completed' ? 'View Results' : 'View Details'}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ElectionCard;
