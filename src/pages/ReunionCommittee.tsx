import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import VipSponsorBanner from '../components/VipSponsorBanner';
import { bannerService } from '../services/bannerService';
import { reunionCommitteeService } from '../services/reunionCommitteeService';
import { ReunionCommitteeMember } from '@/types/reunionCommittee';
import CommitteeMember from '../components/committee/CommitteeMember';
import CommitteeModal from '../components/committee/CommitteeModal';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const ReunionCommittee = () => {
  const location = useLocation();
  const [selectedMember, setSelectedMember] = useState<ReunionCommitteeMember | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTermId, setSelectedTermId] = useState<string>('');

  // Fetch banner data
  const {
    data: bannerResponse,
    isLoading: bannerLoading
  } = useQuery({
    queryKey: ['vip-banner', location.pathname],
    queryFn: () => bannerService.getBannerByPath(location.pathname)
  });

  // Fetch available terms
  const {
    data: terms = [],
    isLoading: termsLoading
  } = useQuery({
    queryKey: ['reunion-committee-terms'],
    queryFn: () => reunionCommitteeService.getReunionTerms()
  });

  // Fetch reunion committee data
  const {
    data: reunionCommitteeData,
    isLoading: committeesLoading
  } = useQuery({
    queryKey: ['reunion-committee-data', selectedTermId],
    queryFn: () => selectedTermId ? reunionCommitteeService.getReunionCommitteeByTerm(selectedTermId) : reunionCommitteeService.getActiveReunionCommittee(),
    enabled: !!selectedTermId || terms.length > 0
  });

  // Set default term to latest when terms are loaded
  React.useEffect(() => {
    if (terms.length > 0 && !selectedTermId) {
      const latestTerm = terms.find(term => term.isActive) || terms[0];
      setSelectedTermId(latestTerm.id);
    }
  }, [terms, selectedTermId]);

  const handleMemberClick = (member: ReunionCommitteeMember) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedMember(null);
  };

  const committeeConfig = [
    {
      key: 'conveningCommittee',
      title: 'Convening Committee',
      icon: '🏛️'
    },
    {
      key: 'registrationCommittee',
      title: 'Registration, Volunteer and Distribution Committee',
      icon: '📝'
    },
    {
      key: 'publicityCommittee',
      title: 'Printing, Publication and Publicity Committee',
      icon: '📢'
    },
    {
      key: 'foodCommittee',
      title: 'Food Committee',
      icon: '🍽️'
    },
    {
      key: 'sponsorCommittee',
      title: 'Sponsor and Fundraising Committee',
      icon: '💰'
    },
    {
      key: 'sportsCommittee',
      title: 'Sports Committee',
      icon: '⚽'
    },
    {
      key: 'culturalCommittee',
      title: 'Cultural Committee',
      icon: '🎭'
    },
    {
      key: 'receptionCommittee',
      title: 'Reception, Rally and Decoration Committee',
      icon: '🎊'
    },
    {
      key: 'batchCoordinators',
      title: 'Batch Coordinators',
      icon: '👥'
    }
  ];

  const renderCommitteeMembers = (members: ReunionCommitteeMember[]) => {
    if (committeesLoading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="bg-card/50 rounded-xl p-4 animate-pulse">
              <div className="w-20 h-20 bg-muted rounded-full mx-auto mb-4"></div>
              <div className="h-4 bg-muted rounded mb-2"></div>
              <div className="h-3 bg-muted rounded mb-1"></div>
              <div className="h-3 bg-muted rounded"></div>
            </div>
          ))}
        </div>
      );
    }

    if (!members || members.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-secondary/20 to-accent/30 flex items-center justify-center mb-4">
            <Users className="w-8 h-8 text-secondary" />
          </div>
          <p className="text-muted-foreground">No committee members assigned yet</p>
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 pt-4">
        {members.map(member => (
          <CommitteeMember key={member.sequence} member={member} onClick={handleMemberClick} />
        ))}
      </div>
    );
  };

  if (committeesLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow pt-40 lg:pt-24 pb-16 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <div className="h-10 bg-muted rounded-lg mb-4 max-w-lg mx-auto animate-pulse"></div>
              <div className="h-6 bg-muted rounded-lg max-w-md mx-auto animate-pulse"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!reunionCommitteeData) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow pt-40 lg:pt-24 pb-16 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-primary mb-4">No Active Reunion Committee</h1>
              <p className="text-muted-foreground">Committee information will be displayed when reunion is active.</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow pt-40 lg:pt-24 pb-16 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="font-bold text-primary mb-4 text-3xl">{reunionCommitteeData.title}</h1>
            <p className="text-muted-foreground mb-6 text-lg">{reunionCommitteeData.subtitle}</p>
          </div>

          {/* Term Dropdown */}
          <div className="mb-8 flex justify-center">
            <div className="w-full max-w-xs">
              <div className="flex items-center gap-3 mb-4 justify-center">
                <Calendar className="w-5 h-5 text-primary" />
                <span className="text-sm font-semibold text-muted-foreground">Select Term:</span>
              </div>
              <Select value={selectedTermId} onValueChange={setSelectedTermId} disabled={committeesLoading || termsLoading}>
                <SelectTrigger className="w-full bg-card/80 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-colors">
                  <SelectValue placeholder="Select committee term" />
                </SelectTrigger>
                <SelectContent className="bg-card/95 backdrop-blur-sm border-border/50">
                  {terms.map((term) => (
                    <SelectItem key={term.id} value={term.id} className="hover:bg-muted/50">
                      <div className="flex items-center gap-2">
                        <span>{term.term}</span>
                        {term.isActive && (
                          <span className="px-2 py-1 text-xs bg-primary/20 text-primary rounded-full">
                            Current
                          </span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Committee Accordion */}
          <Accordion type="single" collapsible className="w-full space-y-4">
            {committeeConfig.map((committee) => {
              const members = reunionCommitteeData.committees[committee.key as keyof typeof reunionCommitteeData.committees] || [];
              
              return (
                <AccordionItem 
                  key={committee.key} 
                  value={committee.key}
                  className="bg-white/70 backdrop-blur-sm rounded-xl border border-white/40 shadow-lg"
                >
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <div className="flex items-center gap-4 text-left">
                      <div className="text-2xl">{committee.icon}</div>
                      <div>
                        <h3 className="font-semibold text-lg text-primary">{committee.title}</h3>
                        <Badge variant="secondary" className="mt-2">
                          {members.length} {members.length === 1 ? 'Member' : 'Members'}
                        </Badge>
                      </div>
                    </div>
                  </AccordionTrigger>
                  
                  <AccordionContent className="px-6 pb-6">
                    {renderCommitteeMembers(members)}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>

          {/* Member Detail Modal */}
          <CommitteeModal member={selectedMember} isOpen={isModalOpen} onClose={handleModalClose} />
        </div>
      </div>
      
      {/* VIP Sponsor Banner - Above Footer */}
      <VipSponsorBanner bannerData={bannerResponse?.banner || null} isLoading={bannerLoading} />
      
      <Footer />
    </div>
  );
};

export default ReunionCommittee;