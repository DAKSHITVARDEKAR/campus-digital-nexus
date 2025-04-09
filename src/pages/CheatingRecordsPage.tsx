
import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ExternalLink, 
  Filter, 
  Info, 
  Search,
  ShieldAlert
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

// Mock data - in a real app, this would come from an API
const mockCheatingRecords = [
  {
    id: '1',
    studentName: 'John Doe',
    studentId: '2023CS001',
    reason: 'Plagiarism in Assignment',
    course: 'CS101 Introduction to Programming',
    date: '2024-10-15',
    hasProof: true,
    status: 'Confirmed'
  },
  {
    id: '2',
    studentName: 'Jane Smith',
    studentId: '2023CS042',
    reason: 'Unauthorized collaboration on project',
    course: 'CS301 Database Systems',
    date: '2024-10-10',
    hasProof: true,
    status: 'Under Review'
  },
  {
    id: '3',
    studentName: 'Alex Johnson',
    studentId: '2023EE105',
    reason: 'Using unauthorized materials during exam',
    course: 'MA201 Linear Algebra',
    date: '2024-09-28',
    hasProof: true,
    status: 'Confirmed'
  },
  {
    id: '4',
    studentName: 'Maria Garcia',
    studentId: '2023CS078',
    reason: 'Submitting another student\'s work',
    course: 'CS210 Data Structures',
    date: '2024-09-22',
    hasProof: true,
    status: 'Confirmed'
  },
  {
    id: '5',
    studentName: 'David Lee',
    studentId: '2022CS112',
    reason: 'Falsifying research data',
    course: 'CS450 Research Methods',
    date: '2024-09-15',
    hasProof: false,
    status: 'Under Investigation'
  }
];

const CheatingRecordsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showInfo, setShowInfo] = useState(false);
  
  const filteredRecords = mockCheatingRecords.filter(record => 
    record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.course.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Academic Integrity Records</h1>
            <p className="text-muted-foreground">
              A transparent record of academic integrity violations. All cases have been reviewed and confirmed by the Academic Integrity Committee.
            </p>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={() => setShowInfo(true)}>
                  <Info className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View information about this system</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-800">
          <div className="flex">
            <ShieldAlert className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">About Academic Integrity Records</p>
              <p className="text-sm mt-1">
                This system promotes accountability and transparency in our academic community. All listed cases have undergone thorough investigation with due process and right to appeal.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search records..."
              className="pl-8 w-full sm:w-[350px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        <Table>
          <TableCaption>Academic integrity violation records for the current academic year.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Student ID</TableHead>
              <TableHead>Student Name</TableHead>
              <TableHead className="hidden md:table-cell">Course</TableHead>
              <TableHead>Violation</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]">Proof</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRecords.length > 0 ? (
              filteredRecords.map(record => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{record.studentId}</TableCell>
                  <TableCell>{record.studentName}</TableCell>
                  <TableCell className="hidden md:table-cell">{record.course}</TableCell>
                  <TableCell>{record.reason}</TableCell>
                  <TableCell className="hidden md:table-cell">{new Date(record.date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={record.status === 'Confirmed' ? 'default' : 
                              record.status === 'Under Review' ? 'secondary' : 'outline'}
                    >
                      {record.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {record.hasProof ? (
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    ) : (
                      <span className="text-sm text-muted-foreground">N/A</span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center h-24">
                  No records found matching your search criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <Dialog open={showInfo} onOpenChange={setShowInfo}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>About Academic Integrity Records</DialogTitle>
              <DialogDescription>
                Transparency and accountability in our academic community
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <p>
                The Academic Integrity Records system is designed to promote transparency, accountability, and deter violations of our academic honesty policies. All cases displayed have undergone a rigorous review process with the following considerations:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Each case has been thoroughly investigated by the Academic Integrity Committee</li>
                <li>Students involved have received due process, including the opportunity to explain their actions</li>
                <li>All decisions are subject to appeal through established procedures</li>
                <li>Records are maintained for educational and deterrence purposes</li>
                <li>Proof documents are available to authorized personnel only</li>
              </ul>
              <p className="text-sm text-muted-foreground">
                If you have questions about this system or wish to report an error, please contact the Academic Affairs Office.
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default CheatingRecordsPage;
