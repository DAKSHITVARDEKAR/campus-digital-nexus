
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import ElectionCard from '@/components/elections/ElectionCard';
import { Election, ElectionStatus } from '@/models/election';

interface ElectionListProps {
  elections: Election[];
  loading: boolean;
  error: string | null;
  filter?: ElectionStatus | 'all';
}

const ElectionList: React.FC<ElectionListProps> = ({ 
  elections, 
  loading, 
  error,
  filter = 'all'
}) => {
  // Filter elections based on status
  const filteredElections = filter === 'all' 
    ? elections 
    : elections.filter(election => election.status === filter);
  
  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Loading elections...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }
  
  if (filteredElections.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">No Elections Found</CardTitle>
          <CardDescription>
            {filter === 'active' && "There are no active elections at the moment."}
            {filter === 'upcoming' && "There are no upcoming elections scheduled."}
            {filter === 'completed' && "No completed elections to display."}
            {filter === 'cancelled' && "No cancelled elections to display."}
            {filter === 'all' && "No elections are available."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Check back later or contact the administration for more information.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  // Helper to format date strings
  const formatDateString = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredElections.map((election) => (
        <ElectionCard
          key={election.id}
          id={election.id}
          title={election.title}
          description={election.description}
          startDate={formatDateString(election.startDate)}
          endDate={formatDateString(election.endDate)}
          status={election.status}
          candidateCount={0} // We'll update this in a later version
          votesCount={0} // We'll update this in a later version
        />
      ))}
    </div>
  );
};

export default ElectionList;
