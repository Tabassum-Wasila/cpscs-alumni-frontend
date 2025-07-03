
import React, { useState, useMemo } from 'react';
import { Loader2, Wifi, WifiOff } from 'lucide-react';
import { SocialPost, SocialFilters } from '@/types/social';
import { SocialService } from '@/services/socialService';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { useAuth } from '@/contexts/AuthContext';
import PostCard from './PostCard';
import PostCreator from './PostCreator';
import SocialSearchBar from './SocialSearchBar';
import { useToast } from '@/hooks/use-toast';

const SocialFeed: React.FC = () => {
  const [filters, setFilters] = useState<SocialFilters>({ sortBy: 'newest' });
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { user } = useAuth();
  const { toast } = useToast();

  // Monitor online status
  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => {
      setIsOnline(false);
      toast({
        title: "Connection Lost",
        description: "Please check your internet connection!",
        variant: "destructive"
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [toast]);

  const fetchPosts = async (page: number) => {
    return await SocialService.getPosts(page, 15, filters);
  };

  const {
    items: posts,
    loading,
    hasMore,
    total,
    refresh
  } = useInfiniteScroll({
    fetchMore: fetchPosts,
    enabled: isOnline
  });

  const handleLike = async (postId: string) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to like posts",
        variant: "destructive"
      });
      return;
    }

    try {
      await SocialService.toggleLike(postId, user.id);
      // The optimistic update would be handled by the service
      refresh();
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: "Error",
        description: "Failed to update like. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleComment = async (postId: string, content: string) => {
    // This is handled by the CommentSection component
    console.log('Comment added to post:', postId);
  };

  const handleProfileClick = (authorId: string) => {
    // Navigate to profile page - will be implemented when profile section is ready
    console.log('Navigate to profile:', authorId);
    toast({
      title: "Profile Feature",
      description: "Profile pages will be available soon!",
    });
  };

  const handlePostCreated = () => {
    refresh();
  };

  // Refresh data when filters change
  React.useEffect(() => {
    refresh();
  }, [filters, refresh]);

  if (!isOnline) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <WifiOff className="h-16 w-16 text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">No Internet Connection</h3>
        <p className="text-gray-500 text-center">
          Please check your internet connection and try again.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Search Bar */}
      <SocialSearchBar
        onFiltersChange={setFilters}
        totalCount={total}
      />

      {/* Posts Feed */}
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {posts.length === 0 && !loading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-cpscs-blue to-cpscs-gold rounded-full flex items-center justify-center mx-auto mb-4">
              <Wifi className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No posts found</h3>
            <p className="text-gray-500 mb-6">
              {filters.searchQuery 
                ? "Try adjusting your search terms" 
                : "Be the first to share your story!"
              }
            </p>
            {user && !filters.searchQuery && (
              <PostCreator onPostCreated={handlePostCreated} />
            )}
          </div>
        ) : (
          <>
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onLike={handleLike}
                onComment={handleComment}
                onProfileClick={handleProfileClick}
                searchQuery={filters.searchQuery}
              />
            ))}

            {/* Loading indicator */}
            {loading && (
              <div className="flex justify-center py-8">
                <div className="flex items-center space-x-2 text-cpscs-blue">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span>Loading more posts...</span>
                </div>
              </div>
            )}

            {/* End of feed indicator */}
            {!hasMore && posts.length > 0 && (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-gradient-to-br from-cpscs-blue to-cpscs-gold rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
                <p className="text-gray-500">
                  You've reached the end! Thanks for scrolling.
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Floating Post Creator */}
      <PostCreator onPostCreated={handlePostCreated} />
    </div>
  );
};

export default SocialFeed;
