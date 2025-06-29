
import React from 'react';
import { X, Heart, Clock, Eye, ExternalLink, Calendar, User } from 'lucide-react';
import { MagazineArticle } from '@/types/magazine';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface MagazineModalProps {
  article: MagazineArticle | null;
  isOpen: boolean;
  onClose: () => void;
  onLoveClick: (articleId: string) => void;
}

const MagazineModal: React.FC<MagazineModalProps> = ({ article, isOpen, onClose, onLoveClick }) => {
  if (!article) return null;

  const handleLoveClick = () => {
    onLoveClick(article.id);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      story: 'bg-blue-500',
      achievement: 'bg-green-500',
      career: 'bg-purple-500',
      memories: 'bg-yellow-500',
      innovation: 'bg-red-500',
      community: 'bg-indigo-500'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-500';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0 bg-white">
        <div className="relative">
          {/* Header with Banner */}
          <div className="relative h-64 overflow-hidden">
            <img 
              src={article.bannerImage || article.featuredImage} 
              alt={article.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-colors duration-300 z-10"
            >
              <X className="h-5 w-5 text-white" />
            </button>

            {/* Featured Badge */}
            {article.featured && (
              <div className="absolute top-4 left-4 bg-gradient-to-r from-cpscs-gold to-yellow-400 text-cpscs-blue px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                Featured Article
              </div>
            )}

            {/* Title Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getCategoryColor(article.category)}`}>
                  {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
                </span>
                <span className="text-sm opacity-80">
                  {new Date(article.publishedAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
              <h1 className="text-3xl font-bold mb-2">{article.title}</h1>
              <p className="text-lg opacity-90">{article.excerpt}</p>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 max-h-96 overflow-y-auto">
            {/* Author Info */}
            <div className="flex items-center gap-4 mb-6 p-4 bg-gradient-to-r from-cpscs-light to-white rounded-lg border border-cpscs-gold/20">
              <div className="w-16 h-16 rounded-full overflow-hidden border-3 border-cpscs-gold/50 shadow-lg">
                <img 
                  src={article.author.profilePhoto || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=100&h=100&fit=crop&crop=face'} 
                  alt={article.author.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-cpscs-blue">{article.author.name}</h3>
                <p className="text-sm text-gray-600">{article.author.bio}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    Batch {article.author.batch}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(article.publishedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Article Content */}
            <div 
              className="prose prose-lg max-w-none mb-6 text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {article.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-cpscs-blue/10 text-cpscs-blue text-sm rounded-full hover:bg-cpscs-blue/20 transition-colors duration-300"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Stats and Actions */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-cpscs-light to-white rounded-lg border border-cpscs-gold/20">
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{article.readTime} min read</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  <span>{article.viewCount.toLocaleString()} views</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {/* Love Button */}
                <button 
                  onClick={handleLoveClick}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-red-50 to-pink-50 hover:from-red-100 hover:to-pink-100 transition-all duration-300 group border border-red-200"
                >
                  <Heart className="h-5 w-5 text-red-500 group-hover:scale-125 transition-transform duration-300 group-hover:fill-current" />
                  <span className="text-sm font-medium text-red-600">
                    {article.loveCount.toLocaleString()} loves
                  </span>
                </button>

                {/* Social Links */}
                {article.author.socialLinks?.linkedin && (
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="border-cpscs-blue/30 hover:bg-cpscs-blue/10"
                  >
                    <a href={article.author.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Connect with Author
                    </a>
                  </Button>
                )}
              </div>
            </div>

            {/* Call to Action */}
            <div className="mt-8 p-6 bg-gradient-to-r from-cpscs-blue to-cpscs-blue/90 rounded-xl text-white text-center">
              <h3 className="text-xl font-bold mb-2">Inspired by this story?</h3>
              <p className="mb-4 opacity-90">Share your own journey with the CPSCS community</p>
              <Button 
                className="bg-cpscs-gold hover:bg-cpscs-gold/90 text-cpscs-blue font-bold px-6 py-2 rounded-full transition-all duration-300 hover:scale-105"
              >
                Upload Your Own Writing
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MagazineModal;
