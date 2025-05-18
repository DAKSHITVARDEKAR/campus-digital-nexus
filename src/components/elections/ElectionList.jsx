
import React, { memo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import ElectionCard from '@/components/elections/ElectionCard';

/**
 * @typedef {import('@/models/election').Election} Election
 * @typedef {import('@/models/election').ElectionStatus} ElectionStatus
 */

/**
 * @typedef {Object} ElectionListProps
 * @property {Election[]} elections
 * @property {boolean} loading
 * @property {string|null} error
 * @property {ElectionStatus|'all'} [filter]
 */

/**
 * Displays a list of elections with optional filtering
 * @param {ElectionListProps} props
 */
const ElectionList = memo(({ 
  elections, 
  loading, 
  error,
  filter = 'all'
}) => {
  // Filter elections based on status
  const filteredElections = filter === 'all' 
    ? elections 
    : elections.filter(election => election.status === filter);
  
  // Helper to format date strings with memoization
  const formatDateString = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };
  
  if (error) {
    return (
      <Alert variant="destructive" className="animate-fade-in">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }
  
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
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-5/6 mb-6" />
              
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
              
              <Skeleton className="h-8 w-full rounded-md mt-4" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  
  if (filteredElections.length === 0) {
    return (
      <Card className="animate-fade-in">
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
          candidateCount={election.positions?.length || 0}
          votesCount={0} // This will be updated when we fetch vote counts
        />
      ))}
    </div>
  );
});

ElectionList.displayName = "ElectionList";

export default ElectionList;
