
import React, { useState } from 'react';
import { committeeData } from '@/data/committeeData';
import { CommitteeMember as CommitteeMemberType } from '@/types/committee';
import CommitteeMember from './committee/CommitteeMember';
import CommitteeModal from './committee/CommitteeModal';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CommitteeSection: React.FC = () => {
  const [selectedMember, setSelectedMember] = useState<CommitteeMemberType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  // Show only key positions for the home page preview
  const keyPositions = [
    'President',
    'Vice President 1',
    'Vice President 2', 
    'General Secretary',
    'Treasurer',
    'Publicity Secretary',
    'Education Secretary',
    'Cultural Affairs Secretary'
  ];

  // Sort all members by sequence first, then filter for featured members
  const sortedMembers = [...committeeData.members].sort((a, b) => a.sequence - b.sequence);
  const featuredMembers = sortedMembers.filter(member =>
    keyPositions.some(position => member.position.includes(position))
  ).slice(0, 8);

  const handleMemberClick = (member: CommitteeMemberType) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedMember(null);
  };

  const handleViewFullCommittee = () => {
    navigate('/committee');
  };

  return (
    <section className="py-16 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-cpscs-blue mb-4">
            Executive Committee
          </h2>
          <p className="text-xl text-gray-600 mb-2">
            {committeeData.term}
          </p>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Meet our dedicated leaders who guide the alumni association with passion and commitment
          </p>
        </div>

        {/* Committee Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
          {featuredMembers.map((member) => (
            <CommitteeMember
              key={member.sequence}
              member={member}
              onClick={handleMemberClick}
            />
          ))}
        </div>

        {/* View Full Committee Button */}
        <div className="text-center">
          <Button
            onClick={handleViewFullCommittee}
            size="lg"
            className="bg-cpscs-blue hover:bg-cpscs-blue/90 text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <Users className="w-5 h-5 mr-3" />
            View Full Committee
          </Button>
          <p className="text-sm text-gray-500 mt-3">
            See all {committeeData.members.length} committee members
          </p>
        </div>

        {/* Member Detail Modal */}
        <CommitteeModal
          member={selectedMember}
          isOpen={isModalOpen}
          onClose={handleModalClose}
        />
      </div>
    </section>
  );
};

export default CommitteeSection;
