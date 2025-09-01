import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import VipSponsorBanner from '../components/VipSponsorBanner';
import { bannerService } from '../services/bannerService';
import { committeeService } from '../services/committeeService';
import { CommitteeMember as CommitteeMemberType, CommitteeData } from '@/types/committee';
import CommitteeMember from '../components/committee/CommitteeMember';
import CommitteeModal from '../components/committee/CommitteeModal';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ExternalLink, Users, Calendar } from 'lucide-react';
const Committee = () => {
  const location = useLocation();
  const [selectedMember, setSelectedMember] = useState<CommitteeMemberType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // State for selected terms for each committee type
  const [executiveTermId, setExecutiveTermId] = useState<string>('');
  const [advisorTermId, setAdvisorTermId] = useState<string>('');
  const [ambassadorsTermId, setAmbassadorsTermId] = useState<string>('');

  // Fetch banner data based on current path
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
    queryKey: ['committee-terms'],
    queryFn: () => committeeService.getTerms()
  });

  // Fetch committee data for executive committee
  const {
    data: executiveCommitteeData,
    isLoading: executiveLoading
  } = useQuery({
    queryKey: ['committee-data', executiveTermId],
    queryFn: () => executiveTermId ? committeeService.getCommitteeByTerm(executiveTermId) : committeeService.getLatestCommittee(),
    enabled: !!executiveTermId || terms.length > 0
  });

  // Fetch committee data for advisor council
  const {
    data: advisorCouncilData,
    isLoading: advisorLoading
  } = useQuery({
    queryKey: ['committee-data', advisorTermId],
    queryFn: () => advisorTermId ? committeeService.getCommitteeByTerm(advisorTermId) : committeeService.getLatestCommittee(),
    enabled: !!advisorTermId || terms.length > 0
  });

  // Fetch committee data for ambassadors
  const {
    data: ambassadorsData,
    isLoading: ambassadorsLoading
  } = useQuery({
    queryKey: ['committee-data', ambassadorsTermId],
    queryFn: () => ambassadorsTermId ? committeeService.getCommitteeByTerm(ambassadorsTermId) : committeeService.getLatestCommittee(),
    enabled: !!ambassadorsTermId || terms.length > 0
  });

  // Set default term to latest when terms are loaded
  React.useEffect(() => {
    if (terms.length > 0 && !executiveTermId) {
      const latestTerm = terms.find(term => term.isActive) || terms[0];
      setExecutiveTermId(latestTerm.id);
      setAdvisorTermId(latestTerm.id);
      setAmbassadorsTermId(latestTerm.id);
    }
  }, [terms, executiveTermId]);

  // Sort members by sequence number for all committees
  const sortedExecutiveCommittee = executiveCommitteeData ? [...executiveCommitteeData.executiveCommittee].sort((a, b) => a.sequence - b.sequence) : [];
  const sortedAdvisorCouncil = advisorCouncilData ? [...advisorCouncilData.advisorCouncil].sort((a, b) => a.sequence - b.sequence) : [];
  const sortedAmbassadors = ambassadorsData ? [...ambassadorsData.ambassadors].sort((a, b) => a.sequence - b.sequence) : [];
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
  const renderTermDropdown = (selectedTermId: string, onTermChange: (termId: string) => void, isLoading: boolean) => (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-4">
        <Calendar className="w-5 h-5 text-primary" />
        <span className="text-sm font-semibold text-muted-foreground">Select Term:</span>
      </div>
      <Select value={selectedTermId} onValueChange={onTermChange} disabled={isLoading || termsLoading}>
        <SelectTrigger className="w-full max-w-xs bg-card/80 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-colors">
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
  );

  const renderCommitteeGrid = (members: CommitteeMemberType[], isLoading: boolean) => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-16">
          {Array.from({ length: 6 }).map((_, index) => (
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

    if (members.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-secondary/20 to-accent/30 flex items-center justify-center mb-6">
            <Users className="w-12 h-12 text-secondary" />
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-2">No members found!</h3>
          <p className="text-muted-foreground max-w-md">
            Committee members for this term will be displayed here once they are added through the admin panel.
          </p>
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-16">
        {members.map(member => (
          <CommitteeMember key={member.sequence} member={member} onClick={handleMemberClick} />
        ))}
      </div>
    );
  };
  return <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow pt-40 lg:pt-24 pb-16 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="font-bold text-primary mb-4 text-3xl">Committees of CPSCS Alumni Association</h1>
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
                  Lifetime Members
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="executive" className="mt-6">
              {renderTermDropdown(executiveTermId, setExecutiveTermId, executiveLoading)}
              {renderCommitteeGrid(sortedExecutiveCommittee, executiveLoading)}
            </TabsContent>

            <TabsContent value="advisor" className="mt-6">
              {renderTermDropdown(advisorTermId, setAdvisorTermId, advisorLoading)}
              {renderCommitteeGrid(sortedAdvisorCouncil, advisorLoading)}
            </TabsContent>

            <TabsContent value="ambassadors" className="mt-6">
              {renderTermDropdown(ambassadorsTermId, setAmbassadorsTermId, ambassadorsLoading)}
              {renderCommitteeGrid(sortedAmbassadors, ambassadorsLoading)}
            </TabsContent>
          </Tabs>

          {/* Previous Committee Members Section */}
          <div className="text-center bg-card/50 backdrop-blur-sm rounded-2xl p-12 border border-border/20">
            <h2 className="text-3xl font-bold text-primary mb-4">
              Previous Committee Members
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto text-base">
              Here are all the people who contributed in the executive committee of CPSCS AA.
            </p>
            <Button onClick={handlePreviousCommitteeClick} size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <ExternalLink className="w-5 h-5 mr-3" />
              See All Committees
            </Button>
          </div>

          {/* Member Detail Modal */}
          <CommitteeModal member={selectedMember} isOpen={isModalOpen} onClose={handleModalClose} />
        </div>
      </div>
      
      {/* VIP Sponsor Banner - Above Footer */}
      <VipSponsorBanner bannerData={bannerResponse?.banner || null} isLoading={bannerLoading} />
      
      <Footer />
    </div>;
};
export default Committee;