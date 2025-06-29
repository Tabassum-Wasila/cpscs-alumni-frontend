
import React from 'react';
import { Heart, Clock, Eye, User } from 'lucide-react';
import { MagazineArticle } from '@/types/magazine';
import { Card } from '@/components/ui/card';

interface MagazineCardProps {
  article: MagazineArticle;
  onCardClick: (article: MagazineArticle) => void;
  onLoveClick: (articleId: string) => void;
}

const MagazineCard: React.FC<MagazineCardProps> = ({ article, onCardClick, onLoveClick }) => {
  const handleLoveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onLoveClick(article.id);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      story: 'bg-blue-100 text-blue-800',
      achievement: 'bg-green-100 text-green-800',
      career: 'bg-purple-100 text-purple-800',
      memories: 'bg-yellow-100 text-yellow-800',
      innovation: 'bg-red-100 text-red-800',
      community: 'bg-indigo-100 text-indigo-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card 
      className="group cursor-pointer overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-2xl bg-gradient-to-br from-white via-cpscs-light to-white border-0 shadow-lg"
      onClick={() => onCardClick(article)}
    >
      {/* Premium Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-cpscs-gold/5 via-transparent to-cpscs-blue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Featured Badge */}
      {article.featured && (
        <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-cpscs-gold to-yellow-400 text-cpscs-blue px-3 py-1 rounded-full text-xs font-bold shadow-lg">
          Featured
        </div>
      )}
      
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-cpscs-blue/10 to-cpscs-gold/10">
        <img 
          src={article.featuredImage} 
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        
        {/* Category Badge */}
        <div className="absolute bottom-4 left-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(article.category)}`}>
            {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 relative">
        <div className="mb-3">
          <h3 className="text-xl font-bold text-cpscs-blue mb-2 line-clamp-2 group-hover:text-cpscs-gold transition-colors duration-300">
            {article.title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
            {article.excerpt}
          </p>
        </div>

        {/* Author Info */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-cpscs-gold/30">
            <img 
              src={article.author.profilePhoto || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=100&h=100&fit=crop&crop=face'} 
              alt={article.author.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="text-sm font-medium text-cpscs-blue">{article.author.name}</p>
            <p className="text-xs text-gray-500">Batch {article.author.batch}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{article.readTime} min</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>{article.viewCount.toLocaleString()}</span>
            </div>
          </div>
          
          {/* Love Button */}
          <button 
            onClick={handleLoveClick}
            className="flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-red-50 to-pink-50 hover:from-red-100 hover:to-pink-100 transition-all duration-300 group/love"
          >
            <Heart className="h-4 w-4 text-red-500 group-hover/love:scale-125 transition-transform duration-300 group-hover/love:fill-current" />
            <span className="text-sm font-medium text-red-600">
              {article.loveCount.toLocaleString()}
            </span>
          </button>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-4">
          {article.tags.slice(0, 3).map((tag, index) => (
            <span 
              key={index}
              className="px-2 py-1 bg-cpscs-blue/10 text-cpscs-blue text-xs rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default MagazineCard;
