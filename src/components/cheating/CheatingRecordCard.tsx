
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, Calendar, User, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

export type CheatingRecordType = {
  id: string;
  studentName: string;
  studentId: string;
  course: string;
  reason: string;
  severity: 'minor' | 'moderate' | 'severe';
  proofAvailable: boolean;
  date: Date;
  reportedBy: string;
};

type CheatingRecordCardProps = {
  record: CheatingRecordType;
  onViewDetails: (id: string) => void;
  onEditRecord?: (id: string) => void;
  onDeleteRecord?: (id: string) => void;
};

const CheatingRecordCard: React.FC<CheatingRecordCardProps> = ({ 
  record, 
  onViewDetails,
  onEditRecord,
  onDeleteRecord 
}) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'minor':
        return 'bg-yellow-100 text-yellow-800 border-yellow-100';
      case 'moderate':
        return 'bg-orange-100 text-orange-800 border-orange-100';
      case 'severe':
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
            {record.studentName}
          </CardTitle>
          <Badge className={getSeverityColor(record.severity)}>
            {record.severity.charAt(0).toUpperCase() + record.severity.slice(1)}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-1">{record.course}</p>
      </CardHeader>
      <CardContent className="p-4 pt-2 space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <User className="h-4 w-4 text-gray-500" />
          <span>ID: {record.studentId}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-gray-500" />
          <span>{format(record.date, 'MMM d, yyyy')}</span>
        </div>
        <p className="text-sm leading-relaxed line-clamp-2">
          {record.reason}
        </p>
        {record.proofAvailable && (
          <div className="flex items-center gap-1.5 text-xs">
            <AlertCircle className="h-3.5 w-3.5 text-blue-500" />
            <span className="text-blue-600 font-medium">
              Proof documentation available
            </span>
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onViewDetails(record.id)}
        >
          View Details
        </Button>
        <div className="flex gap-2">
          {onEditRecord && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={(e) => {
                e.stopPropagation();
                onEditRecord(record.id);
              }}
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
          {onDeleteRecord && (
            <Button 
              variant="ghost" 
              size="sm"
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteRecord(record.id);
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

export default CheatingRecordCard;
