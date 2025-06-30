
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { committeeData } from '@/data/committeeData';
import { CommitteeMember as CommitteeMemberType } from '@/types/committee';
import CommitteeMember from '../components/committee/CommitteeMember';
import CommitteeModal from '../components/committee/CommitteeModal';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExternalLink, Users } from 'lucide-react';

const Committee = () => {
  const [selectedMember, setSelectedMember] = useState<CommitteeMemberType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sort members by sequence number for all committees
  const sortedExecutiveCommittee = [...committeeData.executiveCommittee].sort((a, b) => a.sequence - b.sequence);
  const sortedAdvisorCouncil = [...committeeData.advisorCouncil].sort((a, b) => a.sequence - b.sequence);
  const sortedAmbassadors = [...committeeData.ambassadors].sort((a, b) => a.sequence - b.sequence);

  const handleMemberClick = (member: CommitteeMemberType) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedMember(null);
  };

  const handlePreviousCommitteeClick = () => {
    window.open('https://drive.google.com/drive/folders/1amaPm_pwG7IrJz1uF_neJEvSYt_6JF67?usp=sharing', '_blank');
  };

  const renderCommitteeGrid = (members: CommitteeMemberType[]) => {
    if (members.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cpscs-gold/20 to-yellow-100/30 flex items-center justify-center mb-6">
            <Users className="w-12 h-12 text-cpscs-gold" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">No members added yet!</h3>
          <p className="text-gray-600 max-w-md">
            Ambassador members will be displayed here once they are added through the admin panel.
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-16">
        {members.map(member => (
          <CommitteeMember 
            key={member.sequence} 
            member={member} 
            onClick={handleMemberClick} 
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow pt-40 lg:pt-24 pb-16 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="font-bold text-cpscs-blue mb-4 text-3xl">Current Committee of CPSCS Alumni Association</h1>
          </div>
          
          {/* Committee Tabs */}
          <Tabs defaultValue="executive" className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className="bg-white/70 backdrop-blur-sm shadow-xl border border-white/40">
                <TabsTrigger value="executive" className="text-xs sm:text-sm font-semibold px-3 sm:px-4">
                  <span className="hidden sm:inline">Executive Committee</span>
                  <span className="sm:hidden">Executive</span>
                </TabsTrigger>
                <TabsTrigger value="advisor" className="text-xs sm:text-sm font-semibold px-3 sm:px-4">
                  <span className="hidden sm:inline">Advisor Council</span>
                  <span className="sm:hidden">Advisors</span>
                </TabsTrigger>
                <TabsTrigger value="ambassadors" className="text-xs sm:text-sm font-semibold px-3 sm:px-4">
                  Ambassadors
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="executive" className="mt-6">
              {renderCommitteeGrid(sortedExecutiveCommittee)}
            </TabsContent>

            <TabsContent value="advisor" className="mt-6">
              {renderCommitteeGrid(sortedAdvisorCouncil)}
            </TabsContent>

            <TabsContent value="ambassadors" className="mt-6">
              {renderCommitteeGrid(sortedAmbassadors)}
            </TabsContent>
          </Tabs>

          {/* Previous Committee Members Section */}
          <div className="text-center bg-white/50 backdrop-blur-sm rounded-2xl p-12 border border-white/20">
            <h2 className="text-3xl font-bold text-cpscs-blue mb-4">
              Previous Committee Members
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto text-base">
              Here are all the people who contributed in the executive committee of CPSCS AA.
            </p>
            <Button 
              onClick={handlePreviousCommitteeClick} 
              size="lg" 
              className="bg-cpscs-blue hover:bg-cpscs-blue/90 text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <ExternalLink className="w-5 h-5 mr-3" />
              See All Committees
            </Button>
          </div>

          {/* Member Detail Modal */}
          <CommitteeModal 
            member={selectedMember} 
            isOpen={isModalOpen} 
            onClose={handleModalClose} 
          />
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Committee;
