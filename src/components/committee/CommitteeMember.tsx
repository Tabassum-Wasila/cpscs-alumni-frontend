
import React from 'react';
import { CommitteeMember as CommitteeMemberType } from '@/types/committee';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface CommitteeMemberProps {
  member: CommitteeMemberType;
  onClick: (member: CommitteeMemberType) => void;
}

const CommitteeMember: React.FC<CommitteeMemberProps> = ({ member, onClick }) => {
  const renderBatchInfo = () => {
    if (member.ssc_batch === "Not Applicable" && member.hsc_batch === "Not Applicable") {
      return null;
    }
    
    return (
      <div className="flex gap-2 text-xs text-gray-500 mb-3">
        {member.ssc_batch !== "Not Applicable" && (
          <span className="bg-white px-2 py-1 rounded-full">SSC {member.ssc_batch}</span>
        )}
        {member.hsc_batch !== "Not Applicable" && (
          <span className="bg-white px-2 py-1 rounded-full">HSC {member.hsc_batch}</span>
        )}
      </div>
    );
  };

  return (
    <div
      className="relative p-6 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-xl border-2 border-gray-200 bg-gradient-to-br from-yellow-50/40 via-green-50/30 to-white group"
      onClick={() => onClick(member)}
    >
      {/* Position Badge */}
      <div className="absolute -top-3 left-4 px-3 py-1 rounded-full text-xs font-semibold bg-cpscs-blue text-white">
        {member.position}
      </div>

      {/* Avatar */}
      <div className="flex flex-col items-center">
        <Avatar className="w-20 h-20 mb-4 ring-4 ring-white shadow-lg group-hover:ring-cpscs-gold transition-all duration-300">
          <AvatarImage 
            src={member.photo} 
            alt={member.name}
            className="object-cover"
          />
          <AvatarFallback className="bg-cpscs-blue text-white font-semibold">
            {member.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
          </AvatarFallback>
        </Avatar>

        {/* Name */}
        <h3 className="text-lg font-bold text-cpscs-dark text-center mb-2 group-hover:text-cpscs-blue transition-colors">
          {member.name}
        </h3>

        {/* Profession */}
        <p className="text-sm text-gray-600 text-center mb-2 line-clamp-2">
          {member.profession}
        </p>

        {/* Batch Info */}
        {renderBatchInfo()}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-100/20 via-green-100/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
        
        {/* Click Indicator */}
        <div className="absolute bottom-2 right-2 w-6 h-6 bg-cpscs-blue text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-xs">→</span>
        </div>
      </div>
    </div>
  );
};

export default CommitteeMember;
