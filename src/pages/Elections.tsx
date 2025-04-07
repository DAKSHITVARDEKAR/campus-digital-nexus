
import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { ElectionCard } from '@/components/elections/ElectionCard';
import { VoteChart } from '@/components/elections/VoteChart';
import { ElectionTrendChart } from '@/components/elections/ElectionTrendChart'; 
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, CheckCircle, Clock, Calendar } from 'lucide-react';

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

const electionTrendData = [
  { month: 'Jan', participation: 45 },
  { month: 'Feb', participation: 52 },
  { month: 'Mar', participation: 49 },
  { month: 'Apr', participation: 62 },
  { month: 'May', participation: 55 },
];

const studentCouncilCandidates = [
  {
    id: '1',
    name: 'Alex Chen',
    position: 'President',
    department: 'Computer Science',
    year: '3rd Year',
    manifesto: 'I plan to enhance the academic resources and create more opportunities for technical skill development.',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=774&h=774'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    position: 'Vice President',
    department: 'Business Administration',
    year: '2nd Year',
    manifesto: 'My aim is to bridge the gap between students and administration, ensuring every voice is heard.',
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=774&h=774'
  },
  {
    id: '3',
    name: 'Michael Brown',
    position: 'Secretary',
    department: 'Electrical Engineering',
    year: '4th Year',
    manifesto: 'I will focus on improving infrastructure and creating better study environments.',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=774&h=774'
  },
  {
    id: '4',
    name: 'Jessica Lee',
    position: 'Treasurer',
    department: 'Finance',
    year: '3rd Year',
    manifesto: 'I bring strong financial management skills to ensure transparent and efficient use of student funds.',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=774&h=774'
  },
];

const Elections = () => {
  const [selectedElection, setSelectedElection] = useState('1');
  const [hasVoted, setHasVoted] = useState(false);

  const handleVote = (candidateId: string) => {
    console.log(`Voted for candidate ${candidateId}`);
    setHasVoted(true);
    // Here you would typically call the castVote function
  };

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
          <TabsTrigger value="candidates">Candidates</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
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
            
            <Card>
              <CardHeader>
                <CardTitle>Student Council Election Results</CardTitle>
                <CardDescription>
                  Election period: Apr 5, 2023 - Apr 12, 2023
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {studentCouncilResults.map((candidate, index) => (
                    <div key={candidate.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-semibold text-gray-800 mr-3">
                          {index + 1}
                        </div>
                        <span>{candidate.name}</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-24 bg-gray-200 rounded-full h-2.5 mr-2">
                          <div 
                            className="h-2.5 rounded-full" 
                            style={{ 
                              width: `${(candidate.votes / studentCouncilResults.reduce((sum, c) => sum + c.votes, 0)) * 100}%`,
                              backgroundColor: candidate.color 
                            }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{candidate.votes} votes</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="candidates">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
            {studentCouncilCandidates.map((candidate) => (
              <Card key={candidate.id} className="overflow-hidden">
                <div className="aspect-square overflow-hidden">
                  <img 
                    src={candidate.imageUrl} 
                    alt={candidate.name}
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg">{candidate.name}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="outline">{candidate.position}</Badge>
                    <Badge variant="secondary">{candidate.department}</Badge>
                  </div>
                  <p className="text-sm mt-2">{candidate.manifesto}</p>
                  {!hasVoted && (
                    <Button 
                      className="w-full mt-4" 
                      onClick={() => handleVote(candidate.id)}
                    >
                      Vote
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          
          {hasVoted && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              <p className="text-green-800">Your vote has been successfully recorded. Thank you for participating!</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="stats">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Participation Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Student Council Election</span>
                    <div className="flex items-center mt-1">
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '78%' }}></div>
                      </div>
                      <span className="text-sm font-medium">78%</span>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Cultural Committee</span>
                    <div className="flex items-center mt-1">
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                        <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: '62%' }}></div>
                      </div>
                      <span className="text-sm font-medium">62%</span>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Department Representatives</span>
                    <div className="flex items-center mt-1">
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                        <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                      <span className="text-sm font-medium">85%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Election Participation Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ElectionTrendChart data={electionTrendData} />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="p-4 flex items-center">
                <Users className="h-10 w-10 text-purple-600 mr-4" />
                <div>
                  <h3 className="font-semibold">Total Voters</h3>
                  <p className="text-2xl font-bold text-purple-700">1,245</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4 flex items-center">
                <CheckCircle className="h-10 w-10 text-blue-600 mr-4" />
                <div>
                  <h3 className="font-semibold">Total Votes Cast</h3>
                  <p className="text-2xl font-bold text-blue-700">985</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4 flex items-center">
                <Clock className="h-10 w-10 text-green-600 mr-4" />
                <div>
                  <h3 className="font-semibold">Average Voting Time</h3>
                  <p className="text-2xl font-bold text-green-700">2.5 min</p>
                </div>
              </CardContent>
            </Card>
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
          <li>Your vote remains confidential and secure</li>
          <li>All candidates have equal opportunity to present their manifesto</li>
        </ul>
      </div>
    </Layout>
  );
};

export default Elections;
