
import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { ComplaintCard } from '@/components/complaints/ComplaintCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

// Mock data
const publicComplaints = [
  {
    id: '1',
    title: 'Campus Cleanliness Issue',
    description: 'The area behind the science building needs attention. Trash bins are overflowing and not being emptied regularly.',
    date: 'Apr 3, 2023',
    status: 'under-review' as const,
    isAnonymous: true,
  },
  {
    id: '2',
    title: 'Library Hours Extension Request',
    description: 'Many students have requested the library to extend its hours during exam week to accommodate late-night study sessions.',
    date: 'Apr 1, 2023',
    status: 'pending' as const,
    isAnonymous: false,
    submitter: 'John Doe',
  },
  {
    id: '3',
    title: 'Cafeteria Food Quality',
    description: 'The quality of food in the cafeteria has declined in recent weeks. Many students have reported finding undercooked food.',
    date: 'Mar 28, 2023',
    status: 'resolved' as const,
    isAnonymous: true,
  },
  {
    id: '4',
    title: 'Classroom Projector Not Working',
    description: 'The projector in Room 201 has been malfunctioning for over a week now, affecting lectures and presentations.',
    date: 'Mar 25, 2023',
    status: 'resolved' as const,
    isAnonymous: false,
    submitter: 'Sarah Johnson',
  },
  {
    id: '5',
    title: 'Parking Space Issues',
    description: 'The student parking area is often full by 9 AM, causing many students to be late for their 9:30 AM classes.',
    date: 'Apr 5, 2023',
    status: 'pending' as const,
    isAnonymous: false,
    submitter: 'Michael Chen',
  },
  {
    id: '6',
    title: 'Wi-Fi Connectivity Problems',
    description: 'The Wi-Fi connection in the dormitories has been unstable for the past few days, affecting online classes and assignments.',
    date: 'Apr 4, 2023',
    status: 'under-review' as const,
    isAnonymous: true,
  },
];

const myComplaints = [
  {
    id: '2',
    title: 'Library Hours Extension Request',
    description: 'Many students have requested the library to extend its hours during exam week to accommodate late-night study sessions.',
    date: 'Apr 1, 2023',
    status: 'pending' as const,
    isAnonymous: false,
    submitter: 'John Doe',
  },
  {
    id: '5',
    title: 'Parking Space Issues',
    description: 'The student parking area is often full by 9 AM, causing many students to be late for their 9:30 AM classes.',
    date: 'Apr 5, 2023',
    status: 'pending' as const,
    isAnonymous: false,
    submitter: 'Michael Chen',
  },
];

const cheatingRecords = [
  {
    id: '1',
    student: 'Anonymous Student',
    course: 'CS-301: Data Structures',
    date: 'Mar 15, 2023',
    reason: 'Found using unauthorized materials during mid-term exam',
    proof: 'Confiscated cheat sheet with handwritten notes',
  },
  {
    id: '2',
    student: 'Anonymous Student',
    course: 'PHYS-201: Mechanics',
    date: 'Mar 22, 2023',
    reason: 'Caught using smartphone during quiz',
    proof: 'Faculty observation report and device confiscation receipt',
  },
];

const Complaints = () => {
  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Complaints & Integrity</h1>
        <p className="text-muted-foreground">Submit and track complaints, and view academic integrity records.</p>
      </div>
      
      <Tabs defaultValue="public" className="mb-6">
        <TabsList>
          <TabsTrigger value="public">Public Complaints</TabsTrigger>
          <TabsTrigger value="submit">Submit Complaint</TabsTrigger>
          <TabsTrigger value="my">My Complaints</TabsTrigger>
          <TabsTrigger value="integrity">Academic Integrity</TabsTrigger>
        </TabsList>
        
        <TabsContent value="public">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {publicComplaints.map((complaint) => (
              <ComplaintCard 
                key={complaint.id}
                id={complaint.id}
                title={complaint.title}
                description={complaint.description}
                date={complaint.date}
                status={complaint.status}
                isAnonymous={complaint.isAnonymous}
                submitter={complaint.submitter}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="submit">
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Submit a New Complaint</CardTitle>
            </CardHeader>
            <CardContent>
              <Form>
                <FormField name="title">
                  <FormItem className="mb-4">
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Brief title of your complaint" />
                    </FormControl>
                    <FormDescription>
                      Keep the title clear and concise
                    </FormDescription>
                  </FormItem>
                </FormField>
                
                <FormField name="description">
                  <FormItem className="mb-4">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Detailed description of the issue" 
                        className="min-h-[150px]" 
                      />
                    </FormControl>
                    <FormDescription>
                      Provide as much relevant information as possible
                    </FormDescription>
                  </FormItem>
                </FormField>
                
                <FormField name="location">
                  <FormItem className="mb-4">
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Where is this issue occurring?" />
                    </FormControl>
                  </FormItem>
                </FormField>
                
                <FormField name="anonymous">
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 mb-4">
                    <FormControl>
                      <Checkbox />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Submit Anonymously</FormLabel>
                      <FormDescription>
                        Your identity will not be revealed unless required and approved by board members
                      </FormDescription>
                    </div>
                  </FormItem>
                </FormField>
                
                <Button type="submit" className="mt-2">Submit Complaint</Button>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="my">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {myComplaints.map((complaint) => (
              <ComplaintCard 
                key={complaint.id}
                id={complaint.id}
                title={complaint.title}
                description={complaint.description}
                date={complaint.date}
                status={complaint.status}
                isAnonymous={complaint.isAnonymous}
                submitter={complaint.submitter}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="integrity">
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Academic Integrity Violations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                The following records are published as part of the college's commitment to academic integrity.
                Names are anonymized to protect student privacy while ensuring transparency in the process.
              </p>
              
              <div className="border rounded-lg overflow-hidden">
                {cheatingRecords.map((record, index) => (
                  <div 
                    key={record.id}
                    className={`p-4 ${index !== cheatingRecords.length - 1 ? 'border-b' : ''}`}
                  >
                    <h3 className="font-semibold mb-1">{record.course}</h3>
                    <p className="text-sm text-gray-600 mb-2">{record.date}</p>
                    <p className="text-sm mb-3">{record.reason}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Proof: {record.proof}</span>
                      <Button variant="outline" size="sm">View Details</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-purple-800 mb-2">Complaint System Guidelines</h2>
        <ul className="list-disc pl-5 text-purple-700 space-y-1">
          <li>All complaints are reviewed by appropriate authorities</li>
          <li>Anonymous complaints are protected - identity can only be revealed with board approval</li>
          <li>Vulgar or inappropriate content will be blocked</li>
          <li>Updates on complaint status will be provided regularly</li>
          <li>Academic integrity violations are published without student names</li>
        </ul>
      </div>
    </Layout>
  );
};

export default Complaints;
