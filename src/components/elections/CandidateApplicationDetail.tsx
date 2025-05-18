
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Candidate } from '@/models/election';

export interface CandidateApplicationDetailProps {
  candidate: Candidate;
  onClose: () => void;
  onApprove?: () => Promise<void>;
  onReject?: () => Promise<void>;
  showApproveButtons?: boolean;
}

const CandidateApplicationDetail: React.FC<CandidateApplicationDetailProps> = ({
  candidate,
  onClose,
  onApprove,
  onReject,
  showApproveButtons = false
}) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">Candidate Application</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">ID: {candidate.id}</p>
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
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold">Candidate Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p>{candidate.studentName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Student ID</p>
              <p>{candidate.studentId}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Department</p>
              <p>{candidate.department}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Year</p>
              <p>{candidate.year}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Position</p>
              <p>{candidate.position}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Submitted</p>
              <p>{new Date(candidate.submittedAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold">Manifesto</h3>
          <p className="mt-2 text-gray-700">{candidate.manifesto}</p>
        </div>

        {candidate.imageUrl && (
          <div>
            <h3 className="font-semibold">Profile Image</h3>
            <div className="mt-2">
              <img src={candidate.imageUrl} alt="Candidate profile" className="max-w-xs rounded-md" />
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        {showApproveButtons && candidate.status === 'pending' && (
          <>
            <Button variant="destructive" onClick={onReject}>
              Reject
            </Button>
            <Button variant="default" onClick={onApprove}>
              Approve
            </Button>
          </>
        )}
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CandidateApplicationDetail;
