
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
    setSelectedNotice(notice);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedNotice(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background/95 to-muted/20">
      <Navbar />
      
      <div className="flex-grow pt-20 lg:pt-24">
        {/* Header Section */}
        <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent py-12 mb-6">
          <div className="container mx-auto px-4 text-center">
            <div className="flex justify-center items-center gap-3 mb-4">
              <Bell className="h-8 w-8 text-primary animate-pulse" />
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">Notice Board</h1>
              <Bell className="h-8 w-8 text-primary animate-pulse" />
            </div>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Stay updated with the latest announcements, events, and important information from the CPSCS Alumni Community
            </p>
          </div>
        </div>

        {/* Notice List */}
        <div className="container mx-auto px-4 pb-16">
          <div className="bg-background/60 backdrop-blur-sm rounded-2xl border shadow-lg overflow-hidden">
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

      {/* Notice Modal */}
      <NoticeModal
        notice={selectedNotice}
        isOpen={isModalOpen}
        onClose={handleModalClose}
      />
    </div>
  );
};

export default NoticeBoard;
