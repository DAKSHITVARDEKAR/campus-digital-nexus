
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { AlertCircle, Users, Calendar } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <Card key={item} className="overflow-hidden h-full flex flex-col">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
            </CardHeader>
            <CardContent className="py-2 flex-grow">
              <Skeleton className="h-4 w-full mb-4" />
              <Skeleton className="h-4 w-5/6 mb-4" />
              
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div>
                  <Skeleton className="h-3 w-20 mb-1" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div>
                  <Skeleton className="h-3 w-20 mb-1" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
              
              <div className="flex items-center mt-4">
                <Skeleton className="h-4 w-4 mr-2 rounded-full" />
                <Skeleton className="h-4 w-28" />
              </div>
            </CardContent>
            <CardFooter className="pt-2">
              <Skeleton className="h-10 w-full rounded-md" />
            </CardFooter>
          </Card>
        ))}
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
