
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CheatingRecordType } from './CheatingRecordCard';
import { format } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';

type AddEditRecordModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: Partial<CheatingRecordType>) => void;
  record?: CheatingRecordType;
  isEditMode: boolean;
};

const AddEditRecordModal: React.FC<AddEditRecordModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  record, 
  isEditMode 
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Partial<CheatingRecordType>>(
    record || {
      studentName: '',
      studentId: '',
      course: '',
      reason: '',
      severity: 'minor',
      proofAvailable: false,
      date: new Date(),
      reportedBy: ''
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // Basic validation
    if (!formData.studentName || !formData.studentId || !formData.course || !formData.reason) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Integrity Record' : 'Add New Integrity Record'}</DialogTitle>
          <DialogDescription>
            {isEditMode 
              ? 'Update the details of this academic integrity violation record.' 
              : 'Fill in the details to create a new academic integrity violation record.'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="studentName">Student Name</Label>
              <Input
                id="studentName"
                name="studentName"
                value={formData.studentName}
                onChange={handleChange}
                placeholder="Full name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="studentId">Student ID</Label>
              <Input
                id="studentId"
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                placeholder="ID number"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="course">Course</Label>
            <Input
              id="course"
              name="course"
              value={formData.course}
              onChange={handleChange}
              placeholder="Course code and name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="reason">Violation Reason</Label>
            <Textarea
              id="reason"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              placeholder="Describe the academic integrity violation"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="severity">Severity</Label>
              <Select 
                value={formData.severity} 
                onValueChange={(value) => handleSelectChange('severity', value)}
              >
                <SelectTrigger id="severity">
                  <SelectValue placeholder="Select severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="minor">Minor</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="severe">Severe</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reportedBy">Reported By</Label>
              <Input
                id="reportedBy"
                name="reportedBy"
                value={formData.reportedBy}
                onChange={handleChange}
                placeholder="Faculty name"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="proofAvailable">Proof Status</Label>
            <Select 
              value={formData.proofAvailable ? 'yes' : 'no'} 
              onValueChange={(value) => handleSelectChange('proofAvailable', value === 'yes' ? 'true' : 'false')}
            >
              <SelectTrigger id="proofAvailable">
                <SelectValue placeholder="Select if proof is available" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Proof Available</SelectItem>
                <SelectItem value="no">No Proof Available</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>{isEditMode ? 'Update' : 'Create'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditRecordModal;
