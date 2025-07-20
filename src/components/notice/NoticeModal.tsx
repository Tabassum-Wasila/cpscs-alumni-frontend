
import React from 'react';
import { Notice } from '../../types/notice';
import { Calendar, ExternalLink, X, FileText, Image as ImageIcon, Video } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import EnhancedModalBackground from './EnhancedModalBackground';

interface NoticeModalProps {
  notice: Notice | null;
  isOpen: boolean;
  onClose: () => void;
}

const NoticeModal: React.FC<NoticeModalProps> = ({ notice, isOpen, onClose }) => {
  if (!notice) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handlePdfOpen = () => {
    if (notice.pdfUrl) {
      window.open(notice.pdfUrl, '_blank');
    }
  };

  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return videoId ? `https://www.youtube.com/embed/${videoId[1]}` : url;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-hidden border-0 p-0 bg-transparent shadow-none">
        <div className="relative bg-background/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
          {/* Enhanced animated background */}
          <EnhancedModalBackground />
          
          {/* Glassmorphism overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 pointer-events-none" />
          
          <div className="relative z-20 p-8 max-h-[95vh] overflow-y-auto">
            {/* Header Section */}
            <DialogHeader className="space-y-6 mb-8">
              <div className="flex justify-between items-start gap-6">
                <div className="flex-1 space-y-4">
                  <DialogTitle className="text-3xl md:text-4xl font-bold text-foreground leading-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
                    {notice.noticeTitle}
                  </DialogTitle>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2 bg-muted/30 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span className="font-medium">{formatDate(notice.publishDate)}</span>
                    </div>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="shrink-0 h-10 w-10 rounded-full bg-muted/20 backdrop-blur-sm hover:bg-muted/40 border border-white/10 transition-all duration-300 hover:scale-110 group"
                >
                  <X className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
                </Button>
              </div>
            </DialogHeader>

            {/* Content Section */}
            <div className="space-y-8">
              {/* Main content with beautiful typography */}
              <div className="bg-background/40 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-lg">
                <div className="prose prose-lg max-w-none text-foreground leading-relaxed whitespace-pre-wrap">
                  {notice.noticeBody}
                </div>
              </div>

              {/* Media content with enhanced design */}
              {(notice.imageUrl || notice.videoUrl || notice.pdfUrl) && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                    <div className="w-1 h-6 bg-gradient-to-b from-primary to-primary/50 rounded-full" />
                    Attachments
                  </h3>

                  {/* Image */}
                  {notice.imageUrl && (
                    <div className="group space-y-3">
                      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                          <ImageIcon className="h-4 w-4 text-blue-500" />
                        </div>
                        Attached Image
                      </div>
                      <div className="relative rounded-2xl overflow-hidden border border-white/20 shadow-xl group-hover:shadow-2xl transition-all duration-500">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <img
                          src={notice.imageUrl}
                          alt={notice.noticeTitle}
                          className="w-full h-auto object-cover max-h-96 group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  )}

                  {/* Video */}
                  {notice.videoUrl && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <div className="p-2 bg-purple-500/10 rounded-lg">
                          <Video className="h-4 w-4 text-purple-500" />
                        </div>
                        Attached Video
                      </div>
                      <div className="relative rounded-2xl overflow-hidden border border-white/20 shadow-xl aspect-video">
                        {notice.videoUrl.includes('youtube.com') || notice.videoUrl.includes('youtu.be') ? (
                          <iframe
                            src={getYouTubeEmbedUrl(notice.videoUrl)}
                            title={notice.noticeTitle}
                            className="w-full h-full"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        ) : (
                          <video
                            src={notice.videoUrl}
                            controls
                            className="w-full h-full object-cover"
                            preload="metadata"
                          >
                            Your browser does not support the video tag.
                          </video>
                        )}
                      </div>
                    </div>
                  )}

                  {/* PDF */}
                  {notice.pdfUrl && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <div className="p-2 bg-green-500/10 rounded-lg">
                          <FileText className="h-4 w-4 text-green-500" />
                        </div>
                        Attached Document
                      </div>
                      <Button
                        onClick={handlePdfOpen}
                        className="group relative overflow-hidden bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl px-6 py-3"
                      >
                        <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
                        <div className="relative flex items-center gap-2">
                          <ExternalLink className="h-4 w-4 group-hover:rotate-12 transition-transform duration-300" />
                          <span className="font-semibold">Read PDF</span>
                        </div>
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NoticeModal;
