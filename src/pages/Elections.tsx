
import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, CheckCircle, Clock, Calendar, Plus, Award, ChevronDown } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Loader2 } from 'lucide-react';
import { VoteChart } from '@/components/elections/VoteChart';
import { ElectionTrendChart } from '@/components/elections/ElectionTrendChart';
import ElectionList from '@/components/elections/ElectionList';
import CandidateApplicationsManager from '@/components/elections/CandidateApplicationsManager';
import UserRoleSwitcher from '@/components/elections/UserRoleSwitcher';
import useElectionApi from '@/hooks/useElectionApi';
import { useAuth } from '@/contexts/AuthContext';
import { Election } from '@/models/election';
import { Link } from 'react-router-dom';

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

const Elections = () => {
  const { user, hasPermission } = useAuth();
  const api = useElectionApi();
  
  const [elections, setElections] = useState<Election[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  useEffect(() => {
    const fetchElections = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const electionData = await api.getElections();
        if (electionData) {
          setElections(electionData);
        }
      } catch (err) {
        console.error('Error fetching elections:', err);
        setError('Failed to load elections. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchElections();
  }, [api]);
  
  return (
    <Layout>
      <div className="mb-6">
        <div className="flex flex-col gap-2 md:flex-row md:justify-between md:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Student Elections</h1>
            <p className="text-muted-foreground">Shape the future of campus leadership. Browse, vote, and participate in democratic processes.</p>
          </div>
          <div className="flex items-center gap-2">
            <UserRoleSwitcher />
            
            {/* Helpful context menu for first-time users */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  Help <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-2">
                  <h4 className="font-medium">Election System Guide</h4>
                  <p className="text-sm">Browse active and upcoming elections, submit your candidacy, or cast your vote securely.</p>
                  <ul className="text-sm list-disc pl-4 space-y-1">
                    <li>View active elections to cast votes</li>
                    <li>Submit candidate applications</li>
                    <li>Track election results in real-time</li>
                  </ul>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="active" className="mb-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-7 w-full">
          <TabsTrigger value="active" className="flex items-center gap-1">
            <Award className="h-4 w-4 md:mr-1" />
            <span className="hidden md:inline">Active</span>
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="flex items-center gap-1">
            <Calendar className="h-4 w-4 md:mr-1" />
            <span className="hidden md:inline">Upcoming</span>
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center gap-1">
            <CheckCircle className="h-4 w-4 md:mr-1" />
            <span className="hidden md:inline">Completed</span>
          </TabsTrigger>
          <TabsTrigger value="results" className="flex items-center gap-1">
            <Users className="h-4 w-4 md:mr-1" />
            <span className="hidden md:inline">Results</span>
          </TabsTrigger>
          <TabsTrigger value="applications" className="flex items-center gap-1">
            <Users className="h-4 w-4 md:mr-1" />
            <span className="hidden md:inline">Applications</span>
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-1">
            <Users className="h-4 w-4 md:mr-1" />
            <span className="hidden md:inline">Statistics</span>
          </TabsTrigger>
          {hasPermission('manage', 'election') && (
            <TabsTrigger value="manage" className="flex items-center gap-1">
              <Users className="h-4 w-4 md:mr-1" />
              <span className="hidden md:inline">Manage</span>
            </TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="active">
          <div className="mt-6">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                <span className="ml-2 text-lg">Loading elections...</span>
              </div>
            ) : (
              <ElectionList 
                elections={elections} 
                loading={loading} 
                error={error} 
                filter="active"
              />
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="upcoming">
          <div className="mt-6">
            <ElectionList 
              elections={elections} 
              loading={loading} 
              error={error} 
              filter="upcoming"
            />
          </div>
        </TabsContent>
        
        <TabsContent value="completed">
          <div className="mt-6">
            <ElectionList 
              elections={elections} 
              loading={loading} 
              error={error} 
              filter="completed"
            />
          </div>
        </TabsContent>
        
        <TabsContent value="results">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <VoteChart 
              candidates={studentCouncilResults}
              totalVotes={320}
              isLive={true}
            />
            
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Student Council Election Results</CardTitle>
                <CardDescription>
                  Election period: Apr 5, 2023 - Apr 12, 2023
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {studentCouncilResults.map((candidate, index) => (
                    <div key={candidate.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-semibold text-gray-800 mr-3">
                          {index + 1}
                        </div>
                        <span>{candidate.name}</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-24 bg-gray-100 rounded-full h-2.5 mr-2">
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
        
        <TabsContent value="applications">
          <CandidateApplicationsManager />
        </TabsContent>
        
        <TabsContent value="stats">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle>Participation Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Student Council Election</span>
                    <div className="flex items-center mt-1">
                      <div className="w-full bg-gray-100 rounded-full h-2.5 mr-2">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '78%' }}></div>
                      </div>
                      <span className="text-sm font-medium">78%</span>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Cultural Committee</span>
                    <div className="flex items-center mt-1">
                      <div className="w-full bg-gray-100 rounded-full h-2.5 mr-2">
                        <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: '62%' }}></div>
                      </div>
                      <span className="text-sm font-medium">62%</span>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Department Representatives</span>
                    <div className="flex items-center mt-1">
                      <div className="w-full bg-gray-100 rounded-full h-2.5 mr-2">
                        <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                      <span className="text-sm font-medium">85%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2 bg-white border-gray-200 shadow-sm">
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
            <Card className="bg-purple-50 border-purple-200 transition-all hover:shadow-md">
              <CardContent className="p-4 flex items-center">
                <Users className="h-10 w-10 text-purple-600 mr-4" />
                <div>
                  <h3 className="font-semibold">Total Voters</h3>
                  <p className="text-2xl font-bold text-purple-700">1,245</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-blue-50 border-blue-200 transition-all hover:shadow-md">
              <CardContent className="p-4 flex items-center">
                <CheckCircle className="h-10 w-10 text-blue-600 mr-4" />
                <div>
                  <h3 className="font-semibold">Total Votes Cast</h3>
                  <p className="text-2xl font-bold text-blue-700">985</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-green-50 border-green-200 transition-all hover:shadow-md">
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
        
        {hasPermission('manage', 'election') && (
          <TabsContent value="manage">
            <div className="mt-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Manage Elections</h2>
                <Button className="flex items-center gap-1" onClick={() => setIsCreateModalOpen(true)}>
                  <Plus className="h-4 w-4" />
                  Create New Election
                </Button>
              </div>
              
              <Alert className="mb-6 bg-blue-50 border-blue-200 text-blue-800">
                <AlertDescription>
                  This section allows you to create, edit, and manage all elections. Only administrators can access these controls.
                </AlertDescription>
              </Alert>
              
              <ElectionList 
                elections={elections} 
                loading={loading} 
                error={error} 
                filter="all"
              />
            </div>
          </TabsContent>
        )}
      </Tabs>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-blue-800 mb-4">Election Guidelines</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ul className="list-disc pl-5 text-blue-700 space-y-2">
            <li>All registered students are eligible to vote once in each election</li>
            <li>Elections remain open for the specified duration</li>
            <li>Results are announced immediately after the election closes</li>
          </ul>
          <ul className="list-disc pl-5 text-blue-700 space-y-2">
            <li>If you face any issues while voting, please contact the Election Committee</li>
            <li>Your vote remains confidential and secure</li>
            <li>All candidates have equal opportunity to present their manifesto</li>
          </ul>
        </div>
        
        <div className="mt-6 flex justify-center">
          <Link to="/elections/guidelines">
            <Button variant="outline" className="text-blue-700 border-blue-300 hover:bg-blue-100">
              Read Full Guidelines
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default Elections;
