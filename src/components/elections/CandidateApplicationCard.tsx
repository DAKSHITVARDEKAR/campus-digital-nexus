
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Candidate } from '@/models/election';

export interface CandidateApplicationCardProps {
  candidate: Candidate;
  onView: () => void;
  onApprove?: () => Promise<void>;
  onReject?: () => Promise<void>;
  showApproveButtons?: boolean;
}

const CandidateApplicationCard: React.FC<CandidateApplicationCardProps> = ({
  candidate,
  onView,
  onApprove,
  onReject,
  showApproveButtons = false
}) => {
  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-medium">{candidate.studentName}</h3>
            <p className="text-sm text-muted-foreground">Running for {candidate.position}</p>
          </div>
          <Badge
            variant={
              candidate.status === 'approved'
                ? 'success'
                : candidate.status === 'rejected'
                ? 'destructive'
                : 'outline'
            }
          >
            {candidate.status?.charAt(0).toUpperCase() + candidate.status?.slice(1)}
          </Badge>
        </div>

        <div className="text-sm space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Department:</span>
            <span>{candidate.department}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Year:</span>
            <span>{candidate.year}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Submitted:</span>
            <span>{new Date(candidate.submittedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        {showApproveButtons && candidate.status === 'pending' && (
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
