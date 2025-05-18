
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Candidate } from '@/models/election';

export interface CandidateApplicationCardProps {
  candidate: Candidate;
  application?: Candidate; // For backward compatibility
  onView: () => void;
  onApprove?: () => Promise<void>;
  onReject?: () => Promise<void>;
  showApproveButtons?: boolean;
  isAdmin?: boolean;
}

const CandidateApplicationCard: React.FC<CandidateApplicationCardProps> = ({
  candidate,
  application, // For backward compatibility
  onView,
  onApprove,
  onReject,
  showApproveButtons = false,
  isAdmin = false
}) => {
  // Use candidate prop, fallback to application prop for backward compatibility
  const candidateData = candidate || application;
  if (!candidateData) return null;
  
  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-medium">{candidateData.studentName}</h3>
            <p className="text-sm text-muted-foreground">Running for {candidateData.position}</p>
          </div>
          <Badge
            variant={
              candidateData.status === 'approved'
                ? 'secondary' // Changed from 'success' to 'secondary'
                : candidateData.status === 'rejected'
                ? 'destructive'
                : 'outline'
            }
          >
            {candidateData.status?.charAt(0).toUpperCase() + candidateData.status?.slice(1)}
          </Badge>
        </div>

        <div className="text-sm space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Department:</span>
            <span>{candidateData.department}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Year:</span>
            <span>{candidateData.year}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Submitted:</span>
            <span>{new Date(candidateData.submittedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        {(showApproveButtons || isAdmin) && candidateData.status === 'pending' && (
          <>
            <Button size="sm" variant="destructive" onClick={onReject}>
              Reject
            </Button>
            <Button size="sm" variant="default" onClick={onApprove}>
              Approve
            </Button>
          </>
        )}
        <Button size="sm" variant="outline" onClick={onView}>
          View
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CandidateApplicationCard;
