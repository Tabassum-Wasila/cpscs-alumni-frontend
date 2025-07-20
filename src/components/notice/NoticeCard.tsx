
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

  const gradientVariations = [
    'from-purple-200/30 via-pink-100/15 to-blue-100/25 border-purple-200/30',
    'from-blue-200/30 via-cyan-100/15 to-teal-100/25 border-blue-200/30',
    'from-green-200/30 via-emerald-100/15 to-lime-100/25 border-green-200/30',
    'from-rose-200/30 via-pink-100/15 to-red-100/25 border-rose-200/30',
    'from-orange-200/30 via-amber-100/15 to-yellow-100/25 border-orange-200/30',
    'from-indigo-200/30 via-purple-100/15 to-blue-100/25 border-indigo-200/30',
    'from-teal-200/30 via-cyan-100/15 to-emerald-100/25 border-teal-200/30',
    'from-pink-200/30 via-rose-100/15 to-purple-100/25 border-pink-200/30',
    'from-violet-200/30 via-indigo-100/15 to-blue-100/25 border-violet-200/30',
    'from-cyan-200/30 via-blue-100/15 to-teal-100/25 border-cyan-200/30'
  ];

  const getRandomGradient = () => {
    const hash = notice.id.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    const index = Math.abs(hash) % gradientVariations.length;
    return gradientVariations[index];
  };

  const hasMedia = notice.imageUrl || notice.videoUrl || notice.pdfUrl;

  return (
    <Card 
      className={`p-6 cursor-pointer group relative overflow-hidden border-2 bg-gradient-to-br ${getRandomGradient()} hover:shadow-2xl hover:scale-[1.03] transition-all duration-500 animate-fade-in backdrop-blur-sm`}
      onClick={onClick}
    >
      {/* Enhanced gradient flow animations */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
      <div className="absolute inset-0 bg-gradient-to-l from-transparent via-white/5 to-transparent translate-x-full group-hover:-translate-x-full transition-transform duration-1500 ease-out delay-200" />
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-primary/5 to-transparent translate-y-full group-hover:-translate-y-full transition-transform duration-1200 ease-out delay-100" />
      
      {/* Subtle pulsing border effect */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
      
      <div className="relative z-10">
        {/* Header with enhanced date styling */}
        <div className="flex justify-end items-start mb-3">
          <div className="flex items-center gap-1 text-xs text-muted-foreground bg-background/40 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20 group-hover:bg-background/60 transition-all duration-300">
            <Calendar className="h-3 w-3 text-primary group-hover:rotate-12 transition-transform duration-300" />
            <span className="font-medium">{formatDate(notice.publishDate)}</span>
          </div>
        </div>

        {/* Enhanced title with gradient hover effect */}
        <h3 className="text-xl font-bold text-foreground mb-3 group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-secondary group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300 leading-tight">
          {notice.noticeTitle}
        </h3>

        {/* Body preview with better styling */}
        <p className="text-muted-foreground text-sm leading-relaxed mb-4 group-hover:text-foreground/80 transition-colors duration-300">
          {truncateText(notice.noticeBody)}
        </p>

        {/* Enhanced media indicators */}
        {hasMedia && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
            <span className="flex items-center gap-1 text-xs font-medium">
              <FileText className="h-3 w-3 text-primary" />
              Includes:
            </span>
            <div className="flex gap-2">
              {notice.imageUrl && (
                <span className="flex items-center gap-1 bg-blue-100/80 text-blue-700 px-2 py-1 rounded-full border border-blue-200/50 group-hover:scale-110 transition-transform duration-300">
                  <Image className="h-3 w-3" />
                  <span className="text-xs font-medium">Image</span>
                </span>
              )}
              {notice.videoUrl && (
                <span className="flex items-center gap-1 bg-purple-100/80 text-purple-700 px-2 py-1 rounded-full border border-purple-200/50 group-hover:scale-110 transition-transform duration-300">
                  <Video className="h-3 w-3" />
                  <span className="text-xs font-medium">Video</span>
                </span>
              )}
              {notice.pdfUrl && (
                <span className="flex items-center gap-1 bg-green-100/80 text-green-700 px-2 py-1 rounded-full border border-green-200/50 group-hover:scale-110 transition-transform duration-300">
                  <ExternalLink className="h-3 w-3" />
                  <span className="text-xs font-medium">PDF</span>
                </span>
              )}
            </div>
          </div>
        )}

        {/* Enhanced read more indicator */}
        <div className="flex items-center justify-between">
          <div className="text-primary text-sm font-semibold group-hover:text-secondary transition-colors duration-300 flex items-center gap-2">
            <span>Click to read more</span>
            <div className="w-2 h-2 bg-primary rounded-full group-hover:bg-secondary group-hover:scale-125 transition-all duration-300" />
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <ExternalLink className="h-4 w-4 text-primary group-hover:rotate-12 transition-transform duration-300" />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default NoticeCard;
