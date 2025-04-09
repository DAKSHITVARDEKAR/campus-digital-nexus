
import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

// Mock data
const userData = {
  name: 'Jane Smith',
  email: 'jane.smith@college.edu',
  role: 'Student',
  department: 'Computer Science',
  year: '3rd Year',
  studentId: 'CS2020-123',
  joinedDate: 'August 2020',
  avatar: '/placeholder.svg'
};

const myBookings = [
  { id: '1', facility: 'Computer Lab', date: 'April 15, 2023', time: '2:00 PM - 4:00 PM', status: 'Approved' },
  { id: '2', facility: 'Conference Room', date: 'April 20, 2023', time: '10:00 AM - 12:00 PM', status: 'Pending' },
  { id: '3', facility: 'Auditorium', date: 'May 5, 2023', time: '5:00 PM - 8:00 PM', status: 'Rejected' },
];

const myApplications = [
  { id: '1', type: 'Event', title: 'Tech Symposium', submittedDate: 'March 10, 2023', status: 'Approved' },
  { id: '2', type: 'Budget', title: 'Programming Club Funds', submittedDate: 'March 25, 2023', status: 'Pending' },
];

const myAchievements = [
  { id: '1', title: 'First Place - Hackathon 2023', date: 'February 15, 2023', verified: true },
  { id: '2', title: 'Published Research Paper', date: 'January 20, 2023', verified: true },
  { id: '3', title: 'Student Leader Award', date: 'December 10, 2022', verified: false },
];

const ProfilePage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: userData.name,
    department: userData.department,
    year: userData.year,
  });
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would call an API to update the profile
    setIsDialogOpen(false);
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully.",
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground">Manage your profile and view your activity.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Info Card */}
          <Card className="md:col-span-1">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={userData.avatar} alt={userData.name} />
                  <AvatarFallback>{userData.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
              </div>
              <CardTitle>{userData.name}</CardTitle>
              <CardDescription>{userData.email}</CardDescription>
              <div className="mt-2">
                <Badge className="bg-blue-100 text-blue-800 border-blue-100">
                  {userData.role}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Department</p>
                <p className="font-medium">{userData.department}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Year</p>
                <p className="font-medium">{userData.year}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Student ID</p>
                <p className="font-medium">{userData.studentId}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Joined</p>
                <p className="font-medium">{userData.joinedDate}</p>
              </div>
              <Separator />
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full">Edit Profile</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                    <DialogDescription>
                      Update your profile information.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input 
                          id="name" 
                          name="name" 
                          value={formData.name} 
                          onChange={handleInputChange} 
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="department">Department</Label>
                        <Input 
                          id="department" 
                          name="department" 
                          value={formData.department} 
                          onChange={handleInputChange} 
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="year">Year</Label>
                        <Input 
                          id="year" 
                          name="year" 
                          value={formData.year} 
                          onChange={handleInputChange} 
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Save changes</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
          
          {/* Activity Tabs */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Activity</CardTitle>
              <CardDescription>
                View your recent activity and submissions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="bookings" className="w-full">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="bookings">My Bookings</TabsTrigger>
                  <TabsTrigger value="applications">My Applications</TabsTrigger>
                  <TabsTrigger value="achievements">My Achievements</TabsTrigger>
                </TabsList>
                
                <TabsContent value="bookings">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Facility</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {myBookings.map(booking => (
                        <TableRow key={booking.id}>
                          <TableCell className="font-medium">{booking.facility}</TableCell>
                          <TableCell>{booking.date}</TableCell>
                          <TableCell>{booking.time}</TableCell>
                          <TableCell>
                            <Badge className={
                              booking.status === 'Approved' 
                                ? 'bg-green-100 text-green-800 border-green-100' 
                                : booking.status === 'Pending'
                                  ? 'bg-amber-100 text-amber-800 border-amber-100'
                                  : 'bg-red-100 text-red-800 border-red-100'
                            }>
                              {booking.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                      {myBookings.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                            You have no booking requests.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                  <div className="mt-4">
                    <Button variant="outline" className="w-full">View All Bookings</Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="applications">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Submitted</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {myApplications.map(application => (
                        <TableRow key={application.id}>
                          <TableCell>{application.type}</TableCell>
                          <TableCell className="font-medium">{application.title}</TableCell>
                          <TableCell>{application.submittedDate}</TableCell>
                          <TableCell>
                            <Badge className={
                              application.status === 'Approved' 
                                ? 'bg-green-100 text-green-800 border-green-100' 
                                : application.status === 'Pending'
                                  ? 'bg-amber-100 text-amber-800 border-amber-100'
                                  : 'bg-red-100 text-red-800 border-red-100'
                            }>
                              {application.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                      {myApplications.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                            You have no applications.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                  <div className="mt-4">
                    <Button variant="outline" className="w-full">View All Applications</Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="achievements">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {myAchievements.map(achievement => (
                        <TableRow key={achievement.id}>
                          <TableCell className="font-medium">{achievement.title}</TableCell>
                          <TableCell>{achievement.date}</TableCell>
                          <TableCell>
                            <Badge className={
                              achievement.verified
                                ? 'bg-green-100 text-green-800 border-green-100' 
                                : 'bg-amber-100 text-amber-800 border-amber-100'
                            }>
                              {achievement.verified ? 'Verified' : 'Pending'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                      {myAchievements.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                            You have no achievements.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                  <div className="mt-4">
                    <Button variant="outline" className="w-full">Submit New Achievement</Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
