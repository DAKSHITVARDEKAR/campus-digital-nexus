
import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Calendar, Clock, Award } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ElectionStatus } from '@/models/election';

interface ElectionCardProps {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: ElectionStatus;
  candidateCount: number;
  votesCount?: number;
}

export const ElectionCard = memo(({
  id,
  title,
  description,
  startDate,
  endDate,
  status,
  candidateCount,
  votesCount,
}: ElectionCardProps) => {
  const getStatusColor = (status: ElectionStatus): string => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800 border-blue-100 hover:bg-blue-200';
      case 'active':
        return 'bg-green-100 text-green-800 border-green-100 hover:bg-green-200';
      case 'completed':
        return 'bg-gray-100 text-gray-800 border-gray-100 hover:bg-gray-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-100 hover:bg-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-100 hover:bg-gray-200';
    }
  };

  const getActionButton = (status: ElectionStatus): { text: string, variant: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive" } => {
    switch (status) {
      case 'active':
        return { text: 'Vote Now', variant: 'default' };
      case 'completed':
        return { text: 'View Results', variant: 'secondary' };
      case 'upcoming':
        return { text: 'View Details', variant: 'outline' };
      case 'cancelled':
        return { text: 'View Details', variant: 'ghost' };
      default:
        return { text: 'View Details', variant: 'outline' };
    }
  };

  const actionButton = getActionButton(status);
  
  const StatusIcon = status === 'active' ? Award : Clock;

  return (
    <Card className="overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-lg border border-gray-200 transform hover:-translate-y-1 animate-fade-in">
      <CardHeader className="pb-2 space-y-1">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-lg font-semibold line-clamp-1">{title}</CardTitle>
          <Badge className={`flex items-center gap-1 ${getStatusColor(status)} transition-colors`}>
            <StatusIcon className="h-3 w-3" />
            <span>
              {status === 'active' ? 'Ongoing' : status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="py-2 flex-grow">
        <p className="text-sm text-gray-600 line-clamp-2 mb-4 min-h-[2.5rem]">{description}</p>
        
        <div className="grid grid-cols-2 gap-2 text-sm mb-3">
          <div className="flex flex-col">
            <div className="flex items-center text-gray-500 mb-1">
              <Calendar className="h-3.5 w-3.5 mr-1.5" />
              <span className="text-xs">Start Date</span>
            </div>
            <p className="font-medium">{startDate}</p>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center text-gray-500 mb-1">
              <Clock className="h-3.5 w-3.5 mr-1.5" />
              <span className="text-xs">End Date</span>
            </div>
            <p className="font-medium">{endDate}</p>
          </div>
        </div>
        
        <div className="flex items-center mt-2 text-sm bg-gray-50 p-2 rounded-md">
          <Users className="h-4 w-4 mr-1.5 text-gray-500" />
          <span className="font-medium">{candidateCount} Candidates</span>
          {votesCount !== undefined && (
            <span className="ml-4 font-medium">{votesCount} Votes Cast</span>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="pt-2">
        <Button asChild variant={actionButton.variant} className="w-full">
          <Link to={`/elections/${id}`}>
            {actionButton.text}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
});

ElectionCard.displayName = "ElectionCard";

export default ElectionCard;
