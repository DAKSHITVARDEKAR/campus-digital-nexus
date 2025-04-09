
import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Bell,
  BellOff,
  Calendar,
  Check,
  Clock,
  FileText,
  Filter,
  MessageSquare,
  Search,
  Settings,
  User,
} from 'lucide-react';

// Mock data
const mockNotifications = [
  {
    id: '1',
    title: 'Election Results Published',
    message: 'The results for Student Council Election 2025 have been published. Check them out now!',
    type: 'election',
    read: false,
    timestamp: '2025-04-09T10:30:00Z',
    link: '/elections/1'
  },
  {
    id: '2',
    title: 'Your Facility Booking Approved',
    message: 'Your request to book the Main Auditorium on April 15, 2025 has been approved.',
    type: 'facility',
    read: false,
    timestamp: '2025-04-08T14:45:00Z',
    link: '/facilities/my-bookings'
  },
  {
    id: '3',
    title: 'Budget Application Status Update',
    message: 'Your budget request for Tech Fest has been moved to "Under Review" status.',
    type: 'budget',
    read: true,
    timestamp: '2025-04-07T09:15:00Z',
    link: '/applications'
  },
  {
    id: '4',
    title: 'New Complaint Published',
    message: 'A new public complaint regarding campus cleanliness has been published.',
    type: 'complaint',
    read: true,
    timestamp: '2025-04-06T16:20:00Z',
    link: '/complaints'
  },
  {
    id: '5',
    title: 'Achievement Verification',
    message: 'Your submitted achievement "First Place in Hackathon" has been verified and published.',
    type: 'achievement',
    read: true,
    timestamp: '2025-04-05T11:10:00Z',
    link: '/achievements'
  },
  {
    id: '6',
    title: 'Health Notification Sent',
    message: 'A health notification regarding your recent clinic visit has been sent to your class coordinator.',
    type: 'health',
    read: true,
    timestamp: '2025-04-04T08:30:00Z',
    link: '/profile'
  },
  {
    id: '7',
    title: 'Leave Record Created',
    message: 'A leave record has been created when you left campus on April 3, 2025. A notification was sent to your registered parent contact.',
    type: 'leave',
    read: true,
    timestamp: '2025-04-03T17:45:00Z',
    link: '/profile'
  }
];

// Helper function to get icon based on notification type
const getNotificationIcon = (type) => {
  switch (type) {
    case 'election':
      return <User className="h-5 w-5 text-blue-500" />;
    case 'facility':
      return <Calendar className="h-5 w-5 text-purple-500" />;
    case 'budget':
      return <FileText className="h-5 w-5 text-green-500" />;
    case 'complaint':
      return <MessageSquare className="h-5 w-5 text-red-500" />;
    case 'achievement':
      return <Check className="h-5 w-5 text-orange-500" />;
    case 'health':
    case 'leave':
      return <Bell className="h-5 w-5 text-amber-500" />;
    default:
      return <Bell className="h-5 w-5 text-gray-500" />;
  }
};

// Format date in a human-readable way
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  
  // Calculate difference in milliseconds and convert to days
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) {
    return 'Today, ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (diffInDays === 1) {
    return 'Yesterday, ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  } else {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
  }
};

const NotificationsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  
  // Filter notifications based on search term and active tab
  const filteredNotifications = mockNotifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'unread') return matchesSearch && !notification.read;
    return matchesSearch && notification.type === activeTab;
  });
  
  // Count unread notifications
  const unreadCount = mockNotifications.filter(notification => !notification.read).length;
  
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Notifications</h1>
            <p className="text-muted-foreground">Stay updated with important events and updates from the campus.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Check className="h-4 w-4 mr-2" />
              Mark All as Read
            </Button>
            <Button variant="outline" size="icon" className="h-9 w-9">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search notifications..."
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
        
        <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 w-full mb-6">
            <TabsTrigger value="all">
              All
              {unreadCount > 0 && (
                <Badge variant="secondary" className="ml-2">{unreadCount}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="election">Elections</TabsTrigger>
            <TabsTrigger value="facility">Facilities</TabsTrigger>
            <TabsTrigger value="budget">Budget</TabsTrigger>
            <TabsTrigger value="complaint">Complaints</TabsTrigger>
            <TabsTrigger value="achievement">Achievements</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-0">
            <div className="space-y-4">
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map(notification => (
                  <Card key={notification.id} className={`border-l-4 ${notification.read ? 'border-l-gray-200' : 'border-l-primary'}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-1 gap-1">
                            <h3 className="font-medium text-base line-clamp-1">{notification.title}</h3>
                            <div className="flex items-center text-xs text-muted-foreground whitespace-nowrap">
                              <Clock className="h-3 w-3 mr-1" />
                              {formatDate(notification.timestamp)}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                          <div className="flex justify-between items-center">
                            <Button variant="link" className="h-auto p-0" asChild>
                              <a href={notification.link}>View Details</a>
                            </Button>
                            {!notification.read && (
                              <Button variant="ghost" size="sm" className="h-7">
                                <Check className="h-3 w-3 mr-1" />
                                Mark as Read
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                    <BellOff className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">No notifications found</h3>
                  <p className="text-muted-foreground">
                    {searchTerm 
                      ? "We couldn't find any notifications matching your search."
                      : "You're all caught up! There are no notifications in this category."}
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default NotificationsPage;
