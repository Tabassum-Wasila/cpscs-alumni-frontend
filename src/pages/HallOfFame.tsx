
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Trophy, Star, Award, Crown } from 'lucide-react';

const HallOfFame = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow pt-40 lg:pt-24 pb-16 bg-gradient-to-br from-cpscs-light via-white to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex justify-center items-center gap-3 mb-4">
              <Crown className="h-8 w-8 text-cpscs-gold" />
              <h1 className="text-4xl md:text-5xl font-bold text-cpscs-blue">Hall of Fame</h1>
              <Crown className="h-8 w-8 text-cpscs-gold" />
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Celebrating the extraordinary achievements and contributions of our distinguished alumni
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-all duration-300 hover:scale-105">
              <Trophy className="h-16 w-16 text-cpscs-gold mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-cpscs-blue mb-2">Excellence Awards</h3>
              <p className="text-gray-600">
                Recognizing outstanding professional achievements and industry leadership
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-all duration-300 hover:scale-105">
              <Star className="h-16 w-16 text-cpscs-blue mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-cpscs-blue mb-2">Innovation Leaders</h3>
              <p className="text-gray-600">
                Honoring groundbreaking contributions to technology and research
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-all duration-300 hover:scale-105">
              <Award className="h-16 w-16 text-cpscs-gold mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-cpscs-blue mb-2">Community Champions</h3>
              <p className="text-gray-600">
                Celebrating those who give back and make a difference in society
              </p>
            </div>
          </div>

          <div className="text-center">
            <div className="bg-gradient-to-r from-cpscs-blue to-blue-700 text-white rounded-2xl p-12 shadow-xl">
              <h2 className="text-3xl font-bold mb-4">Coming Soon</h2>
              <p className="text-xl mb-6">
                We're preparing to showcase the remarkable stories and achievements of our alumni community.
              </p>
              <p className="text-lg opacity-90">
                Stay tuned for inspiring profiles, success stories, and recognition of excellence.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default HallOfFame;
