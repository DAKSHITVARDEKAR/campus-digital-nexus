import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import CandidateApplicationForm, { CandidateApplicationType } from './CandidateApplicationForm';
import CandidateApplicationCard from './CandidateApplicationCard';
import CandidateApplicationDetail from './CandidateApplicationDetail';
import DeleteConfirmDialog from '@/components/cheating/DeleteConfirmDialog';
import useElectionApi from '@/hooks/useElectionApi';
import UserRoleSwitcher from './UserRoleSwitcher';
import { getCurrentUser } from '@/services/appwriteAuth'; // Changed from mockAuth to appwriteAuth
import { Candidate } from '@/models/election';

// Helper function to convert API candidate to application type
const mapCandidateToApplication = (candidate) => {
  return {
    id: candidate.id,
    studentName: candidate.studentName,
    studentId: candidate.studentId,
    position: candidate.position,
    department: candidate.department || '',
    year: candidate.year || '',
    manifesto: candidate.manifesto,
    status: candidate.status,
    submittedAt: candidate.submittedAt ? new Date(candidate.submittedAt) : new Date(),
  };
};

// Helper function to map application to candidate for API
const mapApplicationToCandidate = (
  application,
  electionId
) => {
  return {
    electionId,
    studentName: application.studentName,
    studentId: application.studentId,
    position: application.position,
    department: application.department,
    year: application.year,
    manifesto: application.manifesto,
  };
};

/**
 * Manager component for candidate applications
 * @param {Object} props
 * @param {string} [props.electionId] - The ID of the election
 */
