import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, Calendar, Clock, Check, Users } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import useElectionApi from '@/hooks/useElectionApi';
import { useAuth } from '@/contexts/AuthContext';
import { Election, Candidate } from '@/models/election';
import { format, parseISO } from 'date-fns';
import UserRoleSwitcher from '@/components/elections/UserRoleSwitcher';

const ElectionDetailsPage = () => {
  const { electionId } = useParams<{ electionId: string }>();
  const navigate = useNavigate();
  const api = useElectionApi();
  const { user, hasPermission } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [election, setElection] = useState<Election | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [votedFor, setVotedFor] = useState<string | null>(null);
  
  // Fetch election data
  useEffect(() => {
    const fetchElectionData = async () => {
      if (!electionId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Get election details
        const electionData = await api.getElection(electionId);
        if (electionData) {
          setElection(electionData);
          
          // Get candidates
          const candidatesData = await api.getCandidates(electionId);
          if (candidatesData) {
            setCandidates(candidatesData);
          }
          
          // Check if user has voted
          const hasVotedResult = await api.hasVoted(electionId);
          if (hasVotedResult) {
            const userVote = await api.getUserVote(electionId);
            setVotedFor(userVote);
          }
        }
      } catch (err) {
        console.error('Error fetching election data:', err);
        setError('Failed to load election data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchElectionData();
  }, [electionId, api]);
  
  const handleVote = async (candidateId: string) => {
    if (!electionId) return;
    
    // Check if user has permission to vote
    if (!hasPermission('create', 'vote')) {
      api.showErrorToast('You do not have permission to vote');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      await api.castVote(electionId, candidateId);
      setVotedFor(candidateId);
    } catch (err) {
      console.error('Error casting vote:', err);
      // Error is already handled by the API hook
    } finally {
      setLoading(false);
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800 border-blue-100';
      case 'active':
        return 'bg-green-100 text-green-800 border-green-100';
      case 'completed':
        return 'bg-gray-100 text-gray-800 border-gray-100';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-100';
    }
  };
  
  const statusText = {
    upcoming: 'Upcoming',
    active: 'Ongoing',
    completed: 'Completed',
    cancelled: 'Cancelled'
  };
  
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'MMMM d, yyyy');
    } catch (e) {
      return dateString;
    }
  };
  
  return (
    <Layout>
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{election?.title}</h1>
            <div className="flex items-center mt-2">
              {election && (
                <Badge className={getStatusColor(election.status)}>
                  {statusText[election.status as keyof typeof statusText]}
                </Badge>
              )}
              <div className="ml-4 flex items-center text-sm text-muted-foreground">
                <Calendar className="mr-1 h-4 w-4" />
                <span>
                  {election && (
                    <>
                      {formatDate(election.startDate)} - {formatDate(election.endDate)}
                    </>
                  )}
                </span>
              </div>
            </div>
          </div>
          <UserRoleSwitcher />
        </div>
      </div>
      
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>About This Election</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {election.description}
              </p>
              
              <div className="flex flex-col sm:flex-row justify-between mt-6 space-y-4 sm:space-y-0">
                <div className="flex items-center">
                  <div className="bg-blue-50 p-2 rounded-full">
                    <Calendar className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-muted-foreground">Period</p>
                    <p className="font-medium">{formatDate(election.startDate)} - {formatDate(election.endDate)}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="bg-purple-50 p-2 rounded-full">
                    <Users className="h-5 w-5 text-purple-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-muted-foreground">Candidates</p>
                    <p className="font-medium">{candidates.length} Candidates</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="bg-green-50 p-2 rounded-full">
                    <Clock className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className="font-medium capitalize">{election.status}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {(election.status === 'active' || election.status === 'completed') && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Live Results</CardTitle>
                <CardDescription>
                  {election.status === 'active' 
                    ? 'Current standings as votes are being counted'
                    : 'Final election results'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis allowDecimals={false} />
                      <Tooltip formatter={(value) => [`${value} votes`, 'Votes']} />
                      <Bar 
                        dataKey="votes" 
                        fill="#8884d8" 
                        radius={[4, 4, 0, 0]}
                        label={{ position: 'top', formatter: (value: any) => `${value}` }}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Voting Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="bg-blue-100 text-blue-800 rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 mt-0.5">1</span>
                  <span>Review each candidate's manifesto carefully</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-100 text-blue-800 rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 mt-0.5">2</span>
                  <span>Click the "Vote" button for your preferred candidate</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-100 text-blue-800 rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 mt-0.5">3</span>
                  <span>Confirm your selection - you can only vote once</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-100 text-blue-800 rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 mt-0.5">4</span>
                  <span>Your vote is anonymous and secure</span>
                </li>
              </ul>
              
              {election.status === 'completed' && (
                <Alert className="mt-4">
                  <AlertTitle>This election has ended</AlertTitle>
                  <AlertDescription>
                    Voting is now closed. You can view the final results above.
                  </AlertDescription>
                </Alert>
              )}
              
              {election.status === 'upcoming' && (
                <Alert className="mt-4">
                  <AlertTitle>This election has not started yet</AlertTitle>
                  <AlertDescription>
                    Voting will begin on {formatDate(election.startDate)}.
                  </AlertDescription>
                </Alert>
              )}
              
              {votedFor && election.status === 'active' && (
                <Alert className="mt-4 bg-green-50 border-green-200">
                  <Check className="h-4 w-4 text-green-600" />
                  <AlertTitle className="text-green-800">Vote recorded</AlertTitle>
                  <AlertDescription className="text-green-700">
                    You have successfully cast your vote in this election.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      <h2 className="text-xl font-semibold mb-4">Candidates</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {candidates.map((candidate) => (
          <Card key={candidate.id} className="overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3">
                <img 
                  src={candidate.imageUrl || 'https://via.placeholder.com/300'} 
                  alt={candidate.studentName}
                  className="w-full h-full object-cover aspect-square"
                />
              </div>
              <div className="p-4 md:w-2/3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{candidate.studentName}</h3>
                    <p className="text-sm text-muted-foreground">{candidate.position}</p>
                  </div>
                  {candidate.voteCount > 0 && election?.status === 'completed' && (
                    <Badge className="bg-green-100 text-green-800 border-green-100">
                      {candidate.voteCount} votes
                    </Badge>
                  )}
                </div>
                
                <div className="mt-2 space-y-1 text-sm">
                  <p><span className="font-medium">Department:</span> {candidate.department}</p>
                  <p><span className="font-medium">Year:</span> {candidate.year}</p>
                </div>
                
                <Separator className="my-3" />
                
                <p className="text-sm mb-4">{candidate.manifesto}</p>
                
                {election?.status === 'active' && !votedFor && hasPermission('create', 'vote') && (
                  <Button 
                    onClick={() => handleVote(candidate.id)}
                    disabled={loading}
                    className="w-full"
                  >
                    {loading ? 'Processing...' : 'Vote for this Candidate'}
                  </Button>
                )}
                
                {election?.status === 'active' && votedFor === candidate.id && (
                  <Button 
                    variant="outline"
                    className="w-full border-green-500 text-green-600 flex items-center justify-center"
                    disabled={true}
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Voted
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Layout>
  );
};

export default ElectionDetailsPage;
