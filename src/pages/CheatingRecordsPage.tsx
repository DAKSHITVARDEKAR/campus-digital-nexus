
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Helmet } from 'react-helmet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import CheatingRecordCard, { CheatingRecordType } from '@/components/cheating/CheatingRecordCard';
import CheatingRecordDetail from '@/components/cheating/CheatingRecordDetail';
import CheatingRecordsFilter from '@/components/cheating/CheatingRecordsFilter';
import { sub } from 'date-fns';

// Mock data for cheating records
const mockCheatingRecords: CheatingRecordType[] = [
  {
    id: '1',
    studentName: 'John Smith',
    studentId: 'ST12345',
    course: 'CS101 - Introduction to Programming',
    reason: 'Copying code from another student during lab examination',
    severity: 'moderate',
    proofAvailable: true,
    date: sub(new Date(), { days: 5 }),
    reportedBy: 'Prof. Alan Turing'
  },
  {
    id: '2',
    studentName: 'Emily Johnson',
    studentId: 'ST54321',
    course: 'MATH202 - Calculus II',
    reason: 'Using unauthorized cheat sheet during midterm exam',
    severity: 'severe',
    proofAvailable: true,
    date: sub(new Date(), { days: 15 }),
    reportedBy: 'Prof. Katherine Johnson'
  },
  {
    id: '3',
    studentName: 'Michael Brown',
    studentId: 'ST67890',
    course: 'PHYS101 - Physics I',
    reason: 'Submitting another student\'s lab report as own work',
    severity: 'moderate',
    proofAvailable: true,
    date: sub(new Date(), { days: 30 }),
    reportedBy: 'Prof. Richard Feynman'
  },
  {
    id: '4',
    studentName: 'Jessica Lee',
    studentId: 'ST24680',
    course: 'ENG205 - Creative Writing',
    reason: 'Plagiarism in final essay (20% of content plagiarized)',
    severity: 'severe',
    proofAvailable: true,
    date: sub(new Date(), { days: 45 }),
    reportedBy: 'Prof. Jane Austen'
  },
  {
    id: '5',
    studentName: 'David Wilson',
    studentId: 'ST13579',
    course: 'BIO101 - Introduction to Biology',
    reason: 'Looking at another student\'s paper during quiz',
    severity: 'minor',
    proofAvailable: false,
    date: sub(new Date(), { days: 60 }),
    reportedBy: 'Prof. Charles Darwin'
  },
  {
    id: '6',
    studentName: 'Sarah Garcia',
    studentId: 'ST97531',
    course: 'CHEM202 - Organic Chemistry',
    reason: 'Unauthorized collaboration on take-home exam',
    severity: 'moderate',
    proofAvailable: true,
    date: sub(new Date(), { days: 75 }),
    reportedBy: 'Prof. Marie Curie'
  }
];

