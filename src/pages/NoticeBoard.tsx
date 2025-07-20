
import React, { useState, useMemo } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Bell } from 'lucide-react';
import NoticeCard from '../components/notice/NoticeCard';
import NoticeModal from '../components/notice/NoticeModal';
import NoticeHeader from '../components/notice/NoticeHeader';
import { Notice, NoticeFilters } from '../types/notice';
import { sampleNotices } from '../data/noticesData';

const NoticeBoard = () => {
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState<NoticeFilters>({
    searchQuery: '',
    sortBy: 'date-desc',
  });

  // Filter and sort notices
  const filteredNotices = useMemo(() => {
    let filtered = [...sampleNotices];

    // Apply search filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(notice =>
        notice.noticeTitle.toLowerCase().includes(query) ||
        notice.noticeBody.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const dateA = new Date(a.publishDate).getTime();
      const dateB = new Date(b.publishDate).getTime();
      return filters.sortBy === 'date-desc' ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  }, [filters]);

  const handleNoticeClick = (notice: Notice) => {
    console.log('Notice clicked:', notice.noticeTitle); // Debug log
    setSelectedNotice(notice);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    console.log('Modal closing'); // Debug log
    setIsModalOpen(false);
    setTimeout(() => {
      setSelectedNotice(null);
    }, 300); // Small delay to allow animation
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background/95 to-muted/20">
      <Navbar />
      
      <div className="flex-grow pt-20 lg:pt-24">
        {/* Enhanced Header Section */}
        <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent py-12 mb-6 relative overflow-hidden">
          {/* Subtle background animation */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 animate-pulse" />
          
          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="flex justify-center items-center gap-3 mb-4">
              <Bell className="h-8 w-8 text-primary animate-pulse" />
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                Notice Board
              </h1>
              <Bell className="h-8 w-8 text-primary animate-pulse" />
            </div>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Stay updated with the latest announcements, events, and important information from the CPSCS Alumni Community
            </p>
          </div>
        </div>

        {/* Notice List with enhanced container */}
        <div className="container mx-auto px-4 pb-16">
          <div className="bg-background/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl overflow-hidden">
            <NoticeHeader 
              filters={filters}
              onFiltersChange={setFilters}
              totalNotices={filteredNotices.length}
            />
            
            <div className="p-6">
              {filteredNotices.length === 0 ? (
                <div className="text-center py-16">
                  <Bell className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-muted-foreground mb-2">No notices found</h3>
                  <p className="text-muted-foreground">
                    {filters.searchQuery 
                      ? "Try adjusting your search terms or filters"
                      : "Check back later for new announcements"
                    }
                  </p>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredNotices.map((notice) => (
                    <NoticeCard
                      key={notice.id}
                      notice={notice}
                      onClick={() => handleNoticeClick(notice)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />

      {/* Enhanced Notice Modal */}
      <NoticeModal
        notice={selectedNotice}
        isOpen={isModalOpen}
        onClose={handleModalClose}
      />
    </div>
  );
};

export default NoticeBoard;
