import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { StatCard } from '@/components/dashboard/StatCard';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { ElectionCard } from '@/components/elections/ElectionCard';
import { BudgetCard } from '@/components/budget/BudgetCard';
import { FacilityCard } from '@/components/facilities/FacilityCard';
import { ComplaintCard } from '@/components/complaints/ComplaintCard';
import { ExpenseChart } from '@/components/budget/ExpenseChart';
import { ElectionTrendChart } from '@/components/elections/ElectionTrendChart';
import { BarChart, Calendar, FileText, List, TrendingUp, Users, Bell, Clipboard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ElectionStatus } from '@/models/election';

// Mock data
const recentActivities = [
  {
    id: '1',
    title: 'Student Council Election Started',
    description: 'The election for Student Council 2023-24 has started. Vote now!',
    timestamp: '2 hours ago',
    type: 'election' as const,
  },
  {
    id: '2',
    title: 'New Budget Allocated',
    description: 'Computer Science Department received the quarterly budget allocation.',
    timestamp: '5 hours ago',
    type: 'budget' as const,
    user: 'Finance Office',
  },
  {
    id: '3',
    title: 'Auditorium Booking Approved',
    description: 'Your request to book the Main Auditorium has been approved.',
    timestamp: '1 day ago',
    type: 'facility' as const,
  },
  {
    id: '4',
    title: 'New Complaint Filed',
    description: 'Anonymous complaint regarding campus cleanliness has been submitted.',
    timestamp: '2 days ago',
    type: 'complaint' as const,
  },
];

const expenseCategories = [
  { name: 'Events', value: 15000, color: '#0088FE' },
  { name: 'Equipment', value: 25000, color: '#00C49F' },
  { name: 'Maintenance', value: 18000, color: '#FFBB28' },
  { name: 'Staff', value: 35000, color: '#FF8042' },
  { name: 'Miscellaneous', value: 7000, color: '#8884D8' },
];

const electionTrendData = [
  { month: 'Jan', participation: 45 },
  { month: 'Feb', participation: 52 },
  { month: 'Mar', participation: 49 },
  { month: 'Apr', participation: 62 },
  { month: 'May', participation: 55 },
  { month: 'Jun', participation: 60 },
  { month: 'Jul', participation: 68 },
  { month: 'Aug', participation: 72 },
  { month: 'Sep', participation: 75 },
  { month: 'Oct', participation: 70 },
  { month: 'Nov', participation: 65 },
  { month: 'Dec', participation: 58 },
];

const applicationStatusData = [
  { name: 'Approved', value: 63, color: '#4CAF50' },
  { name: 'Pending', value: 25, color: '#FF9800' },
  { name: 'Rejected', value: 12, color: '#F44336' },
];

