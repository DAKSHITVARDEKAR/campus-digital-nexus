
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import CandidateApplicationForm, { CandidateApplicationType } from './CandidateApplicationForm';
import CandidateApplicationCard from './CandidateApplicationCard';
import CandidateApplicationDetail from './CandidateApplicationDetail';
import DeleteConfirmDialog from '@/components/cheating/DeleteConfirmDialog';

// Mock data for applications
const mockApplications = [
  {
    id: '1',
    studentName: 'Alex Chen',
    studentId: 'ST12345',
    position: 'President',
    department: 'Computer Science',
    year: '3rd Year',
    manifesto: 'I plan to enhance the academic resources and create more opportunities for technical skill development.',
    status: 'approved' as const,
    submittedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  },
  {
    id: '2',
    studentName: 'Sarah Johnson',
    studentId: 'ST54321',
    position: 'Vice President',
    department: 'Business Administration',
    year: '2nd Year',
    manifesto: 'My aim is to bridge the gap between students and administration, ensuring every voice is heard.',
    status: 'pending' as const,
    submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
  },
  {
    id: '3',
    studentName: 'Michael Brown',
    studentId: 'ST67890',
    position: 'Secretary',
    department: 'Engineering',
    year: '4th Year',
    manifesto: 'I will focus on improving infrastructure and creating better study environments.',
    status: 'pending' as const,
    submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
  },
  {
    id: '4',
    studentName: 'Jessica Lee',
    studentId: 'ST24680',
    position: 'Treasurer',
    department: 'Finance',
    year: '3rd Year',
    manifesto: 'I bring strong financial management skills to ensure transparent and efficient use of student funds.',
    status: 'rejected' as const,
    submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
  }
];

const CandidateApplicationsManager: React.FC = () => {
  const { toast } = useToast();
  const [applications, setApplications] = useState<CandidateApplicationType[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<CandidateApplicationType | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [applicationToEdit, setApplicationToEdit] = useState<CandidateApplicationType | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [applicationToDelete, setApplicationToDelete] = useState<string | null>(null);
  
  // For demo purposes - admin controls
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // In a real app, this would fetch from API
    setApplications(mockApplications);
  }, []);

  const filteredApplications = applications.filter(app => {
    if (activeTab === 'all') return true;
    return app.status === activeTab;
  });

  const handleViewApplication = (id: string) => {
    const application = applications.find(app => app.id === id);
    if (application) {
      setSelectedApplication(application);
      setIsDetailOpen(true);
    }
  };

  const handleEditApplication = (id: string) => {
    const application = applications.find(app => app.id === id);
    if (application) {
      setApplicationToEdit(application);
      setIsEditMode(true);
      setShowForm(true);
    }
  };

  const handleDeleteApplication = (id: string) => {
    setApplicationToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteApplication = () => {
    if (!applicationToDelete) return;
    
    setApplications(prev => prev.filter(app => app.id !== applicationToDelete));
    toast({
      title: "Application Deleted",
      description: "Your candidate application has been deleted successfully."
    });
    
    setApplicationToDelete(null);
    setIsDeleteDialogOpen(false);
  };

  const handleApproveApplication = (id: string) => {
    setApplications(prev => prev.map(app => 
      app.id === id ? { ...app, status: 'approved' as const } : app
    ));
    toast({
      title: "Application Approved",
      description: "The candidate application has been approved."
    });
  };

  const handleRejectApplication = (id: string) => {
    setApplications(prev => prev.map(app => 
      app.id === id ? { ...app, status: 'rejected' as const } : app
    ));
    toast({
      title: "Application Rejected",
      description: "The candidate application has been rejected."
    });
  };

  const handleSubmitApplication = (data: Omit<CandidateApplicationType, 'id' | 'status' | 'submittedAt'>) => {
    if (isEditMode && applicationToEdit) {
      // Update existing application
      setApplications(prev => prev.map(app => 
        app.id === applicationToEdit.id ? { 
          ...app, 
          ...data
        } : app
      ));
      setIsEditMode(false);
      setApplicationToEdit(null);
    } else {
      // Add new application
      const newApplication: CandidateApplicationType = {
        id: `app-${Date.now()}`,
        ...data,
        status: 'pending',
        submittedAt: new Date()
      };
      setApplications(prev => [...prev, newApplication]);
    }
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Candidate Applications</h2>
        <div className="flex items-center gap-4">
          {/* Toggle for demo purposes - in a real app, would be based on user role */}
          <Button 
            variant="outline" 
            onClick={() => setIsAdmin(!isAdmin)}
            className={isAdmin ? "bg-blue-50 text-blue-600" : ""}
          >
            {isAdmin ? "Admin Mode" : "Student Mode"}
          </Button>
          
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
            {renderApplicationList(filteredApplications, handleViewApplication, handleEditApplication, handleDeleteApplication, handleApproveApplication, handleRejectApplication, isAdmin)}
          </TabsContent>
          
          <TabsContent value="pending" className="mt-6">
            {renderApplicationList(filteredApplications, handleViewApplication, handleEditApplication, handleDeleteApplication, handleApproveApplication, handleRejectApplication, isAdmin)}
          </TabsContent>
          
          <TabsContent value="approved" className="mt-6">
            {renderApplicationList(filteredApplications, handleViewApplication, handleEditApplication, handleDeleteApplication, handleApproveApplication, handleRejectApplication, isAdmin)}
          </TabsContent>
          
          <TabsContent value="rejected" className="mt-6">
            {renderApplicationList(filteredApplications, handleViewApplication, handleEditApplication, handleDeleteApplication, handleApproveApplication, handleRejectApplication, isAdmin)}
          </TabsContent>
        </Tabs>
      )}

      <CandidateApplicationDetail
        application={selectedApplication}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onEdit={!isAdmin ? handleEditApplication : undefined}
        onDelete={!isAdmin ? handleDeleteApplication : undefined}
        onApprove={isAdmin ? handleApproveApplication : undefined}
        onReject={isAdmin ? handleRejectApplication : undefined}
        isAdmin={isAdmin}
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
  applications: CandidateApplicationType[],
  onView: (id: string) => void,
  onEdit: (id: string) => void,
  onDelete: (id: string) => void,
  onApprove: (id: string) => void,
  onReject: (id: string) => void,
  isAdmin: boolean
) => {
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
