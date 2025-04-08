
import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertCircle, Eye, CheckCircle, XCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

// Mock data for board review items
const mockBoardItems = [
  {
    id: '1',
    type: 'anonymous_reveal',
    title: 'Identity Reveal Request',
    submittedBy: 'Academic Affairs Committee',
    date: 'Apr 12, 2025',
    description: 'Request to reveal identity of anonymous complaint #A-2025-103 regarding academic misconduct.',
    status: 'pending',
    urgency: 'high'
  },
  {
    id: '2',
    type: 'budget_exception',
    title: 'Special Budget Allocation',
    submittedBy: 'Finance Department',
    date: 'Apr 10, 2025',
    description: 'Request for special allocation of $5,000 for emergency repairs to science laboratory equipment.',
    status: 'pending',
    urgency: 'medium'
  },
  {
    id: '3',
    type: 'policy_change',
    title: 'Academic Calendar Modification',
    submittedBy: 'Registrar Office',
    date: 'Apr 8, 2025',
    description: 'Proposal to extend the current semester by one week due to multiple snow days.',
    status: 'pending',
    urgency: 'medium'
  },
  {
    id: '4',
    type: 'special_case',
    title: 'Student Disciplinary Case',
    submittedBy: 'Student Affairs',
    date: 'Apr 5, 2025',
    description: 'Appeal of disciplinary action for student ID #ST-2025-4872.',
    status: 'pending',
    urgency: 'high'
  }
];

const BoardReviewPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [boardItems, setBoardItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'detail'
  const { toast } = useToast();
  const navigate = useNavigate();

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setBoardItems(mockBoardItems);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleViewItem = (item) => {
    setSelectedItem(item);
    setViewMode('detail');
  };

  const handleBack = () => {
    setViewMode('list');
    setSelectedItem(null);
  };

  const handleApprove = (item) => {
    // In a real app, this would call an API
    toast({
      title: "Item Approved",
      description: `You have approved: ${item.title}`,
    });
    
    // Update local state to reflect change
    setBoardItems(boardItems.map(boardItem => 
      boardItem.id === item.id ? {...boardItem, status: 'approved'} : boardItem
    ));
    
    setViewMode('list');
    setSelectedItem(null);
  };

  const handleReject = (item) => {
    // In a real app, this would call an API
    toast({
      title: "Item Rejected",
      description: `You have rejected: ${item.title}`,
      variant: "destructive"
    });
    
    // Update local state to reflect change
    setBoardItems(boardItems.map(boardItem => 
      boardItem.id === item.id ? {...boardItem, status: 'rejected'} : boardItem
    ));
    
    setViewMode('list');
    setSelectedItem(null);
  };

  // Helper function to render the urgency badge with appropriate variant
  const renderUrgencyBadge = (urgency) => {
    switch(urgency) {
      case 'high':
        return <Badge variant="destructive">High</Badge>;
      case 'medium':
        return <Badge variant="secondary">Medium</Badge>;
      case 'low':
        return <Badge variant="outline">Low</Badge>;
      default:
        return <Badge variant="outline">{urgency}</Badge>;
    }
  };

  // Helper function to render the status badge
  const renderStatusBadge = (status) => {
    switch(status) {
      case 'approved':
        return <Badge className="bg-green-500">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Render the item list view
  const renderListView = () => (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Board Review Items</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : boardItems.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Submitted By</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Urgency</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {boardItems.map(item => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.title}</TableCell>
                    <TableCell>{item.submittedBy}</TableCell>
                    <TableCell>{item.date}</TableCell>
                    <TableCell>{renderUrgencyBadge(item.urgency)}</TableCell>
                    <TableCell>{renderStatusBadge(item.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleViewItem(item)}
                        disabled={item.status !== 'pending'}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Review
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-6">
            <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">No pending items for board review</p>
          </div>
        )}
      </CardContent>
    </Card>
  );

  // Render the item detail view
  const renderDetailView = () => selectedItem && (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl font-bold">{selectedItem.title}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Submitted by {selectedItem.submittedBy} on {selectedItem.date}
            </p>
          </div>
          <div>{renderUrgencyBadge(selectedItem.urgency)}</div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold mb-2">Description</h3>
          <p>{selectedItem.description}</p>
        </div>
        
        <Separator />
        
        {selectedItem.type === 'anonymous_reveal' && (
          <div>
            <h3 className="font-semibold mb-2">Important Information</h3>
            <p className="text-sm text-muted-foreground">
              By approving this request, you will allow the original submitter's identity to be revealed to authorized personnel.
              Please ensure this action complies with college policy and is necessary for the resolution of the matter at hand.
            </p>
          </div>
        )}
        
        {selectedItem.type === 'budget_exception' && (
          <div>
            <h3 className="font-semibold mb-2">Budget Impact</h3>
            <p className="text-sm text-muted-foreground">
              This exception would utilize funds from the emergency reserve allocation.
              Current reserve balance: $25,000. This request represents 20% of available reserves.
            </p>
          </div>
        )}
        
        {selectedItem.type === 'policy_change' && (
          <div>
            <h3 className="font-semibold mb-2">Policy Implications</h3>
            <p className="text-sm text-muted-foreground">
              This change would affect all academic departments and require adjustments to the examination schedule.
              The registrar has confirmed technical feasibility of the change.
            </p>
          </div>
        )}
        
        {selectedItem.type === 'special_case' && (
          <div>
            <h3 className="font-semibold mb-2">Confidential Information</h3>
            <p className="text-sm text-muted-foreground">
              This case involves a potential violation of the college's academic integrity policy.
              The student has requested a formal hearing with the board.
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleBack}>
          Back to List
        </Button>
        <div className="space-x-2">
          <Button variant="destructive" onClick={() => handleReject(selectedItem)}>
            <XCircle className="h-4 w-4 mr-1" />
            Reject
          </Button>
          <Button onClick={() => handleApprove(selectedItem)}>
            <CheckCircle className="h-4 w-4 mr-1" />
            Approve
          </Button>
        </div>
      </CardFooter>
    </Card>
  );

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Board Member Review</h1>
        </div>
        
        <div className="mb-6">
          <p className="text-muted-foreground">
            As a faculty board member, you are responsible for reviewing sensitive matters that require collective decision-making. 
            Please review each item carefully before making your decision.
          </p>
        </div>
        
        {viewMode === 'list' ? renderListView() : renderDetailView()}
      </div>
    </Layout>
  );
};

export default BoardReviewPage;
