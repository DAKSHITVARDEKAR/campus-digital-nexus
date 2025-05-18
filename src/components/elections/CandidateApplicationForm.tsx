
import React, { useState } from 'react';
import { Candidate } from '@/models/election';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export type CandidateApplicationType = Candidate;

export interface CandidateApplicationFormProps {
  electionId: string;
  onSubmit?: (application: CandidateApplicationType) => Promise<void>;
}

const CandidateApplicationForm: React.FC<CandidateApplicationFormProps> = ({ 
  electionId,
  onSubmit 
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [application, setApplication] = useState<Partial<CandidateApplicationType>>({
    electionId,
    studentName: '',
    studentId: '',
    department: '',
    position: '',
    year: '',
    manifesto: '',
    imageUrl: null,
    status: 'pending',
    voteCount: 0,
    submittedAt: new Date().toISOString()
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setApplication(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setApplication(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onSubmit) return;
    
    try {
      setLoading(true);
      setError(null);
      await onSubmit(application as CandidateApplicationType);
    } catch (err: any) {
      setError(err.message || 'Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Apply as a Candidate</CardTitle>
        <CardDescription>
          Complete this form to apply as a candidate for the current election. The election ID is: {electionId}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="studentName">Full Name</Label>
              <Input
                id="studentName"
                name="studentName"
                placeholder="Enter your full name"
                value={application.studentName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="studentId">Student ID</Label>
              <Input
                id="studentId"
                name="studentId"
                placeholder="Enter your student ID"
                value={application.studentId}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                name="department"
                placeholder="Your academic department"
                value={application.department}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Select
                value={application.year}
                onValueChange={(value) => handleSelectChange('year', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Freshman">Freshman</SelectItem>
                  <SelectItem value="Sophomore">Sophomore</SelectItem>
                  <SelectItem value="Junior">Junior</SelectItem>
                  <SelectItem value="Senior">Senior</SelectItem>
                  <SelectItem value="Graduate">Graduate</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                name="position"
                placeholder="The position you're running for"
                value={application.position}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="manifesto">Manifesto</Label>
              <Textarea
                id="manifesto"
                name="manifesto"
                placeholder="Describe your platform and vision"
                value={application.manifesto}
                onChange={handleInputChange}
                required
                className="min-h-[150px]"
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="imageUpload">Profile Image (Optional)</Label>
              <Input id="imageUpload" type="file" accept="image/*" />
              <p className="text-xs text-muted-foreground mt-1">
                Upload a professional image to be displayed with your candidate profile
              </p>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button type="submit" disabled={loading} onClick={handleSubmit}>
          {loading ? 'Submitting...' : 'Submit Application'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CandidateApplicationForm;
