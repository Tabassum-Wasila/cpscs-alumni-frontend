import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, Mail, Phone, MapPin, Briefcase, GraduationCap, 
  Heart, Globe, Linkedin, Twitter, Instagram, Youtube,
  Calendar, Shield, ExternalLink, MessageCircle
} from 'lucide-react';
import { User as UserType } from '@/contexts/AuthContext';
import { UserService } from '@/services/userService';
import PrivacyVerification from './PrivacyVerification';

interface ProfileViewProps {
  user: UserType;
  isOwnProfile?: boolean;
  onEdit?: () => void;
  onMentorshipRequest?: (mentorUser: UserType) => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ 
  user, 
  isOwnProfile = false,
  onEdit,
  onMentorshipRequest
}) => {
  const [showPrivacyDialog, setShowPrivacyDialog] = useState(false);
  const [verificationContactType, setVerificationContactType] = useState<'email' | 'phone'>('email');
  const [verifiedContacts, setVerifiedContacts] = useState<Set<string>>(new Set());

  const completionPercentage = UserService.calculateProfileCompletion(user);
  const missingFields = UserService.getMissingFields(user);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleContactVerification = (contactType: 'email' | 'phone') => {
    if (verifiedContacts.has(contactType)) return;
    
    setVerificationContactType(contactType);
    setShowPrivacyDialog(true);
  };

  const handleVerificationSuccess = () => {
    setVerifiedContacts(prev => new Set([...prev, verificationContactType]));
  };

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'linkedin': return <Linkedin className="h-4 w-4" />;
      case 'twitter': return <Twitter className="h-4 w-4" />;
      case 'instagram': return <Instagram className="h-4 w-4" />;
      case 'youtube': return <Youtube className="h-4 w-4" />;
      case 'website': return <Globe className="h-4 w-4" />;
      default: return <ExternalLink className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.profile?.profilePicture} alt={user.fullName} />
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                {getInitials(user.fullName)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold">{user.fullName}</h1>
                  {user.profile?.profession && (
                    <p className="text-lg text-muted-foreground">{user.profile.profession}</p>
                  )}
                  {user.profile?.organization && (
                    <p className="text-sm text-muted-foreground">{user.profile.organization}</p>
                  )}
                </div>
                
                <div className="flex gap-2">
                  {isOwnProfile && onEdit && (
                    <Button onClick={onEdit} variant="outline">
                      <User className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  )}
                  {!isOwnProfile && user.profile?.willingToMentor && onMentorshipRequest && (
                    <Button onClick={() => onMentorshipRequest(user)}>
                      <Heart className="h-4 w-4 mr-2" />
                      Request Mentorship
                    </Button>
                  )}
                </div>
              </div>

              {/* Profile Completion */}
              {isOwnProfile && (
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Profile Completion</span>
                    <span className="text-sm font-semibold">{completionPercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${completionPercentage}%` }}
                    />
                  </div>
                  {missingFields.length > 0 && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Missing: {missingFields.join(', ')}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Tabs */}
      <Tabs defaultValue="basic" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="basic">Basic</TabsTrigger>
          <TabsTrigger value="professional">Work</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="social">Social</TabsTrigger>
          <TabsTrigger value="additional">More</TabsTrigger>
        </TabsList>

        {/* Basic Information */}
        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {user.profile?.bio && (
                <div>
                  <h4 className="font-medium mb-2">About</h4>
                  <div 
                    className="text-muted-foreground prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: user.profile.bio }}
                  />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Email */}
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  {verifiedContacts.has('email') ? (
                    <span className="text-sm">{user.email}</span>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleContactVerification('email')}
                      className="h-8"
                    >
                      <Shield className="h-3 w-3 mr-1" />
                      View Email
                    </Button>
                  )}
                </div>

                {/* Phone */}
                {user.profile?.phoneNumber && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    {verifiedContacts.has('phone') ? (
                      <span className="text-sm">{user.profile.phoneNumber}</span>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleContactVerification('phone')}
                        className="h-8"
                      >
                        <Shield className="h-3 w-3 mr-1" />
                        View Phone
                      </Button>
                    )}
                  </div>
                )}

                {/* Location */}
                {user.profile?.city && user.profile?.country && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{user.profile.city}, {user.profile.country}</span>
                  </div>
                )}

                {/* Date of Birth */}
                {user.profile?.dateOfBirth && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{formatDate(user.profile.dateOfBirth)}</span>
                  </div>
                )}
              </div>

              {/* Expertise */}
              {user.profile?.expertise && user.profile.expertise.length > 0 && (
                <div>
                  <h4 className="font-medium mb-3">Expertise</h4>
                  <div className="flex flex-wrap gap-2">
                    {user.profile.expertise.map((skill, index) => (
                      <Badge key={index} variant="secondary">{skill}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Professional Information */}
        <TabsContent value="professional">
          <Card>
            <CardHeader>
              <CardTitle>Professional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {user.profile?.profession && (
                  <div>
                    <h4 className="font-medium mb-1">Profession</h4>
                    <p className="text-muted-foreground">{user.profile.profession}</p>
                  </div>
                )}

                {user.profile?.jobTitle && (
                  <div>
                    <h4 className="font-medium mb-1">Job Title</h4>
                    <p className="text-muted-foreground">{user.profile.jobTitle}</p>
                  </div>
                )}

                {user.profile?.organization && (
                  <div>
                    <h4 className="font-medium mb-1">Organization</h4>
                    <p className="text-muted-foreground">{user.profile.organization}</p>
                  </div>
                )}

                {user.profile?.organizationWebsite && (
                  <div>
                    <h4 className="font-medium mb-1">Organization Website</h4>
                    <a 
                      href={user.profile.organizationWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline text-sm flex items-center gap-1"
                    >
                      {user.profile.organizationWebsite}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}
              </div>

              {/* Work Experience */}
              {user.profile?.workExperience && user.profile.workExperience.length > 0 && (
                <div>
                  <h4 className="font-medium mb-3">Work Experience</h4>
                  <div className="space-y-3">
                    {user.profile.workExperience.map((work, index) => (
                      <div key={index} className="border-l-2 border-primary pl-4">
                        <h5 className="font-medium">{work.title}</h5>
                        <p className="text-sm text-muted-foreground">{work.company}</p>
                        <p className="text-xs text-muted-foreground">
                          {work.startDate} - {work.isCurrent ? 'Present' : work.endDate}
                        </p>
                        {work.description && (
                          <p className="text-sm mt-1">{work.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Mentorship */}
              {user.profile?.willingToMentor && (
                <div>
                  <h4 className="font-medium mb-2">Mentorship</h4>
                  <Badge className="bg-green-100 text-green-800 mb-2">
                    <Heart className="h-3 w-3 mr-1" />
                    Available for Mentoring
                  </Badge>
                  {user.profile.mentorshipAreas && user.profile.mentorshipAreas.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm text-muted-foreground mb-2">Mentorship Areas:</p>
                      <div className="flex flex-wrap gap-1">
                        {user.profile.mentorshipAreas.map((area, index) => (
                          <Badge key={index} variant="outline">{area}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Education */}
        <TabsContent value="education">
          <Card>
            <CardHeader>
              <CardTitle>Education</CardTitle>
            </CardHeader>
            <CardContent>
              {user.profile?.education && user.profile.education.length > 0 ? (
                <div className="space-y-4">
                  {user.profile.education
                    .sort((a, b) => parseInt(b.graduationYear) - parseInt(a.graduationYear))
                    .map((edu, index) => (
                    <div key={edu.id} className="flex items-start gap-4">
                      <div className="w-3 h-3 rounded-full bg-primary mt-2" />
                      <div className="flex-1">
                        <h4 className="font-medium">{edu.degree}</h4>
                        <p className="text-sm text-muted-foreground">{edu.institution}</p>
                        {edu.department && (
                          <p className="text-sm text-muted-foreground">{edu.department}</p>
                        )}
                        <p className="text-xs text-muted-foreground">Graduated {edu.graduationYear}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No education information available.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Links */}
        <TabsContent value="social">
          <Card>
            <CardHeader>
              <CardTitle>Social Links</CardTitle>
            </CardHeader>
            <CardContent>
              {user.profile?.socialLinks && Object.keys(user.profile.socialLinks).length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.entries(user.profile.socialLinks)
                    .filter(([, url]) => url)
                    .map(([platform, url]) => (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2 rounded-lg border hover:bg-muted transition-colors"
                    >
                      {getSocialIcon(platform)}
                      <span className="text-sm capitalize">{platform}</span>
                      <ExternalLink className="h-3 w-3 ml-auto" />
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No social links available.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Additional Information */}
        <TabsContent value="additional">
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {user.dateJoined && (
                  <div>
                    <h4 className="font-medium mb-1">Member Since</h4>
                    <p className="text-muted-foreground">{formatDate(user.dateJoined)}</p>
                  </div>
                )}

                <div>
                  <h4 className="font-medium mb-1">Membership Status</h4>
                  <Badge variant={user.hasMembership ? "default" : "outline"}>
                    {user.hasMembership ? "Active Member" : "Basic Member"}
                  </Badge>
                </div>

                {/* Permanent Address */}
                {user.profile?.permanentAddress && (
                  <div>
                    <h4 className="font-medium mb-1">Permanent Address</h4>
                    <p className="text-muted-foreground">{user.profile.permanentAddress}</p>
                  </div>
                )}
              </div>

              {/* Hall of Fame */}
              {user.profile?.hallOfFameOptIn && user.profile?.hallOfFameBio && (
                <div>
                  <h4 className="font-medium mb-2">Hall of Fame</h4>
                  <div className="p-3 bg-muted rounded-lg">
                    <Badge className="mb-2">Hall of Fame Member</Badge>
                    <p className="text-sm">{user.profile.hallOfFameBio}</p>
                  </div>
                </div>
              )}

              {/* About Me */}
              {user.profile?.aboutMe && (
                <div>
                  <h4 className="font-medium mb-2">More About Me</h4>
                  <div 
                    className="text-muted-foreground prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: user.profile.aboutMe }}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Privacy Verification Dialog */}
      <PrivacyVerification
        isOpen={showPrivacyDialog}
        onClose={() => setShowPrivacyDialog(false)}
        onVerified={handleVerificationSuccess}
        contactType={verificationContactType}
        userName={user.fullName}
      />
    </div>
  );
};

export default ProfileView;