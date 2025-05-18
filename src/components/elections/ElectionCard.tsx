
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Election } from '@/models/election';

export interface ElectionCardProps {
  election: Election;
}

export const ElectionCard: React.FC<ElectionCardProps> = ({ election }) => {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'closed':
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleViewElection = () => {
    navigate(`/elections/${election.id}`);
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <Badge variant="outline" className={getStatusColor(election.status)}>
            {election.status}
          </Badge>
        </div>
        <CardTitle className="text-xl mt-2">{election.title}</CardTitle>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-muted-foreground line-clamp-2 mb-4">{election.description}</p>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2 text-gray-500" />
            <span>
              {formatDate(election.startDate)} - {formatDate(election.endDate)}
            </span>
          </div>
          <div className="flex items-center">
            <User className="w-4 h-4 mr-2 text-gray-500" />
            <span>
              {election.positions?.length || 0} position{election.positions?.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2 text-gray-500" />
            <span>
              Created {formatDate(election.createdAt)}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleViewElection}>
          {election.status.toLowerCase() === 'active'
            ? 'Vote Now'
            : election.status.toLowerCase() === 'upcoming'
            ? 'View Candidates'
            : 'View Results'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ElectionCard;
