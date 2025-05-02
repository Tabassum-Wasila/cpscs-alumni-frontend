
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { X, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription } from '@/components/ui/alert';

const ProfilePage = () => {
  const { user, updateUserProfile } = useAuth();
  const { toast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(user?.profile?.profilePicture || '');
  const [bio, setBio] = useState(user?.profile?.bio || '');
  const [profession, setProfession] = useState(user?.profile?.profession || '');
  const [organization, setOrganization] = useState(user?.profile?.organization || '');
  const [city, setCity] = useState(user?.profile?.city || '');
  const [country, setCountry] = useState(user?.profile?.country || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.profile?.phoneNumber || '');
  const [willingToMentor, setWillingToMentor] = useState(user?.profile?.willingToMentor || false);
  const [facebookLink, setFacebookLink] = useState(user?.profile?.socialLinks?.facebook || '');
  const [linkedinLink, setLinkedinLink] = useState(user?.profile?.socialLinks?.linkedin || '');
  const [youtubeLink, setYoutubeLink] = useState(user?.profile?.socialLinks?.youtube || '');
  
  const [newExpertise, setNewExpertise] = useState('');
  const [expertise, setExpertise] = useState<string[]>(user?.profile?.expertise || []);
  
  const [mentorshipArea, setMentorshipArea] = useState('');
  const [mentorshipAreas, setMentorshipAreas] = useState<string[]>(user?.profile?.mentorshipAreas || []);
  
  const [isSaving, setIsSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  
  // Check required fields
  const checkRequiredFieldsComplete = () => {
    const missingFields = [];
    
    if (!avatarUrl) missingFields.push('Profile Picture');
    if (!bio) missingFields.push('Bio');
    if (!profession) missingFields.push('Profession');
    if (!organization) missingFields.push('Organization');
    if (!city) missingFields.push('City');
    if (!country) missingFields.push('Country');
    if (expertise.length === 0) missingFields.push('Areas of Expertise');
    
    return missingFields;
  };
  
  const addExpertise = () => {
    const trimmedExpertise = newExpertise.trim();
    if (trimmedExpertise && !expertise.includes(trimmedExpertise)) {
      setExpertise([...expertise, trimmedExpertise]);
      setNewExpertise('');
    }
  };

  const removeExpertise = (tag: string) => {
    setExpertise(expertise.filter(t => t !== tag));
  };
  
  const addMentorshipArea = () => {
    const trimmedArea = mentorshipArea.trim();
    if (trimmedArea && !mentorshipAreas.includes(trimmedArea)) {
      setMentorshipAreas([...mentorshipAreas, trimmedArea]);
      setMentorshipArea('');
    }
  };

  const removeMentorshipArea = (area: string) => {
    setMentorshipAreas(mentorshipAreas.filter(a => a !== area));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    const missingFields = checkRequiredFieldsComplete();
    if (missingFields.length > 0) {
      setValidationErrors(missingFields);
      toast({
        title: "Missing Required Fields",
        description: `Please complete all required fields: ${missingFields.join(', ')}`,
        variant: "destructive",
      });
      return;
    }
    
    setIsSaving(true);
    setValidationErrors([]);
    
    try {
      const success = await updateUserProfile({
        profilePicture: avatarUrl,
        bio,
        profession,
        organization,
        city,
        country,
        phoneNumber,
        expertise,
        willingToMentor,
        mentorshipAreas,
        socialLinks: {
          facebook: facebookLink,
          linkedin: linkedinLink,
          youtube: youtubeLink
        }
      });
      
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

  // Check if profile is complete
  const missingRequiredFields = checkRequiredFieldsComplete();
  const isProfileComplete = missingRequiredFields.length === 0;

  if (!user) {
    return (
      <Card className="mb-6">
        <CardContent className="pt-6 pb-6 text-center">
          <p>Please log in to view your profile.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {!isProfileComplete && !isEditing && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Your profile is incomplete. Please complete all required fields to access the Alumni Directory.
          </AlertDescription>
        </Alert>
      )}
      
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold text-cpscs-blue">My Profile</CardTitle>
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)}>
                {isProfileComplete ? "Edit Profile" : "Complete Profile"}
              </Button>
            ) : (
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel Editing
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-cpscs-blue">Basic Information</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input 
                    id="fullName" 
                    value={user.fullName} 
                    disabled 
                  />
                  <p className="text-xs text-gray-500">Name cannot be changed</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="batch">SSC Batch</Label>
                  <Input 
                    id="batch" 
                    value={user.sscYear} 
                    disabled 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="avatarUrl" className="flex items-center">
                    Profile Picture URL <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Input 
                    id="avatarUrl" 
                    value={avatarUrl} 
                    onChange={(e) => setAvatarUrl(e.target.value)} 
                    placeholder="https://example.com/your-photo.jpg" 
                    className={validationErrors.includes('Profile Picture') ? "border-red-500" : ""}
                  />
                  <p className="text-xs text-gray-500">
                    Paste a link to your profile picture (required)
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio" className="flex items-center">
                    Bio <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Textarea 
                    id="bio" 
                    value={bio} 
                    onChange={(e) => setBio(e.target.value)} 
                    placeholder="Tell us about yourself..." 
                    className={`min-h-[100px] ${validationErrors.includes('Bio') ? "border-red-500" : ""}`}
                  />
                </div>
              </div>
              
              {/* Professional Info Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-cpscs-blue">Professional Information</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="profession" className="flex items-center">
                    Profession <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Input 
                    id="profession" 
                    value={profession} 
                    onChange={(e) => setProfession(e.target.value)} 
                    placeholder="E.g., Software Engineer, Doctor, Teacher, etc." 
                    className={validationErrors.includes('Profession') ? "border-red-500" : ""}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="organization" className="flex items-center">
                    Organization <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Input 
                    id="organization" 
                    value={organization} 
                    onChange={(e) => setOrganization(e.target.value)} 
                    placeholder="Where do you work or study?" 
                    className={validationErrors.includes('Organization') ? "border-red-500" : ""}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="expertise" className="flex items-center">
                    Areas of Expertise <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {expertise.map((tag) => (
                      <Badge key={tag} variant="secondary" className="pl-2 pr-1 py-1 flex items-center gap-1">
                        {tag}
                        <button 
                          type="button"
                          onClick={() => removeExpertise(tag)} 
                          className="text-gray-500 hover:text-gray-700 focus:outline-none"
                        >
                          <X size={14} />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Input 
                      id="expertise" 
                      value={newExpertise} 
                      onChange={(e) => setNewExpertise(e.target.value)} 
                      placeholder="Add an expertise area (e.g., Web Development)" 
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addExpertise())}
                      className={validationErrors.includes('Areas of Expertise') ? "border-red-500" : ""}
                    />
                    <Button type="button" onClick={addExpertise}>Add</Button>
                  </div>
                  {expertise.length === 0 && validationErrors.includes('Areas of Expertise') && (
                    <p className="text-xs text-red-500">At least one expertise area is required</p>
                  )}
                </div>
              </div>
              
              {/* Contact Info Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-cpscs-blue">Contact Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      value={user.email} 
                      disabled 
                    />
                    <p className="text-xs text-gray-500">Email cannot be changed</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input 
                      id="phoneNumber" 
                      value={phoneNumber} 
                      onChange={(e) => setPhoneNumber(e.target.value)} 
                      placeholder="E.g., +880 1234 567890" 
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city" className="flex items-center">
                      City <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Input 
                      id="city" 
                      value={city} 
                      onChange={(e) => setCity(e.target.value)} 
                      placeholder="Current city" 
                      className={validationErrors.includes('City') ? "border-red-500" : ""}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="country" className="flex items-center">
                      Country <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Input 
                      id="country" 
                      value={country} 
                      onChange={(e) => setCountry(e.target.value)} 
                      placeholder="Current country" 
                      className={validationErrors.includes('Country') ? "border-red-500" : ""}
                    />
                  </div>
                </div>
              </div>
              
              {/* Social Media Section */}
              <Accordion type="single" collapsible defaultValue="social-media">
                <AccordionItem value="social-media">
                  <AccordionTrigger>Social Media Links</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-2">
                      <div className="space-y-2">
                        <Label htmlFor="facebook">Facebook</Label>
                        <Input 
                          id="facebook" 
                          value={facebookLink} 
                          onChange={(e) => setFacebookLink(e.target.value)} 
                          placeholder="https://facebook.com/your-profile" 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="linkedin">LinkedIn</Label>
                        <Input 
                          id="linkedin" 
                          value={linkedinLink} 
                          onChange={(e) => setLinkedinLink(e.target.value)} 
                          placeholder="https://linkedin.com/in/your-profile" 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="youtube">YouTube</Label>
                        <Input 
                          id="youtube" 
                          value={youtubeLink} 
                          onChange={(e) => setYoutubeLink(e.target.value)} 
                          placeholder="https://youtube.com/@your-channel" 
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              
              {/* Mentorship Section */}
              <div className="space-y-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-cpscs-blue">Mentorship</h3>
                    <p className="text-sm text-gray-500">Are you willing to mentor other alumni?</p>
                  </div>
                  <Switch 
                    checked={willingToMentor}
                    onCheckedChange={setWillingToMentor}
                  />
                </div>
                
                {willingToMentor && (
                  <div className="space-y-4 mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
                    <h4 className="font-medium text-amber-800">Mentorship Areas</h4>
                    <p className="text-sm text-amber-700">Specify areas where you can provide mentorship:</p>
                    
                    <div className="flex flex-wrap gap-2 mb-2">
                      {mentorshipAreas.map((area) => (
                        <Badge key={area} variant="secondary" className="bg-amber-100 border-amber-200 text-amber-800 pl-2 pr-1 py-1 flex items-center gap-1">
                          {area}
                          <button 
                            type="button"
                            onClick={() => removeMentorshipArea(area)} 
                            className="text-amber-500 hover:text-amber-700 focus:outline-none"
                          >
                            <X size={14} />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex gap-2">
                      <Input 
                        value={mentorshipArea} 
                        onChange={(e) => setMentorshipArea(e.target.value)} 
                        placeholder="E.g., Career Guidance, College Applications" 
                        className="bg-white"
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addMentorshipArea())}
                      />
                      <Button 
                        type="button" 
                        onClick={addMentorshipArea} 
                        className="bg-amber-500 hover:bg-amber-600"
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              
              {validationErrors.length > 0 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Please fill in all required fields marked with *
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="pt-4 flex justify-between items-center">
                <p className="text-sm text-red-500">* Required fields</p>
                <Button type="submit" className="bg-cpscs-blue hover:bg-blue-700" disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Profile"}
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              {/* Profile Header */}
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <Avatar className="w-24 h-24 border-2 border-cpscs-gold">
                  <AvatarImage 
                    src={user.profile?.profilePicture} 
                    alt={user.fullName} 
                  />
                  <AvatarFallback className="bg-cpscs-blue text-white text-xl">
                    {user.fullName.split(' ').map(n => n[0]).join('').substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="text-center md:text-left space-y-2">
                  <h3 className="text-2xl font-semibold">{user.fullName}</h3>
                  <div className="flex flex-wrap justify-center md:justify-start gap-2">
                    <Badge>Class of {user.sscYear}</Badge>
                    {user.hscYear && <Badge>HSC {user.hscYear}</Badge>}
                    {user.profile?.willingToMentor && (
                      <Badge className="bg-cpscs-gold">Available for Mentorship</Badge>
                    )}
                  </div>
                  <p className="text-gray-600">
                    {user.profile?.profession}{user.profile?.profession && user.profile?.organization && " at "}
                    {user.profile?.organization}
                  </p>
                  <p className="text-gray-600">
                    {user.profile?.city}{user.profile?.city && user.profile?.country && ", "}
                    {user.profile?.country}
                  </p>
                </div>
              </div>
              
              {/* Bio Section */}
              <div className="space-y-2">
                <h4 className="font-medium text-cpscs-blue text-lg">About</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  {user.profile?.bio ? (
                    <p>{user.profile.bio}</p>
                  ) : (
                    <p className="text-gray-500 italic">No bio provided. Click "Edit Profile" to add your bio.</p>
                  )}
                </div>
              </div>
              
              {/* Expertise Section */}
              <div className="space-y-2">
                <h4 className="font-medium text-cpscs-blue text-lg">Areas of Expertise</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  {user.profile?.expertise && user.profile.expertise.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {user.profile.expertise.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No expertise areas listed. Click "Edit Profile" to add your areas of expertise.</p>
                  )}
                </div>
              </div>
              
              {/* Contact Section */}
              <div className="space-y-2">
                <h4 className="font-medium text-cpscs-blue text-lg">Contact Information</h4>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <p>
                    <span className="font-medium">Email:</span> {user.email}
                  </p>
                  <p>
                    <span className="font-medium">Phone:</span> {user.profile?.phoneNumber || "Not provided"}
                  </p>
                  
                  {/* Social Media Links */}
                  <div className="pt-2">
                    <p className="font-medium mb-2">Social Media:</p>
                    <div className="flex flex-wrap gap-3">
                      {user.profile?.socialLinks?.facebook ? (
                        <a 
                          href={user.profile.socialLinks.facebook} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                          </svg>
                          Facebook
                        </a>
                      ) : null}
                      
                      {user.profile?.socialLinks?.linkedin ? (
                        <a 
                          href={user.profile.socialLinks.linkedin} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-blue-800 hover:underline"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                            <rect x="2" y="9" width="4" height="12"></rect>
                            <circle cx="4" cy="4" r="2"></circle>
                          </svg>
                          LinkedIn
                        </a>
                      ) : null}
                      
                      {user.profile?.socialLinks?.youtube ? (
                        <a 
                          href={user.profile.socialLinks.youtube} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-red-600 hover:underline"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                            <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                          </svg>
                          YouTube
                        </a>
                      ) : null}
                      
                      {!user.profile?.socialLinks?.facebook && !user.profile?.socialLinks?.linkedin && !user.profile?.socialLinks?.youtube && (
                        <span className="text-gray-500 italic">No social media links provided</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Mentorship Section */}
              {user.profile?.willingToMentor && (
                <div className="space-y-2">
                  <h4 className="font-medium text-cpscs-blue text-lg">Mentorship Information</h4>
                  <div className="bg-amber-50 p-4 rounded-lg space-y-2 border border-amber-200">
                    <p className="font-medium text-amber-800">You are available as a mentor</p>
                    
                    {user.profile.mentorshipAreas && user.profile.mentorshipAreas.length > 0 ? (
                      <div>
                        <p className="mb-2">Areas where you provide mentorship:</p>
                        <div className="flex flex-wrap gap-2">
                          {user.profile.mentorshipAreas.map((area) => (
                            <Badge key={area} variant="secondary" className="bg-amber-100 border-amber-200 text-amber-800">
                              {area}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-amber-700">You haven't specified any particular mentorship areas.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Account Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-cpscs-blue">Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Email Address</p>
              <p className="text-base">{user.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Member Since</p>
              <p className="text-base">
                {user.dateJoined ? new Date(user.dateJoined).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : "Unknown"}
              </p>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Membership Status</p>
            <div className="flex items-center mt-1">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Active Member
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
