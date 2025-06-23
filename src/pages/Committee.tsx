
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { committeeData } from '@/data/committeeData';
import { CommitteeMember as CommitteeMemberType } from '@/types/committee';
import CommitteeMember from '../components/committee/CommitteeMember';
import CommitteeModal from '../components/committee/CommitteeModal';

const Committee = () => {
  const [selectedMember, setSelectedMember] = useState<CommitteeMemberType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleMemberClick = (member: CommitteeMemberType) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedMember(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow pt-24 pb-16 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-cpscs-blue mb-4">
              {committeeData.subtitle}
            </h1>
            <p className="text-2xl text-gray-600 mb-2">
              {committeeData.term}
            </p>
            <p className="text-lg text-gray-500 max-w-3xl mx-auto">
              {committeeData.title}
            </p>
          </div>
          
          {/* Committee Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {committeeData.members.map((member) => (
              <CommitteeMember
                key={member.sequence}
                member={member}
                onClick={handleMemberClick}
              />
            ))}
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
