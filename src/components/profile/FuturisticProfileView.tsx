import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, Mail, Phone, MapPin, Briefcase, GraduationCap, 
  Heart, Globe, Linkedin, Twitter, Instagram, Youtube,
  Calendar, ExternalLink, MessageCircle, ArrowLeft, Sparkles,
  Star, Trophy, Target, Book, Users, Building2
} from 'lucide-react';
import { User as UserType } from '@/contexts/AuthContext';
import { UserService } from '@/services/userService';
import PrivacyVerification from './PrivacyVerification';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface FuturisticProfileViewProps {
  user: UserType;
  isOwnProfile?: boolean;
  onEdit?: () => void;
  onMentorshipRequest?: (mentorUser: UserType) => void;
}

const FuturisticProfileView: React.FC<FuturisticProfileViewProps> = ({ 
  user, 
  isOwnProfile = false,
  onEdit,
  onMentorshipRequest
}) => {
  const navigate = useNavigate();
  const [showPrivacyDialog, setShowPrivacyDialog] = useState(false);
  const [verificationContactType, setVerificationContactType] = useState<'email' | 'phone'>('email');
  const [verifiedContacts, setVerifiedContacts] = useState<Set<string>>(new Set());
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeTab, setActiveTab] = useState('overview');

  const completionPercentage = UserService.calculateProfileCompletion(user);
  const missingFields = UserService.getMissingFields(user);

  // Mouse tracking for subtle animations
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

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
      case 'facebook': return <Globe className="h-4 w-4" />;
      case 'linkedin': return <Linkedin className="h-4 w-4" />;
      case 'youtube': return <Youtube className="h-4 w-4" />;
      case 'twitter': return <Twitter className="h-4 w-4" />;
      case 'instagram': return <Instagram className="h-4 w-4" />;
      default: return <Globe className="h-4 w-4" />;
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

  // Floating particles animation
  const particles = Array.from({ length: 20 }, (_, i) => (
    <motion.div
      key={i}
      className="absolute w-1 h-1 bg-primary/20 rounded-full"
      animate={{
        x: [0, Math.random() * 100 - 50],
        y: [0, Math.random() * 100 - 50],
        opacity: [0, 1, 0],
      }}
      transition={{
        duration: Math.random() * 3 + 2,
        repeat: Infinity,
        delay: Math.random() * 2,
      }}
      style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
      }}
    />
  ));

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/5 rounded-full blur-3xl" />
        {particles}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Back Button */}
        {!isOwnProfile && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6"
          >
            <Button
              onClick={() => navigate('/alumni-directory')}
              variant="ghost"
              className="group hover:bg-primary/10 transition-all duration-300"
            >
              <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Directory
            </Button>
          </motion.div>
        )}

        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <Card className="overflow-hidden border-0 shadow-2xl bg-gradient-to-r from-card/80 to-card/60 backdrop-blur-xl">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5" />
            <CardContent className="relative p-8">
              <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
                {/* Profile Picture */}
                <div className="relative group">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="relative"
                  >
                    <Avatar className="h-32 w-32 lg:h-40 lg:w-40 ring-4 ring-primary/20 shadow-2xl">
                      <AvatarImage src={user.profile?.profilePicture} alt={user.fullName} />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-2xl lg:text-3xl font-bold">
                        {getInitials(user.fullName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-full blur opacity-30 group-hover:opacity-50 transition-opacity" />
                  </motion.div>
                  
                  {/* Floating status indicator */}
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -top-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-2 border-background shadow-lg flex items-center justify-center"
                  >
                    <Sparkles className="h-3 w-3 text-white" />
                  </motion.div>
                </div>

                {/* Profile Info */}
                <div className="flex-1 text-center lg:text-left space-y-4">
                  <div>
                    <motion.h1 
                      className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      {user.fullName}
                    </motion.h1>
                    
                    {user.profile?.profession && (
                      <motion.div 
                        className="flex items-center justify-center lg:justify-start mt-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        <Briefcase className="h-5 w-5 text-primary mr-2" />
                        <span className="text-lg text-muted-foreground font-medium">{user.profile.profession}</span>
                      </motion.div>
                    )}
                    
                    {user.profile?.organization && (
                      <motion.div 
                        className="flex items-center justify-center lg:justify-start mt-1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                      >
                        <Building2 className="h-4 w-4 text-muted-foreground mr-2" />
                        <span className="text-muted-foreground">{user.profile.organization}</span>
                      </motion.div>
                    )}
                  </div>

                  {/* Quick Stats */}
                  <motion.div 
                    className="flex flex-wrap gap-3 justify-center lg:justify-start"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Badge variant="outline" className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20 hover:from-primary/20 hover:to-primary/10 transition-all duration-300">
                      <GraduationCap className="h-3 w-3 mr-1" />
                      SSC {user.sscYear}
                    </Badge>
                    
                    {user.profile?.city && user.profile?.country && (
                      <Badge variant="outline" className="bg-gradient-to-r from-secondary/10 to-secondary/5 border-secondary/20 hover:from-secondary/20 hover:to-secondary/10 transition-all duration-300">
                        <MapPin className="h-3 w-3 mr-1" />
                        {user.profile.city}, {user.profile.country}
                      </Badge>
                    )}
                    
                    {user.profile?.willingToMentor && (
                      <Badge className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition-all duration-300">
                        <Heart className="h-3 w-3 mr-1" />
                        Available for Mentoring
                      </Badge>
                    )}
                  </motion.div>

                  {/* Action Buttons */}
                  <motion.div 
                    className="flex flex-wrap gap-3 justify-center lg:justify-start"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    {isOwnProfile ? (
                      <Button onClick={onEdit} className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 shadow-lg hover:shadow-xl transition-all duration-300">
                        <User className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                    ) : (
                      <>
                        {user.profile?.willingToMentor && onMentorshipRequest && (
                          <Button
                            onClick={() => onMentorshipRequest(user)}
                            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl transition-all duration-300"
                          >
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Request Mentorship
                          </Button>
                        )}
                      </>
                    )}
                  </motion.div>
                </div>

                {/* Profile Completion (for own profile) */}
                {isOwnProfile && (
                  <motion.div 
                    className="lg:w-64"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center">
                          <Trophy className="h-5 w-5 mr-2 text-primary" />
                          Profile Strength
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold text-primary">{completionPercentage}%</span>
                            <span className="text-sm text-muted-foreground">Complete</span>
                          </div>
                          <div className="w-full bg-secondary/20 rounded-full h-2">
                            <motion.div 
                              className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${completionPercentage}%` }}
                              transition={{ duration: 1, delay: 0.8 }}
                            />
                          </div>
                          {missingFields.length > 0 && (
                            <div className="text-xs text-muted-foreground">
                              Missing: {missingFields.slice(0, 2).join(', ')}
                              {missingFields.length > 2 && ` +${missingFields.length - 2} more`}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Detailed Information Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8"
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-5 bg-card/50 backdrop-blur-sm border border-border/50">
              <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300">
                <Star className="h-4 w-4 mr-2 hidden sm:block" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="professional" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300">
                <Briefcase className="h-4 w-4 mr-2 hidden sm:block" />
                Professional
              </TabsTrigger>
              <TabsTrigger value="education" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300">
                <Book className="h-4 w-4 mr-2 hidden sm:block" />
                Education
              </TabsTrigger>
              <TabsTrigger value="social" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300">
                <Users className="h-4 w-4 mr-2 hidden sm:block" />
                Social
              </TabsTrigger>
              <TabsTrigger value="contact" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300">
                <Mail className="h-4 w-4 mr-2 hidden sm:block" />
                Contact
              </TabsTrigger>
            </TabsList>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6 mt-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    {user.profile?.bio && (
                      <Card className="md:col-span-2 bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-xl border-0 shadow-xl">
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <User className="h-5 w-5 mr-2" />
                            About Me
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground leading-relaxed">{user.profile.bio}</p>
                        </CardContent>
                      </Card>
                    )}

                    {user.profile?.expertise && user.profile.expertise.length > 0 && (
                      <Card className="bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-xl border-0 shadow-xl">
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <Target className="h-5 w-5 mr-2" />
                            Expertise
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2">
                            {user.profile.expertise.map((skill, index) => (
                              <motion.div
                                key={skill}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                              >
                                <Badge 
                                  variant="secondary" 
                                  className="bg-gradient-to-r from-primary/10 to-secondary/10 hover:from-primary/20 hover:to-secondary/20 transition-all duration-300 cursor-default"
                                >
                                  {skill}
                                </Badge>
                              </motion.div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {user.profile?.willingToMentor && user.profile?.mentorshipAreas && user.profile.mentorshipAreas.length > 0 && (
                      <Card className="bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-xl border-0 shadow-xl">
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <Heart className="h-5 w-5 mr-2 text-red-500" />
                            Mentorship Areas
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2">
                            {user.profile.mentorshipAreas.map((area, index) => (
                              <motion.div
                                key={area}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                              >
                                <Badge 
                                  className="bg-gradient-to-r from-red-500/10 to-pink-500/10 text-red-700 border-red-200 hover:from-red-500/20 hover:to-pink-500/20 transition-all duration-300"
                                >
                                  {area}
                                </Badge>
                              </motion.div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </TabsContent>

                {/* Professional Tab */}
                <TabsContent value="professional" className="space-y-6 mt-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    {user.profile?.profession && (
                      <Card className="bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-xl border-0 shadow-xl">
                        <CardHeader>
                          <CardTitle>Current Role</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-center">
                            <Briefcase className="h-4 w-4 text-primary mr-2" />
                            <span className="font-medium">{user.profile.profession}</span>
                          </div>
                          {user.profile.organization && (
                            <div className="flex items-center">
                              <Building2 className="h-4 w-4 text-muted-foreground mr-2" />
                              <span className="text-muted-foreground">{user.profile.organization}</span>
                            </div>
                          )}
                          {user.profile.jobTitle && (
                            <div className="text-sm text-muted-foreground">
                              <strong>Position:</strong> {user.profile.jobTitle}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )}

                    {user.profile?.workExperience && user.profile.workExperience.length > 0 && (
                      <Card className="md:col-span-2 bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-xl border-0 shadow-xl">
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <Briefcase className="h-5 w-5 mr-2" />
                            Work Experience
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {user.profile.workExperience.map((exp, index) => (
                              <motion.div 
                                key={exp.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="border-l-2 border-primary/20 pl-4 pb-4 last:pb-0"
                              >
                                <h4 className="font-medium">{exp.title}</h4>
                                <p className="text-sm text-muted-foreground">{exp.company}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {formatDate(exp.startDate)} - {exp.isCurrent ? 'Present' : formatDate(exp.endDate)}
                                </p>
                                {exp.description && (
                                  <p className="text-sm mt-2">{exp.description}</p>
                                )}
                              </motion.div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </TabsContent>

                {/* Education Tab */}
                <TabsContent value="education" className="space-y-6 mt-6">
                  {user.profile?.education && user.profile.education.length > 0 ? (
                    <Card className="bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-xl border-0 shadow-xl">
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <GraduationCap className="h-5 w-5 mr-2" />
                          Educational Background
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {user.profile.education.map((edu, index) => (
                            <motion.div 
                              key={edu.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="border-l-2 border-secondary/20 pl-4 pb-4 last:pb-0"
                            >
                              <h4 className="font-medium">{edu.degree}</h4>
                              <p className="text-sm text-muted-foreground">{edu.institution}</p>
                              {edu.department && (
                                <p className="text-xs text-muted-foreground">Department: {edu.department}</p>
                              )}
                              <p className="text-xs text-muted-foreground mt-1">Graduated: {edu.graduationYear}</p>
                            </motion.div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-xl border-0 shadow-xl">
                      <CardContent className="text-center py-12">
                        <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No education information provided.</p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                {/* Social Tab */}
                <TabsContent value="social" className="space-y-6 mt-6">
                  {user.profile?.socialLinks && Object.keys(user.profile.socialLinks).length > 0 ? (
                    <Card className="bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-xl border-0 shadow-xl">
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Globe className="h-5 w-5 mr-2" />
                          Social Media & Links
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-3 sm:grid-cols-2">
                          {Object.entries(user.profile.socialLinks)
                            .filter(([_, url]) => url)
                            .map(([platform, url], index) => (
                              <motion.a
                                key={platform}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-center p-3 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg border border-border/50 hover:from-primary/10 hover:to-secondary/10 hover:border-primary/20 transition-all duration-300 group"
                              >
                                <div className="mr-3 group-hover:scale-110 transition-transform">
                                  {getSocialIcon(platform)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium capitalize">{platform}</p>
                                  <p className="text-sm text-muted-foreground truncate">{url}</p>
                                </div>
                                <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                              </motion.a>
                            ))}
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-xl border-0 shadow-xl">
                      <CardContent className="text-center py-12">
                        <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No social media links provided.</p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                {/* Contact Tab */}
                <TabsContent value="contact" className="space-y-6 mt-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Email */}
                    <Card className="bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-xl border-0 shadow-xl">
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Mail className="h-5 w-5 mr-2" />
                          Email
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {!isOwnProfile ? (
                          <div className="space-y-3">
                            {verifiedContacts.has('email') ? (
                              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                                <p className="text-sm text-green-800 font-medium">{user.email}</p>
                              </div>
                            ) : (
                              <Button
                                onClick={() => handleContactVerification('email')}
                                variant="outline"
                                className="w-full hover:bg-primary/10 transition-colors"
                              >
                                <Mail className="h-4 w-4 mr-2" />
                                Verify to View Email
                              </Button>
                            )}
                          </div>
                        ) : (
                          <p className="text-sm">{user.email}</p>
                        )}
                      </CardContent>
                    </Card>

                    {/* Phone */}
                    {user.profile?.phoneNumber && (
                      <Card className="bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-xl border-0 shadow-xl">
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <Phone className="h-5 w-5 mr-2" />
                            Phone
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {!isOwnProfile ? (
                            <div className="space-y-3">
                              {user.profile.showPhone === false ? (
                                <p className="text-sm text-muted-foreground italic">Phone number is private</p>
                              ) : verifiedContacts.has('phone') ? (
                                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                                  <p className="text-sm text-green-800 font-medium">{user.profile.phoneNumber}</p>
                                </div>
                              ) : (
                                <Button
                                  onClick={() => handleContactVerification('phone')}
                                  variant="outline"
                                  className="w-full hover:bg-primary/10 transition-colors"
                                >
                                  <Phone className="h-4 w-4 mr-2" />
                                  Verify to View Phone
                                </Button>
                              )}
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <p className="text-sm">{user.profile.phoneNumber}</p>
                              <p className="text-xs text-muted-foreground">
                                Privacy: {user.profile.showPhone === false ? 'Hidden from others' : 'Visible to verified contacts'}
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )}

                    {/* Additional Information */}
                    {(user.profile?.dateOfBirth || user.profile?.permanentAddress) && (
                      <Card className="md:col-span-2 bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-xl border-0 shadow-xl">
                        <CardHeader>
                          <CardTitle>Additional Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {user.profile.dateOfBirth && (
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
                              <span className="text-sm">Born on {formatDate(user.profile.dateOfBirth)}</span>
                            </div>
                          )}
                          {user.profile.permanentAddress && (
                            <div className="flex items-start">
                              <MapPin className="h-4 w-4 text-muted-foreground mr-2 mt-0.5" />
                              <span className="text-sm">{user.profile.permanentAddress}</span>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </TabsContent>
              </motion.div>
            </AnimatePresence>
          </Tabs>
        </motion.div>
      </div>

      {/* Privacy Verification Dialog */}
      <PrivacyVerification
        isOpen={showPrivacyDialog}
        onClose={() => setShowPrivacyDialog(false)}
        contactType={verificationContactType}
        onVerified={handleVerificationSuccess}
        userName={user.fullName}
      />
    </div>
  );
};

export default FuturisticProfileView;