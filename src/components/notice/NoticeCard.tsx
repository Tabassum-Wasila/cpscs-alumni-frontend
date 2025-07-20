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
    'from-purple-200/40 via-pink-100/20 to-blue-100/30 border-purple-200/40',
    'from-blue-200/40 via-cyan-100/20 to-teal-100/30 border-blue-200/40',
    'from-green-200/40 via-emerald-100/20 to-lime-100/30 border-green-200/40',
    'from-rose-200/40 via-pink-100/20 to-red-100/30 border-rose-200/40',
    'from-orange-200/40 via-amber-100/20 to-yellow-100/30 border-orange-200/40',
    'from-indigo-200/40 via-purple-100/20 to-blue-100/30 border-indigo-200/40',
    'from-teal-200/40 via-cyan-100/20 to-emerald-100/30 border-teal-200/40',
    'from-pink-200/40 via-rose-100/20 to-purple-100/30 border-pink-200/40',
    'from-violet-200/40 via-indigo-100/20 to-blue-100/30 border-violet-200/40',
    'from-cyan-200/40 via-blue-100/20 to-teal-100/30 border-cyan-200/40'
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
      className={`p-6 cursor-pointer group relative overflow-hidden border-2 bg-gradient-to-br ${getRandomGradient()} hover:shadow-xl hover:scale-[1.02] transition-all duration-300 animate-fade-in`}
      onClick={onClick}
    >
      {/* Animated gradient flow overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
      <div className="absolute inset-0 bg-gradient-to-l from-transparent via-white/10 to-transparent translate-x-full group-hover:-translate-x-full transition-transform duration-1500 ease-out delay-200" />
      
      <div className="relative z-10">
        {/* Header with date */}
        <div className="flex justify-end items-start mb-3">
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