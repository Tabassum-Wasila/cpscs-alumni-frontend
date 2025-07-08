import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Edit3, Save, X, AlertCircle, Calendar as CalendarIcon, 
  MapPin, Briefcase, GraduationCap, Heart, Award, 
  Phone, Mail, Globe, CheckCircle, User, Building
} from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// Import our new components
import ImageCropUpload from './ImageCropUpload';
import ProfileProgress from './ProfileProgress';
import ProfessionAutocomplete from './ProfessionAutocomplete';
import SocialLinksManager from './SocialLinksManager';
import EducationTimeline from './EducationTimeline';
import RichTextEditor from '@/components/social/RichTextEditor';
import CountryCodeSelect from '@/components/CountryCodeSelect';

const EnhancedProfilePage = () => {
  const { user, updateUserProfile } = useAuth();
  const { toast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  
  // Profile state
  const [profileData, setProfileData] = useState({
    profilePicture: user?.profile?.profilePicture || '',
    bio: user?.profile?.bio || '',
    profession: user?.profile?.profession || '',
    organization: user?.profile?.organization || '',
    organizationWebsite: user?.profile?.organizationWebsite || '',
    jobTitle: user?.profile?.jobTitle || '',
    city: user?.profile?.city || '',
    country: user?.profile?.country || '',
    permanentAddress: user?.profile?.permanentAddress || '',
    sameAsCurrentAddress: user?.profile?.sameAsCurrentAddress || false,
    phoneNumber: user?.profile?.phoneNumber || '',
    showPhone: user?.profile?.showPhone || false,
    dateOfBirth: user?.profile?.dateOfBirth || '',
    expertise: user?.profile?.expertise || [],
    socialLinks: user?.profile?.socialLinks || {},
    willingToMentor: user?.profile?.willingToMentor || false,
    mentorshipAreas: user?.profile?.mentorshipAreas || [],
    aboutMe: user?.profile?.aboutMe || '',
    hallOfFameOptIn: user?.profile?.hallOfFameOptIn || false,
    hallOfFameBio: user?.profile?.hallOfFameBio || '',
    education: user?.profile?.education || [],
    workExperience: user?.profile?.workExperience || []
  });

  // Form state
  const [newExpertise, setNewExpertise] = useState('');
  const [newMentorshipArea, setNewMentorshipArea] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    profileData.dateOfBirth ? new Date(profileData.dateOfBirth) : undefined
  );
  const [countryCode, setCountryCode] = useState('+880');

  const updateField = (field: string, value: any) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
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
      updateField('permanentAddress', profileData.city + ', ' + profileData.country);
    }
  };

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
    updateField('dateOfBirth', date ? date.toISOString() : '');
  };

  const getRequiredFieldsMissing = () => {
    const missing = [];
    if (!profileData.profilePicture) missing.push('Profile Picture');
    if (!profileData.bio) missing.push('Short Bio');
    if (!profileData.profession) missing.push('Profession');
    if (!profileData.organization) missing.push('Organization');
    if (!profileData.city) missing.push('City');
    if (!profileData.country) missing.push('Country');
    if (!profileData.phoneNumber) missing.push('Phone Number');
    if (profileData.expertise.length === 0) missing.push('Expertise');
    
    const socialCount = Object.values(profileData.socialLinks).filter(Boolean).length;
    if (socialCount === 0) missing.push('At least one social link');
    
    return missing;
  };

  const isProfileComplete = getRequiredFieldsMissing().length === 0;

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      const success = await updateUserProfile(profileData);
      
      if (success) {
        toast({
          title: "Profile Updated",
          description: "Your profile has been updated successfully.",
        });
        setIsEditing(false);
      } else {
        throw new Error("Failed to update profile");
      }
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleMentorshipRequest = () => {
    const subject = `Mentorship Request from ${user?.fullName}`;
    const body = `Hello,

I would like to request mentorship from you. I am ${user?.fullName} from SSC Batch ${user?.sscYear}.

Current Position: ${profileData.jobTitle || 'Not specified'} at ${profileData.organization || 'Not specified'}
Areas of Interest: ${profileData.expertise.join(', ') || 'Not specified'}

I would appreciate any guidance you can provide in my professional journey.

Thank you for your time.

Best regards,
${user?.fullName}
Email: ${user?.email}
${profileData.phoneNumber ? `Phone: ${profileData.phoneNumber}` : ''}`;

    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="pt-6 pb-6 text-center">
          <p>Please log in to view your profile.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Progress */}
      <ProfileProgress profile={profileData} />

      {/* Main Profile Card */}
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <ImageCropUpload
                currentImage={profileData.profilePicture}
                onImageUpdate={(imageUrl) => updateField('profilePicture', imageUrl)}
              />
              <div>
                <CardTitle className="text-2xl font-bold text-primary">{user.fullName}</CardTitle>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="secondary">SSC {user.sscYear}</Badge>
                  {user.hscYear && <Badge variant="secondary">HSC {user.hscYear}</Badge>}
                  {profileData.profession && (
                    <Badge className="bg-primary/10 text-primary border-primary/20">
                      {profileData.profession}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)} className="group">
                  <Edit3 className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform" />
                  {isProfileComplete ? "Edit Profile" : "Complete Profile"}
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={isSaving}>
                    <Save className="h-4 w-4 mr-2" />
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {/* Bio Section */}
          {profileData.bio && (
            <div className="mb-6 p-4 bg-muted/50 rounded-lg">
              <p className="text-muted-foreground leading-relaxed">{profileData.bio}</p>
            </div>
          )}

          {isEditing ? (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="basic">Basic</TabsTrigger>
                <TabsTrigger value="professional">Work</TabsTrigger>
                <TabsTrigger value="education">Education</TabsTrigger>
                <TabsTrigger value="social">Social</TabsTrigger>
                <TabsTrigger value="additional">More</TabsTrigger>
              </TabsList>

              {/* Basic Information Tab */}
              <TabsContent value="basic" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="bio" className="flex items-center">
                      Short Bio <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Textarea
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) => updateField('bio', e.target.value)}
                      placeholder="Write a brief introduction about yourself..."
                      className="min-h-[100px]"
                    />
                    <p className="text-xs text-muted-foreground">
                      This appears below your name when others search for you
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="flex items-center">
                        Phone Number <span className="text-red-500 ml-1">*</span>
                      </Label>
                      <div className="flex space-x-2">
                        <CountryCodeSelect
                          value={countryCode}
                          onValueChange={setCountryCode}
                          className="w-24"
                        />
                        <Input
                          id="phone"
                          value={profileData.phoneNumber}
                          onChange={(e) => updateField('phoneNumber', e.target.value)}
                          placeholder="1234567890"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Date of Birth (Optional)</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !selectedDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={handleDateChange}
                            disabled={(date) => date > new Date() || date < new Date("1940-01-01")}
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>

                {/* Address Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Address Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city" className="flex items-center">
                        Current City <span className="text-red-500 ml-1">*</span>
                      </Label>
                      <Input
                        id="city"
                        value={profileData.city}
                        onChange={(e) => updateField('city', e.target.value)}
                        placeholder="e.g., Dhaka"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="country" className="flex items-center">
                        Country <span className="text-red-500 ml-1">*</span>
                      </Label>
                      <Input
                        id="country"
                        value={profileData.country}
                        onChange={(e) => updateField('country', e.target.value)}
                        placeholder="e.g., Bangladesh"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="permanentAddress">Permanent Address (Optional)</Label>
                    <div className="flex items-center space-x-2 mb-2">
                      <Checkbox
                        id="sameAddress"
                        checked={profileData.sameAsCurrentAddress}
                        onCheckedChange={handleSameAddressChange}
                      />
                      <Label htmlFor="sameAddress" className="text-sm">
                        Same as current address
                      </Label>
                    </div>
                    <Textarea
                      id="permanentAddress"
                      value={profileData.permanentAddress}
                      onChange={(e) => updateField('permanentAddress', e.target.value)}
                      placeholder="Enter your permanent address"
                      disabled={profileData.sameAsCurrentAddress}
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Professional Information Tab */}
              <TabsContent value="professional" className="space-y-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Professional Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="flex items-center">
                        Profession <span className="text-red-500 ml-1">*</span>
                      </Label>
                      <ProfessionAutocomplete
                        value={profileData.profession}
                        onChange={(value) => updateField('profession', value)}
                        placeholder="Select or type your profession..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="jobTitle" className="flex items-center">
                        Job Title/Role <span className="text-red-500 ml-1">*</span>
                      </Label>
                      <Input
                        id="jobTitle"
                        value={profileData.jobTitle}
                        onChange={(e) => updateField('jobTitle', e.target.value)}
                        placeholder="e.g., Senior Software Engineer"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="organization" className="flex items-center">
                        Organization <span className="text-red-500 ml-1">*</span>
                      </Label>
                      <Input
                        id="organization"
                        value={profileData.organization}
                        onChange={(e) => updateField('organization', e.target.value)}
                        placeholder="Company/Organization name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="orgWebsite">Organization Website (Optional)</Label>
                      <Input
                        id="orgWebsite"
                        value={profileData.organizationWebsite}
                        onChange={(e) => updateField('organizationWebsite', e.target.value)}
                        placeholder="https://company-website.com"
                      />
                    </div>
                  </div>
                </div>

                {/* Skills & Expertise */}
                <div className="space-y-4">
                  <Label className="flex items-center">
                    Skills & Expertise <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {profileData.expertise.map((tag) => (
                      <Badge key={tag} variant="secondary" className="pl-2 pr-1 py-1 flex items-center gap-1">
                        {tag}
                        <button 
                          type="button"
                          onClick={() => removeExpertise(tag)} 
                          className="text-muted-foreground hover:text-destructive focus:outline-none"
                        >
                          <X size={14} />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Input 
                      value={newExpertise} 
                      onChange={(e) => setNewExpertise(e.target.value)} 
                      placeholder="Add a skill (e.g., JavaScript, Project Management)" 
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addExpertise())}
                    />
                    <Button type="button" onClick={addExpertise}>Add</Button>
                  </div>
                  {profileData.expertise.length === 0 && (
                    <p className="text-xs text-destructive">At least one expertise area is required</p>
                  )}
                </div>
              </TabsContent>

              {/* Education Tab */}
              <TabsContent value="education" className="space-y-6">
                <EducationTimeline
                  education={profileData.education}
                  onChange={(education) => updateField('education', education)}
                  sscYear={user.sscYear}
                  hscYear={user.hscYear}
                />
              </TabsContent>

              {/* Social Links Tab */}
              <TabsContent value="social" className="space-y-6">
                <SocialLinksManager
                  socialLinks={profileData.socialLinks}
                  onChange={(socialLinks) => updateField('socialLinks', socialLinks)}
                />
              </TabsContent>

              {/* Additional Information Tab */}
              <TabsContent value="additional" className="space-y-6">
                <div className="space-y-6">
                  {/* About Me Section */}
                  <div className="space-y-4">
                    <Label className="text-base font-medium">More About Myself (Optional)</Label>
                    <p className="text-sm text-muted-foreground">
                      Write about your achievements, awards, community services, dreams, goals, etc.
                    </p>
                    <RichTextEditor
                      value={profileData.aboutMe}
                      onChange={(value) => updateField('aboutMe', value)}
                      placeholder="Tell us more about yourself - your achievements, goals, community involvement..."
                    />
                  </div>

                  <Separator />

                  {/* Mentorship Section */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="mentorship"
                        checked={profileData.willingToMentor}
                        onCheckedChange={(checked) => updateField('willingToMentor', checked)}
                      />
                      <Label htmlFor="mentorship" className="flex items-center gap-2">
                        <Heart className="h-4 w-4" />
                        I want to mentor juniors to become successful
                      </Label>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      One of our core values is to help others grow. If you feel the same, you can help your juniors by mentoring them to success.
                    </p>

                    {profileData.willingToMentor && (
                      <div className="space-y-4 p-4 bg-accent/50 rounded-lg border">
                        <Label>Mentorship Areas</Label>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {profileData.mentorshipAreas.map((area) => (
                            <Badge key={area} variant="secondary" className="pl-2 pr-1 py-1 flex items-center gap-1">
                              {area}
                              <button 
                                type="button"
                                onClick={() => removeMentorshipArea(area)} 
                                className="text-muted-foreground hover:text-destructive focus:outline-none"
                              >
                                <X size={14} />
                              </button>
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex gap-2">
                          <Input 
                            value={newMentorshipArea} 
                            onChange={(e) => setNewMentorshipArea(e.target.value)} 
                            placeholder="Add mentorship area (e.g., Career Guidance, Technical Skills)" 
                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addMentorshipArea())}
                          />
                          <Button type="button" onClick={addMentorshipArea}>Add</Button>
                        </div>
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Hall of Fame Section */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="hallOfFame"
                        checked={profileData.hallOfFameOptIn}
                        onCheckedChange={(checked) => updateField('hallOfFameOptIn', checked)}
                      />
                      <Label htmlFor="hallOfFame" className="flex items-center gap-2">
                        <Award className="h-4 w-4" />
                        I want to feature my profile in the Hall of Fame
                      </Label>
                    </div>

                    {profileData.hallOfFameOptIn && (
                      <div className="space-y-4 p-4 bg-accent/50 rounded-lg border">
                        <Label htmlFor="hallOfFameBio">Third-Party Bio</Label>
                        <p className="text-sm text-muted-foreground">
                          Write a short bio for yourself in a third-party tone, as if someone else is writing it about you. 
                          Your profile will be reviewed by an independent board before publication. We do not guarantee that your name will be displayed.
                        </p>
                        <Textarea
                          id="hallOfFameBio"
                          value={profileData.hallOfFameBio}
                          onChange={(e) => updateField('hallOfFameBio', e.target.value)}
                          placeholder="John Doe is a renowned software engineer who has contributed significantly to..."
                          className="min-h-[120px]"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            // View Mode
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <Briefcase className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="text-sm font-medium">{profileData.jobTitle || 'Not specified'}</p>
                  <p className="text-xs text-muted-foreground">Current Role</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <Building className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="text-sm font-medium">{profileData.organization || 'Not specified'}</p>
                  <p className="text-xs text-muted-foreground">Organization</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <MapPin className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="text-sm font-medium">{profileData.city || 'Not specified'}</p>
                  <p className="text-xs text-muted-foreground">Location</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <GraduationCap className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="text-sm font-medium">{profileData.education?.length || 0}</p>
                  <p className="text-xs text-muted-foreground">Education Entries</p>
                </div>
              </div>

              {/* Contact & Social */}
              {(profileData.phoneNumber || Object.values(profileData.socialLinks).some(Boolean)) && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Contact Information</h3>
                  <div className="flex flex-wrap gap-2">
                    {profileData.phoneNumber && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={`tel:${profileData.phoneNumber}`}>
                          <Phone className="h-4 w-4 mr-2" />
                          {profileData.phoneNumber}
                        </a>
                      </Button>
                    )}
                    <Button variant="outline" size="sm" asChild>
                      <a href={`mailto:${user.email}`}>
                        <Mail className="h-4 w-4 mr-2" />
                        {user.email}
                      </a>
                    </Button>
                  </div>
                </div>
              )}

              {/* Mentorship */}
              {profileData.willingToMentor && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-green-800">Available for Mentorship</h3>
                      <p className="text-sm text-green-700">
                        {profileData.mentorshipAreas.length > 0 
                          ? `Specialized in: ${profileData.mentorshipAreas.join(', ')}`
                          : 'Open to provide guidance and support'
                        }
                      </p>
                    </div>
                    <Button onClick={handleMentorshipRequest} className="bg-green-600 hover:bg-green-700">
                      Request Mentorship
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedProfilePage;