import React from 'react';
import { Notice } from '../../types/notice';
import { Calendar, ExternalLink, X, FileText, Image as ImageIcon, Video } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import ModalBackground from './ModalBackground';

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

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'announcement':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'event':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'spotlight':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'general':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto relative bg-background/95 backdrop-blur-md border-2">
        {/* Animated star background */}
        <ModalBackground />
        
        <div className="relative z-10">
          <DialogHeader className="space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex-1 pr-4">
                <DialogTitle className="text-2xl font-bold text-foreground mb-3 leading-tight">
                  {notice.noticeTitle}
                </DialogTitle>
                
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  {notice.category && (
                    <Badge className={`${getCategoryColor(notice.category)} border`}>
                      {notice.category.toUpperCase()}
                    </Badge>
                  )}
                  {notice.priority && (
                    <Badge className={`${getPriorityColor(notice.priority)} border`}>
                      {notice.priority.toUpperCase()} PRIORITY
                    </Badge>
                  )}
                  <div className="flex items-center gap-1 text-sm text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
                    <Calendar className="h-4 w-4" />
                    {formatDate(notice.publishDate)}
                  </div>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="shrink-0 hover:bg-muted rounded-full"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </DialogHeader>

          <div className="space-y-6 mt-6">
            {/* Main content */}
            <div className="prose prose-gray max-w-none">
              <div className="text-foreground leading-relaxed whitespace-pre-wrap text-base">
                {notice.noticeBody}
              </div>
            </div>

            {/* Media content */}
            <div className="space-y-6">
              {/* Image */}
              {notice.imageUrl && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <ImageIcon className="h-4 w-4" />
                    Attached Image
                  </div>
                  <div className="rounded-lg overflow-hidden border-2 shadow-lg">
                    <img
                      src={notice.imageUrl}
                      alt={notice.noticeTitle}
                      className="w-full h-auto object-cover max-h-96"
                      loading="lazy"
                    />
                  </div>
                </div>
              )}

              {/* Video */}
              {notice.videoUrl && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <Video className="h-4 w-4" />
                    Attached Video
                  </div>
                  <div className="rounded-lg overflow-hidden border-2 shadow-lg aspect-video">
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
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <FileText className="h-4 w-4" />
                    Attached Document
                  </div>
                  <Button
                    onClick={handlePdfOpen}
                    className="flex items-center gap-2 bg-primary hover:bg-primary/90"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Read PDF
                  </Button>
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