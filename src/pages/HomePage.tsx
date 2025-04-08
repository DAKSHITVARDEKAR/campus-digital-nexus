
import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Vote, FileText, BookOpen, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock data - in a real implementation, this would come from Firebase
const bannerImages = [
  {
    id: '1',
    imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
    title: 'Welcome to Campus Digital Nexus',
    description: 'Your one-stop platform for all college services',
    linkTo: '/',
  },
  {
    id: '2',
    imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1',
    title: 'Student Elections Now Open',
    description: 'Cast your vote for the student council',
    linkTo: '/elections',
  },
  {
    id: '3',
    imageUrl: 'https://images.unsplash.com/photo-1606761568499-6d2451b23c66',
    title: 'Book Campus Facilities',
    description: 'Reserve rooms, sports facilities, and more',
    linkTo: '/facilities',
  },
];

const announcements = [
  {
    id: '1',
    title: 'Mid-Semester Exams Schedule',
    content: 'The mid-semester examination schedule has been released. Check your email for details.',
    date: 'Apr 5, 2025',
    type: 'academic',
  },
  {
    id: '2',
    title: 'Campus Maintenance Notice',
    content: 'The main library will be closed for maintenance on April 10th from 2 PM to 6 PM.',
    date: 'Apr 4, 2025',
    type: 'facility',
  },
  {
    id: '3',
    title: 'Student Council Nominations',
    content: 'Nominations for Student Council positions are now open. Submit your applications by April 15th.',
    date: 'Apr 3, 2025',
    type: 'election',
  },
];

const notifications = [
  {
    id: '1',
    title: 'Facility Booking Approved',
    content: 'Your request to book the Main Auditorium for April 20th has been approved.',
    date: '2 hours ago',
    isRead: false,
    linkTo: '/facilities/my-bookings',
  },
  {
    id: '2',
    title: 'Budget Request Update',
    content: 'Your budget request for the Tech Fest has been reviewed and requires additional information.',
    date: '1 day ago',
    isRead: true,
    linkTo: '/applications',
  },
];

const quickStats = [
  {
    title: 'Active Elections',
    value: '2',
    icon: <Vote className="h-5 w-5 text-blue-600" />,
    linkTo: '/elections',
    color: 'bg-blue-50 border-blue-200',
  },
  {
    title: 'Open Facilities',
    value: '12',
    icon: <BookOpen className="h-5 w-5 text-green-600" />,
    linkTo: '/facilities',
    color: 'bg-green-50 border-green-200',
  },
  {
    title: 'Pending Applications',
    value: '5',
    icon: <FileText className="h-5 w-5 text-amber-600" />,
    linkTo: '/applications',
    color: 'bg-amber-50 border-amber-200',
  },
  {
    title: 'Upcoming Events',
    value: '8',
    icon: <Calendar className="h-5 w-5 text-purple-600" />,
    linkTo: '/events',
    color: 'bg-purple-50 border-purple-200',
  },
];

const HomePage = () => {
  return (
    <Layout>
      <div className="space-y-6">
        {/* Banner Carousel */}
        <div className="rounded-lg overflow-hidden border">
          <Carousel className="w-full">
            <CarouselContent>
              {bannerImages.map((banner) => (
                <CarouselItem key={banner.id}>
                  <div className="relative h-[300px] md:h-[400px]">
                    <img
                      src={banner.imageUrl}
                      alt={banner.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6 text-white">
                      <h2 className="text-2xl font-bold mb-2">{banner.title}</h2>
                      <p className="mb-4">{banner.description}</p>
                      <Link to={banner.linkTo}>
                        <Button variant="outline" className="text-white border-white hover:bg-white/20">
                          Learn More
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </Carousel>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickStats.map((stat, index) => (
            <Link to={stat.linkTo} key={index} className="no-underline">
              <Card className={`border ${stat.color} hover:shadow-md transition-shadow`}>
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.color}`}>
                    {stat.icon}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Announcements and Notifications */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Announcements */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Announcements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {announcements.map((announcement) => (
                  <div key={announcement.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{announcement.title}</h3>
                      <Badge className={
                        announcement.type === 'academic' 
                          ? 'bg-blue-100 text-blue-800 border-blue-100' 
                          : announcement.type === 'facility'
                            ? 'bg-green-100 text-green-800 border-green-100'
                            : 'bg-purple-100 text-purple-800 border-purple-100'
                      }>
                        {announcement.type.charAt(0).toUpperCase() + announcement.type.slice(1)}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{announcement.content}</p>
                    <p className="text-xs text-gray-500">{announcement.date}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
          
          {/* Notifications */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>My Notifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <Link 
                      to={notification.linkTo} 
                      key={notification.id}
                      className="block border rounded-lg p-3 hover:bg-gray-50 transition no-underline text-inherit"
                    >
                      <div className="flex items-start space-x-2">
                        {!notification.isRead && (
                          <span className="h-2 w-2 mt-1.5 rounded-full bg-blue-600 flex-shrink-0"></span>
                        )}
                        <div className={notification.isRead ? "ml-4" : ""}>
                          <p className="font-medium mb-1">{notification.title}</p>
                          <p className="text-sm text-gray-600 mb-1">{notification.content}</p>
                          <p className="text-xs text-gray-500">{notification.date}</p>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-muted-foreground">No new notifications</p>
                  </div>
                )}
                
                {notifications.length > 0 && (
                  <div className="text-center mt-2">
                    <Button variant="link" size="sm">
                      View All Notifications
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
