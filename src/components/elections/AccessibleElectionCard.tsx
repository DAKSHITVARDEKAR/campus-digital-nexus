
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format, parseISO } from 'date-fns';
import { useAccessibility } from '@/contexts/AccessibilityContext';

interface ElectionCardProps {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  positions: string[];
  candidatesCount?: number;
}

const AccessibleElectionCard: React.FC<ElectionCardProps> = ({
  id,
  title,
  description,
  startDate,
  endDate,
  status,
  positions,
  candidatesCount = 0
}) => {
  const { options, getAriaLabel, getScreenReaderText } = useAccessibility();

  // Enhanced styling based on accessibility options
  const fontSize = options.fontSize === 'normal' 
    ? 'text-base' 
    : options.fontSize === 'large' 
      ? 'text-lg' 
      : 'text-xl';

  const getStatusColor = (status: string) => {
    // Use high contrast colors if that option is enabled
    const highContrast = options.contrast === 'high';
    
    switch (status) {
      case 'upcoming':
        return highContrast 
          ? 'bg-blue-200 text-blue-900 border-blue-900' 
          : 'bg-blue-100 text-blue-800 border-blue-100';
      case 'active':
        return highContrast 
          ? 'bg-green-200 text-green-900 border-green-900' 
          : 'bg-green-100 text-green-800 border-green-100';
      case 'completed':
        return highContrast 
          ? 'bg-gray-300 text-gray-900 border-gray-900' 
          : 'bg-gray-100 text-gray-800 border-gray-100';
      case 'cancelled':
        return highContrast 
          ? 'bg-red-200 text-red-900 border-red-900' 
          : 'bg-red-100 text-red-800 border-red-100';
      default:
        return highContrast 
          ? 'bg-gray-300 text-gray-900 border-gray-900' 
          : 'bg-gray-100 text-gray-800 border-gray-100';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'MMMM d, yyyy');
    } catch (e) {
      return dateString;
    }
  };

  const statusText = {
    upcoming: 'Upcoming',
    active: 'Ongoing',
    completed: 'Completed',
    cancelled: 'Cancelled'
  };

  // Context for aria labels
  const context = {
    title,
    status: statusText[status],
    startDate: formatDate(startDate),
    endDate: formatDate(endDate)
  };

  return (
    <Card 
      className={`h-full transition-all ${options.contrast === 'high' ? 'border-2' : ''}`}
      aria-label={getAriaLabel('election-card', context)}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className={`${fontSize}`}>{title}</CardTitle>
          <Badge 
            className={getStatusColor(status)}
            aria-label={getScreenReaderText('election-status-badge', { status: statusText[status] })}
          >
            {statusText[status as keyof typeof statusText]}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className={`text-muted-foreground ${fontSize === 'text-base' ? 'text-sm' : fontSize === 'text-lg' ? 'text-base' : 'text-lg'} line-clamp-2 mb-4`}>
          {description}
        </p>
        
        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className={fontSize === 'text-base' ? 'text-sm' : fontSize === 'text-lg' ? 'text-base' : 'text-lg'}>
              {formatDate(startDate)} - {formatDate(endDate)}
            </span>
          </div>
          
          <div className="flex items-center text-sm">
            <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className={fontSize === 'text-base' ? 'text-sm' : fontSize === 'text-lg' ? 'text-base' : 'text-lg'}>
              {status === 'upcoming' ? 'Starts soon' : status === 'active' ? 'Vote now' : 'Voting closed'}
            </span>
          </div>
          
          <div className="flex items-center text-sm">
            <Users className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className={fontSize === 'text-base' ? 'text-sm' : fontSize === 'text-lg' ? 'text-base' : 'text-lg'}>
              {candidatesCount} {candidatesCount === 1 ? 'Candidate' : 'Candidates'}
            </span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          asChild 
          className="w-full"
          variant={status === 'active' ? 'default' : 'secondary'}
        >
          <Link to={`/elections/${id}`}>
            {status === 'upcoming' ? 'View Details' : 
             status === 'active' ? 'Vote Now' : 
             'View Results'}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AccessibleElectionCard;
