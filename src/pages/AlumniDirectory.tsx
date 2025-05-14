
import React, { useState, useEffect } from 'react';
import { useAuth, User } from '@/contexts/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  UserPlus, 
  Mail,
  Phone, 
  MessageSquare,
  Filter,
  Users,
  Star,
  AlertTriangle
} from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate, Link } from 'react-router-dom';
import ProfilePage from '@/components/alumni/ProfilePage';
import ProtectedRoute from '@/components/ProtectedRoute';
import { 
  addDemoUsers, 
  removeDemoUsers, 
  isDemoModeActive, 
  DEMO_USERS_KEY
} from '@/utils/dummyData';

const AlumniDirectory = () => {
  const { user, searchAlumni, requestMentorship, toggleContactVisibility } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<User | null>(null);
  const [mentorshipMessage, setMentorshipMessage] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showingMentorsOnly, setShowingMentorsOnly] = useState(false);
  const [demoModeActive, setDemoModeActive] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Batch options (generated for demo)
  const batchYears = Array.from({ length: 30 }, (_, i) => (2025 - i).toString());

  // Check if demo mode is active on component mount
  useEffect(() => {
    setDemoModeActive(isDemoModeActive());
  }, []);

  // Fetch initial results
  useEffect(() => {
    handleSearch();
  }, [activeFilters, showingMentorsOnly]);

  const handleSearch = async () => {
    try {
      setIsLoading(true);
      const filters = { ...activeFilters };
      if (showingMentorsOnly) {
        filters.mentorsOnly = true;
      }
      
      const results = await searchAlumni(searchQuery, filters);
      setSearchResults(results);
    } catch (error) {
      console.error("Search error:", error);
      toast({
        title: "Search Error",
        description: "Failed to search directory. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string | null) => {
    if (!value || value === "all") {
      const newFilters = { ...activeFilters };
      delete newFilters[key];
      setActiveFilters(newFilters);
    } else {
      setActiveFilters(prev => ({ ...prev, [key]: value }));
    }
  };

  const handleMentorshipRequest = async (mentorId: string) => {
    if (!mentorshipMessage.trim()) {
      toast({
        title: "Message Required",
        description: "Please provide a message for your mentorship request",
        variant: "destructive",
      });
      return;
    }

    try {
      const success = await requestMentorship(mentorId, mentorshipMessage);
      if (success) {
        toast({
          title: "Request Sent",
          description: "Your mentorship request has been sent successfully!",
        });
        setMentorshipMessage("");
      } else {
        throw new Error("Failed to send request");
      }
    } catch (error) {
      toast({
        title: "Request Failed",
        description: "Failed to send mentorship request. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleToggleContactVisibility = async (type: 'email' | 'phone', userId: string) => {
    await toggleContactVisibility(type, userId);
    toast({
      title: `${type === 'email' ? 'Email' : 'Phone'} Revealed`,
      description: "Contact information has been revealed.",
    });
  };
  
  // Handle loading demo users
  const handleAddDemoUsers = () => {
    try {
      addDemoUsers(20); // Add 20 demo users
      setDemoModeActive(true);
      toast({
        title: "Demo Data Added",
        description: "20 dummy alumni profiles have been added successfully.",
      });
      handleSearch(); // Refresh the search results
    } catch (error) {
      console.error("Error adding demo users:", error);
      toast({
        title: "Error",
        description: "Failed to add demo users. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Handle removing demo users
  const handleRemoveDemoUsers = () => {
    try {
      removeDemoUsers();
      setDemoModeActive(false);
      toast({
        title: "Demo Data Removed",
        description: "All dummy alumni profiles have been removed.",
      });
      handleSearch(); // Refresh the search results
    } catch (error) {
      console.error("Error removing demo users:", error);
      toast({
        title: "Error",
        description: "Failed to remove demo users. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <div className="flex-grow pt-24 pb-16 bg-cpscs-light">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold text-cpscs-blue mb-4">Alumni Directory</h1>
            
            <Tabs defaultValue="directory" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="directory" className="text-base">Directory</TabsTrigger>
                <TabsTrigger value="profile" className="text-base">My Profile</TabsTrigger>
                
                {user?.isAdmin && (
                  <TabsTrigger value="admin" className="text-base">Admin</TabsTrigger>
                )}
              </TabsList>
              
              <TabsContent value="directory" className="space-y-6">
                {/* Demo Mode Alert */}
                {demoModeActive && (
                  <Alert variant="info" className="bg-amber-50 border-amber-200 text-amber-800">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Demo Mode Active</AlertTitle>
                    <AlertDescription>
                      The directory is currently showing demo data. These profiles are for demonstration purposes only.
                      {user?.isAdmin && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mt-2 border-amber-300 hover:bg-amber-100"
                          onClick={handleRemoveDemoUsers}
                        >
                          Remove Demo Data
                        </Button>
                      )}
                    </AlertDescription>
                  </Alert>
                )}
                
                {/* Search Section */}
                <Card className="shadow-md border-cpscs-gold/30">
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="relative flex-grow">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <Input
                          placeholder="Search alumni by name, batch, profession..."
                          className="pl-10"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                      </div>
                      <Button onClick={handleSearch} className="bg-cpscs-blue hover:bg-blue-700">
                        Search
                      </Button>
                    </div>
                    
                    {/* Filters */}
                    <div className="mt-4">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <Filter size={16} />
                        <span className="text-sm font-medium">Filters:</span>
                        
                        <Select onValueChange={(value) => handleFilterChange('batch', value)}>
                          <SelectTrigger className="w-[120px] h-8 text-xs">
                            <SelectValue placeholder="Batch" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Batches</SelectItem>
                            {batchYears.map(year => (
                              <SelectItem key={year} value={year}>{year}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        
                        <Select onValueChange={(value) => handleFilterChange('profession', value)}>
                          <SelectTrigger className="w-[130px] h-8 text-xs">
                            <SelectValue placeholder="Profession" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Professions</SelectItem>
                            <SelectItem value="Engineer">Engineer</SelectItem>
                            <SelectItem value="Doctor">Doctor</SelectItem>
                            <SelectItem value="Teacher">Teacher</SelectItem>
                            <SelectItem value="Business">Business</SelectItem>
                            <SelectItem value="Student">Student</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <Select onValueChange={(value) => handleFilterChange('location', value)}>
                          <SelectTrigger className="w-[130px] h-8 text-xs">
                            <SelectValue placeholder="Location" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Locations</SelectItem>
                            <SelectItem value="Bangladesh">Bangladesh</SelectItem>
                            <SelectItem value="USA">USA</SelectItem>
                            <SelectItem value="Canada">Canada</SelectItem>
                            <SelectItem value="Australia">Australia</SelectItem>
                            <SelectItem value="UK">UK</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <Button 
                          variant={showingMentorsOnly ? "default" : "outline"} 
                          size="sm"
                          className={showingMentorsOnly ? "bg-cpscs-gold hover:bg-amber-500" : ""}
                          onClick={() => setShowingMentorsOnly(!showingMentorsOnly)}
                        >
                          <Star size={14} className="mr-1" />
                          Mentors Only
                        </Button>

                        {/* Demo Data Button - shown to admins when demo mode is not active */}
                        {user?.isAdmin && !demoModeActive && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="ml-auto"
                            onClick={handleAddDemoUsers}
                          >
                            <UserPlus size={14} className="mr-1" />
                            Add Demo Data
                          </Button>
                        )}

                        <div className={`${!user?.isAdmin || demoModeActive ? 'ml-auto' : ''} flex items-center space-x-1`}>
                          <Button 
                            variant={viewMode === 'grid' ? 'secondary' : 'outline'} 
                            size="icon" 
                            className="w-8 h-8"
                            onClick={() => setViewMode('grid')}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="3" y="3" width="7" height="7"></rect>
                              <rect x="14" y="3" width="7" height="7"></rect>
                              <rect x="3" y="14" width="7" height="7"></rect>
                              <rect x="14" y="14" width="7" height="7"></rect>
                            </svg>
                          </Button>
                          <Button 
                            variant={viewMode === 'list' ? 'secondary' : 'outline'} 
                            size="icon" 
                            className="w-8 h-8"
                            onClick={() => setViewMode('list')}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="8" y1="6" x2="21" y2="6"></line>
                              <line x1="8" y1="12" x2="21" y2="12"></line>
                              <line x1="8" y1="18" x2="21" y2="18"></line>
                              <line x1="3" y1="6" x2="3" y2="6"></line>
                              <line x1="3" y1="12" x2="3" y2="12"></line>
                              <line x1="3" y1="18" x2="3" y2="18"></line>
                            </svg>
                          </Button>
                        </div>
                      </div>
                      
                      {/* Active filters */}
                      {Object.keys(activeFilters).length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {Object.entries(activeFilters).map(([key, value]) => (
                            <Badge key={key} variant="outline" className="px-2 py-1 text-xs">
                              {key}: {value}
                              <button 
                                className="ml-1 text-gray-500 hover:text-gray-700"
                                onClick={() => handleFilterChange(key, null)}
                              >
                                ✕
                              </button>
                            </Badge>
                          ))}
                          {Object.keys(activeFilters).length > 0 && (
                            <Button 
                              variant="link" 
                              size="sm" 
                              className="text-xs text-cpscs-blue h-6 px-2"
                              onClick={() => setActiveFilters({})}
                            >
                              Clear all
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Results count */}
                <div className="flex items-center text-sm text-gray-500">
                  <Users size={16} className="mr-2" />
                  <span>{searchResults.length} alumni found</span>
                </div>
                
                {/* Results Grid */}
                {isLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="bg-white rounded-lg shadow-md h-64"></div>
                    ))}
                  </div>
                ) : searchResults.length === 0 ? (
                  <div className="py-12 text-center bg-white rounded-lg shadow-md">
                    <p className="text-lg text-gray-600">
                      No alumni found matching your search criteria.
                    </p>
                    <Button 
                      variant="link" 
                      className="text-cpscs-blue mt-2"
                      onClick={() => {
                        setSearchQuery('');
                        setActiveFilters({});
                        setShowingMentorsOnly(false);
                        handleSearch();
                      }}
                    >
                      Clear search and view all alumni
                    </Button>
                  </div>
                ) : viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {searchResults.map((alumnus) => (
                      <Card key={alumnus.id} className="transition-all duration-200 hover:shadow-lg">
                        <CardContent className="p-6">
                          <div className="flex items-center space-x-4">
                            <Avatar className="w-16 h-16 border-2 border-cpscs-gold">
                              <AvatarImage 
                                src={alumnus.profile?.profilePicture} 
                                alt={alumnus.fullName} 
                              />
                              <AvatarFallback className="bg-cpscs-blue text-white">
                                {alumnus.fullName.split(' ').map(n => n[0]).join('').substring(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold text-lg">{alumnus.fullName}</h3>
                              <p className="text-sm text-gray-500">
                                Class of {alumnus.sscYear}
                                {alumnus.hscYear && ` / ${alumnus.hscYear}`}
                              </p>
                              
                              {alumnus.profile?.willingToMentor && (
                                <Badge variant="secondary" className="bg-amber-100 text-amber-800 mt-1">
                                  <Star size={12} className="mr-1" />
                                  Mentor
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          <div className="mt-4 space-y-2 text-sm">
                            {alumnus.profile?.profession && (
                              <div className="flex items-center gap-2">
                                <Briefcase size={14} className="text-gray-500" />
                                <span>{alumnus.profile.profession}</span>
                                {alumnus.profile.organization && (
                                  <span className="text-gray-500">@ {alumnus.profile.organization}</span>
                                )}
                              </div>
                            )}
                            
                            {(alumnus.profile?.city || alumnus.profile?.country) && (
                              <div className="flex items-center gap-2">
                                <MapPin size={14} className="text-gray-500" />
                                <span>
                                  {alumnus.profile.city}{alumnus.profile.city && alumnus.profile.country && ', '}
                                  {alumnus.profile.country}
                                </span>
                              </div>
                            )}
                          </div>
                          
                          {alumnus.profile?.expertise && alumnus.profile.expertise.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-1">
                              {alumnus.profile.expertise.slice(0, 3).map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {alumnus.profile.expertise.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{alumnus.profile.expertise.length - 3} more
                                </Badge>
                              )}
                            </div>
                          )}
                        </CardContent>
                        <CardFooter className="pt-0 px-6 pb-6 flex justify-between">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-xs"
                            onClick={() => setSelectedProfile(alumnus)}
                          >
                            View Profile
                          </Button>
                          
                          {alumnus.profile?.willingToMentor && (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  size="sm" 
                                  className="text-xs bg-cpscs-gold hover:bg-amber-500"
                                >
                                  <MessageSquare size={12} className="mr-1" />
                                  Request Mentorship
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-md">
                                <DialogHeader>
                                  <DialogTitle>Request Mentorship</DialogTitle>
                                  <DialogDescription>
                                    Send a mentorship request to {alumnus.fullName}. They will receive an email with your information.
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                  <p className="text-sm">
                                    <span className="font-medium">Your information:</span><br />
                                    {user?.fullName}<br />
                                    SSC Batch: {user?.sscYear}<br />
                                    {user?.profile?.profession && `Profession: ${user.profile.profession}`}
                                  </p>
                                  
                                  <div className="space-y-2">
                                    <Label htmlFor="message">Your message</Label>
                                    <Textarea 
                                      id="message"
                                      placeholder="Briefly explain why you're seeking mentorship and what topics you'd like guidance on..."
                                      value={mentorshipMessage}
                                      onChange={(e) => setMentorshipMessage(e.target.value)}
                                      className="min-h-[120px]"
                                    />
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button 
                                    onClick={() => handleMentorshipRequest(alumnus.id)}
                                    className="bg-cpscs-blue hover:bg-blue-700"
                                  >
                                    Send Request
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          )}
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {searchResults.map((alumnus) => (
                      <Card key={alumnus.id} className="transition-all duration-200 hover:shadow-lg">
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row md:items-center gap-4">
                            <Avatar className="w-16 h-16 border-2 border-cpscs-gold">
                              <AvatarImage 
                                src={alumnus.profile?.profilePicture} 
                                alt={alumnus.fullName} 
                              />
                              <AvatarFallback className="bg-cpscs-blue text-white">
                                {alumnus.fullName.split(' ').map(n => n[0]).join('').substring(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            
                            <div className="flex-grow">
                              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                <div>
                                  <h3 className="font-semibold text-lg">{alumnus.fullName}</h3>
                                  <p className="text-sm text-gray-500">
                                    Class of {alumnus.sscYear}
                                    {alumnus.hscYear && ` / ${alumnus.hscYear}`}
                                  </p>
                                </div>
                                
                                <div className="mt-2 md:mt-0 flex items-center gap-2">
                                  {alumnus.profile?.willingToMentor && (
                                    <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                                      <Star size={12} className="mr-1" />
                                      Mentor
                                    </Badge>
                                  )}
                                  
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="text-xs"
                                    onClick={() => setSelectedProfile(alumnus)}
                                  >
                                    View Profile
                                  </Button>
                                  
                                  {alumnus.profile?.willingToMentor && (
                                    <Dialog>
                                      <DialogTrigger asChild>
                                        <Button 
                                          size="sm" 
                                          className="text-xs bg-cpscs-gold hover:bg-amber-500"
                                        >
                                          <MessageSquare size={12} className="mr-1" />
                                          Request Mentorship
                                        </Button>
                                      </DialogTrigger>
                                      <DialogContent className="max-w-md">
                                        <DialogHeader>
                                          <DialogTitle>Request Mentorship</DialogTitle>
                                          <DialogDescription>
                                            Send a mentorship request to {alumnus.fullName}. They will receive an email with your information.
                                          </DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-4 py-4">
                                          <p className="text-sm">
                                            <span className="font-medium">Your information:</span><br />
                                            {user?.fullName}<br />
                                            SSC Batch: {user?.sscYear}<br />
                                            {user?.profile?.profession && `Profession: ${user.profile.profession}`}
                                          </p>
                                          
                                          <div className="space-y-2">
                                            <Label htmlFor="message">Your message</Label>
                                            <Textarea 
                                              id="message"
                                              placeholder="Briefly explain why you're seeking mentorship and what topics you'd like guidance on..."
                                              value={mentorshipMessage}
                                              onChange={(e) => setMentorshipMessage(e.target.value)}
                                              className="min-h-[120px]"
                                            />
                                          </div>
                                        </div>
                                        <DialogFooter>
                                          <Button 
                                            onClick={() => handleMentorshipRequest(alumnus.id)}
                                            className="bg-cpscs-blue hover:bg-blue-700"
                                          >
                                            Send Request
                                          </Button>
                                        </DialogFooter>
                                      </DialogContent>
                                    </Dialog>
                                  )}
                                </div>
                              </div>
                              
                              <div className="mt-3 flex flex-wrap md:flex-nowrap gap-4">
                                <div className="space-y-1 text-sm min-w-[180px]">
                                  {alumnus.profile?.profession && (
                                    <div className="flex items-center gap-2">
                                      <Briefcase size={14} className="text-gray-500" />
                                      <span>{alumnus.profile.profession}</span>
                                    </div>
                                  )}
                                  
                                  {alumnus.profile?.organization && (
                                    <div className="flex items-center gap-2">
                                      <span className="w-3.5"></span>
                                      <span className="text-gray-500">@ {alumnus.profile.organization}</span>
                                    </div>
                                  )}
                                  
                                  {(alumnus.profile?.city || alumnus.profile?.country) && (
                                    <div className="flex items-center gap-2">
                                      <MapPin size={14} className="text-gray-500" />
                                      <span>
                                        {alumnus.profile.city}{alumnus.profile.city && alumnus.profile.country && ', '}
                                        {alumnus.profile.country}
                                      </span>
                                    </div>
                                  )}
                                </div>
                                
                                {alumnus.profile?.expertise && alumnus.profile.expertise.length > 0 && (
                                  <div className="flex flex-wrap gap-1 items-start">
                                    {alumnus.profile.expertise.map((tag) => (
                                      <Badge key={tag} variant="outline" className="text-xs">
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="profile">
                <ProfilePage />
              </TabsContent>
              
              {/* Admin Tab - Only shown to admins */}
              {user?.isAdmin && (
                <TabsContent value="admin" className="space-y-6">
                  <Card className="shadow-md">
                    <CardHeader>
                      <h2 className="text-2xl font-semibold">Demo Data Management</h2>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h3 className="font-medium mb-2">Current Status</h3>
                        <p>Demo Mode: <span className={demoModeActive ? "text-green-600 font-medium" : "text-gray-600"}>
                          {demoModeActive ? "Active" : "Inactive"}
                        </span></p>
                        
                        <div className="mt-4">
                          {!demoModeActive ? (
                            <div>
                              <p className="mb-2 text-sm text-gray-600">
                                Add 20 demo alumni profiles to showcase the directory functionality.
                                These profiles will be marked with <code>isDemoUser: true</code> and
                                can be easily removed later.
                              </p>
                              <Button 
                                onClick={handleAddDemoUsers}
                                className="mt-2"
                              >
                                <UserPlus size={16} className="mr-2" />
                                Add Demo Data
                              </Button>
                            </div>
                          ) : (
                            <div>
                              <p className="mb-2 text-sm text-gray-600">
                                Demo data is currently active. You can remove all demo alumni profiles
                                from the directory by clicking the button below.
                              </p>
                              <Button 
                                variant="destructive" 
                                onClick={handleRemoveDemoUsers}
                                className="mt-2"
                              >
                                Remove All Demo Data
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                        <h3 className="font-medium mb-2 text-amber-800">How Demo Data Works</h3>
                        <ul className="list-disc list-inside space-y-1 text-sm text-amber-800">
                          <li>Demo users are stored in localStorage with the regular users</li>
                          <li>Each demo user is marked with <code>isDemoUser: true</code> property</li>
                          <li>A flag in localStorage (<code>{DEMO_USERS_KEY}</code>) tracks if demo mode is active</li>
                          <li>Demo data can be completely removed with a single click</li>
                          <li>Demo mode status is visibly displayed to all users via a banner</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}
            </Tabs>
          </div>
        </div>
        
        {/* Full Profile Dialog */}
        {selectedProfile && (
          <Dialog open={!!selectedProfile} onOpenChange={(open) => !open && setSelectedProfile(null)}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-cpscs-blue">
                  {selectedProfile.fullName}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Profile Header */}
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                  <Avatar className="w-24 h-24 border-3 border-cpscs-gold">
                    <AvatarImage 
                      src={selectedProfile.profile?.profilePicture} 
                      alt={selectedProfile.fullName} 
                    />
                    <AvatarFallback className="text-2xl bg-cpscs-blue text-white">
                      {selectedProfile.fullName.split(' ').map(n => n[0]).join('').substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-grow">
                    <div className="flex flex-wrap gap-2 mb-2">
                      <Badge>Class of {selectedProfile.sscYear}</Badge>
                      {selectedProfile.hscYear && <Badge>HSC {selectedProfile.hscYear}</Badge>}
                      {selectedProfile.profile?.willingToMentor && (
                        <Badge className="bg-cpscs-gold hover:bg-amber-500">
                          <Star size={12} className="mr-1" />
                          Available for Mentorship
                        </Badge>
                      )}
                    </div>
                    
                    <div className="space-y-1">
                      {selectedProfile.profile?.profession && (
                        <div className="flex items-center gap-2">
                          <Briefcase size={16} className="text-gray-500" />
                          <span className="font-medium">{selectedProfile.profile.profession}</span>
                          {selectedProfile.profile.organization && (
                            <span>at {selectedProfile.profile.organization}</span>
                          )}
                        </div>
                      )}
                      
                      {(selectedProfile.profile?.city || selectedProfile.profile?.country) && (
                        <div className="flex items-center gap-2">
                          <MapPin size={16} className="text-gray-500" />
                          <span>
                            {selectedProfile.profile.city}{selectedProfile.profile.city && selectedProfile.profile.country && ', '}
                            {selectedProfile.profile.country}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* About */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-cpscs-blue border-b pb-2">About</h3>
                    <p className="text-gray-700">
                      {selectedProfile.profile?.bio || "No bio provided."}
                    </p>
                  </div>
                  
                  {/* Areas of Expertise */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-cpscs-blue border-b pb-2">Areas of Expertise</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedProfile.profile?.expertise && selectedProfile.profile.expertise.length > 0 ? (
                        selectedProfile.profile.expertise.map((tag) => (
                          <Badge key={tag} variant="secondary" className="py-1">
                            {tag}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-gray-500">No expertise areas listed.</p>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-cpscs-blue border-b pb-2">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <Mail size={16} className="text-gray-500" />
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="text-xs">
                            Show Email
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-sm">
                          <DialogHeader>
                            <DialogTitle>Contact Information</DialogTitle>
                            <DialogDescription>
                              This action will be logged for privacy purposes.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="py-4">
                            <p className="font-semibold">{selectedProfile.email}</p>
                          </div>
                          <DialogFooter>
                            <Button 
                              onClick={() => handleToggleContactVisibility('email', selectedProfile.id)}
                            >
                              Close
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                    
                    {selectedProfile.profile?.phoneNumber && (
                      <div className="flex items-center gap-3">
                        <Phone size={16} className="text-gray-500" />
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="text-xs">
                              Show Phone Number
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-sm">
                            <DialogHeader>
                              <DialogTitle>Contact Information</DialogTitle>
                              <DialogDescription>
                                This action will be logged for privacy purposes.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="py-4">
                              <p className="font-semibold">{selectedProfile.profile.phoneNumber}</p>
                            </div>
                            <DialogFooter>
                              <Button 
                                onClick={() => handleToggleContactVisibility('phone', selectedProfile.id)}
                              >
                                Close
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    )}
                    
                    {/* Social Links */}
                    <div className="col-span-1 md:col-span-2 flex flex-wrap gap-3 mt-2">
                      {selectedProfile.profile?.socialLinks?.facebook && (
                        <a 
                          href={selectedProfile.profile.socialLinks.facebook} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                          </svg>
                          Facebook
                        </a>
                      )}
                      
                      {selectedProfile.profile?.socialLinks?.linkedin && (
                        <a 
                          href={selectedProfile.profile.socialLinks.linkedin} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-blue-800 hover:underline"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                            <rect x="2" y="9" width="4" height="12"></rect>
                            <circle cx="4" cy="4" r="2"></circle>
                          </svg>
                          LinkedIn
                        </a>
                      )}
                      
                      {selectedProfile.profile?.socialLinks?.youtube && (
                        <a 
                          href={selectedProfile.profile.socialLinks.youtube} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-red-600 hover:underline"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                            <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                          </svg>
                          YouTube
                        </a>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Mentorship Section */}
                {selectedProfile.profile?.willingToMentor && (
                  <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-amber-800">
                      <Star size={18} />
                      Available for Mentorship
                    </h3>
                    
                    <p className="my-3 text-amber-900">
                      {selectedProfile.fullName} is willing to provide mentorship in the following areas:
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {selectedProfile.profile.mentorshipAreas && selectedProfile.profile.mentorshipAreas.length > 0 ? (
                        selectedProfile.profile.mentorshipAreas.map((area) => (
                          <Badge key={area} variant="outline" className="bg-amber-100 border-amber-300 text-amber-800">
                            {area}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-amber-700">General mentorship</p>
                      )}
                    </div>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="bg-cpscs-gold hover:bg-amber-500">
                          <MessageSquare size={16} className="mr-2" />
                          Request Mentorship
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Request Mentorship</DialogTitle>
                          <DialogDescription>
                            Send a mentorship request to {selectedProfile.fullName}. They will receive an email with your information.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <p className="text-sm">
                            <span className="font-medium">Your information:</span><br />
                            {user?.fullName}<br />
                            SSC Batch: {user?.sscYear}<br />
                            {user?.profile?.profession && `Profession: ${user.profile.profession}`}
                          </p>
                          
                          <div className="space-y-2">
                            <Label htmlFor="message">Your message</Label>
                            <Textarea 
                              id="message"
                              placeholder="Briefly explain why you're seeking mentorship and what topics you'd like guidance on..."
                              value={mentorshipMessage}
                              onChange={(e) => setMentorshipMessage(e.target.value)}
                              className="min-h-[120px]"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button 
                            onClick={() => handleMentorshipRequest(selectedProfile.id)}
                            className="bg-cpscs-blue hover:bg-blue-700"
                          >
                            Send Request
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
        
        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default AlumniDirectory;
