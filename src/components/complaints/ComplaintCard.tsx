
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User } from 'lucide-react';

interface ComplaintCardProps {
  id: string;
  title: string;
  description: string;
  date: string;
  status: 'pending' | 'under-review' | 'resolved' | 'rejected';
  isAnonymous: boolean;
  submitter?: string;
}

export const ComplaintCard = ({
  id,
  title,
  description,
  date,
  status,
  isAnonymous,
  submitter,
}: ComplaintCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-100 text-amber-800 border-amber-100';
      case 'under-review':
        return 'bg-blue-100 text-blue-800 border-blue-100';
      case 'resolved':
        return 'bg-green-100 text-green-800 border-green-100';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-100';
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
            {status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{date}</p>
      </CardHeader>
      
      <CardContent className="py-2">
        <p className="text-sm text-gray-600 line-clamp-3 mb-4">{description}</p>
        
        <div className="flex items-center text-sm">
          <User className="h-4 w-4 mr-1 text-gray-500" />
          {isAnonymous ? (
            <span className="text-gray-500">Anonymous</span>
          ) : (
            <span>{submitter || 'Student'}</span>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="pt-2">
        <Button asChild variant="outline" className="w-full">
          <Link to={`/complaints/${id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ComplaintCard;
