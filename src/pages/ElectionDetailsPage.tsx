
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Election, Candidate } from '@/models/election';
import useElectionApi from '@/hooks/useElectionApi';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const ElectionDetailsPage: React.FC = () => {
  const { electionId } = useParams<{ electionId: string }>();
  const [election, setElection] = useState<Election | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [votedFor, setVotedFor] = useState<string>("");
  const { loading, error, getElection, getCandidates, castVote, hasVoted, getUserVote } = useElectionApi();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchData = async () => {
      if (!electionId) return;
      
      const electionData = await getElection(electionId);
      if (electionData) {
        setElection(electionData as Election);
      }
      
      const candidatesData = await getCandidates(electionId);
      if (candidatesData && Array.isArray(candidatesData)) {
        setCandidates(candidatesData as Candidate[]);
      }
      
      if (user) {
        const hasVotedResult = await hasVoted(electionId);
        if (hasVotedResult) {
          const userVote = await getUserVote(electionId);
          if (userVote) {
            setVotedFor(userVote as string);
          }
        }
      }
    };
    
    fetchData();
  }, [electionId, getElection, getCandidates, hasVoted, getUserVote, user]);

  const handleVote = async (candidateId: string) => {
    if (!electionId || !user) return;
    
    if (votedFor) {
      toast({
        title: "Already voted",
        description: "You have already cast your vote in this election.",
        variant: "destructive"
      });
      return;
    }
    
    const result = await castVote(electionId, candidateId);
    if (result) {
      setVotedFor(candidateId);
      toast({
        title: "Vote recorded",
        description: "Your vote has been successfully recorded.",
      });
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="border rounded-lg p-6">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-24 bg-gray-200 rounded mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-full"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto p-6">
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button onClick={() => navigate('/elections')} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Elections
          </Button>
        </div>
      </Layout>
    );
  }

  if (!election) {
    return (
      <Layout>
        <div className="container mx-auto p-6">
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Election not found or has been removed.</AlertDescription>
          </Alert>
          <Button onClick={() => navigate('/elections')} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Elections
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <Button onClick={() => navigate('/elections')} variant="outline" className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Elections
        </Button>
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{election.title}</h1>
          <p className="text-gray-600 mb-4">{election.description}</p>
          
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="bg-gray-100 px-3 py-1 rounded-full">
              Status: <span className="font-semibold">{election.status.charAt(0).toUpperCase() + election.status.slice(1)}</span>
            </div>
            <div className="bg-gray-100 px-3 py-1 rounded-full">
              Start: <span className="font-semibold">{new Date(election.startDate).toLocaleDateString()}</span>
            </div>
            <div className="bg-gray-100 px-3 py-1 rounded-full">
              End: <span className="font-semibold">{new Date(election.endDate).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        
        {votedFor && (
          <Alert className="mb-6">
            <AlertDescription>
              You have already voted in this election. Thank you for participating!
            </AlertDescription>
          </Alert>
        )}
        
        <h2 className="text-2xl font-bold mb-4">Candidates</h2>
        
        {candidates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {candidates.map(candidate => (
              <div key={candidate.id} className="border rounded-lg p-6 bg-white shadow-sm">
                <h3 className="text-xl font-bold mb-1">{candidate.studentName}</h3>
                <p className="text-gray-500 mb-4">Position: {candidate.position}</p>
                
                {candidate.imageUrl && (
                  <div className="mb-4">
                    <img 
                      src={candidate.imageUrl} 
                      alt={`${candidate.studentName} - Candidate`} 
                      className="w-full h-40 object-cover rounded" 
                    />
                  </div>
                )}
                
                <p className="mb-4 text-sm">{candidate.manifesto}</p>
                
                <Button 
                  onClick={() => handleVote(candidate.id)}
                  disabled={!!votedFor || election.status !== 'active' || !user}
                  variant={votedFor === candidate.id ? "secondary" : "default"}
                  className="w-full"
                >
                  {votedFor === candidate.id ? "Voted" : "Vote"}
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">No candidates yet</h3>
            <p className="text-gray-600">
              There are no candidates registered for this election yet.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ElectionDetailsPage;
