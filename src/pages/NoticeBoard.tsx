
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Bell, Pin, Calendar, AlertCircle } from 'lucide-react';

const NoticeBoard = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow pt-40 lg:pt-24 pb-16 bg-gradient-to-br from-cpscs-light via-white to-yellow-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex justify-center items-center gap-3 mb-4">
              <Bell className="h-8 w-8 text-cpscs-blue animate-pulse" />
              <h1 className="text-4xl md:text-5xl font-bold text-cpscs-blue">Notice Board</h1>
              <Bell className="h-8 w-8 text-cpscs-blue animate-pulse" />
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Stay updated with the latest announcements, events, and important information from the CPSCS Alumni Community
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-red-500 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="h-6 w-6 text-red-500" />
                <h3 className="text-xl font-bold text-red-600">Important Announcements</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Critical updates and urgent notifications for all alumni members
              </p>
              <div className="text-sm text-gray-500">Last updated: Today</div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-blue-500 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="h-6 w-6 text-blue-500" />
                <h3 className="text-xl font-bold text-blue-600">Upcoming Events</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Don't miss out on networking events, reunions, and professional meetups
              </p>
              <div className="text-sm text-gray-500">Next event: TBA</div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-green-500 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <Pin className="h-6 w-6 text-green-500" />
                <h3 className="text-xl font-bold text-green-600">General Notices</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Regular updates, policy changes, and community guidelines
              </p>
              <div className="text-sm text-gray-500">Updated weekly</div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-cpscs-gold hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <Bell className="h-6 w-6 text-cpscs-gold" />
                <h3 className="text-xl font-bold text-cpscs-gold">Alumni Spotlights</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Celebrating achievements and sharing success stories from our community
              </p>
              <div className="text-sm text-gray-500">Featured monthly</div>
            </div>
          </div>

          <div className="text-center">
            <div className="bg-gradient-to-r from-cpscs-blue to-blue-700 text-white rounded-2xl p-12 shadow-xl">
              <h2 className="text-3xl font-bold mb-4">Stay Connected</h2>
              <p className="text-xl mb-6">
                Be the first to know about important updates and opportunities in our alumni community.
              </p>
              <p className="text-lg opacity-90">
                Join our mailing list and follow our social media channels for real-time notifications.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default NoticeBoard;
