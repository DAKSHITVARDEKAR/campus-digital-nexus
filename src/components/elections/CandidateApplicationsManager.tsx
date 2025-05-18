
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Candidate } from '@/models/election';
import { useAuth } from '@/contexts/AuthContext';
import useElectionApi from '@/hooks/useElectionApi';
import CandidateApplicationCard from './CandidateApplicationCard';
import CandidateApplicationForm from './CandidateApplicationForm';
import CandidateApplicationDetail from './CandidateApplicationDetail';

// Ensure these types match the component property interfaces
type CandidateApplicationType = Candidate;

interface CandidateApplicationsManagerProps {
  electionId: string;
}

const CandidateApplicationsManager: React.FC<CandidateApplicationsManagerProps> = ({ 
  electionId 
}) => {
  const [activeTab, setActiveTab] = useState<string>('view');
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [filteredCandidates, setFilteredCandidates] = useState<Candidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  
  const { toast } = useToast();
  const { user, hasPermission } = useAuth();
  const { 
    loading, 
    error, 
    getCandidates, 
    approveCandidate, 
    rejectCandidate 
  } = useElectionApi();

  // Fetch candidates
  useEffect(() => {
    const fetchCandidates = async () => {
      if (!electionId) return;
      
      const result = await getCandidates(electionId);
      if (result && Array.isArray(result)) {
        setCandidates(result as Candidate[]);
      }
    };
    
    fetchCandidates();
  }, [electionId, getCandidates]);

  // Apply filters
  useEffect(() => {
    if (!candidates || candidates.length === 0) {
      setFilteredCandidates([]);
      return;
    }
    
    let filtered = [...candidates];
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(candidate => candidate.status === statusFilter);
    }
    
    // Apply user-specific filter for non-admins
    if (!hasPermission('manage', 'election')) {
      filtered = filtered.filter(candidate => 
        candidate.studentId === user?.userId || candidate.status === 'approved'
      );
    }
    
    setFilteredCandidates(filtered);
  }, [candidates, statusFilter, user, hasPermission]);

  const handleViewDetails = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setIsDetailModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsDetailModalOpen(false);
    setSelectedCandidate(null);
  };

  const handleApproveCandidate = async (candidate: Candidate) => {
    if (!candidate) return;
    
    try {
      await approveCandidate(candidate.id);
      
      // Update local state
      setCandidates(prev => 
        prev.map(c => 
          c.id === candidate.id ? { ...c, status: 'approved' } : c
        )
      );
      
      toast({
        title: "Candidate approved",
        description: "The candidate application has been approved.",
      });
      
      handleCloseModal();
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to approve the candidate. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRejectCandidate = async (candidate: Candidate) => {
    if (!candidate) return;
    
    try {
      await rejectCandidate(candidate.id);
      
      // Update local state
      setCandidates(prev => 
        prev.map(c => 
          c.id === candidate.id ? { ...c, status: 'rejected' } : c
        )
      );
      
      toast({
        title: "Candidate rejected",
        description: "The candidate application has been rejected.",
      });
      
      handleCloseModal();
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to reject the candidate. Please try again.",
        variant: "destructive",
      });
    }
  };

  const canApproveCandidates = user && hasPermission('approve', 'candidate');

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="view">View Applications</TabsTrigger>
          <TabsTrigger value="apply">Apply as Candidate</TabsTrigger>
        </TabsList>
        
        <TabsContent value="view" className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {canApproveCandidates && (
            <div className="flex space-x-2">
              <Button 
                variant={statusFilter === 'all' ? 'secondary' : 'outline'} 
                onClick={() => setStatusFilter('all')}
              >
                All
              </Button>
              <Button 
                variant={statusFilter === 'pending' ? 'secondary' : 'outline'} 
                onClick={() => setStatusFilter('pending')}
              >
                Pending
              </Button>
              <Button 
                variant={statusFilter === 'approved' ? 'secondary' : 'outline'} 
                onClick={() => setStatusFilter('approved')}
              >
                Approved
              </Button>
              <Button 
                variant={statusFilter === 'rejected' ? 'secondary' : 'outline'} 
                onClick={() => setStatusFilter('rejected')}
              >
                Rejected
              </Button>
            </div>
          )}
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((_, i) => (
                <div key={i} className="border rounded-lg p-4 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                </div>
              ))}
            </div>
          ) : filteredCandidates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCandidates.map((candidate) => (
                <CandidateApplicationCard
                  key={candidate.id}
                  candidate={candidate}
                  onView={() => handleViewDetails(candidate)}
                  isAdmin={canApproveCandidates}
                  onApprove={canApproveCandidates ? () => handleApproveCandidate(candidate) : undefined}
                  onReject={canApproveCandidates ? () => handleRejectCandidate(candidate) : undefined}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-medium mb-2">No applications found</h3>
              <p className="text-gray-600 mb-4">
                {statusFilter !== 'all' 
                  ? `No ${statusFilter} applications available.` 
                  : 'There are no candidate applications yet.'
                }
              </p>
              {user && !canApproveCandidates && (
                <Button onClick={() => setActiveTab('apply')}>
                  Apply as Candidate
                </Button>
              )}
            </div>
          )}
          
          {isDetailModalOpen && selectedCandidate && (
            <CandidateApplicationDetail
              candidate={selectedCandidate}
              onClose={handleCloseModal}
              onApprove={canApproveCandidates ? () => handleApproveCandidate(selectedCandidate) : undefined}
              onReject={canApproveCandidates ? () => handleRejectCandidate(selectedCandidate) : undefined}
              isAdmin={canApproveCandidates}
              isOpen={true}
            />
          )}
        </TabsContent>
        
        <TabsContent value="apply">
          <CandidateApplicationForm electionId={electionId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CandidateApplicationsManager;
