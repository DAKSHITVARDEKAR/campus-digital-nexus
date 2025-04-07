
import React from 'react';
import { useForm } from 'react-hook-form';
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
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { AlertCircle, CheckCircle, Clock, Filter, Search } from 'lucide-react';

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

const complaintStatusData = [
  { name: 'Resolved', value: 43, color: '#4CAF50' },
  { name: 'Under Review', value: 28, color: '#2196F3' },
  { name: 'Pending', value: 29, color: '#FFC107' },
];

const complaintCategoryData = [
  { name: 'Facilities', value: 35, color: '#9C27B0' },
  { name: 'Academic', value: 25, color: '#3F51B5' },
  { name: 'Administrative', value: 20, color: '#FF5722' },
  { name: 'Food Services', value: 15, color: '#009688' },
  { name: 'Others', value: 5, color: '#607D8B' },
];

const anonymityData = [
  { name: 'Anonymous', value: 40, color: '#FF9800' },
  { name: 'Named', value: 60, color: '#03A9F4' },
];

const Complaints = () => {
  const form = useForm({
    defaultValues: {
      title: '',
      description: '',
      location: '',
      anonymous: false,
    },
  });

  const onSubmit = (data: any) => {
    console.log(data);
    // Here you would typically submit the complaint
    form.reset();
  };

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
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="public">
          <div className="flex items-center justify-between mb-4">
            <div className="relative w-64">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search complaints..." 
                className="pl-8"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" className="flex items-center">
                <Filter className="h-4 w-4 mr-1" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                Latest
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Brief title of your complaint" {...field} />
                        </FormControl>
                        <FormDescription>
                          Keep the title clear and concise
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Detailed description of the issue" 
                            className="min-h-[150px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Provide as much relevant information as possible
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="Where is this issue occurring?" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="anonymous"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 mb-4">
                        <FormControl>
                          <Checkbox 
                            checked={field.value} 
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Submit Anonymously</FormLabel>
                          <FormDescription>
                            Your identity will not be revealed unless required and approved by board members
                          </FormDescription>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="mt-2">Submit Complaint</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="my">
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold">My Submitted Complaints</h2>
            <Button variant="outline" size="sm">
              View Resolved
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          
          <div className="mt-6 p-4 border border-gray-200 rounded-lg flex flex-col sm:flex-row items-center justify-between">
            <div className="flex items-center mb-4 sm:mb-0">
              <div className="bg-blue-100 p-2 rounded-full mr-4">
                <AlertCircle className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium">Need to update a complaint?</h3>
                <p className="text-sm text-gray-600">You can provide additional information to your pending complaints.</p>
              </div>
            </div>
            <Button>Update Complaint</Button>
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
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
                  <div className="rounded-full bg-red-100 p-2 mr-3">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-red-800">Critical Violations</h3>
                    <p className="text-sm text-red-700">12 cases in 2023</p>
                  </div>
                </div>
                
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center">
                  <div className="rounded-full bg-amber-100 p-2 mr-3">
                    <Clock className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-amber-800">Academic Review</h3>
                    <p className="text-sm text-amber-700">5 cases in progress</p>
                  </div>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
                  <div className="rounded-full bg-green-100 p-2 mr-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-green-800">Resolved Cases</h3>
                    <p className="text-sm text-green-700">28 cases completed</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Complaints by Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ width: '100%', height: 250 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={complaintStatusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {complaintStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Complaints by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ width: '100%', height: 250 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={complaintCategoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {complaintCategoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Complaint Anonymity</CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ width: '100%', height: 250 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={anonymityData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {anonymityData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Complaint Response Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Facilities Related</span>
                    <span className="text-sm font-medium">3.2 days</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Academic Related</span>
                    <span className="text-sm font-medium">2.5 days</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                    <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '80%' }}></div>
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Administrative</span>
                    <span className="text-sm font-medium">4.8 days</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                    <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: '40%' }}></div>
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Food Services</span>
                    <span className="text-sm font-medium">1.8 days</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                    <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: '90%' }}></div>
                  </div>
                </div>
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
          <li>The system ensures fair and transparent handling of all complaints</li>
        </ul>
      </div>
    </Layout>
  );
};

export default Complaints;
