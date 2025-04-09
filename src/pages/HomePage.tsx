
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Award, 
  BookOpen, 
  Building, 
  Calendar, 
  FileText, 
  HelpCircle, 
  MessageSquare, 
  ShieldAlert, 
  Users, 
  Wallet,
  ArrowRight,
  CheckCircle,
  Lock
} from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1527576539890-dfa815648363?auto=format&fit=crop&q=80')] bg-fixed bg-center bg-cover opacity-5 z-0"></div>
        <div className="relative z-10">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight">
              <span className="block text-primary">Campus Digital Nexus</span>
              <span className="block text-2xl sm:text-3xl mt-2 font-semibold text-gray-600">College ERP System</span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-gray-600">
              A centralized, transparent platform for managing all aspects of college administration and student life
            </p>
            <div className="mt-10 max-w-sm mx-auto sm:max-w-none sm:flex sm:justify-center">
              <div className="space-y-4 sm:space-y-0 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5">
                <Button size="lg" onClick={() => navigate('/login')}>
                  Login Now
                </Button>
                <Button variant="outline" size="lg" onClick={() => navigate('/signup')}>
                  Create Account
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Core Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              title: "Role-Based Access",
              description: "Personalized dashboards and interfaces for Students, Faculty, and Administrators",
              icon: <Lock className="h-10 w-10 text-primary" />
            },
            { 
              title: "Transparency",
              description: "Open access to budgets, applications, election results, and decision processes",
              icon: <ShieldAlert className="h-10 w-10 text-primary" />
            },
            { 
              title: "Efficiency",
              description: "Streamlined digital workflows replacing manual paper-based processes",
              icon: <CheckCircle className="h-10 w-10 text-primary" />
            }
          ].map((feature, index) => (
            <Card key={index} className="border border-gray-200 hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <div className="mb-2">{feature.icon}</div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Module Tabs Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-gray-50 rounded-xl">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Explore Our Modules</h2>
        <Tabs defaultValue="governance" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="governance">Governance</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="communication">Communication</TabsTrigger>
            <TabsTrigger value="academics">Academics</TabsTrigger>
          </TabsList>
          
          {/* Governance Tab */}
          <TabsContent value="governance" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="mr-2 h-5 w-5" /> Elections
                  </CardTitle>
                  <CardDescription>Transparent student governance elections</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Browse candidates, vote securely, and view live election results with clear visualizations.</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/elections">
                      Explore Elections <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Wallet className="mr-2 h-5 w-5" /> Budget Tracking
                  </CardTitle>
                  <CardDescription>Financial transparency for all college funds</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Access public dashboards for departmental budgets, event funds, and expense records with proof.</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/budget">
                      View Budgets <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          {/* Resources Tab */}
          <TabsContent value="resources" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Building className="mr-2 h-5 w-5" /> Facility Booking
                  </CardTitle>
                  <CardDescription>Book campus facilities with ease</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>View availability calendars, submit booking requests, and track your current bookings status.</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/facilities">
                      Book Facilities <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="mr-2 h-5 w-5" /> Applications
                  </CardTitle>
                  <CardDescription>Streamlined application workflows</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Submit and track applications for events, budgets, and sponsorships with real-time status updates.</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/applications">
                      Access Applications <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          {/* Communication Tab */}
          <TabsContent value="communication" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageSquare className="mr-2 h-5 w-5" /> Complaints
                  </CardTitle>
                  <CardDescription>Voice concerns with optional anonymity</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Submit complaints anonymously, view moderated public complaints, and track resolution status.</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/complaints">
                      Submit Complaints <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="mr-2 h-5 w-5" /> Achievements
                  </CardTitle>
                  <CardDescription>Celebrate student and faculty success</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Browse achievements from across campus, submit your accomplishments, and inspire others.</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/achievements">
                      Browse Achievements <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          {/* Academics Tab */}
          <TabsContent value="academics" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BookOpen className="mr-2 h-5 w-5" /> Academic Integrity
                  </CardTitle>
                  <CardDescription>Upholding academic honesty</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Access transparent records of academic misconduct cases handled professionally and factually.</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/cheating-records">
                      View Records <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="mr-2 h-5 w-5" /> Health & Leave
                  </CardTitle>
                  <CardDescription>Automated notification system</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Automated notifications to faculty and parents regarding health issues and campus leave.</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/notifications">
                      Check Notifications <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Role Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Choose Your Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Student Dashboard",
              description: "Access your personal bookings, applications, participate in elections, and more.",
              link: "/student-dashboard",
              color: "bg-blue-100 text-blue-800"
            },
            {
              title: "Faculty Dashboard",
              description: "Manage approvals, access faculty-specific tools, and track student activities.",
              link: "/faculty-dashboard",
              color: "bg-amber-100 text-amber-800"
            },
            {
              title: "Admin Dashboard",
              description: "Full system administration tools for managing college operations.",
              link: "/admin-dashboard",
              color: "bg-green-100 text-green-800"
            }
          ].map((role, index) => (
            <Card key={index} className="border border-gray-200 hover:shadow-lg transition-shadow">
              <CardHeader className={`${role.color} rounded-t-lg`}>
                <CardTitle className="text-center">{role.title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-gray-600 mb-6">{role.description}</p>
              </CardContent>
              <CardFooter>
                <Button className="w-full" asChild>
                  <Link to={role.link}>
                    Go to Dashboard
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-white shadow-lg rounded-xl p-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
            <p className="mt-2 text-lg text-gray-600">Common questions about the Campus Digital Nexus</p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            {[
              {
                q: "Who can access the system?",
                a: "Only authenticated members of the college community can access the system using their official college email credentials."
              },
              {
                q: "How are different roles assigned?",
                a: "Roles (Student, Faculty, Admin) are assigned based on your college email domain and verified during account creation."
              },
              {
                q: "Is my data secure on the platform?",
                a: "Yes, we implement industry-standard security practices, role-based access controls, and data encryption to protect your information."
              },
              {
                q: "How can I submit an application?",
                a: "Navigate to the Applications section, choose the application type, and follow the guided submission process."
              },
              {
                q: "Can I submit anonymous complaints?",
                a: "Yes, the complaint system has an explicit 'Submit Anonymously' option to protect your identity."
              },
              {
                q: "How do I check the status of my facility booking?",
                a: "Go to Facilities → My Bookings to see all your bookings and their current status."
              },
            ].map((item, index) => (
              <div key={index} className="border-b border-gray-200 pb-4">
                <h3 className="flex items-center text-lg font-medium text-gray-900 mb-2">
                  <HelpCircle className="h-5 w-5 text-primary mr-2" />
                  {item.q}
                </h3>
                <p className="text-gray-600">{item.a}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-10 text-center">
            <p className="text-gray-600">Still have questions?</p>
            <Button variant="outline" className="mt-4">Contact Support</Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h2 className="text-xl font-semibold text-gray-900">Campus Digital Nexus</h2>
              <p className="mt-2 text-gray-600">A transparent college management system for paperless and efficient campus administration.</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Platform</h3>
              <ul className="mt-4 space-y-2">
                <li><Link to="/login" className="text-gray-600 hover:text-gray-900">Login</Link></li>
                <li><Link to="/signup" className="text-gray-600 hover:text-gray-900">Create Account</Link></li>
                <li><Link to="/dashboard" className="text-gray-600 hover:text-gray-900">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Legal</h3>
              <ul className="mt-4 space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Terms of Service</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-200 pt-8 md:flex md:items-center md:justify-between">
            <p className="text-gray-500 text-sm">© {new Date().getFullYear()} Campus Digital Nexus. All rights reserved.</p>
            <div className="mt-4 md:mt-0 flex space-x-6">
              {/* Social media links could go here */}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
