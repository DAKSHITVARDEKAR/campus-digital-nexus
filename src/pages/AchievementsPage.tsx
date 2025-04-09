
import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

// Mock achievement data
const achievementsData = [
  {
    id: '1',
    title: 'First Place in National Robotics Competition',
    description: 'Our team won first place in the 2023 National Robotics Competition with our innovative autonomous robot design.',
    category: 'Academic',
    date: 'April 2, 2023',
    user: {
      name: 'Alex Johnson',
      role: 'Student',
      department: 'Mechanical Engineering',
      avatar: '/placeholder.svg'
    },
    image: '/placeholder.svg',
    verified: true
  },
  {
    id: '2',
    title: 'Published Research Paper in Nature Journal',
    description: 'Our groundbreaking research on sustainable energy solutions was published in the prestigious Nature Journal.',
    category: 'Research',
    date: 'March 15, 2023',
    user: {
      name: 'Dr. Sarah Williams',
      role: 'Faculty',
      department: 'Environmental Science',
      avatar: '/placeholder.svg'
    },
    image: null,
    verified: true
  },
  {
    id: '3',
    title: 'Community Service Excellence Award',
    description: 'Recognized for 500+ hours of community service at local shelters and environmental cleanup initiatives.',
    category: 'Community Service',
    date: 'February 28, 2023',
    user: {
      name: 'Emma Rodriguez',
      role: 'Student',
      department: 'Social Sciences',
      avatar: '/placeholder.svg'
    },
    image: '/placeholder.svg',
    verified: true
  },
  {
    id: '4',
    title: 'Winner of College Business Plan Competition',
    description: 'Developed an innovative business plan for a sustainable food delivery service that won first place in the annual competition.',
    category: 'Entrepreneurship',
    date: 'February 10, 2023',
    user: {
      name: 'Michael Chen',
      role: 'Student',
      department: 'Business Administration',
      avatar: '/placeholder.svg'
    },
    image: '/placeholder.svg',
    verified: true
  },
  {
    id: '5',
    title: 'International Conference Speaker',
    description: 'Invited to present research findings at the International Conference on Advanced Computing Technologies.',
    category: 'Academic',
    date: 'January 25, 2023',
    user: {
      name: 'Prof. James Wilson',
      role: 'Faculty',
      department: 'Computer Science',
      avatar: '/placeholder.svg'
    },
    image: null,
    verified: true
  },
];

const AchievementsPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    image: null as File | null
  });
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, category: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, image: e.target.files?.[0] || null }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would call an API to submit the achievement
    setIsDialogOpen(false);
    toast({
      title: "Achievement submitted",
      description: "Your achievement has been submitted for verification.",
    });
    // Reset form
    setFormData({
      title: '',
      description: '',
      category: '',
      image: null
    });
  };

  const filteredAchievements = activeTab === 'all' 
    ? achievementsData 
    : achievementsData.filter(a => a.category.toLowerCase() === activeTab);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Achievements</h1>
            <p className="text-muted-foreground">Celebrate and recognize the accomplishments of our college community.</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>Submit Achievement</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Submit Achievement</DialogTitle>
                <DialogDescription>
                  Share your achievement with the college community. All submissions will be verified before appearing publicly.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Achievement Title</Label>
                    <Input 
                      id="title" 
                      name="title" 
                      value={formData.title} 
                      onChange={handleInputChange} 
                      placeholder="E.g., First Place in Hackathon"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={handleSelectChange}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="academic">Academic</SelectItem>
                        <SelectItem value="research">Research</SelectItem>
                        <SelectItem value="sports">Sports</SelectItem>
                        <SelectItem value="arts">Arts & Culture</SelectItem>
                        <SelectItem value="community">Community Service</SelectItem>
                        <SelectItem value="entrepreneurship">Entrepreneurship</SelectItem>
                        <SelectItem value="leadership">Leadership</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description" 
                      name="description" 
                      value={formData.description} 
                      onChange={handleInputChange} 
                      placeholder="Describe your achievement in detail..."
                      rows={4}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="image">Proof/Image (Optional)</Label>
                    <Input 
                      id="image" 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileChange} 
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Submit for Verification</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="academic">Academic</TabsTrigger>
            <TabsTrigger value="research">Research</TabsTrigger>
            <TabsTrigger value="sports">Sports</TabsTrigger>
            <TabsTrigger value="community">Community</TabsTrigger>
            <TabsTrigger value="entrepreneurship">Entrepreneurship</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab}>
            <div className="grid grid-cols-1 gap-6">
              {filteredAchievements.map(achievement => (
                <Card key={achievement.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={achievement.user.avatar} alt={achievement.user.name} />
                          <AvatarFallback>{achievement.user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{achievement.user.name}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{achievement.user.role}</span>
                            <span>•</span>
                            <span>{achievement.user.department}</span>
                          </div>
                        </div>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800 border-blue-100">
                        {achievement.category}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <h3 className="text-lg font-semibold">{achievement.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{achievement.date}</p>
                    </div>
                    <p>{achievement.description}</p>
                    {achievement.image && (
                      <div className="mt-3 rounded-md overflow-hidden">
                        <img 
                          src={achievement.image} 
                          alt={`Proof of ${achievement.title}`} 
                          className="w-full object-cover max-h-80"
                        />
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="border-t pt-3 flex justify-between">
                    <div className="flex items-center">
                      <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700">
                        ✓ Verified Achievement
                      </Badge>
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
              
              {filteredAchievements.length === 0 && (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium">No achievements found</h3>
                  <p className="text-muted-foreground mt-1">
                    {activeTab === 'all' 
                      ? "There are no achievements to display." 
                      : `There are no achievements in the ${activeTab} category.`}
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

export default AchievementsPage;
