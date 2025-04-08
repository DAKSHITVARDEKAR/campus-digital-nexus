
import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, FileText, Users, Bell, AlertCircle, Shield, Activity, BookOpen, BarChart } from 'lucide-react';
import DashboardWidget from '@/components/dashboard/DashboardWidget';
import NotificationItem from '@/components/dashboard/NotificationItem';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// Mock data - in a real implementation, these would come from API calls
const mockPendingBookings = [
  {
    id: '1',
    requestorName: 'Alex Johnson',
    facilityName: 'Main Auditorium',
    date: 'Apr 18, 2025',
    time: '2:00 PM - 4:00 PM',
    purpose: 'Tech Club Meeting',
    submittedDate: 'Apr 10, 2025'
  },
  {
    id: '2',
    requestorName: 'Sarah Williams',
    facilityName: 'Computer Lab',
    date: 'Apr 22, 2025',
    time: '1:00 PM - 3:00 PM',
    purpose: 'Programming Workshop',
    submittedDate: 'Apr 11, 2025'
  }
];

const mockPendingApplications = [
  {
    id: '1',
    submitterName: 'Tech Club',
    title: 'Tech Fest Budget Request',
    type: 'budget',
    submittedDate: 'Apr 5, 2025'
  },
  {
    id: '2',
    submitterName: 'Dance Club',
    title: 'Annual Dance Event',
    type: 'event',
    submittedDate: 'Apr 7, 2025'
  }
];

const mockNotifications = [
  {
    id: '1',
    message: 'New facility booking request requires your approval',
    timestamp: '1 hour ago',
    isRead: false,
    link: '/faculty/approve-bookings'
  },
  {
    id: '2',
    message: 'New application submitted for your review',
    timestamp: '3 hours ago',
    isRead: false,
    link: '/faculty/review-applications'
  }
];

const FacultyDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState('');

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setUserName('Prof. Robert Smith'); // This would come from auth context in a real app
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending Booking Requests */}
          <DashboardWidget 
            title="Pending Facility Booking Requests" 
            icon={<Calendar className="h-5 w-5" />}
            isLoading={isLoading}
            footer={
              <Link to="/faculty/approve-bookings" className="w-full">
                <Button variant="outline" size="sm" className="w-full">
                  View All Booking Requests
                </Button>
              </Link>
            }
          >
            {mockPendingBookings.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Requestor</TableHead>
                      <TableHead>Facility</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockPendingBookings.map(booking => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">{booking.requestorName}</TableCell>
                        <TableCell>{booking.facilityName}</TableCell>
                        <TableCell>{booking.date}</TableCell>
                        <TableCell className="text-right">
                          <Link to={`/faculty/approve-bookings/${booking.id}`}>
                            <Button variant="outline" size="sm">Review</Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-6">
                <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">No pending booking requests</p>
              </div>
            )}
          </DashboardWidget>

          {/* Pending Applications */}
          <DashboardWidget 
            title="Pending Applications for Review" 
            icon={<FileText className="h-5 w-5" />}
            isLoading={isLoading}
            footer={
              <Link to="/faculty/review-applications" className="w-full">
                <Button variant="outline" size="sm" className="w-full">
                  View All Applications
                </Button>
              </Link>
            }
          >
            {mockPendingApplications.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Submitter</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockPendingApplications.map(application => (
                      <TableRow key={application.id}>
                        <TableCell className="font-medium">{application.submitterName}</TableCell>
                        <TableCell>{application.title}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {application.type.charAt(0).toUpperCase() + application.type.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Link to={`/faculty/review-applications/${application.id}`}>
                            <Button variant="outline" size="sm">Review</Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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
              title="Notifications"
              icon={<Bell className="h-5 w-5" />}
              isLoading={isLoading}
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
            title="Faculty Actions"
            isLoading={isLoading}
          >
            <div className="flex flex-col space-y-2">
              <Link to="/faculty/board-review" className="w-full">
                <Button variant="outline" className="w-full justify-start text-left">
                  <Shield className="h-4 w-4 mr-2" />
                  Board Member Review
                  <Badge className="ml-auto bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200">
                    New
                  </Badge>
                </Button>
              </Link>
              <Link to="/faculty/report-cheating" className="w-full">
                <Button variant="outline" className="w-full justify-start text-left">
                  <Activity className="h-4 w-4 mr-2" />
                  Report Cheating Incident
                </Button>
              </Link>
              <Link to="/faculty/submit-expense" className="w-full">
                <Button variant="outline" className="w-full justify-start text-left">
                  <BarChart className="h-4 w-4 mr-2" />
                  Submit Department Expense
                </Button>
              </Link>
              <Link to="/faculty/budget-view" className="w-full">
                <Button variant="outline" className="w-full justify-start text-left">
                  <BarChart className="h-4 w-4 mr-2" />
                  Department Budget
                </Button>
              </Link>
              <Link to="/faculty/courses" className="w-full">
                <Button variant="outline" className="w-full justify-start text-left">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Manage Courses
                </Button>
              </Link>
            </div>
          </DashboardWidget>
        </div>
      </div>
    </Layout>
  );
};

export default FacultyDashboard;
