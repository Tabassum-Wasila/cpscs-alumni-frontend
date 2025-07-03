
import React, { useState } from 'react';
import { Heart, MessageCircle, Eye, Clock, User, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SocialPost } from '@/types/social';
import YouTubeEmbed from './YouTubeEmbed';
import CommentSection from './CommentSection';
import { cn } from '@/lib/utils';

interface PostCardProps {
  post: SocialPost;
  onLike: (postId: string) => void;
  onComment: (postId: string, content: string) => void;
  onProfileClick: (authorId: string) => void;
  searchQuery?: string;
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  onLike,
  onComment,
  onProfileClick,
  searchQuery
}) => {
  const [showComments, setShowComments] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  const highlightText = (text: string, query?: string) => {
    if (!query) return text;
    
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === query.toLowerCase() ? 
        <mark key={index} className="bg-yellow-200 px-1 rounded">{part}</mark> : 
        part
    );
  };

  const shouldTruncate = post.content.length > 300;
  const displayContent = shouldTruncate && !isExpanded 
    ? post.content.substring(0, 300) + '...'
    : post.content;

  return (
    <Card className="mb-6 overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Header */}
      <div className="p-4 pb-2">
        <div className="flex items-center space-x-3">
          <div 
            className="w-10 h-10 rounded-full overflow-hidden cursor-pointer hover:ring-2 hover:ring-cpscs-blue/30 transition-all"
            onClick={() => onProfileClick(post.authorId)}
          >
            {post.author.profilePhoto ? (
              <img 
                src={post.author.profilePhoto} 
                alt={post.author.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-cpscs-blue to-cpscs-gold flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <h4 
              className="font-medium text-cpscs-blue cursor-pointer hover:underline"
              onClick={() => onProfileClick(post.authorId)}
            >
              {highlightText(post.author.name, searchQuery)}
            </h4>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              {post.author.batch && (
                <span>Batch {post.author.batch}</span>
              )}
              {post.author.designation && post.author.company && (
                <span>• {post.author.designation} at {post.author.company}</span>
              )}
              <span>•</span>
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>{formatTime(post.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-2">
        <div 
          className="prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ 
            __html: highlightText(displayContent, searchQuery) 
          }}
        />
        
        {shouldTruncate && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-2 text-cpscs-blue hover:bg-cpscs-blue/10 p-0 h-auto"
          >
            {isExpanded ? (
              <>
                <span>Show less</span>
                <ChevronUp className="h-4 w-4 ml-1" />
              </>
            ) : (
              <>
                <span>Show more</span>
                <ChevronDown className="h-4 w-4 ml-1" />
              </>
            )}
          </Button>
        )}
      </div>

      {/* Media */}
      {post.mediaType === 'image' && post.imageUrl && (
        <div className="px-4 pb-4">
          <img 
            src={post.imageUrl} 
            alt="Post image"
            className="w-full rounded-lg object-cover max-h-96"
            loading="lazy"
          />
        </div>
      )}

      {post.mediaType === 'youtube' && post.youtubeUrl && (
        <div className="px-4 pb-4">
          <YouTubeEmbed url={post.youtubeUrl} />
        </div>
      )}

      {/* Actions */}
      <div className="px-4 py-3 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onLike(post.id)}
              className={cn(
                "flex items-center space-x-2 hover:bg-red-50 transition-colors",
                post.isLiked && "text-red-500"
              )}
            >
              <Heart className={cn("h-4 w-4", post.isLiked && "fill-current")} />
              <span>{post.likeCount}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowComments(!showComments)}
              className="flex items-center space-x-2 hover:bg-blue-50 transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              <span>{post.commentCount}</span>
            </Button>
          </div>

          <div className="flex items-center space-x-1 text-sm text-gray-500">
            <Eye className="h-4 w-4" />
            <span>12 views</span>
          </div>
        </div>
      </div>

      {/* Comments */}
      {showComments && (
        <div className="border-t border-gray-100">
          <CommentSection
            postId={post.id}
            onComment={onComment}
            onProfileClick={onProfileClick}
            searchQuery={searchQuery}
          />
        </div>
      )}
    </Card>
  );
};

export default PostCard;
