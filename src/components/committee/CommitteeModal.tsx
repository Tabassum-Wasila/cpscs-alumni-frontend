
import React from 'react';
import { CommitteeMember } from '@/types/committee';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Mail, Phone, Building2, GraduationCap, User } from 'lucide-react';

interface CommitteeModalProps {
  member: CommitteeMember | null;
  isOpen: boolean;
  onClose: () => void;
}

const CommitteeModal: React.FC<CommitteeModalProps> = ({ member, isOpen, onClose }) => {
  if (!member) return null;

  const handleWhatsAppClick = () => {
    const phoneNumber = member.whatsapp.replace(/\s+/g, '').replace(/\+/g, '');
    window.open(`https://wa.me/${phoneNumber}`, '_blank');
  };

  const handleEmailClick = () => {
    window.open(`mailto:${member.email}`, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg mx-auto bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-white">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold text-cpscs-blue">
            Committee Member Details
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-6 p-6">
          {/* Avatar */}
          <Avatar className="w-32 h-32 ring-4 ring-cpscs-gold shadow-xl">
            <AvatarImage 
              src={member.photo} 
              alt={member.name}
              className="object-cover"
            />
            <AvatarFallback className="bg-cpscs-blue text-white text-2xl font-bold">
              {member.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
            </AvatarFallback>
          </Avatar>

          {/* Name and Position */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-cpscs-dark mb-2">{member.name}</h2>
            <div className="bg-cpscs-blue text-white px-4 py-2 rounded-full text-sm font-semibold">
              {member.position}
            </div>
          </div>

          {/* Details Grid */}
          <div className="w-full space-y-4">
            {/* Profession */}
            <div className="flex items-start gap-3 p-3 bg-white/60 rounded-lg backdrop-blur-sm">
              <User className="w-5 h-5 text-cpscs-blue mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-gray-700">Profession</p>
                <p className="text-gray-600">{member.profession}</p>
              </div>
            </div>

            {/* Organization */}
            <div className="flex items-start gap-3 p-3 bg-white/60 rounded-lg backdrop-blur-sm">
              <Building2 className="w-5 h-5 text-cpscs-blue mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-gray-700">Organization</p>
                <p className="text-gray-600">{member.organization}</p>
              </div>
            </div>

            {/* Education */}
            <div className="flex items-start gap-3 p-3 bg-white/60 rounded-lg backdrop-blur-sm">
              <GraduationCap className="w-5 h-5 text-cpscs-blue mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-gray-700">Education</p>
                <div className="flex gap-3 mt-1">
                  <span className="bg-white px-3 py-1 rounded-full text-sm border">
                    SSC {member.ssc_batch}
                  </span>
                  <span className="bg-white px-3 py-1 rounded-full text-sm border">
                    HSC {member.hsc_batch}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Actions */}
          <div className="flex gap-3 w-full">
            <Button
              onClick={handleWhatsAppClick}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              <Phone className="w-4 h-4 mr-2" />
              WhatsApp
            </Button>
            <Button
              onClick={handleEmailClick}
              variant="outline"
              className="flex-1 border-cpscs-blue text-cpscs-blue hover:bg-cpscs-blue hover:text-white"
            >
              <Mail className="w-4 h-4 mr-2" />
              Email
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommitteeModal;
