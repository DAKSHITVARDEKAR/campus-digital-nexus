
import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Mock data
const publicApplications = [
  {
    id: '1',
    type: 'Event',
    title: 'Annual Tech Fest',
    submitter: 'Computer Science Club',
    date: 'Apr 3, 2023',
    status: 'approved',
  },
  {
    id: '2',
    type: 'Budget',
    title: 'Engineering Lab Equipment',
    submitter: 'Engineering Department',
    date: 'Apr 1, 2023',
    status: 'under-review',
  },
  {
    id: '3',
    type: 'Sponsorship',
    title: 'Corporate Visit to Microsoft',
    submitter: 'Career Development Cell',
    date: 'Mar 28, 2023',
    status: 'pending',
  },
  {
    id: '4',
    type: 'Event',
    title: 'Cultural Night',
    submitter: 'Cultural Committee',
    date: 'Mar 25, 2023',
    status: 'approved',
  },
  {
    id: '5',
    type: 'Budget',
    title: 'Library Book Acquisition',
    submitter: 'Library Committee',
    date: 'Apr 5, 2023',
    status: 'rejected',
    reason: 'Insufficient details provided',
  },
];

const myApplications = [
  {
    id: '2',
    type: 'Budget',
    title: 'Engineering Lab Equipment',
    submitter: 'Engineering Department',
    date: 'Apr 1, 2023',
    status: 'under-review',
  },
  {
    id: '4',
    type: 'Event',
    title: 'Cultural Night',
    submitter: 'Cultural Committee',
    date: 'Mar 25, 2023',
    status: 'approved',
  },
];

const applicationTracker = {
  id: '2',
  type: 'Budget',
  title: 'Engineering Lab Equipment',
  submitter: 'Engineering Department',
  date: 'Apr 1, 2023',
  status: 'under-review',
  details: 'Purchase of new oscilloscopes and circuit boards for the electronics lab',
  amount: '$12,500',
  steps: [
    {
      step: 'Submission',
      date: 'Apr 1, 2023',
      status: 'completed',
      notes: 'Application submitted successfully',
    },
    {
      step: 'Initial Review',
      date: 'Apr 2, 2023',
      status: 'completed',
      notes: 'Application verified for completeness',
    },
    {
      step: 'Department Head Approval',
      date: 'Apr 3, 2023',
      status: 'completed',
      notes: 'Approved by Dr. Johnson',
    },
    {
      step: 'Finance Committee Review',
      date: 'In Progress',
      status: 'current',
      notes: 'Scheduled for next committee meeting on Apr 8',
    },
    {
      step: 'Final Approval',
      date: 'Pending',
      status: 'pending',
      notes: '',
    },
    {
      step: 'Fund Allocation',
      date: 'Pending',
      status: 'pending',
      notes: '',
    },
  ],
};

