import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Filter, Users, MapPin, Heart, GraduationCap, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { User as UserType } from '@/contexts/AuthContext';

const AlumniDirectory = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    batch: 'all',
    country: 'all',
    profession: 'all',
    willingToMentor: false
  });

  // Load user data from localStorage
  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem('cpscs_users') || '[]');
    setUsers(storedUsers);
  }, []);

  // Memoize derived data to prevent unnecessary re-renders
  const uniqueBatches = useCallback(() => {
    return [...new Set(users.map(user => user.sscYear))];
  }, [users]);

  const uniqueCountries = useCallback(() => {
    return [...new Set(users.map(user => user.profile?.country).filter(Boolean))];
  }, [users]);

  const uniqueProfessions = useCallback(() => {
    return [...new Set(users.map(user => user.profile?.profession).filter(Boolean))];
  }, [users]);

  const mentorCount = useCallback(() => {
    return users.filter(user => user.profile?.willingToMentor).length;
  }, [users]);

  const filteredUsers = useCallback(() => {
    let filtered = users.filter(user => {
      const searchRegex = new RegExp(searchTerm, 'i');
      const matchesSearch = searchRegex.test(user.fullName) ||
        searchRegex.test(user.profile?.profession || '') ||
        searchRegex.test(user.profile?.organization || '');

      let matchesFilters = true;
      if (filters.batch !== 'all') {
        matchesFilters = matchesFilters && user.sscYear === filters.batch;
      }
      if (filters.country !== 'all') {
        matchesFilters = matchesFilters && user.profile?.country === filters.country;
      }
      if (filters.profession !== 'all') {
        matchesFilters = matchesFilters && user.profile?.profession === filters.profession;
      }
      if (filters.willingToMentor) {
        matchesFilters = matchesFilters && user.profile?.willingToMentor === true;
      }

      return matchesSearch && matchesFilters;
    });

    return filtered;
  }, [users, searchTerm, filters]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Alumni Directory</h1>
          <p className="text-lg text-muted-foreground">
            Connect with fellow alumni from Chittagong Public School and College
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="text-center">
            <CardContent className="pt-6">
              <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">{users.length}</div>
              <p className="text-sm text-muted-foreground">Total Alumni</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <GraduationCap className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold">{uniqueBatches().length}</div>
              <p className="text-sm text-muted-foreground">Batches</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <MapPin className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold">{uniqueCountries().length}</div>
              <p className="text-sm text-muted-foreground">Countries</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <Heart className="h-8 w-8 mx-auto mb-2 text-red-600" />
              <div className="text-2xl font-bold">{mentorCount()}</div>
              <p className="text-sm text-muted-foreground">Mentors</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, profession, or organization..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filters
                {Object.values(filters).some(v => v !== 'all' && v !== '') && (
                  <Badge variant="secondary" className="ml-1">
                    {Object.values(filters).filter(v => v !== 'all' && v !== '').length}
                  </Badge>
                )}
              </Button>
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
                <div>
                  <Label htmlFor="batch-filter">Batch</Label>
                  <Select value={filters.batch} onValueChange={(value) => setFilters(prev => ({...prev, batch: value}))}>
                    <SelectTrigger>
                      <SelectValue placeholder="All batches" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All batches</SelectItem>
                      {uniqueBatches().map(batch => (
                        <SelectItem key={batch} value={batch}>{batch}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="country-filter">Country</Label>
                  <Select value={filters.country} onValueChange={(value) => setFilters(prev => ({...prev, country: value}))}>
                    <SelectTrigger>
                      <SelectValue placeholder="All countries" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All countries</SelectItem>
                      {uniqueCountries().map(country => (
                        <SelectItem key={country} value={country}>{country}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="profession-filter">Profession</Label>
                  <Select value={filters.profession} onValueChange={(value) => setFilters(prev => ({...prev, profession: value}))}>
                    <SelectTrigger>
                      <SelectValue placeholder="All professions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All professions</SelectItem>
                      {uniqueProfessions().map(profession => (
                        <SelectItem key={profession} value={profession}>{profession}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="mentor-filter"
                    checked={filters.willingToMentor}
                    onCheckedChange={(checked) => setFilters(prev => ({...prev, willingToMentor: checked}))}
                  />
                  <Label htmlFor="mentor-filter">Available for mentoring</Label>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Alumni Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers().map((user) => (
            <Card key={user.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={user.profile?.profilePicture} alt={user.fullName} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-lg font-semibold">
                      {user.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg truncate">{user.fullName}</h3>
                    <p className="text-sm text-muted-foreground">SSC {user.sscYear}</p>
                    
                    {user.profile?.profession && (
                      <p className="text-sm font-medium text-primary mt-1 truncate">
                        {user.profile.profession}
                      </p>
                    )}
                    
                    {user.profile?.organization && (
                      <p className="text-xs text-muted-foreground truncate">
                        {user.profile.organization}
                      </p>
                    )}
                    
                    {user.profile?.city && user.profile?.country && (
                      <p className="text-xs text-muted-foreground mt-1 flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {user.profile.city}, {user.profile.country}
                      </p>
                    )}

                    {user.profile?.willingToMentor && (
                      <Badge variant="secondary" className="mt-2 text-xs">
                        <Heart className="h-3 w-3 mr-1" />
                        Available for Mentoring
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button
                    size="sm"
                    onClick={() => navigate(`/profile/${user.id}`)}
                    className="flex-1"
                  >
                    <User className="h-4 w-4 mr-2" />
                    View Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredUsers().length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No alumni found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlumniDirectory;
