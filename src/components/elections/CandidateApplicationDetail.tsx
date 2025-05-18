
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Candidate } from '@/models/election';

type CandidateApplicationDetailProps = {
  application: Candidate;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  isAdmin?: boolean;
};

const CandidateApplicationDetail: React.FC<CandidateApplicationDetailProps> = ({
  application,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onApprove,
  onReject,
  isAdmin = false
}) => {
  if (!application) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-100';
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-100';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-100';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-100';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Candidate Application</span>
            <Badge className={getStatusColor(application.status)}>
              {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Submitted on {format(new Date(application.submittedAt), 'MMMM d, yyyy')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div>
            <h3 className="font-semibold text-lg">{application.studentName}</h3>
            <p className="text-sm text-muted-foreground">ID: {application.studentId}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium">Position</p>
              <p>{application.position}</p>
            </div>
            <div>
              <p className="font-medium">Department</p>
              <p>{application.department}</p>
            </div>
          </div>

          <div>
            <p className="font-medium">Year of Study</p>
            <p className="text-sm">{application.year}</p>
          </div>

          <div>
            <p className="font-medium">Manifesto / Statement</p>
            <p className="text-sm whitespace-pre-line">{application.manifesto}</p>
          </div>
        </div>

        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
          <Button variant="outline" onClick={onClose}>Close</Button>
          
          <div className="flex gap-2 mb-2 sm:mb-0">
            {isAdmin && application.status === 'pending' && (
              <>
                <Button 
                  variant="outline"
                  className="text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700"
                  onClick={() => onApprove && onApprove(application.id)}
                >
                  Approve
                </Button>
                <Button 
                  variant="outline"
                  className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                  onClick={() => onReject && onReject(application.id)}
                >
                  Reject
                </Button>
              </>
            )}
            {onEdit && application.status === 'pending' && (
              <Button 
                onClick={() => {
                  onClose();
                  onEdit(application.id);
                }}
              >
                Edit
              </Button>
            )}
            {onDelete && application.status === 'pending' && (
              <Button 
                variant="destructive"
                onClick={() => {
                  onClose();
                  onDelete(application.id);
                }}
              >
                Delete
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CandidateApplicationDetail;
