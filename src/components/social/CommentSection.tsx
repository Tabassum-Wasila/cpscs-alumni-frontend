
import React, { useState, useEffect } from 'react';
import { Send, User, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { SocialComment } from '@/types/social';
import { SocialService } from '@/services/socialService';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface CommentSectionProps {
  postId: string;
  onComment: (postId: string, content: string) => void;
  onProfileClick: (authorId: string) => void;
  searchQuery?: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({
  postId,
  onComment,
  onProfileClick,
  searchQuery
}) => {
  const [comments, setComments] = useState<SocialComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    loadComments();
  }, [postId]);

  const loadComments = async () => {
    try {
      setLoading(true);
      const fetchedComments = await SocialService.getComments(postId);
      setComments(fetchedComments);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !user || submitting) return;

    try {
      setSubmitting(true);
      const comment = await SocialService.addComment(postId, newComment.trim(), user.id);
      setComments(prev => [comment, ...prev]);
      setNewComment('');
      onComment(postId, newComment.trim());
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

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

  return (
    <div className="p-4 bg-gray-50/50">
      {/* Comment Input */}
      {user ? (
        <div className="mb-4">
          <div className="flex space-x-3">
            <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
              {user.profile?.profilePicture ? (
                <img 
                  src={user.profile.profilePicture} 
                  alt={user.fullName || 'User'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-cpscs-blue to-cpscs-gold flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="min-h-[60px] resize-none border-gray-200 focus:border-cpscs-blue"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                    e.preventDefault();
                    handleSubmitComment();
                  }
                }}
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-500">
                  Press Ctrl+Enter to submit
                </span>
                <Button
                  onClick={handleSubmitComment}
                  disabled={!newComment.trim() || submitting}
                  size="sm"
                  className="bg-cpscs-blue hover:bg-cpscs-blue/90"
                >
                  {submitting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-4 text-center text-gray-500 text-sm">
          <a href="/login" className="text-cpscs-blue hover:underline">
            Login to comment
          </a>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-3">
        {loading ? (
          <div className="flex items-center justify-center py-4">
            <div className="w-6 h-6 border-2 border-cpscs-blue border-t-transparent rounded-full animate-spin" />
          </div>
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="flex space-x-3">
              <div 
                className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 cursor-pointer hover:ring-2 hover:ring-cpscs-blue/30 transition-all"
                onClick={() => onProfileClick(comment.authorId)}
              >
                {comment.author.profilePhoto ? (
                  <img 
                    src={comment.author.profilePhoto} 
                    alt={comment.author.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-cpscs-blue to-cpscs-gold flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
              
              <div className="flex-1 bg-white rounded-lg p-3 border border-gray-200">
                <div className="flex items-center space-x-2 mb-1">
                  <span 
                    className="font-medium text-sm text-cpscs-blue cursor-pointer hover:underline"
                    onClick={() => onProfileClick(comment.authorId)}
                  >
                    {highlightText(comment.author.name, searchQuery)}
                  </span>
                  {comment.author.batch && (
                    <span className="text-xs text-gray-500">
                      Batch {comment.author.batch}
                    </span>
                  )}
                  <span className="text-xs text-gray-400 flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{formatTime(comment.createdAt)}</span>
                  </span>
                </div>
                <p className="text-sm text-gray-700">
                  {highlightText(comment.content, searchQuery)}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 text-sm py-4">
            No comments yet. Be the first to comment!
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
