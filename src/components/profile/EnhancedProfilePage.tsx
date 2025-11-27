import React, { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import DateOfBirthPicker from './DateOfBirthPicker';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Edit, Save, Camera, User, Briefcase, GraduationCap, 
  Globe, Plus, X, MapPin, Phone, Mail, Calendar as CalendarIcon,
  Heart, Award, BookOpen, Target, MessageCircle, CheckCircle,
  Building, ExternalLink, Linkedin, Twitter, Instagram, Youtube
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { UserService, UserProfile } from '@/services/userService';
import { useToast } from '@/hooks/use-toast';
import ImageCropUpload from './ImageCropUpload';
import EducationTimeline from './EducationTimeline';
import ProfessionAutocomplete from './ProfessionAutocomplete';
import SocialLinksManager from './SocialLinksManager';
import RichTextEditor from '../social/RichTextEditor';
import CountryCodeSelect from '../CountryCodeSelect';
import { countryCodes } from '@/data/countryCodes';
import ProfileProgress from './ProfileProgress';
import ProfileView from './ProfileView';
import FuturisticProfileView from './FuturisticProfileView';
import { User as UserType } from '@/contexts/AuthContext';

const EnhancedProfilePage = () => {
  const { user, updateUserProfile } = useAuth();
  const { toast } = useToast();
  const { userId } = useParams();
  const navigate = useNavigate();
  const [viewUser, setViewUser] = useState<UserType | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [countryCode, setCountryCode] = useState('+880');
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Determine if this is the user's own profile
  const isOwnProfile = !userId || (user && userId === user.id);
  const currentUser = isOwnProfile ? user : viewUser;

  // Profile data state
  const [profileData, setProfileData] = useState<UserProfile>({
    profilePicture: '',
    bio: '',
    profession: '',
    organization: '',
    organizationWebsite: '',
    jobTitle: '',
    city: '',
    country: '',
    permanentAddress: '',
    sameAsCurrentAddress: false,
    countryCode: '+880', // <-- add countryCode
    phoneNumber: '',
    showPhone: true,
    dateOfBirth: '',
    expertise: [],
    socialLinks: {},
    willingToMentor: false,
    mentorshipAreas: [],
    aboutMe: '',
    hallOfFameOptIn: false,
    hallOfFameBio: '',
    education: [],
    workExperience: [],
    profileCompletionScore: 0
  });

  // Load user data when component mounts or user changes
  useEffect(() => {
    if (userId && !isOwnProfile) {
      // Load other user's profile from backend
      let mounted = true;
      (async () => {
        try {
          const fetched = await UserService.getUserProfile(userId);
          if (mounted && fetched) setViewUser(fetched);
        } catch (err) {
          console.error('Error loading user profile:', err);
        }
      })();
      return () => { mounted = false; };
    }
  }, [userId, isOwnProfile]);

  // Helper function to detect social platform from URL
  const detectSocialPlatform = (url: string): string | null => {
    if (!url) return null;
    const lowerUrl = url.toLowerCase();
    if (lowerUrl.includes('facebook.com')) return 'facebook';
    if (lowerUrl.includes('linkedin.com')) return 'linkedin';
    if (lowerUrl.includes('instagram.com')) return 'instagram';
    if (lowerUrl.includes('twitter.com') || lowerUrl.includes('x.com')) return 'twitter';
    if (lowerUrl.includes('youtube.com')) return 'youtube';
    return 'website'; // Default to website for other URLs
  };

  // Sync profile data when current user changes
  useEffect(() => {
    if (currentUser?.profile) {
      let socialLinks = currentUser.profile.socialLinks || {};
      
      // Auto-migrate socialProfileLink from signup if socialLinks is empty
      if (Object.keys(socialLinks).length === 0 && (currentUser as any).socialProfileLink) {
        const socialProfileLink = (currentUser as any).socialProfileLink;
        const platform = detectSocialPlatform(socialProfileLink);
        if (platform) {
          socialLinks = { [platform]: socialProfileLink };
        }
      }
      
      setProfileData({
        profilePicture: currentUser.profile.profilePicture || '',
        bio: currentUser.profile.bio || '',
        profession: currentUser.profile.profession || '',
        organization: currentUser.profile.organization || '',
        organizationWebsite: currentUser.profile.organizationWebsite || '',
        jobTitle: currentUser.profile.jobTitle || '',
        city: currentUser.profile.city || '',
        country: currentUser.profile.country || '',
        permanentAddress: currentUser.profile.permanentAddress || '',
        sameAsCurrentAddress: currentUser.profile.sameAsCurrentAddress || false,
        countryCode: currentUser.profile.countryCode || '+880', // <-- expect from backend
        phoneNumber: currentUser.profile.phoneNumber || '',
        showPhone: currentUser.profile.showPhone ?? true,
        dateOfBirth: currentUser.profile.dateOfBirth || '',
        expertise: currentUser.profile.expertise || [],
        socialLinks: socialLinks,
        willingToMentor: currentUser.profile.willingToMentor || false,
        mentorshipAreas: currentUser.profile.mentorshipAreas || [],
        aboutMe: currentUser.profile.aboutMe || '',
        hallOfFameOptIn: currentUser.profile.hallOfFameOptIn || false,
        hallOfFameBio: currentUser.profile.hallOfFameBio || '',
        education: currentUser.profile.education || [],
        workExperience: currentUser.profile.workExperience || [],
        profileCompletionScore: currentUser.profile.profileCompletionScore || 0
      });
      setCountryCode(currentUser.profile.countryCode || '+880'); // keep UI in sync
      setHasUnsavedChanges(false);
    }
  }, [currentUser]);

  // Form state
  const [newExpertise, setNewExpertise] = useState('');
  const [newMentorshipArea, setNewMentorshipArea] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    profileData.dateOfBirth ? new Date(profileData.dateOfBirth) : undefined
  );

  const updateField = (field: string, value: any) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
  };

  const addExpertise = () => {
    if (newExpertise.trim() && !profileData.expertise.includes(newExpertise.trim())) {
      updateField('expertise', [...profileData.expertise, newExpertise.trim()]);
      setNewExpertise('');
    }
  };

  const removeExpertise = (tag: string) => {
    updateField('expertise', profileData.expertise.filter(t => t !== tag));
  };

  const addMentorshipArea = () => {
    if (newMentorshipArea.trim() && !profileData.mentorshipAreas.includes(newMentorshipArea.trim())) {
      updateField('mentorshipAreas', [...profileData.mentorshipAreas, newMentorshipArea.trim()]);
      setNewMentorshipArea('');
    }
  };

  const removeMentorshipArea = (area: string) => {
    updateField('mentorshipAreas', profileData.mentorshipAreas.filter(a => a !== area));
  };

  const handleSameAddressChange = (checked: boolean) => {
    updateField('sameAsCurrentAddress', checked);
    if (checked) {
      updateField('permanentAddress', `${profileData.city}, ${profileData.country}`);
    }
  };

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
    updateField('dateOfBirth', date ? date.toISOString().split('T')[0] : '');
  };

  const getRequiredFieldsMissing = (): string[] => {
    const missing: string[] = [];
    if (!profileData.profilePicture) missing.push('Profile Picture');
    if (!profileData.profession) missing.push('Profession');
    if (!profileData.organization) missing.push('Organization');
    if (!profileData.city) missing.push('City');
    if (!profileData.country) missing.push('Country');
    if (!profileData.bio) missing.push('Bio');
    if (!profileData.phoneNumber) missing.push('Phone Number');
    if (!profileData.expertise.length) missing.push('Expertise');
    
    const socialCount = Object.values(profileData.socialLinks || {}).filter(Boolean).length;
    if (socialCount === 0) missing.push('At least one Social Link');
    
    return missing;
  };

  const isProfileComplete = getRequiredFieldsMissing().length === 0;

  const handleSave = async () => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      const success = await updateUserProfile(profileData);
      if (success) {
        toast({
          title: "Profile Updated",
          description: "Your profile has been successfully updated.",
        });
        setIsEditing(false);
        setHasUnsavedChanges(false);
      } else {
        toast({
          title: "Update Failed",
          description: "Failed to update profile. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Profile update error:', error);
      toast({
        title: "Error",
        description: "An error occurred while updating your profile.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleMentorshipRequest = (mentorUser: UserType) => {
    if (!user) return;
    
    const subject = encodeURIComponent(`Mentorship Request from ${user.fullName}`);
    const body = encodeURIComponent(`Dear ${mentorUser.fullName},

I hope this email finds you well. I am ${user.fullName}, a fellow CPSCS alumni from batch ${user.sscYear}.

I came across your profile in our alumni directory and was impressed by your experience in ${mentorUser.profile?.profession || 'your field'}. I am currently seeking guidance and would be honored if you could consider mentoring me.

I would love to connect and discuss potential mentorship opportunities at your convenience.

Thank you for your time and consideration.

Best regards,
${user.fullName}
Batch ${user.sscYear}
Contact: ${user.email}`);

    window.open(`mailto:${mentorUser.email}?subject=${subject}&body=${body}`, '_blank');
  };

  const handleBeforeUnload = useCallback((e: BeforeUnloadEvent) => {
    if (hasUnsavedChanges) {
      e.preventDefault();
      e.returnValue = '';
    }
  }, [hasUnsavedChanges]);

  const handlePopState = useCallback(() => {
    if (hasUnsavedChanges) {
      setShowUnsavedDialog(true);
      window.history.pushState(null, '', window.location.pathname);
    }
  }, [hasUnsavedChanges]);

  useEffect(() => {
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [handleBeforeUnload, handlePopState]);

  const handleCancelEdit = () => {
    if (hasUnsavedChanges) {
      setShowUnsavedDialog(true);
    } else {
      setIsEditing(false);
    }
  };

  const handleDiscardChanges = () => {
    setShowUnsavedDialog(false);
    setIsEditing(false);
    setHasUnsavedChanges(false);
    // Reset profile data to current user data
    if (currentUser?.profile) {
      setProfileData({
        profilePicture: currentUser.profile.profilePicture || '',
        bio: currentUser.profile.bio || '',
        profession: currentUser.profile.profession || '',
        organization: currentUser.profile.organization || '',
        organizationWebsite: currentUser.profile.organizationWebsite || '',
        jobTitle: currentUser.profile.jobTitle || '',
        city: currentUser.profile.city || '',
        country: currentUser.profile.country || '',
        permanentAddress: currentUser.profile.permanentAddress || '',
        sameAsCurrentAddress: currentUser.profile.sameAsCurrentAddress || false,
        phoneNumber: currentUser.profile.phoneNumber || '',
        showPhone: currentUser.profile.showPhone ?? true,
        dateOfBirth: currentUser.profile.dateOfBirth || '',
        expertise: currentUser.profile.expertise || [],
        socialLinks: currentUser.profile.socialLinks || {},
        willingToMentor: currentUser.profile.willingToMentor || false,
        mentorshipAreas: currentUser.profile.mentorshipAreas || [],
        aboutMe: currentUser.profile.aboutMe || '',
        hallOfFameOptIn: currentUser.profile.hallOfFameOptIn || false,
        hallOfFameBio: currentUser.profile.hallOfFameBio || '',
        education: currentUser.profile.education || [],
        workExperience: currentUser.profile.workExperience || [],
        profileCompletionScore: currentUser.profile.profileCompletionScore || 0
      });
      setHasUnsavedChanges(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <User className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h2 className="text-xl font-semibold mb-2">
              {!isOwnProfile ? "Profile Not Found" : "Please Log In"}
            </h2>
            <p className="text-gray-600">
              {!isOwnProfile 
                ? "The requested profile could not be found." 
                : "You need to be logged in to view your profile."
              }
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show read-only profile view if not editing or viewing someone else's profile
  if (!isEditing || !isOwnProfile) {
    return (
      <FuturisticProfileView 
        user={currentUser} 
        isOwnProfile={isOwnProfile}
        onEdit={() => setIsEditing(true)}
        onMentorshipRequest={handleMentorshipRequest}
      />
    );
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header with Profile Progress */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="relative">
                  <ImageCropUpload
                    currentImage={profileData.profilePicture}
                    onImageUpdate={(imageUrl) => updateField('profilePicture', imageUrl)}
                  />
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h1 className="text-2xl font-bold">{currentUser.fullName}</h1>
                      <p className="text-muted-foreground">Batch {currentUser.sscYear}</p>
                      {profileData.profession && (
                        <p className="text-sm text-muted-foreground">{profileData.profession}</p>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button onClick={handleSave} disabled={isSaving}>
                        <Save className="h-4 w-4 mr-2" />
                        {isSaving ? 'Saving...' : 'Save Changes'}
                      </Button>
                      <Button variant="outline" onClick={handleCancelEdit}>
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </div>

                  {/* Profile Progress */}
                  <ProfileProgress
                    profile={profileData}
                    className="mt-4"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Editing Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="work">Work</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
              <TabsTrigger value="social">Social</TabsTrigger>
              <TabsTrigger value="more">More</TabsTrigger>
            </TabsList>

            {/* Basic Information Tab */}
            <TabsContent value="basic" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Bio */}
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio *</Label>
                    <RichTextEditor
                      value={profileData.bio}
                      onChange={(content) => updateField('bio', content)}
                      placeholder="Tell us about yourself..."
                      className="min-h-[120px]"
                    />
                  </div>

                  {/* Location */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={profileData.city}
                        onChange={(e) => updateField('city', e.target.value)}
                        placeholder="e.g., Dhaka"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Country *</Label>
                      <Input
                        id="country"
                        value={profileData.country}
                        onChange={(e) => updateField('country', e.target.value)}
                        placeholder="e.g., Bangladesh"
                      />
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-4">
                    <h4 className="font-medium flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Contact Information
                    </h4>
                    
                    <div className="flex space-x-2">
                      <CountryCodeSelect
                        value={profileData.countryCode}
                        onValueChange={val => { setCountryCode(val); updateField('countryCode', val); }}
                        className="w-24"
                      />
                      <Input
                        placeholder="Phone number"
                        value={profileData.phoneNumber}
                        onChange={(e) => updateField('phoneNumber', e.target.value)}
                        className="flex-1"
                      />
                    </div>
                    
                    {/* Phone Privacy Toggle */}
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="showPhone"
                        checked={profileData.showPhone}
                        onCheckedChange={(checked) => updateField('showPhone', checked)}
                      />
                      <Label htmlFor="showPhone" className="text-sm">
                        {profileData.showPhone ? "Show My Number" : "Don't Show My Number"}
                      </Label>
                    </div>
                  </div>

                  {/* Date of Birth */}
                  <DateOfBirthPicker value={selectedDate} onChange={handleDateChange} />

                  {/* Expertise */}
                  <div className="space-y-3">
                    <Label>Areas of Expertise *</Label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {profileData.expertise.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {skill}
                          <X 
                            className="h-3 w-3 cursor-pointer" 
                            onClick={() => removeExpertise(skill)}
                          />
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add expertise (e.g., Web Development)"
                        value={newExpertise}
                        onChange={(e) => setNewExpertise(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addExpertise()}
                      />
                      <Button onClick={addExpertise} size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Work Tab */}
            <TabsContent value="work" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    Professional Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Profession */}
                  <div className="space-y-2">
                    <Label htmlFor="profession">Profession *</Label>
                    <ProfessionAutocomplete
                      value={profileData.profession}
                      onChange={(value) => updateField('profession', value)}
                      placeholder="e.g., Software Engineer"
                    />
                  </div>

                  {/* Job Title */}
                  <div className="space-y-2">
                    <Label htmlFor="jobTitle">Job Title</Label>
                    <Input
                      id="jobTitle"
                      value={profileData.jobTitle}
                      onChange={(e) => updateField('jobTitle', e.target.value)}
                      placeholder="e.g., Senior Software Engineer"
                    />
                  </div>

                  {/* Organization */}
                  <div className="space-y-2">
                    <Label htmlFor="organization">Organization *</Label>
                    <Input
                      id="organization"
                      value={profileData.organization}
                      onChange={(e) => updateField('organization', e.target.value)}
                      placeholder="e.g., Google"
                    />
                  </div>

                  {/* Organization Website */}
                  <div className="space-y-2">
                    <Label htmlFor="organizationWebsite">Organization Website</Label>
                    <Input
                      id="organizationWebsite"
                      value={profileData.organizationWebsite}
                      onChange={(e) => updateField('organizationWebsite', e.target.value)}
                      placeholder="https://example.com"
                    />
                  </div>

                  {/* Mentorship */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="willingToMentor"
                        checked={profileData.willingToMentor}
                        onCheckedChange={(checked) => updateField('willingToMentor', checked)}
                      />
                      <Label htmlFor="willingToMentor" className="flex items-center gap-2">
                        <Heart className="h-4 w-4" />
                        I'm willing to mentor other alumni
                      </Label>
                    </div>

                    {profileData.willingToMentor && (
                      <div className="space-y-3">
                        <Label>Mentorship Areas</Label>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {profileData.mentorshipAreas.map((area, index) => (
                            <Badge key={index} variant="outline" className="flex items-center gap-1">
                              {area}
                              <X 
                                className="h-3 w-3 cursor-pointer" 
                                onClick={() => removeMentorshipArea(area)}
                              />
                            </Badge>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Add mentorship area"
                            value={newMentorshipArea}
                            onChange={(e) => setNewMentorshipArea(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && addMentorshipArea()}
                          />
                          <Button onClick={addMentorshipArea} size="sm">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Education Tab */}
            <TabsContent value="education" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Education
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <EducationTimeline
                    education={profileData.education}
                    onChange={(education) => updateField('education', education)}
                    sscYear={currentUser.sscYear}
                    hscYear={currentUser.hscYear}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Social Links Tab */}
            <TabsContent value="social" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Social Links
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <SocialLinksManager
                    socialLinks={profileData.socialLinks}
                    onChange={(socialLinks) => updateField('socialLinks', socialLinks)}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* More Tab */}
            <TabsContent value="more" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Additional Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* More About Me */}
                  <div className="space-y-2">
                    <Label htmlFor="aboutMe">More About Me</Label>
                    <RichTextEditor
                      value={profileData.aboutMe}
                      onChange={(content) => updateField('aboutMe', content)}
                      placeholder="Tell us more about yourself, your interests, achievements..."
                      className="min-h-[120px]"
                    />
                  </div>

                  {/* Permanent Address */}
                  <div className="space-y-4">
                    <h4 className="font-medium flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Address Information
                    </h4>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="sameAsCurrentAddress"
                        checked={profileData.sameAsCurrentAddress}
                        onCheckedChange={handleSameAddressChange}
                      />
                      <Label htmlFor="sameAsCurrentAddress">
                        Permanent address is same as current location
                      </Label>
                    </div>

                    {!profileData.sameAsCurrentAddress && (
                      <div className="space-y-2">
                        <Label htmlFor="permanentAddress">Permanent Address</Label>
                        <Textarea
                          id="permanentAddress"
                          value={profileData.permanentAddress}
                          onChange={(e) => updateField('permanentAddress', e.target.value)}
                          placeholder="Enter your permanent address..."
                          rows={2}
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        <div className="flex gap-2 justify-end mt-[1rem]">
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* Unsaved Changes Dialog */}
      <Dialog open={showUnsavedDialog} onOpenChange={setShowUnsavedDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unsaved Changes</DialogTitle>
            <DialogDescription>
              You have unsaved changes. What would you like to do?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUnsavedDialog(false)}>
              Continue Editing
            </Button>
            <Button variant="destructive" onClick={handleDiscardChanges}>
              Discard Changes
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EnhancedProfilePage;
