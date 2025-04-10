
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, User, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { CandidateApplicationType } from './CandidateApplicationForm';

type CandidateApplicationCardProps = {
  application: CandidateApplicationType;
  onView: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  isAdmin?: boolean;
};

const CandidateApplicationCard: React.FC<CandidateApplicationCardProps> = ({ 
  application, 
  onView,
  onEdit,
  onDelete,
  onApprove,
  onReject,
  isAdmin = false
}) => {
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
    <Card className="overflow-hidden">
      <CardHeader className="p-4 pb-2 space-y-1">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold line-clamp-1">
            {application.studentName}
          </CardTitle>
          <Badge className={getStatusColor(application.status)}>
            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-1">{application.position}</p>
      </CardHeader>
      <CardContent className="p-4 pt-2 space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <User className="h-4 w-4 text-gray-500" />
          <span>{application.department}, {application.year}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-gray-500" />
          <span>Submitted: {format(application.submittedAt, 'MMM d, yyyy')}</span>
        </div>
        <p className="text-sm leading-relaxed line-clamp-2">
          {application.manifesto}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onView(application.id)}
        >
          View Details
        </Button>
        <div className="flex gap-2">
          {isAdmin && application.status === 'pending' && (
            <>
              <Button 
                variant="outline" 
                size="sm"
                className="text-green-600 hover:text-green-700 hover:bg-green-50" 
                onClick={() => onApprove && onApprove(application.id)}
              >
                <CheckCircle className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="text-red-500 hover:text-red-700 hover:bg-red-50" 
                onClick={() => onReject && onReject(application.id)}
              >
                <XCircle className="h-4 w-4" />
              </Button>
            </>
          )}
          {onEdit && application.status === 'pending' && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={(e) => {
                e.stopPropagation();
                onEdit(application.id);
              }}
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
          {onDelete && application.status === 'pending' && (
            <Button 
              variant="ghost" 
              size="sm"
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(application.id);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default CandidateApplicationCard;
