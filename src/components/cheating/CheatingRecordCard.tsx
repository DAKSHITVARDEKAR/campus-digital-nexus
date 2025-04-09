
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, AlertTriangle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export interface CheatingRecordType {
  id: string;
  studentName: string;
  studentId: string;
  course: string;
  reason: string;
  severity: 'minor' | 'moderate' | 'severe';
  proofAvailable: boolean;
  date: Date;
  reportedBy: string;
}

interface CheatingRecordCardProps {
  record: CheatingRecordType;
  onViewDetails: (recordId: string) => void;
}

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'minor':
      return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
    case 'moderate':
      return 'bg-orange-100 text-orange-800 hover:bg-orange-200';
    case 'severe':
      return 'bg-red-100 text-red-800 hover:bg-red-200';
    default:
      return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
  }
};

export const CheatingRecordCard: React.FC<CheatingRecordCardProps> = ({ record, onViewDetails }) => {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{record.studentName}</CardTitle>
            <CardDescription>Student ID: {record.studentId}</CardDescription>
          </div>
          <Badge className={`${getSeverityColor(record.severity)}`}>
            {record.severity.charAt(0).toUpperCase() + record.severity.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="mb-2">
          <p className="text-sm font-medium text-gray-500">Course</p>
          <p>{record.course}</p>
        </div>
        <div className="mb-2">
          <p className="text-sm font-medium text-gray-500">Reason</p>
          <p className="text-sm">{record.reason}</p>
        </div>
        <div className="flex items-center text-sm text-gray-500 mt-2">
          {record.proofAvailable && (
            <div className="flex items-center mr-4">
              <FileText className="w-4 h-4 mr-1" />
              <span>Evidence Available</span>
            </div>
          )}
          <div className="flex items-center">
            <AlertTriangle className="w-4 h-4 mr-1" />
            <span>Reported {formatDistanceToNow(record.date, { addSuffix: true })}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex justify-between">
        <div className="text-sm text-gray-500">Reported by: {record.reportedBy}</div>
        <Button variant="outline" size="sm" onClick={() => onViewDetails(record.id)}>
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CheatingRecordCard;
