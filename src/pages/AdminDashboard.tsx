
import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Users, 
  Vote, 
  Calendar, 
  FileText, 
  AlertCircle, 
  Bell,
  Settings,
  BarChart
} from 'lucide-react';
import DashboardWidget from '@/components/dashboard/DashboardWidget';
import NotificationItem from '@/components/dashboard/NotificationItem';
import { StatCard } from '@/components/dashboard/StatCard';

// Mock data
const mockStats = [
  {
    title: 'Total Users',
    value: '1,254',
    icon: <Users className="h-5 w-5 text-blue-600" />,
    change: 5.2,
    iconClassName: "bg-blue-100"
  },
  {
    title: 'Active Elections',
    value: '3',
    icon: <Vote className="h-5 w-5 text-green-600" />,
    change: 0,
    iconClassName: "bg-green-100"
  },
  {
    title: 'Pending Approvals',
    value: '24',
    icon: <FileText className="h-5 w-5 text-amber-600" />,
    change: -12.5,
    iconClassName: "bg-amber-100"
  },
  {
    title: 'Facility Bookings',
    value: '128',
    icon: <Calendar className="h-5 w-5 text-purple-600" />,
    change: 8.1,
    iconClassName: "bg-purple-100"
  }
];

const mockModeration = [
  {
    id: '1',
    type: 'complaint',
    subject: 'Issue with cafeteria food quality',
    submittedDate: 'Apr 11, 2025',
    isAnonymous: true
  },
  {
    id: '2',
    type: 'complaint',
    subject: 'Broken equipment in physics lab',
    submittedDate: 'Apr 10, 2025',
    isAnonymous: false
  }
];

const mockNotifications = [
  {
    id: '1',
    message: 'New user registration requires approval',
    timestamp: '30 minutes ago',
    isRead: false,
    link: '/admin/users'
  },
  {
    id: '2',
    message: 'Budget balance alert: CS Department at 85% utilization',
    timestamp: '2 hours ago',
    isRead: false,
    link: '/admin/budgets'
  },
  {
    id: '3',
    message: 'System update scheduled for tonight at 2 AM',
    timestamp: '5 hours ago',
    isRead: true
  }
];

const AdminDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState('');

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setUserName('Admin User'); // This would come from auth context in a real app
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Welcome Message */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">
            {isLoading ? (
              <Skeleton className="h-9 w-64" />
            ) : (
              `Admin Dashboard`
            )}
          </h1>
          <div>
            <Link to="/admin/settings">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                System Settings
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {isLoading ? (
            Array(4).fill(0).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))
          ) : (
            mockStats.map((stat, index) => (
              <StatCard
                key={index}
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                change={stat.change}
                iconClassName={stat.iconClassName}
              />
            ))
          )}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Content Moderation Queue */}
          <DashboardWidget 
            title="Content Moderation Queue" 
            isLoading={isLoading}
            footer={
              <Link to="/admin/moderation" className="w-full">
                <Button variant="outline" size="sm" className="w-full">
                  View All Moderation Items
                </Button>
              </Link>
            }
          >
            {mockModeration.length > 0 ? (
              <div className="space-y-3">
                {mockModeration.map(item => (
                  <div key={item.id} className="border rounded-md p-3">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium text-sm truncate">{item.subject}</h3>
                      <Badge variant="outline">
                        {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-xs text-muted-foreground">
                        Submitted: {item.submittedDate}
                      </p>
                      {item.isAnonymous && (
                        <Badge variant="secondary" className="text-xs">
                          Anonymous
                        </Badge>
                      )}
                    </div>
                    <div className="mt-3 flex space-x-2">
                      <Button size="sm" variant="default" className="w-1/2">
                        Approve
                      </Button>
                      <Button size="sm" variant="destructive" className="w-1/2">
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">No items requiring moderation</p>
              </div>
            )}
          </DashboardWidget>

          {/* System Notifications */}
          <DashboardWidget
            title="System Notifications"
            icon={<Bell className="h-5 w-5" />}
            isLoading={isLoading}
            footer={
              <Link to="/admin/notifications" className="w-full">
                <Button variant="outline" size="sm" className="w-full">
                  View All Notifications
                </Button>
              </Link>
            }
          >
            {mockNotifications.length > 0 ? (
              <div className="space-y-1">
                {mockNotifications.map(notification => (
                  <NotificationItem
                    key={notification.id}
                    id={notification.id}
                    message={notification.message}
                    timestamp={notification.timestamp}
                    isRead={notification.isRead}
                    link={notification.link}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">No notifications</p>
              </div>
            )}
          </DashboardWidget>
        </div>

        {/* Admin Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/admin/users">
            <Card className="hover:bg-muted/50 transition-colors">
              <CardContent className="p-4 flex items-center space-x-3">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium">Manage Users</h3>
                  <p className="text-sm text-muted-foreground">Edit roles and permissions</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/admin/elections">
            <Card className="hover:bg-muted/50 transition-colors">
              <CardContent className="p-4 flex items-center space-x-3">
                <div className="bg-green-100 p-3 rounded-full">
                  <Vote className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium">Manage Elections</h3>
                  <p className="text-sm text-muted-foreground">Create and oversee elections</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/admin/budgets">
            <Card className="hover:bg-muted/50 transition-colors">
              <CardContent className="p-4 flex items-center space-x-3">
                <div className="bg-amber-100 p-3 rounded-full">
                  <BarChart className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-medium">Budget Management</h3>
                  <p className="text-sm text-muted-foreground">Track and allocate funds</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
