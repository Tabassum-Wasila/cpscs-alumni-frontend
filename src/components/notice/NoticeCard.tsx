import React from 'react';
import { Notice } from '../../types/notice';
import { Calendar, FileText, Image, Video, ExternalLink } from 'lucide-react';
import { Card } from '../ui/card';

interface NoticeCardProps {
  notice: Notice;
  onClick: () => void;
}

const NoticeCard: React.FC<NoticeCardProps> = ({ notice, onClick }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const truncateText = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'announcement':
        return 'from-red-400/20 via-red-300/10 to-red-200/20 border-red-200';
      case 'event':
        return 'from-blue-400/20 via-blue-300/10 to-blue-200/20 border-blue-200';
      case 'spotlight':
        return 'from-yellow-400/20 via-yellow-300/10 to-yellow-200/20 border-yellow-200';
      case 'general':
        return 'from-green-400/20 via-green-300/10 to-green-200/20 border-green-200';
      default:
        return 'from-gray-400/20 via-gray-300/10 to-gray-200/20 border-gray-200';
    }
  };

  const getPriorityIcon = (priority?: string) => {
    switch (priority) {
      case 'high':
        return '🔴';
      case 'medium':
        return '🟡';
      case 'low':
        return '🟢';
      default:
        return '';
    }
  };

  const hasMedia = notice.imageUrl || notice.videoUrl || notice.pdfUrl;

  return (
    <Card 
      className={`p-6 cursor-pointer group relative overflow-hidden border-2 bg-gradient-to-br ${getCategoryColor(notice.category)} hover:shadow-xl hover:scale-[1.02] transition-all duration-300 animate-fade-in`}
      onClick={onClick}
    >
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
      
      <div className="relative z-10">
        {/* Header with priority and date */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            {notice.priority && (
              <span className="text-sm">{getPriorityIcon(notice.priority)}</span>
            )}
            <span className="text-xs text-muted-foreground bg-background/50 px-2 py-1 rounded-full">
              {notice.category?.toUpperCase() || 'NOTICE'}
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            {formatDate(notice.publishDate)}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-200">
          {notice.noticeTitle}
        </h3>

        {/* Body preview */}
        <p className="text-muted-foreground text-sm leading-relaxed mb-4">
          {truncateText(notice.noticeBody)}
        </p>

        {/* Media indicators */}
        {hasMedia && (
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <FileText className="h-3 w-3" />
              Content includes:
            </span>
            {notice.imageUrl && (
              <span className="flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                <Image className="h-3 w-3" />
                Image
              </span>
            )}
            {notice.videoUrl && (
              <span className="flex items-center gap-1 bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                <Video className="h-3 w-3" />
                Video
              </span>
            )}
            {notice.pdfUrl && (
              <span className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full">
                <ExternalLink className="h-3 w-3" />
                PDF
              </span>
            )}
          </div>
        )}

        {/* Read more indicator */}
        <div className="mt-4 text-primary text-sm font-medium group-hover:underline">
          Click to read more →
        </div>
      </div>
    </Card>
  );
};

export default NoticeCard;