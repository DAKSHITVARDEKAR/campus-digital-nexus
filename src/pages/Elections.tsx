
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ElectionCard } from '@/components/elections/ElectionCard';
import { ElectionList } from '@/components/elections/ElectionList';
import { useElectionApi } from '@/hooks/useElectionApi';
import { Election } from '@/models/election';
import { UserRoleSwitcher } from '@/components/elections/UserRoleSwitcher';
import { useAccessibilityContext } from '@/contexts/AccessibilityContext';

const Elections = () => {
  const [elections, setElections] = useState<Election[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const { highContrast, largeText } = useAccessibilityContext();
  const electionApi = useElectionApi();

  useEffect(() => {
    const fetchElections = async () => {
      try {
        setLoading(true);
        const response = await electionApi.getElections();
        setElections(response.elections);
        setError(null);
      } catch (err: any) {
        console.error('Failed to fetch elections:', err);
        setError('Failed to load elections. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchElections();
  }, []);

  const filterElections = (status: string) => {
    if (status === 'all') {
      return elections;
    }
    return elections.filter(election => election.status.toLowerCase() === status.toLowerCase());
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className={`text-3xl font-bold tracking-tight ${largeText ? 'text-4xl' : ''}`}>Student Elections</h1>
          <p className="text-muted-foreground">View and participate in ongoing campus elections</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <UserRoleSwitcher />
          <Button variant="outline">Election History</Button>
          <Button>View My Votes</Button>
        </div>
      </div>

      <Separator />

      <Tabs defaultValue="all" onValueChange={handleTabChange} className="w-full">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="all">All Elections</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="closed">Closed</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          {loading ? (
            <p>Loading elections...</p>
          ) : error ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-red-500">{error}</p>
              </CardContent>
            </Card>
          ) : elections.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p>No elections found.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterElections(activeTab).map(election => (
                <ElectionCard key={election.id} election={election} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="upcoming" className="mt-6">
          <ElectionList elections={filterElections('upcoming')} loading={loading} error={error} />
        </TabsContent>

        <TabsContent value="active" className="mt-6">
          <ElectionList elections={filterElections('active')} loading={loading} error={error} />
        </TabsContent>

        <TabsContent value="closed" className="mt-6">
          <ElectionList elections={filterElections('closed')} loading={loading} error={error} />
        </TabsContent>
      </Tabs>

      <Separator className="my-8" />

      <Card className={`${highContrast ? 'border-2 border-black' : ''}`}>
        <CardHeader>
          <CardTitle className={`${largeText ? 'text-2xl' : 'text-xl'}`}>About Student Elections</CardTitle>
        </CardHeader>
        <CardContent>
          <p className={`${largeText ? 'text-lg' : ''}`}>
            The student election system allows you to vote for candidates running for various positions in student
            government. Active elections are available for voting, while upcoming elections show the candidates who
            will be running. Closed elections display the results of past elections.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Elections;
