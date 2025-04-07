
import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { StatCard } from '@/components/dashboard/StatCard';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { ElectionCard } from '@/components/elections/ElectionCard';
import { BudgetCard } from '@/components/budget/BudgetCard';
import { FacilityCard } from '@/components/facilities/FacilityCard';
import { ComplaintCard } from '@/components/complaints/ComplaintCard';
import { ExpenseChart } from '@/components/budget/ExpenseChart';
import { BarChart, Calendar, FileText, List, Users } from 'lucide-react';

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

const Index = () => {
  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to Campus Digital Nexus, your transparent college management system.</p>
      </div>
      
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
        <h2 className="text-xl font-semibold mb-4">Featured Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <ElectionCard 
            id="1" 
            title="Student Council 2023-24" 
            description="Vote for your representatives for the upcoming academic year."
            startDate="Apr 5, 2023" 
            endDate="Apr 12, 2023" 
            status="active" 
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
      </div>
    </Layout>
  );
};

export default Index;
