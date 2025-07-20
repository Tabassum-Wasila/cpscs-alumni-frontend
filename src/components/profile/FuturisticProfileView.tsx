
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Mail, Phone, MapPin, Briefcase, GraduationCap, Heart, Globe, Linkedin, Twitter, Instagram, Youtube, Calendar, ExternalLink, MessageCircle, ArrowLeft, Sparkles, Star, Trophy, Target, Book, Users, Building2, Shield } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState('basic');
  
  const completionPercentage = UserService.calculateProfileCompletion(user);
  const missingFields = UserService.getMissingFields(user);

  // Enhanced mouse tracking for more dynamic animations
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

  // Enhanced floating particles with more variety
  const particles = Array.from({ length: 30 }, (_, i) => (
    <motion.div
      key={i}
      className={`absolute rounded-full opacity-20 ${
        i % 3 === 0 ? 'bg-blue-400' : i % 3 === 1 ? 'bg-purple-400' : 'bg-pink-400'
      }`}
      style={{
        width: Math.random() * 4 + 2 + 'px',
        height: Math.random() * 4 + 2 + 'px',
        left: Math.random() * 100 + '%',
        top: Math.random() * 100 + '%',
      }}
      animate={{
        x: [0, Math.random() * 200 - 100],
        y: [0, Math.random() * 200 - 100],
        opacity: [0, 0.6, 0],
        scale: [0.5, 1.2, 0.5],
      }}
      transition={{
        duration: Math.random() * 4 + 3,
        repeat: Infinity,
        delay: Math.random() * 2,
        ease: "easeInOut"
      }}
    />
  ));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 relative overflow-hidden">
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-10"
          style={{
            background: 'radial-gradient(circle, rgba(59,130,246,0.3) 0%, rgba(147,51,234,0.2) 50%, rgba(236,72,153,0.1) 100%)'
          }}
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div 
          className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-10"
          style={{
            background: 'radial-gradient(circle, rgba(34,197,94,0.3) 0%, rgba(59,130,246,0.2) 50%, rgba(147,51,234,0.1) 100%)'
          }}
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        {particles}
        
        {/* Dynamic gradient lines */}
        <motion.div
          className="absolute top-1/4 left-0 w-full h-px opacity-20"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(59,130,246,0.5) 50%, transparent 100%)'
          }}
          animate={{
            scaleX: [0, 1, 0],
            opacity: [0, 0.3, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            delay: 1,
          }}
        />
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
              className="group hover:bg-blue-500/10 hover:text-blue-600 transition-all duration-300 border border-blue-200/50 hover:border-blue-300/70"
            >
              <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Directory
            </Button>
          </motion.div>
        )}

        {/* Enhanced Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <Card className="overflow-hidden border-0 shadow-2xl bg-gradient-to-r from-white/90 to-white/70 backdrop-blur-xl relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5" />
            <motion.div
              className="absolute inset-0 opacity-30"
              style={{
                background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59,130,246,0.1) 0%, transparent 50%)`
              }}
            />
            <CardContent className="relative p-8">
              <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
                {/* Enhanced Profile Picture */}
                <div className="relative group">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="relative"
                  >
                    <Avatar className="h-32 w-32 lg:h-40 lg:w-40 ring-4 ring-blue-200/50 shadow-2xl">
                      <AvatarImage src={user.profile?.profilePicture} alt={user.fullName} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl lg:text-3xl font-bold">
                        {getInitials(user.fullName)}
                      </AvatarFallback>
                    </Avatar>
                    <motion.div
                      className="absolute -inset-1 bg-gradient-to-r from-blue-400/30 via-purple-400/30 to-pink-400/30 rounded-full blur opacity-30 group-hover:opacity-60 transition-opacity"
                      animate={{
                        rotate: [0, 360],
                      }}
                      transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    />
                  </motion.div>
                  
                  {/* Enhanced floating status indicator */}
                  <motion.div
                    animate={{
                      y: [0, -8, 0],
                      rotate: [0, 180, 360],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="absolute -top-2 -right-2 bg-gradient-to-r from-green-400 to-emerald-500 w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center"
                  >
                    <Sparkles className="h-4 w-4 text-white" />
                  </motion.div>
                </div>

                {/* Profile Info */}
                <div className="flex-1 text-center lg:text-left space-y-4">
                  <div>
                    <motion.h1
                      className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent"
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
                        <Briefcase className="h-5 w-5 text-blue-600 mr-2" />
                        <span className="text-lg text-gray-700 font-medium">{user.profile.profession}</span>
                      </motion.div>
                    )}
                    
                    {user.profile?.organization && (
                      <motion.div
                        className="flex items-center justify-center lg:justify-start mt-1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                      >
                        <Building2 className="h-4 w-4 text-gray-500 mr-2" />
                        <span className="text-gray-600">{user.profile.organization}</span>
                      </motion.div>
                    )}
                  </div>

                  {/* Enhanced Quick Stats */}
                  <motion.div
                    className="flex flex-wrap gap-3 justify-center lg:justify-start"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0 shadow-lg">
                      <GraduationCap className="h-3 w-3 mr-1" />
                      SSC {user.sscYear}
                    </Badge>
                    
                    {user.profile?.city && user.profile?.country && (
                      <Badge className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white border-0 shadow-lg">
                        <MapPin className="h-3 w-3 mr-1" />
                        {user.profile.city}, {user.profile.country}
                      </Badge>
                    )}
                    
                    {user.profile?.willingToMentor && (
                      <Badge className="bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white border-0 shadow-lg">
                        <Heart className="h-3 w-3 mr-1" />
                        Available for Mentoring
                      </Badge>
                    )}
                  </motion.div>

                  {/* Enhanced Action Buttons */}
                  <motion.div
                    className="flex flex-wrap gap-3 justify-center lg:justify-start"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    {isOwnProfile ? (
                      <Button
                        onClick={onEdit}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                      >
                        <User className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                    ) : (
                      <>
                        {user.profile?.willingToMentor && onMentorshipRequest && (
                          <Button
                            onClick={() => onMentorshipRequest(user)}
                            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                          >
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Request Mentorship
                          </Button>
                        )}
                      </>
                    )}
                  </motion.div>
                </div>

                {/* Enhanced Profile Completion */}
                {isOwnProfile && (
                  <motion.div
                    className="lg:w-64"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <Card className="bg-gradient-to-br from-blue-50/80 to-purple-50/80 border-blue-200/30 shadow-lg">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center">
                          <Trophy className="h-5 w-5 mr-2 text-yellow-600" />
                          Profile Strength
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold text-blue-600">{completionPercentage}%</span>
                            <span className="text-sm text-gray-600">Complete</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <motion.div
                              className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full shadow-sm"
                              initial={{ width: 0 }}
                              animate={{ width: `${completionPercentage}%` }}
                              transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
                            />
                          </div>
                          {missingFields.length > 0 && (
                            <div className="text-xs text-gray-500">
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

        {/* Enhanced Information Tabs - Updated to match edit mode tabs exactly */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8"
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 bg-white/80 backdrop-blur-sm border border-blue-200/50 shadow-lg">
              <TabsTrigger 
                value="basic" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white transition-all duration-300 hover:bg-blue-50"
              >
                <Star className="h-4 w-4 mr-2 hidden sm:block" />
                Basic
              </TabsTrigger>
              <TabsTrigger 
                value="work" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white transition-all duration-300 hover:bg-blue-50"
              >
                <Briefcase className="h-4 w-4 mr-2 hidden sm:block" />
                Work
              </TabsTrigger>
              <TabsTrigger 
                value="education" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white transition-all duration-300 hover:bg-blue-50"
              >
                <Book className="h-4 w-4 mr-2 hidden sm:block" />
                Education
              </TabsTrigger>
              <TabsTrigger 
                value="social" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white transition-all duration-300 hover:bg-blue-50"
              >
                <Users className="h-4 w-4 mr-2 hidden sm:block" />
                Social
              </TabsTrigger>
              <TabsTrigger 
                value="more" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white transition-all duration-300 hover:bg-blue-50"
              >
                <Target className="h-4 w-4 mr-2 hidden sm:block" />
                More
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
                {/* Basic Tab */}
                <TabsContent value="basic" className="space-y-6 mt-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    {user.profile?.bio && (
                      <Card className="md:col-span-2 bg-gradient-to-br from-white/90 to-blue-50/30 backdrop-blur-xl border-blue-200/30 shadow-xl">
                        <CardHeader>
                          <CardTitle className="flex items-center text-blue-800">
                            <User className="h-5 w-5 mr-2" />
                            About Me
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div 
                            className="text-gray-700 leading-relaxed prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{ __html: user.profile.bio }}
                          />
                        </CardContent>
                      </Card>
                    )}

                    {/* Contact Information */}
                    <Card className="bg-gradient-to-br from-white/90 to-blue-50/30 backdrop-blur-xl border-blue-200/30 shadow-xl">
                      <CardHeader>
                        <CardTitle className="flex items-center text-blue-800">
                          <Mail className="h-5 w-5 mr-2" />
                          Contact Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Email */}
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-500" />
                          {verifiedContacts.has('email') ? (
                            <span className="text-sm">{user.email}</span>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleContactVerification('email')}
                              className="h-8 hover:bg-blue-50"
                            >
                              <Shield className="h-3 w-3 mr-1" />
                              View Email
                            </Button>
                          )}
                        </div>

                        {/* Phone */}
                        {user.profile?.phoneNumber && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-500" />
                            {user.profile?.showPhone === false ? (
                              <span className="text-sm text-gray-400">Phone number is private</span>
                            ) : verifiedContacts.has('phone') ? (
                              <span className="text-sm">{user.profile.phoneNumber}</span>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleContactVerification('phone')}
                                className="h-8 hover:bg-blue-50"
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
                            <MapPin className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">{user.profile.city}, {user.profile.country}</span>
                          </div>
                        )}

                        {/* Date of Birth */}
                        {user.profile?.dateOfBirth && (
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">{formatDate(user.profile.dateOfBirth)}</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {user.profile?.expertise && user.profile.expertise.length > 0 && (
                      <Card className="bg-gradient-to-br from-white/90 to-purple-50/30 backdrop-blur-xl border-purple-200/30 shadow-xl">
                        <CardHeader>
                          <CardTitle className="flex items-center text-purple-800">
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
                                <Badge className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border-purple-200 hover:from-purple-200 hover:to-pink-200 transition-all duration-300 cursor-default">
                                  {skill}
                                </Badge>
                              </motion.div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </TabsContent>

                {/* Work Tab */}
                <TabsContent value="work" className="space-y-6 mt-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    {user.profile?.profession && (
                      <Card className="bg-gradient-to-br from-white/90 to-emerald-50/30 backdrop-blur-xl border-emerald-200/30 shadow-xl">
                        <CardHeader>
                          <CardTitle className="text-emerald-800">Current Role</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-center">
                            <Briefcase className="h-4 w-4 text-emerald-600 mr-2" />
                            <span className="font-medium">{user.profile.profession}</span>
                          </div>
                          {user.profile.organization && (
                            <div className="flex items-center">
                              <Building2 className="h-4 w-4 text-gray-500 mr-2" />
                              <span className="text-gray-700">{user.profile.organization}</span>
                            </div>
                          )}
                          {user.profile.jobTitle && (
                            <div className="text-sm text-gray-600">
                              <strong>Position:</strong> {user.profile.jobTitle}
                            </div>
                          )}
                          {user.profile.organizationWebsite && (
                            <div>
                              <a 
                                href={user.profile.organizationWebsite}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline text-sm flex items-center gap-1"
                              >
                                {user.profile.organizationWebsite}
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )}

                    {/* Mentorship Information */}
                    {user.profile?.willingToMentor && (
                      <Card className="bg-gradient-to-br from-white/90 to-pink-50/30 backdrop-blur-xl border-pink-200/30 shadow-xl">
                        <CardHeader>
                          <CardTitle className="flex items-center text-pink-800">
                            <Heart className="h-5 w-5 mr-2" />
                            Mentorship
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Badge className="bg-gradient-to-r from-pink-100 to-rose-100 text-pink-800 border-pink-200 mb-3">
                            <Heart className="h-3 w-3 mr-1" />
                            Available for Mentoring
                          </Badge>
                          {user.profile.mentorshipAreas && user.profile.mentorshipAreas.length > 0 && (
                            <div className="mt-3">
                              <p className="text-sm text-gray-600 mb-2">Mentorship Areas:</p>
                              <div className="flex flex-wrap gap-2">
                                {user.profile.mentorshipAreas.map((area, index) => (
                                  <motion.div
                                    key={area}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                  >
                                    <Badge className="bg-gradient-to-r from-pink-100 to-rose-100 text-pink-700 border-pink-200 hover:from-pink-200 hover:to-rose-200 transition-all duration-300">
                                      {area}
                                    </Badge>
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )}

                    {user.profile?.workExperience && user.profile.workExperience.length > 0 && (
                      <Card className="md:col-span-2 bg-gradient-to-br from-white/90 to-blue-50/30 backdrop-blur-xl border-blue-200/30 shadow-xl">
                        <CardHeader>
                          <CardTitle className="flex items-center text-blue-800">
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
                                className="border-l-2 border-blue-200 pl-4 pb-4 last:pb-0"
                              >
                                <h4 className="font-medium text-blue-900">{exp.title}</h4>
                                <p className="text-sm text-gray-600">{exp.company}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {formatDate(exp.startDate)} - {exp.isCurrent ? 'Present' : formatDate(exp.endDate)}
                                </p>
                                {exp.description && <p className="text-sm mt-2 text-gray-700">{exp.description}</p>}
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
                    <Card className="bg-gradient-to-br from-white/90 to-indigo-50/30 backdrop-blur-xl border-indigo-200/30 shadow-xl">
                      <CardHeader>
                        <CardTitle className="flex items-center text-indigo-800">
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
                              className="border-l-2 border-indigo-200 pl-4 pb-4 last:pb-0"
                            >
                              <h4 className="font-medium text-indigo-900">{edu.degree}</h4>
                              <p className="text-sm text-gray-600">{edu.institution}</p>
                              {edu.department && <p className="text-xs text-gray-500">Department: {edu.department}</p>}
                              <p className="text-xs text-gray-500 mt-1">Graduated: {edu.graduationYear}</p>
                            </motion.div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="bg-gradient-to-br from-white/90 to-gray-50/30 backdrop-blur-xl border-gray-200/30 shadow-xl">
                      <CardContent className="text-center py-12">
                        <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No education information provided.</p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                {/* Social Tab */}
                <TabsContent value="social" className="space-y-6 mt-6">
                  {user.profile?.socialLinks && Object.keys(user.profile.socialLinks).length > 0 ? (
                    <Card className="bg-gradient-to-br from-white/90 to-cyan-50/30 backdrop-blur-xl border-cyan-200/30 shadow-xl">
                      <CardHeader>
                        <CardTitle className="flex items-center text-cyan-800">
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
                              className="flex items-center p-3 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg border border-cyan-200/50 hover:from-cyan-100 hover:to-blue-100 hover:border-cyan-300/70 transition-all duration-300 group"
                            >
                              <div className="mr-3 group-hover:scale-110 transition-transform">
                                {getSocialIcon(platform)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium capitalize text-cyan-900">{platform}</p>
                                <p className="text-sm text-gray-600 truncate">{url}</p>
                              </div>
                              <ExternalLink className="h-4 w-4 text-gray-500 group-hover:text-cyan-600 transition-colors" />
                            </motion.a>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="bg-gradient-to-br from-white/90 to-gray-50/30 backdrop-blur-xl border-gray-200/30 shadow-xl">
                      <CardContent className="text-center py-12">
                        <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No social media links provided.</p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                {/* More Tab - Added to match edit mode */}
                <TabsContent value="more" className="space-y-6 mt-6">
                  <div className="space-y-6">
                    {/* More About Me */}
                    {user.profile?.aboutMe && (
                      <Card className="bg-gradient-to-br from-white/90 to-amber-50/30 backdrop-blur-xl border-amber-200/30 shadow-xl">
                        <CardHeader>
                          <CardTitle className="flex items-center text-amber-800">
                            <User className="h-5 w-5 mr-2" />
                            More About Me
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div 
                            className="text-gray-700 leading-relaxed prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{ __html: user.profile.aboutMe }}
                          />
                        </CardContent>
                      </Card>
                    )}

                    {/* Additional Information */}
                    <div className="grid gap-6 md:grid-cols-2">
                      {user.dateJoined && (
                        <Card className="bg-gradient-to-br from-white/90 to-slate-50/30 backdrop-blur-xl border-slate-200/30 shadow-xl">
                          <CardHeader>
                            <CardTitle className="text-slate-800">Member Since</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-gray-700">{formatDate(user.dateJoined)}</p>
                          </CardContent>
                        </Card>
                      )}

                      <Card className="bg-gradient-to-br from-white/90 to-slate-50/30 backdrop-blur-xl border-slate-200/30 shadow-xl">
                        <CardHeader>
                          <CardTitle className="text-slate-800">Membership Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Badge className={user.hasMembership ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white" : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700"}>
                            {user.hasMembership ? "Active Member" : "Basic Member"}
                          </Badge>
                        </CardContent>
                      </Card>

                      {/* Permanent Address */}
                      {user.profile?.permanentAddress && (
                        <Card className="md:col-span-2 bg-gradient-to-br from-white/90 to-slate-50/30 backdrop-blur-xl border-slate-200/30 shadow-xl">
                          <CardHeader>
                            <CardTitle className="text-slate-800">Permanent Address</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-gray-700">{user.profile.permanentAddress}</p>
                          </CardContent>
                        </Card>
                      )}
                    </div>

                    {/* Hall of Fame */}
                    {user.profile?.hallOfFameOptIn && user.profile?.hallOfFameBio && (
                      <Card className="bg-gradient-to-br from-white/90 to-yellow-50/30 backdrop-blur-xl border-yellow-200/30 shadow-xl">
                        <CardHeader>
                          <CardTitle className="flex items-center text-yellow-800">
                            <Trophy className="h-5 w-5 mr-2" />
                            Hall of Fame
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Badge className="bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border-yellow-200 mb-3">
                            Hall of Fame Member
                          </Badge>
                          <p className="text-gray-700">{user.profile.hallOfFameBio}</p>
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
        onVerified={handleVerificationSuccess}
        contactType={verificationContactType}
        userName={user.fullName}
      />
    </div>
  );
};

export default FuturisticProfileView;