const CandidateApplicationsManager = ({ 
  electionId = 'election-2025' // Default to the current election
}) => {
  const { toast } = useToast();
  const api = useElectionApi();
  
  const [applications, setApplications] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [applicationToEdit, setApplicationToEdit] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [applicationToDelete, setApplicationToDelete] = useState(null);
  const [userRole, setUserRole] = useState('Student');
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          // Determine role from user object
          if (user.roles.includes('admin')) {
            setUserRole('Admin');
          } else if (user.roles.includes('faculty')) {
            setUserRole('Faculty');
          } else {
            setUserRole('Student');
          }
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
      }
    };
    
    fetchUserRole();
  }, []);
  
  useEffect(() => {
    const fetchCandidates = async () => {
      setLoading(true);
      try {
        const candidates = await api.getCandidates(electionId);
        if (candidates) {
          const mappedApplications = candidates.map(mapCandidateToApplication);
          setApplications(mappedApplications);
        }
      } catch (error) {
        console.error('Error fetching candidates:', error);
        toast({
          title: "Error",
          description: "Failed to load candidate applications",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchCandidates();
  }, [electionId, api, toast]);
  
  const filteredApplications = applications.filter(app => {
    if (activeTab === 'all') return true;
    return app.status === activeTab;
  });
  
  const handleViewApplication = (id) => {
    const application = applications.find(app => app.id === id);
    if (application) {
      setSelectedApplication(application);
      setIsDetailOpen(true);
    }
  };
  
  const handleEditApplication = (id) => {
    const application = applications.find(app => app.id === id);
    if (application) {
      setApplicationToEdit(application);
      setIsEditMode(true);
      setShowForm(true);
    }
  };
  
  const handleDeleteApplication = (id) => {
    setApplicationToDelete(id);
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDeleteApplication = async () => {
    if (!applicationToDelete) return;
    
    try {
      const result = await api.deleteCandidate(applicationToDelete);
      if (result !== null) {
        setApplications(prev => prev.filter(app => app.id !== applicationToDelete));
        toast({
          title: "Application Deleted",
          description: "Your candidate application has been deleted successfully."
        });
      }
    } catch (error) {
      console.error('Error deleting application:', error);
    }
    
    setApplicationToDelete(null);
    setIsDeleteDialogOpen(false);
  };
  
  const handleApproveApplication = async (id) => {
    try {
      const updatedCandidate = await api.approveCandidate(id);
      if (updatedCandidate) {
        setApplications(prev => prev.map(app => 
          app.id === id ? { ...app, status: 'approved' } : app
        ));
      }
    } catch (error) {
      console.error('Error approving application:', error);
    }
  };
  
  const handleRejectApplication = async (id) => {
    try {
      const updatedCandidate = await api.rejectCandidate(id);
      if (updatedCandidate) {
        setApplications(prev => prev.map(app => 
          app.id === id ? { ...app, status: 'rejected' } : app
        ));
      }
    } catch (error) {
      console.error('Error rejecting application:', error);
    }
  };
  
  const handleSubmitApplication = async (data) => {
    if (isEditMode && applicationToEdit) {
      // Update existing application
      try {
        const updatedCandidate = await api.updateCandidate(applicationToEdit.id, data);
        if (updatedCandidate) {
          const updatedApplication = mapCandidateToApplication(updatedCandidate);
          setApplications(prev => prev.map(app => 
            app.id === updatedApplication.id ? updatedApplication : app
          ));
        }
      } catch (error) {
        console.error('Error updating application:', error);
        return;
      }
      
      setIsEditMode(false);
      setApplicationToEdit(null);
    } else {
      // Add new application
      try {
        const candidateData = mapApplicationToCandidate(data, electionId);
        const newCandidate = await api.createCandidate(candidateData);
        
        if (newCandidate) {
          const newApplication = mapCandidateToApplication(newCandidate);
          setApplications(prev => [...prev, newApplication]);
        }
      } catch (error) {
        console.error('Error submitting application:', error);
        return;
      }
    }
    
    setShowForm(false);
  };
  
  const handleRoleChange = (role) => {
    setUserRole(role);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Candidate Applications</h2>
        <div className="flex items-center gap-4">
          {/* User role switcher for testing different permissions */}
          <UserRoleSwitcher onRoleChange={handleRoleChange} />
          
          <Button 
            onClick={() => {
              setShowForm(true);
              setIsEditMode(false);
              setApplicationToEdit(null);
            }}
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            Apply as Candidate
          </Button>
        </div>
      </div>
      
      {showForm ? (
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h3 className="text-lg font-semibold mb-4">{isEditMode ? 'Edit Application' : 'New Candidate Application'}</h3>
          <CandidateApplicationForm 
            onSubmit={handleSubmitApplication}
            initialData={applicationToEdit || {}}
            isEditMode={isEditMode}
          />
          <div className="mt-4 flex justify-end">
            <Button 
              variant="outline" 
              onClick={() => {
                setShowForm(false);
                setIsEditMode(false);
                setApplicationToEdit(null);
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="all">All Applications</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            {renderApplicationList(filteredApplications, handleViewApplication, handleEditApplication, handleDeleteApplication, handleApproveApplication, handleRejectApplication, userRole === 'Admin' || userRole === 'Faculty', loading)}
          </TabsContent>
          
          <TabsContent value="pending" className="mt-6">
            {renderApplicationList(filteredApplications, handleViewApplication, handleEditApplication, handleDeleteApplication, handleApproveApplication, handleRejectApplication, userRole === 'Admin' || userRole === 'Faculty', loading)}
          </TabsContent>
          
          <TabsContent value="approved" className="mt-6">
            {renderApplicationList(filteredApplications, handleViewApplication, handleEditApplication, handleDeleteApplication, handleApproveApplication, handleRejectApplication, userRole === 'Admin' || userRole === 'Faculty', loading)}
          </TabsContent>
          
          <TabsContent value="rejected" className="mt-6">
            {renderApplicationList(filteredApplications, handleViewApplication, handleEditApplication, handleDeleteApplication, handleApproveApplication, handleRejectApplication, userRole === 'Admin' || userRole === 'Faculty', loading)}
          </TabsContent>
        </Tabs>
      )}

      <CandidateApplicationDetail
        application={selectedApplication}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onEdit={userRole === 'Admin' || (userRole === 'Student' && selectedApplication?.status === 'pending') ? (id) => handleEditApplication(id) : undefined}
        onDelete={userRole === 'Admin' || (userRole === 'Student' && selectedApplication?.status === 'pending') ? (id) => handleDeleteApplication(id) : undefined}
        onApprove={(userRole === 'Admin' || userRole === 'Faculty') && selectedApplication?.status === 'pending' ? (id) => handleApproveApplication(id) : undefined}
        onReject={(userRole === 'Admin' || userRole === 'Faculty') && selectedApplication?.status === 'pending' ? (id) => handleRejectApplication(id) : undefined}
        isAdmin={userRole === 'Admin' || userRole === 'Faculty'}
      />

      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDeleteApplication}
        title="Delete Application"
        description="Are you sure you want to delete this candidate application? This action cannot be undone."
      />
    </div>
  );
};

const renderApplicationList = (
  applications,
  onView,
  onEdit,
  onDelete,
  onApprove,
  onReject,
  isAdmin,
  loading
) => {
  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Loading applications...</p>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">No applications found</h3>
        <p className="mt-1 text-gray-500">There are no candidate applications in this category.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {applications.map(application => (
        <CandidateApplicationCard
          key={application.id}
          application={application}
          onView={onView}
          onEdit={application.status === 'pending' && !isAdmin ? onEdit : undefined}
          onDelete={application.status === 'pending' && !isAdmin ? onDelete : undefined}
          onApprove={isAdmin && application.status === 'pending' ? onApprove : undefined}
          onReject={isAdmin && application.status === 'pending' ? onReject : undefined}
          isAdmin={isAdmin}
        />
      ))}
    </div>
  );
};

export default CandidateApplicationsManager;
