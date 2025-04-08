
import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Bell, Calendar, FileText, Vote, AlertCircle } from 'lucide-react';
import DashboardWidget from '@/components/dashboard/DashboardWidget';
import NotificationItem from '@/components/dashboard/NotificationItem';

// Mock data - in a real implementation, these would come from API calls
const mockActiveElections = [
  {
    id: '1',
    title: 'Student Council President Election',
    endDate: 'Apr 15, 2025',
    status: 'ongoing'
  },
  {
    id: '2',
    title: 'Department Representative Election',
    endDate: 'Apr 20, 2025',
    status: 'ongoing'
  }
];

const mockUpcomingBookings = [
  {
    id: '1',
    facilityName: 'Main Auditorium',
    date: 'Apr 18, 2025',
    time: '2:00 PM - 4:00 PM',
    status: 'approved'
  },
  {
    id: '2',
    facilityName: 'Tennis Court',
    date: 'Apr 22, 2025',
    time: '5:00 PM - 6:00 PM',
    status: 'pending'
  }
];

const mockPendingApplications = [
  {
    id: '1',
    title: 'Tech Fest Budget Request',
    type: 'budget',
    submittedDate: 'Apr 5, 2025',
    status: 'pending'
  }
];

const mockNotifications = [
  {
    id: '1',
    message: 'Your facility booking for Main Auditorium has been approved',
    timestamp: '2 hours ago',
    isRead: false,
    link: '/facilities/my-bookings'
  },
  {
    id: '2',
    message: 'New election has been announced: Department Representative',
    timestamp: '1 day ago',
    isRead: true,
    link: '/elections'
  },
  {
    id: '3',
    message: 'Your budget request needs additional information',
    timestamp: '2 days ago',
    isRead: false,
    link: '/applications'
  }
];

const StudentDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState('');

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setUserName('Alex Johnson'); // This would come from auth context in a real app
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
              `Welcome, ${userName}!`
            )}
          </h1>
          <div>
            <Link to="/profile">
              <Button variant="outline" size="sm">My Profile</Button>
            </Link>
          </div>
        </div>

        {/* Dashboard Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Active Elections Widget */}
          <DashboardWidget 
            title="Active Elections" 
            icon={<Vote className="h-5 w-5" />}
            isLoading={isLoading}
            footer={
              <Link to="/elections" className="w-full">
                <Button variant="outline" size="sm" className="w-full">
                  View All Elections
                </Button>
              </Link>
            }
          >
            {mockActiveElections.length > 0 ? (
              <div className="space-y-3">
                {mockActiveElections.map(election => (
                  <Card key={election.id} className="bg-muted/40">
                    <CardContent className="p-3">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-sm">{election.title}</h3>
                        <Badge variant="secondary">Ongoing</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">Ends: {election.endDate}</p>
                      <Link to={`/elections/${election.id}`}>
                        <Button size="sm" className="w-full">
                          Vote Now
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">No active elections</p>
              </div>
            )}
          </DashboardWidget>

          {/* Upcoming Bookings Widget */}
          <DashboardWidget 
            title="Your Bookings" 
            icon={<Calendar className="h-5 w-5" />}
            isLoading={isLoading}
            footer={
              <div className="flex justify-between w-full">
                <Link to="/facilities">
                  <Button variant="outline" size="sm">
                    Book Facility
                  </Button>
                </Link>
                <Link to="/facilities/my-bookings">
                  <Button variant="outline" size="sm">
                    View All Bookings
                  </Button>
                </Link>
              </div>
            }
          >
            {mockUpcomingBookings.length > 0 ? (
              <div className="space-y-3">
                {mockUpcomingBookings.map(booking => (
                  <div key={booking.id} className="border rounded-md p-3">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium text-sm">{booking.facilityName}</h3>
                      <Badge variant={booking.status === 'approved' ? 'default' : 'secondary'}>
                        {booking.status === 'approved' ? 'Approved' : 'Pending'}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {booking.date} • {booking.time}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">No upcoming bookings</p>
              </div>
            )}
          </DashboardWidget>

          {/* Pending Applications Widget */}
          <DashboardWidget 
            title="Pending Applications" 
            icon={<FileText className="h-5 w-5" />}
            isLoading={isLoading}
            footer={
              <div className="flex justify-between w-full">
                <Link to="/applications/submit">
                  <Button variant="outline" size="sm">
                    New Application
                  </Button>
                </Link>
                <Link to="/applications">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </div>
            }
          >
            {mockPendingApplications.length > 0 ? (
              <div className="space-y-3">
                {mockPendingApplications.map(application => (
                  <div key={application.id} className="border rounded-md p-3">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium text-sm">{application.title}</h3>
                      <Badge variant="secondary">
                        {application.type.charAt(0).toUpperCase() + application.type.slice(1)}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-xs text-muted-foreground">
                        Submitted: {application.submittedDate}
                      </p>
                      <Badge variant="outline">Pending</Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">No pending applications</p>
              </div>
            )}
          </DashboardWidget>
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Notifications */}
          <div className="lg:col-span-2">
            <DashboardWidget
              title="Recent Notifications"
              icon={<Bell className="h-5 w-5" />}
              isLoading={isLoading}
              className="h-full"
              footer={
                <Link to="/notifications" className="w-full">
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

          {/* Quick Links */}
          <DashboardWidget
            title="Quick Links"
            isLoading={isLoading}
          >
            <div className="flex flex-col space-y-2">
              <Link to="/budget" className="w-full">
                <Button variant="outline" className="w-full justify-start text-left">
                  View College Budget
                </Button>
              </Link>
              <Link to="/complaints" className="w-full">
                <Button variant="outline" className="w-full justify-start text-left">
                  View Public Complaints
                </Button>
              </Link>
              <Link to="/complaints/submit" className="w-full">
                <Button variant="outline" className="w-full justify-start text-left">
                  Submit a Complaint
                </Button>
              </Link>
              <Link to="/cheating-records" className="w-full">
                <Button variant="outline" className="w-full justify-start text-left">
                  Academic Integrity Records
                </Button>
              </Link>
              <Link to="/achievements" className="w-full">
                <Button variant="outline" className="w-full justify-start text-left">
                  Student Achievements
                </Button>
              </Link>
            </div>
          </DashboardWidget>
        </div>
      </div>
    </Layout>
  );
};

export default StudentDashboard;