const CheatingRecordsPage: React.FC = () => {
  const [records, setRecords] = useState<CheatingRecordType[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<CheatingRecordType[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<CheatingRecordType | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('all');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [courseFilter, setCourseFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('all');

  // Simulate fetching data on component mount
  useEffect(() => {
    // In a real app, this would be an API call
    setRecords(mockCheatingRecords);
  }, []);

  // Apply filters whenever filter states change
  useEffect(() => {
    let filtered = [...records];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(record => 
        record.studentName.toLowerCase().includes(query) ||
        record.studentId.toLowerCase().includes(query) ||
        record.course.toLowerCase().includes(query)
      );
    }
    
    // Apply severity filter
    if (severityFilter !== 'all') {
      filtered = filtered.filter(record => record.severity === severityFilter);
    }
    
    // Apply course filter
    if (courseFilter !== 'all') {
      filtered = filtered.filter(record => 
        record.course.toLowerCase().includes(courseFilter.toLowerCase())
      );
    }
    
    // Apply time filter
    if (timeFilter !== 'all') {
      const now = new Date();
      switch (timeFilter) {
        case 'recent':
          filtered = filtered.filter(record => 
            record.date >= sub(now, { days: 30 })
          );
          break;
        case 'semester':
          filtered = filtered.filter(record => 
            record.date >= sub(now, { months: 4 })
          );
          break;
        case 'year':
          filtered = filtered.filter(record => 
            record.date >= sub(now, { months: 9 })
          );
          break;
        case 'custom':
          if (startDate) {
            filtered = filtered.filter(record => record.date >= startDate);
          }
          if (endDate) {
            filtered = filtered.filter(record => record.date <= endDate);
          }
          break;
      }
    }
    
    // Apply tab filter
    if (activeTab !== 'all') {
      filtered = filtered.filter(record => record.severity === activeTab);
    }
    
    setFilteredRecords(filtered);
  }, [records, searchQuery, severityFilter, timeFilter, courseFilter, startDate, endDate, activeTab]);

  const handleViewDetails = (recordId: string) => {
    const record = records.find(r => r.id === recordId);
    if (record) {
      setSelectedRecord(record);
      setIsDetailOpen(true);
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSeverityFilter('all');
    setTimeFilter('all');
    setCourseFilter('all');
    setStartDate(undefined);
    setEndDate(undefined);
    setActiveTab('all');
  };

  return (
    <Layout>
      <Helmet>
        <title>Academic Integrity Records | Campus Digital Nexus</title>
      </Helmet>
      
      <div className="container mx-auto space-y-6 pb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Academic Integrity Records</h1>
          <p className="text-muted-foreground mt-1">
            View and track academic integrity violations
          </p>
        </div>
        
        <Alert variant="default" className="bg-amber-50 text-amber-800 border-amber-200">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Public Information</AlertTitle>
          <AlertDescription>
            This is a public record of academic integrity violations. All students and faculty can view these records.
            These records help maintain transparency and accountability in our academic community.
          </AlertDescription>
        </Alert>
        
        <CheatingRecordsFilter 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          severityFilter={severityFilter}
          onSeverityChange={setSeverityFilter}
          timeFilter={timeFilter}
          onTimeChange={setTimeFilter}
          startDate={startDate}
          onStartDateChange={setStartDate}
          endDate={endDate}
          onEndDateChange={setEndDate}
          courseFilter={courseFilter}
          onCourseFilterChange={setCourseFilter}
          onResetFilters={handleResetFilters}
        />
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="all">All Records</TabsTrigger>
            <TabsTrigger value="minor">Minor</TabsTrigger>
            <TabsTrigger value="moderate">Moderate</TabsTrigger>
            <TabsTrigger value="severe">Severe</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-6">
            {renderRecordsList(filteredRecords, handleViewDetails)}
          </TabsContent>
          
          <TabsContent value="minor" className="mt-6">
            {renderRecordsList(filteredRecords, handleViewDetails)}
          </TabsContent>
          
          <TabsContent value="moderate" className="mt-6">
            {renderRecordsList(filteredRecords, handleViewDetails)}
          </TabsContent>
          
          <TabsContent value="severe" className="mt-6">
            {renderRecordsList(filteredRecords, handleViewDetails)}
          </TabsContent>
        </Tabs>
      </div>
      
      <CheatingRecordDetail 
        record={selectedRecord}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />
    </Layout>
  );
};

// Helper function to render the records list
const renderRecordsList = (
  records: CheatingRecordType[], 
  onViewDetails: (id: string) => void
) => {
  if (records.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">No records found</h3>
        <p className="mt-1 text-gray-500">Try adjusting your filters to see more results.</p>
        <Button variant="outline" className="mt-4">
          Clear Filters
        </Button>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {records.map(record => (
        <CheatingRecordCard 
          key={record.id} 
          record={record} 
          onViewDetails={onViewDetails} 
        />
      ))}
    </div>
  );
};

export default CheatingRecordsPage;
