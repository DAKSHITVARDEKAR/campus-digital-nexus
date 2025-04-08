
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, Calendar, Clock, Check, Users } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

// Mock data - would be fetched from Firestore in a real implementation
const electionData = {
  "election-2025": {
    id: 'election-2025',
    title: 'Student Council Election 2025',
    description: 'Vote for your student representatives for the academic year 2025-2026. The elected council will represent student interests in administrative decisions and organize campus events.',
    startDate: 'April 10, 2025',
    endDate: 'April 15, 2025',
    status: 'ongoing',
    candidates: [
      {
        id: 'candidate-1',
        name: 'Alex Johnson',
        position: 'President',
        department: 'Computer Science',
        year: '3rd Year',
        manifesto: 'Committed to improving campus technology infrastructure and creating more internship opportunities.',
        imageUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
        voteCount: 145
      },
      {
        id: 'candidate-2',
        name: 'Samantha Wilson',
        position: 'President',
        department: 'Business Administration',
        year: '3rd Year',
        manifesto: 'Focused on enhancing student welfare services and creating a more inclusive campus environment.',
        imageUrl: 'https://randomuser.me/api/portraits/women/65.jpg',
        voteCount: 132
      },
      {
        id: 'candidate-3',
        name: 'Miguel Hernandez',
        position: 'Vice President',
        department: 'Engineering',
        year: '2nd Year',
        manifesto: 'Will work to improve academic resources and establish stronger industry connections.',
        imageUrl: 'https://randomuser.me/api/portraits/men/45.jpg',
        voteCount: 98
      },
      {
        id: 'candidate-4',
        name: 'Emily Zhang',
        position: 'Vice President',
        department: 'Life Sciences',
        year: '3rd Year',
        manifesto: 'Dedicated to sustainability initiatives and creating more research opportunities for undergraduates.',
        imageUrl: 'https://randomuser.me/api/portraits/women/32.jpg',
        voteCount: 110
      }
    ]
  },
  "election-past": {
    id: 'election-past',
    title: 'Student Council Election 2024',
    description: 'Student Council election for the academic year 2024-2025.',
    startDate: 'April 10, 2024',
    endDate: 'April 15, 2024',
    status: 'completed',
    candidates: [
      {
        id: 'past-candidate-1',
        name: 'Taylor Smith',
        position: 'President',
        department: 'Psychology',
        year: '3rd Year',
        manifesto: 'Focused on mental health resources and academic support services.',
        imageUrl: 'https://randomuser.me/api/portraits/women/22.jpg',
        voteCount: 178,
        elected: true
      },
      {
        id: 'past-candidate-2',
        name: 'Omar Khan',
        position: 'President',
        department: 'Political Science',
        year: '3rd Year',
        manifesto: 'Advocating for more student involvement in university governance.',
        imageUrl: 'https://randomuser.me/api/portraits/men/21.jpg',
        voteCount: 132
      }
    ]
  }
};

const ElectionDetailsPage = () => {
  const { electionId } = useParams<{ electionId: string }>();
  const [loading, setLoading] = useState(false);
  const [votedFor, setVotedFor] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // In a real implementation, this would be fetched from Firestore
  const election = electionData[electionId as keyof typeof electionData];
  
  if (!election) {
    return (
      <Layout>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Election not found. Please select a valid election.</AlertDescription>
        </Alert>
        <Button onClick={() => navigate('/elections')} className="mt-4">
          Back to Elections
        </Button>
      </Layout>
    );
  }
  
  const handleVote = async (candidateId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real implementation, this would call a Firebase Cloud Function
      // await castVote({ electionId, candidateId });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setVotedFor(candidateId);
      toast({
        title: "Vote Cast Successfully",
        description: "Your vote has been recorded. Thank you for participating!",
      });
    } catch (err) {
      setError("There was an error processing your vote. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800 border-blue-100';
      case 'ongoing':
        return 'bg-green-100 text-green-800 border-green-100';
      case 'completed':
        return 'bg-gray-100 text-gray-800 border-gray-100';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-100';
    }
  };
  
  const statusText = {
    upcoming: 'Upcoming',
    ongoing: 'Ongoing',
    completed: 'Completed'
  };
  
  // Prepare chart data
  const chartData = election.candidates.map(candidate => ({
    name: candidate.name.split(' ')[0], // Just use first name for brevity
    votes: candidate.voteCount
  }));
  
  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">{election.title}</h1>
        <div className="flex items-center mt-2">
          <Badge className={getStatusColor(election.status)}>
            {statusText[election.status as keyof typeof statusText]}
          </Badge>
          <div className="ml-4 flex items-center text-sm text-muted-foreground">
            <Calendar className="mr-1 h-4 w-4" />
            <span>{election.startDate} - {election.endDate}</span>
          </div>
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
                    <p className="font-medium">{election.startDate} - {election.endDate}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="bg-purple-50 p-2 rounded-full">
                    <Users className="h-5 w-5 text-purple-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-muted-foreground">Candidates</p>
                    <p className="font-medium">{election.candidates.length} Candidates</p>
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
          
          {/* Results Chart (visible for ongoing and completed elections) */}
          {(election.status === 'ongoing' || election.status === 'completed') && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Live Results</CardTitle>
                <CardDescription>
                  {election.status === 'ongoing' 
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
                    Voting will begin on {election.startDate}.
                  </AlertDescription>
                </Alert>
              )}
              
              {votedFor && election.status === 'ongoing' && (
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
        {election.candidates.map((candidate) => (
          <Card key={candidate.id} className="overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3">
                <img 
                  src={candidate.imageUrl} 
                  alt={candidate.name}
                  className="w-full h-full object-cover aspect-square"
                />
              </div>
              <div className="p-4 md:w-2/3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{candidate.name}</h3>
                    <p className="text-sm text-muted-foreground">{candidate.position}</p>
                  </div>
                  {candidate.elected && (
                    <Badge className="bg-green-100 text-green-800 border-green-100">
                      Elected
                    </Badge>
                  )}
                </div>
                
                <div className="mt-2 space-y-1 text-sm">
                  <p><span className="font-medium">Department:</span> {candidate.department}</p>
                  <p><span className="font-medium">Year:</span> {candidate.year}</p>
                </div>
                
                <Separator className="my-3" />
                
                <p className="text-sm mb-4">{candidate.manifesto}</p>
                
                {election.status === 'ongoing' && !votedFor && (
                  <Button 
                    onClick={() => handleVote(candidate.id)}
                    disabled={loading}
                    className="w-full"
                  >
                    {loading ? 'Processing...' : 'Vote for this Candidate'}
                  </Button>
                )}
                
                {election.status === 'ongoing' && votedFor === candidate.id && (
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