const Index = () => {
  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Campus Digital Nexus</h1>
        <p className="text-muted-foreground">Your transparent college management system - access information, track activities, and participate in campus governance.</p>
      </div>

      <Tabs defaultValue="overview" className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="statistics">Statistics</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard 
              title="Active Elections" 
              value="2" 
              icon={<Users className="h-5 w-5 text-primary" />}
              iconClassName="bg-primary/10"
              className="fade-in"
            />
            <StatCard 
              title="Budget Allocation" 
              value="$245,000" 
              icon={<BarChart className="h-5 w-5 text-emerald-600" />}
              iconClassName="bg-emerald-100"
              className="fade-in delay-100"
            />
            <StatCard 
              title="Facility Bookings" 
              value="18" 
              change={12}
              icon={<Calendar className="h-5 w-5 text-purple-600" />}
              iconClassName="bg-purple-100"
              className="fade-in delay-200"
            />
            <StatCard 
              title="Pending Applications" 
              value="7" 
              icon={<FileText className="h-5 w-5 text-amber-600" />}
              iconClassName="bg-amber-100"
              className="fade-in delay-300"
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2">
              <ExpenseChart categories={expenseCategories} title="College Budget Allocation" />
            </div>
            <div>
              <ActivityFeed activities={recentActivities} />
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Quick Access</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex flex-col items-center justify-center">
                  <Users className="h-8 w-8 text-primary mb-2" />
                  <p className="font-medium text-center">Elections</p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex flex-col items-center justify-center">
                  <Calendar className="h-8 w-8 text-emerald-600 mb-2" />
                  <p className="font-medium text-center">Book Facility</p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex flex-col items-center justify-center">
                  <List className="h-8 w-8 text-purple-600 mb-2" />
                  <p className="font-medium text-center">Complaints</p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex flex-col items-center justify-center">
                  <FileText className="h-8 w-8 text-amber-600 mb-2" />
                  <p className="font-medium text-center">Applications</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="statistics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Election Participation Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ElectionTrendChart data={electionTrendData} />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Application Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ExpenseChart categories={applicationStatusData} title="" />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <StatCard 
              title="Complaints Resolved" 
              value="85%" 
              icon={<Bell className="h-5 w-5 text-blue-600" />}
              iconClassName="bg-blue-100"
            />
            <StatCard 
              title="Budget Utilization" 
              value="64%" 
              icon={<BarChart className="h-5 w-5 text-green-600" />}
              iconClassName="bg-green-100"
            />
            <StatCard 
              title="Election Turnout" 
              value="72%" 
              icon={<Users className="h-5 w-5 text-amber-600" />}
              iconClassName="bg-amber-100"
            />
            <StatCard 
              title="Facility Usage" 
              value="91%" 
              icon={<Calendar className="h-5 w-5 text-purple-600" />}
              iconClassName="bg-purple-100"
            />
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Campus Activity Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Applications Processed</span>
                  <div className="w-1/2 bg-gray-200 rounded-full h-2.5">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '88%' }}></div>
                  </div>
                  <span className="ml-2">88%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Budget Transparency</span>
                  <div className="w-1/2 bg-gray-200 rounded-full h-2.5">
                    <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '95%' }}></div>
                  </div>
                  <span className="ml-2">95%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Booking Efficiency</span>
                  <div className="w-1/2 bg-gray-200 rounded-full h-2.5">
                    <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: '79%' }}></div>
                  </div>
                  <span className="ml-2">79%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Complaint Resolution</span>
                  <div className="w-1/2 bg-gray-200 rounded-full h-2.5">
                    <div className="bg-amber-600 h-2.5 rounded-full" style={{ width: '83%' }}></div>
                  </div>
                  <span className="ml-2">83%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <ElectionCard 
              title="Student Council 2023-24" 
              description="Vote for your representatives for the upcoming academic year."
              startDate="Apr 5, 2023" 
              endDate="Apr 12, 2023" 
              status="active" as ElectionStatus 
              candidateCount={8}
              votesCount={320}
            />
            <BudgetCard 
              id="1" 
              title="Computer Science Department" 
              department="Academic" 
              allocated={50000} 
              spent={32500} 
              remaining={17500} 
              lastUpdated="Apr 1, 2023" 
            />
            <FacilityCard 
              id="1" 
              name="Main Auditorium" 
              description="Fully equipped auditorium with stage, sound system, and seating for 300 people." 
              image="https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=1469" 
              location="Main Campus, Building A" 
              capacity={300} 
              status="available" 
            />
            <ComplaintCard 
              id="1" 
              title="Campus Cleanliness Issue" 
              description="The area behind the science building needs attention. Trash bins are overflowing and not being emptied regularly." 
              date="Apr 3, 2023" 
              status="under-review" 
              isAnonymous={true} 
            />
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold text-blue-800 mb-2">Campus Digital Nexus Objectives</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-blue-800">Transparent Governance</h3>
              <p className="text-sm text-blue-700">Open access to election processes and results</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
              <BarChart className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-medium text-blue-800">Budget Accountability</h3>
              <p className="text-sm text-blue-700">Public tracking of college funds and expenses</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mr-3">
              <TrendingUp className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-medium text-blue-800">Operational Efficiency</h3>
              <p className="text-sm text-blue-700">Streamlined administrative processes</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
              <Calendar className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-medium text-blue-800">Resource Optimization</h3>
              <p className="text-sm text-blue-700">Effective scheduling and utilization of facilities</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-3">
              <Bell className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <h3 className="font-medium text-blue-800">Safety Communication</h3>
              <p className="text-sm text-blue-700">Automated health and leave notifications</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
              <Clipboard className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-medium text-blue-800">Academic Integrity</h3>
              <p className="text-sm text-blue-700">Public record of academic misconduct cases</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
