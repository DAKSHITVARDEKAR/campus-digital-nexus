
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { FileText, Calendar, User, Book, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { CheatingRecordType } from './CheatingRecordCard';

interface CheatingRecordDetailProps {
  record: CheatingRecordType | null;
  isOpen: boolean;
  onClose: () => void;
}

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'minor':
      return 'bg-yellow-100 text-yellow-800';
    case 'moderate':
      return 'bg-orange-100 text-orange-800';
    case 'severe':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const CheatingRecordDetail: React.FC<CheatingRecordDetailProps> = ({ record, isOpen, onClose }) => {
  if (!record) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md md:max-w-lg">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle>Academic Integrity Record</DialogTitle>
            <Badge className={`${getSeverityColor(record.severity)}`}>
              {record.severity.charAt(0).toUpperCase() + record.severity.slice(1)}
            </Badge>
          </div>
          <DialogDescription>
            Full details of the academic integrity violation
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-start space-x-2">
            <User className="h-5 w-5 text-gray-500 mt-0.5" />
            <div>
              <h4 className="font-medium">Student Information</h4>
              <p>{record.studentName}</p>
              <p className="text-sm text-gray-500">ID: {record.studentId}</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-2">
            <Book className="h-5 w-5 text-gray-500 mt-0.5" />
            <div>
              <h4 className="font-medium">Course</h4>
              <p>{record.course}</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-2">
            <AlertTriangle className="h-5 w-5 text-gray-500 mt-0.5" />
            <div>
              <h4 className="font-medium">Violation Details</h4>
              <p>{record.reason}</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-2">
            <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
            <div>
              <h4 className="font-medium">Date Reported</h4>
              <p>{format(record.date, 'PPP')}</p>
            </div>
          </div>
          
          <Separator />
          
          <div className="flex items-start space-x-2">
            <User className="h-5 w-5 text-gray-500 mt-0.5" />
            <div>
              <h4 className="font-medium">Reported By</h4>
              <p>{record.reportedBy}</p>
            </div>
          </div>
          
          {record.proofAvailable && (
            <div className="bg-blue-50 p-3 rounded-md flex items-center space-x-2">
              <FileText className="h-5 w-5 text-blue-500" />
              <div>
                <h4 className="font-medium text-blue-700">Evidence Available</h4>
                <p className="text-sm text-blue-600">Supporting documentation has been provided</p>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          {record.proofAvailable && (
            <Button variant="outline" className="gap-2">
              <FileText className="h-4 w-4" />
              View Evidence
            </Button>
          )}
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CheatingRecordDetail;
