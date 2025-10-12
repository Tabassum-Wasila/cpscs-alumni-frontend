import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, MapPin, Briefcase, GraduationCap, Heart, Lock, UserPlus, LogIn } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const AlumniDirectoryLanding = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Users,
      title: "Connect with Alumni",
      description: "Find and connect with fellow CPSCS alumni from around the world"
    },
    {
      icon: Briefcase,
      title: "Professional Networking",
      description: "Discover alumni in various industries and expand your professional network"
    },
    {
      icon: Heart,
      title: "Mentorship Opportunities",
      description: "Find mentors or become one to help guide the next generation"
    },
    {
      icon: MapPin,
      title: "Global Reach",
      description: "Connect with alumni across different countries and cities"
    }
  ];

  const stats = [
    { label: "Alumni Members", value: "500+", icon: Users },
    { label: "Countries", value: "25+", icon: MapPin },
    { label: "Industries", value: "50+", icon: Briefcase },
    { label: "Active Mentors", value: "100+", icon: Heart }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow pt-24 pb-16 bg-gradient-to-br from-cpscs-light to-white">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="mb-6">
              <Lock className="h-16 w-16 text-cpscs-blue mx-auto mb-4" />
              <h1 className="text-4xl font-bold text-cpscs-blue mb-4">
                Alumni Directory
              </h1>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Connect with fellow CPSCS alumni from around the world. Access our comprehensive directory to network, find mentors, and build lasting professional relationships.
              </p>
            </div>
            
            {/* <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button 
                onClick={() => navigate('/login')}
                size="lg"
                className="bg-cpscs-blue hover:bg-cpscs-blue/90"
              >
                <LogIn className="mr-2 h-5 w-5" />
                Login to Access Directory
              </Button>
              <Button 
                onClick={() => navigate('/signup')}
                variant="outline"
                size="lg"
                className="border-cpscs-blue text-cpscs-blue hover:bg-cpscs-blue hover:text-white"
              >
                <UserPlus className="mr-2 h-5 w-5" />
                Join Our Community
              </Button>
            </div> */}
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <stat.icon className="h-8 w-8 text-cpscs-blue mx-auto mb-2" />
                  <p className="text-2xl font-bold text-cpscs-blue mb-1">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Features Section */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-center text-cpscs-blue mb-8">
              Why Join Our Alumni Network?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <feature.icon className="h-12 w-12 text-cpscs-blue mx-auto mb-4" />
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* How It Works Section */}
          <Card className="bg-cpscs-blue text-white">
            <CardHeader>
              <CardTitle className="text-2xl text-center">How It Works</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold">1</span>
                  </div>
                  <h3 className="font-semibold mb-2">Join & Complete Profile</h3>
                  <p className="text-white/90">Sign up and complete your profile with professional information</p>
                </div>
                <div>
                  <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold">2</span>
                  </div>
                  <h3 className="font-semibold mb-2">Search & Connect</h3>
                  <p className="text-white/90">Find alumni by profession, location, batch, or expertise</p>
                </div>
                <div>
                  <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold">3</span>
                  </div>
                  <h3 className="font-semibold mb-2">Network & Grow</h3>
                  <p className="text-white/90">Build professional relationships and mentorship connections</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AlumniDirectoryLanding;