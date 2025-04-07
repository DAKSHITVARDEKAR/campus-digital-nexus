
import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { ElectionCard } from '@/components/elections/ElectionCard';
import { VoteChart } from '@/components/elections/VoteChart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock data
const activeElections = [
  {
    id: '1',
    title: 'Student Council 2023-24',
    description: 'Vote for your representatives for the upcoming academic year. The elected council will represent student interests and organize various events.',
    startDate: 'Apr 5, 2023',
    endDate: 'Apr 12, 2023',
    status: 'active' as const,
    candidateCount: 8,
    votesCount: 320,
  },
  {
    id: '2',
    title: 'Cultural Committee Selection',
    description: 'Select members for the cultural committee who will organize cultural events throughout the year.',
    startDate: 'Apr 7, 2023',
    endDate: 'Apr 14, 2023',
    status: 'active' as const,
    candidateCount: 12,
    votesCount: 215,
  },
];

const upcomingElections = [
  {
    id: '3',
    title: 'Sports Committee Election',
    description: 'Vote for the sports committee members who will organize sports events and manage sports facilities.',
    startDate: 'Apr 20, 2023',
    endDate: 'Apr 27, 2023',
    status: 'upcoming' as const,
    candidateCount: 6,
  },
];

const completedElections = [
  {
    id: '4',
    title: 'Department Representatives',
    description: 'Election for department representatives who will liaise between students and faculty.',
    startDate: 'Mar 15, 2023',
    endDate: 'Mar 22, 2023',
    status: 'completed' as const,
    candidateCount: 15,
    votesCount: 450,
  },
];

const studentCouncilResults = [
  { id: '1', name: 'Alex Chen', votes: 120, color: '#0088FE' },
  { id: '2', name: 'Sarah Johnson', votes: 85, color: '#00C49F' },
  { id: '3', name: 'Michael Brown', votes: 65, color: '#FFBB28' },
  { id: '4', name: 'Jessica Lee', votes: 50, color: '#FF8042' },
];

const Elections = () => {
  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Student Elections</h1>
        <p className="text-muted-foreground">View ongoing, upcoming, and past elections. Cast your vote in active elections.</p>
      </div>
      
      <Tabs defaultValue="active" className="mb-6">
        <TabsList>
          <TabsTrigger value="active">Active Elections</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {activeElections.map((election) => (
              <ElectionCard 
                key={election.id}
                id={election.id}
                title={election.title}
                description={election.description}
                startDate={election.startDate}
                endDate={election.endDate}
                status={election.status}
                candidateCount={election.candidateCount}
                votesCount={election.votesCount}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="upcoming">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {upcomingElections.map((election) => (
              <ElectionCard 
                key={election.id}
                id={election.id}
                title={election.title}
                description={election.description}
                startDate={election.startDate}
                endDate={election.endDate}
                status={election.status}
                candidateCount={election.candidateCount}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="completed">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {completedElections.map((election) => (
              <ElectionCard 
                key={election.id}
                id={election.id}
                title={election.title}
                description={election.description}
                startDate={election.startDate}
                endDate={election.endDate}
                status={election.status}
                candidateCount={election.candidateCount}
                votesCount={election.votesCount}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="results">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <VoteChart 
              candidates={studentCouncilResults}
              totalVotes={320}
              isLive={true}
            />
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold text-blue-800 mb-2">Election Guidelines</h2>
        <ul className="list-disc pl-5 text-blue-700 space-y-1">
          <li>All registered students are eligible to vote once in each election</li>
          <li>Elections remain open for the specified duration</li>
          <li>Results are announced immediately after the election closes</li>
          <li>If you face any issues while voting, please contact the Election Committee</li>
        </ul>
      </div>
    </Layout>
  );
};

export default Elections;