const Applications = () => {
  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Applications & Approvals</h1>
        <p className="text-muted-foreground">Apply for events, budgets, and sponsorships with transparent tracking.</p>
      </div>
      
      <Tabs defaultValue="public" className="mb-6">
        <TabsList>
          <TabsTrigger value="public">Public Applications</TabsTrigger>
          <TabsTrigger value="submit">Submit Application</TabsTrigger>
          <TabsTrigger value="my">My Applications</TabsTrigger>
          <TabsTrigger value="track">Application Tracker</TabsTrigger>
        </TabsList>
        
        <TabsContent value="public">
          <div className="mt-6 rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Submitter</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {publicApplications.map((application) => (
                  <TableRow key={application.id}>
                    <TableCell>
                      <Badge className={
                        application.type === 'Event'
                          ? 'bg-blue-100 text-blue-800 border-blue-100'
                          : application.type === 'Budget'
                            ? 'bg-green-100 text-green-800 border-green-100'
                            : 'bg-purple-100 text-purple-800 border-purple-100'
                      }>
                        {application.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{application.title}</TableCell>
                    <TableCell>{application.submitter}</TableCell>
                    <TableCell>{application.date}</TableCell>
                    <TableCell>
                      <Badge className={
                        application.status === 'approved'
                          ? 'bg-green-100 text-green-800 border-green-100'
                          : application.status === 'pending'
                            ? 'bg-amber-100 text-amber-800 border-amber-100'
                            : application.status === 'under-review'
                              ? 'bg-blue-100 text-blue-800 border-blue-100'
                              : 'bg-red-100 text-red-800 border-red-100'
                      }>
                        {application.status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">View Details</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="submit">
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Submit a New Application</CardTitle>
            </CardHeader>
            <CardContent>
              <Form>
                <FormField name="type">
                  <FormItem className="mb-4">
                    <FormLabel>Application Type</FormLabel>
                    <Select>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select application type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="event">Event</SelectItem>
                        <SelectItem value="budget">Budget</SelectItem>
                        <SelectItem value="sponsorship">Sponsorship</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select the type of application you want to submit
                    </FormDescription>
                  </FormItem>
                </FormField>
                
                <FormField name="title">
                  <FormItem className="mb-4">
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Application title" />
                    </FormControl>
                  </FormItem>
                </FormField>
                
                <FormField name="details">
                  <FormItem className="mb-4">
                    <FormLabel>Details</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Detailed description of your application" 
                        className="min-h-[150px]" 
                      />
                    </FormControl>
                    <FormDescription>
                      Provide comprehensive details to expedite the approval process
                    </FormDescription>
                  </FormItem>
                </FormField>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <FormField name="date">
                    <FormItem>
                      <FormLabel>Date (if applicable)</FormLabel>
                      <FormControl>
                        <Input type="date" />
                      </FormControl>
                    </FormItem>
                  </FormField>
                  
                  <FormField name="amount">
                    <FormItem>
                      <FormLabel>Amount (if applicable)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0.00" />
                      </FormControl>
                    </FormItem>
                  </FormField>
                </div>
                
                <Button type="submit" className="mt-2">Submit Application</Button>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="my">
          <div className="mt-6 rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Submitter</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {myApplications.map((application) => (
                  <TableRow key={application.id}>
                    <TableCell>
                      <Badge className={
                        application.type === 'Event'
                          ? 'bg-blue-100 text-blue-800 border-blue-100'
                          : application.type === 'Budget'
                            ? 'bg-green-100 text-green-800 border-green-100'
                            : 'bg-purple-100 text-purple-800 border-purple-100'
                      }>
                        {application.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{application.title}</TableCell>
                    <TableCell>{application.submitter}</TableCell>
                    <TableCell>{application.date}</TableCell>
                    <TableCell>
                      <Badge className={
                        application.status === 'approved'
                          ? 'bg-green-100 text-green-800 border-green-100'
                          : application.status === 'pending'
                            ? 'bg-amber-100 text-amber-800 border-amber-100'
                            : application.status === 'under-review'
                              ? 'bg-blue-100 text-blue-800 border-blue-100'
                              : 'bg-red-100 text-red-800 border-red-100'
                      }>
                        {application.status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">Track</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="track">
          <Card className="mt-6">
            <CardHeader>
              <div className="flex flex-col space-y-1.5">
                <CardTitle>Application Status Tracker</CardTitle>
                <p className="text-muted-foreground">{applicationTracker.title}</p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-700">Application Type</p>
                  <p className="font-medium">{applicationTracker.type}</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-700">Submitted Date</p>
                  <p className="font-medium">{applicationTracker.date}</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-700">Status</p>
                  <p className="font-medium capitalize">{applicationTracker.status.replace('-', ' ')}</p>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Application Details</h3>
                <p className="text-sm mb-3">{applicationTracker.details}</p>
                {applicationTracker.amount && (
                  <p className="text-sm">
                    <span className="font-medium">Amount: </span>
                    {applicationTracker.amount}
                  </p>
                )}
              </div>
              
              <div>
                <h3 className="font-semibold mb-3">Approval Progress</h3>
                <ol className="relative border-l border-gray-200 ml-3">
                  {applicationTracker.steps.map((step, index) => (
                    <li key={index} className="mb-6 ml-6">
                      <span className={`absolute flex items-center justify-center w-6 h-6 rounded-full -left-3 ${
                        step.status === 'completed' 
                          ? 'bg-green-500 text-white' 
                          : step.status === 'current'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-500'
                      }`}>
                        {step.status === 'completed' ? '✓' : index + 1}
                      </span>
                      <h4 className={`font-semibold ${
                        step.status === 'completed' 
                          ? 'text-green-600' 
                          : step.status === 'current'
                            ? 'text-blue-600'
                            : 'text-gray-500'
                      }`}>
                        {step.step}
                      </h4>
                      <p className="text-sm">{step.date}</p>
                      {step.notes && <p className="text-sm text-gray-600">{step.notes}</p>}
                    </li>
                  ))}
                </ol>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-blue-800 mb-2">Application System Guidelines</h2>
        <ul className="list-disc pl-5 text-blue-700 space-y-1">
          <li>All applications are visible to students and faculty for transparency</li>
          <li>Applications are processed in the order they are received, with priority escalation for delayed requests</li>
          <li>Each application goes through a structured approval workflow</li>
          <li>You can track the status of your applications in real-time</li>
          <li>Rejections will include a reason to help with resubmission</li>
        </ul>
      </div>
    </Layout>
  );
};

export default Applications;
