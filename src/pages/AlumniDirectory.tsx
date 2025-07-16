import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Users, MapPin, Briefcase, GraduationCap, Heart, User as UserIcon, Mail, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { User } from '@/contexts/AuthContext';

const AlumniDirectory = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('all');
  const [selectedProfession, setSelectedProfession] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [showOnlyMentors, setShowOnlyMentors] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    try {
      const storedUsers = JSON.parse(localStorage.getItem('cpscs_users') || '[]');
      // Filter out demo users and current user
      const realUsers = storedUsers.filter((user: User) => 
        !user.isDemoUser && user.id !== currentUser?.id
      );
      setUsers(realUsers);
    } catch (error) {
      console.error('Error loading users:', error);
      toast({
        title: "Error",
        description: "Failed to load alumni directory",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let filtered = users;

    // Search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(user =>
        user.fullName.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        (user.profile?.profession && user.profile.profession.toLowerCase().includes(searchLower)) ||
        (user.profile?.organization && user.profile.organization.toLowerCase().includes(searchLower)) ||
        (user.profile?.city && user.profile.city.toLowerCase().includes(searchLower)) ||
        (user.profile?.country && user.profile.country.toLowerCase().includes(searchLower)) ||
        (user.profile?.expertise && user.profile.expertise.some(skill => 
          skill.toLowerCase().includes(searchLower)
        ))
      );
    }

    // Batch filter
    if (selectedBatch !== 'all') {
      filtered = filtered.filter(user => user.sscYear === selectedBatch);
    }

    // Profession filter
    if (selectedProfession !== 'all') {
      filtered = filtered.filter(user => user.profile?.profession === selectedProfession);
    }

    // Location filter
    if (selectedLocation !== 'all') {
      filtered = filtered.filter(user => user.profile?.country === selectedLocation);
    }

    // Mentors filter
    if (showOnlyMentors) {
      filtered = filtered.filter(user => user.profile?.willingToMentor);
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, selectedBatch, selectedProfession, selectedLocation, showOnlyMentors]);

  // Get unique values for filters
  const uniqueBatches = [...new Set(users.map(user => user.sscYear))].sort();
  const uniqueProfessions = [...new Set(users.map(user => user.profile?.profession).filter(Boolean))].sort();
  const uniqueLocations = [...new Set(users.map(user => user.profile?.country).filter(Boolean))].sort();

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleContactAlumni = (contactUser: User, contactType: 'email' | 'phone') => {
    if (contactType === 'email') {
      window.location.href = `mailto:${contactUser.email}`;
    } else if (contactType === 'phone' && contactUser.profile?.phoneNumber) {
      window.location.href = `tel:${contactUser.profile.phoneNumber}`;
    }
    
    toast({
      title: "Contact Initiated",
      description: `Opening ${contactType} client for ${contactUser.fullName}`,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow pt-24 pb-16 bg-cpscs-light flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cpscs-blue mx-auto mb-4"></div>
            <p className="text-gray-600">Loading Alumni Directory...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow pt-24 pb-16 bg-cpscs-light">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-cpscs-blue mb-4">Alumni Directory</h1>
            <p className="text-gray-600 text-lg">
              Connect with fellow CPSCS alumni from around the world
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-cpscs-blue" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Alumni</p>
                    <p className="text-2xl font-bold text-cpscs-blue">{users.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <GraduationCap className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Batches</p>
                    <p className="text-2xl font-bold text-green-600">{uniqueBatches.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <MapPin className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Countries</p>
                    <p className="text-2xl font-bold text-blue-600">{uniqueLocations.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Heart className="h-8 w-8 text-red-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Mentors</p>
                    <p className="text-2xl font-bold text-red-600">
                      {users.filter(user => user.profile?.willingToMentor).length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filter */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Search className="mr-2" />
                Search & Filter
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search by name, email, profession, organization, location, or skills..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                
                <Select value={selectedBatch} onValueChange={setSelectedBatch}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="All Batches" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Batches</SelectItem>
                    {uniqueBatches.map(batch => (
                      <SelectItem key={batch} value={batch}>Batch {batch}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={selectedProfession} onValueChange={setSelectedProfession}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="All Professions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Professions</SelectItem>
                    {uniqueProfessions.map(profession => (
                      <SelectItem key={profession} value={profession!}>{profession}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="All Countries" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Countries</SelectItem>
                    {uniqueLocations.map(location => (
                      <SelectItem key={location} value={location!}>{location}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="mentors-only"
                  checked={showOnlyMentors}
                  onCheckedChange={(checked) => setShowOnlyMentors(checked === true)}
                />
                <label htmlFor="mentors-only" className="text-sm font-medium cursor-pointer">
                  Show only mentors
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Alumni Grid */}
          {filteredUsers.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Alumni Found</h3>
                <p className="text-gray-500">
                  {users.length === 0 
                    ? "No alumni profiles available. More alumni will appear as they join the platform." 
                    : "Try adjusting your search criteria to find more alumni."}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredUsers.map((user) => (
                <Card key={user.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center">
                      <Avatar className="h-20 w-20 mb-4">
                        <AvatarImage src={user.profile?.profilePicture} alt={user.fullName} />
                        <AvatarFallback className="bg-cpscs-blue text-white text-lg">
                          {getInitials(user.fullName)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <h3 className="font-bold text-lg mb-1">{user.fullName}</h3>
                      
                      {user.profile?.profession && (
                        <div className="flex items-center text-gray-600 mb-2">
                          <Briefcase size={14} className="mr-1" />
                          <span className="text-sm">{user.profile.profession}</span>
                        </div>
                      )}
                      
                      {user.profile?.organization && (
                        <p className="text-sm text-gray-600 mb-2">{user.profile.organization}</p>
                      )}
                      
                      <div className="flex items-center text-gray-600 mb-2">
                        <GraduationCap size={14} className="mr-1" />
                        <span className="text-sm">SSC {user.sscYear}</span>
                      </div>
                      
                      {user.profile?.city && user.profile?.country && (
                        <div className="flex items-center text-gray-600 mb-4">
                          <MapPin size={14} className="mr-1" />
                          <span className="text-sm">{user.profile.city}, {user.profile.country}</span>
                        </div>
                      )}
                      
                      <div className="flex flex-wrap gap-1 mb-4 justify-center">
                        {user.profile?.expertise?.slice(0, 2).map((skill, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {user.profile?.expertise && user.profile.expertise.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{user.profile.expertise.length - 2}
                          </Badge>
                        )}
                      </div>
                      
                      {user.profile?.willingToMentor && (
                        <Badge className="mb-4 bg-green-100 text-green-800">
                          <Heart size={12} className="mr-1" />
                          Available for Mentoring
                        </Badge>
                      )}
                      
                      <div className="flex gap-2 w-full">
                        <Button 
                          onClick={() => navigate(`/profile/${user.id}`)}
                          className="flex-1"
                          size="sm"
                        >
                          <UserIcon size={14} className="mr-2" />
                          View Profile
                        </Button>
                        
                        
                        {user.profile?.phoneNumber && user.profile?.showPhone !== false && (
                          <Button 
                            onClick={() => handleContactAlumni(user, 'phone')}
                            variant="outline"
                            size="sm"
                            className="px-3"
                          >
                            <Phone size={14} />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AlumniDirectory;