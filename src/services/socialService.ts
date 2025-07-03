
/**
 * Social media service for managing posts, comments, and interactions
 * Mock implementation ready for REST API backend integration
 */

import { SocialPost, SocialComment, CreatePostData, SocialFilters } from '@/types/social';

export class SocialService {
  private static readonly STORAGE_KEY = 'cpscs_social_posts';
  private static readonly COMMENTS_KEY = 'cpscs_social_comments';
  
  /**
   * Get all posts with pagination and filtering
   */
  static async getPosts(
    page: number = 1, 
    limit: number = 15, 
    filters: SocialFilters = { sortBy: 'newest' }
  ): Promise<{ items: SocialPost[]; hasMore: boolean; total: number }> {
    try {
      // Simulate API delay
      await this.delay(300);
      
      let posts = this.getStoredPosts();
      
      // Apply search filter
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        posts = posts.filter(post => 
          post.content.toLowerCase().includes(query) ||
          post.author.name.toLowerCase().includes(query) ||
          post.youtubeData?.title.toLowerCase().includes(query)
        );
      }
      
      // Apply sorting
      posts = this.sortPosts(posts, filters.sortBy);
      
      // Apply pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedPosts = posts.slice(startIndex, endIndex);
      
      return {
        items: paginatedPosts,
        hasMore: endIndex < posts.length,
        total: posts.length
      };
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  }

  /**
   * Create a new post
   */
  static async createPost(postData: CreatePostData, userId: string): Promise<SocialPost> {
    try {
      // Simulate API delay
      await this.delay(500);
      
      const posts = this.getStoredPosts();
      
      // Get user data (in real app, this would come from auth service)
      const author = this.getMockAuthor(userId);
      
      const newPost: SocialPost = {
        id: this.generateId(),
        authorId: userId,
        author,
        content: postData.content,
        mediaType: postData.mediaType,
        imageUrl: postData.imageFile ? URL.createObjectURL(postData.imageFile) : undefined,
        youtubeUrl: postData.youtubeUrl,
        youtubeData: undefined, // Will be populated by YouTube service
        likeCount: 0,
        commentCount: 0,
        createdAt: new Date().toISOString(),
        isLiked: false,
        isExpanded: false
      };
      
      posts.unshift(newPost);
      this.storePosts(posts);
      
      console.log('Post created successfully:', newPost.id);
      return newPost;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  }

  /**
   * Toggle like on a post
   */
  static async toggleLike(postId: string, userId: string): Promise<{ liked: boolean; likeCount: number }> {
    try {
      const posts = this.getStoredPosts();
      const postIndex = posts.findIndex(p => p.id === postId);
      
      if (postIndex === -1) {
        throw new Error('Post not found');
      }
      
      const post = posts[postIndex];
      const wasLiked = post.isLiked || false;
      
      // Toggle like status
      post.isLiked = !wasLiked;
      post.likeCount += wasLiked ? -1 : 1;
      
      posts[postIndex] = post;
      this.storePosts(posts);
      
      return {
        liked: post.isLiked,
        likeCount: post.likeCount
      };
    } catch (error) {
      console.error('Error toggling like:', error);
      throw error;
    }
  }

  /**
   * Get comments for a post
   */
  static async getComments(postId: string): Promise<SocialComment[]> {
    try {
      await this.delay(200);
      
      const comments = this.getStoredComments();
      return comments
        .filter(c => c.postId === postId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  }

  /**
   * Add comment to a post
   */
  static async addComment(postId: string, content: string, userId: string): Promise<SocialComment> {
    try {
      await this.delay(300);
      
      const comments = this.getStoredComments();
      const posts = this.getStoredPosts();
      
      // Create new comment
      const newComment: SocialComment = {
        id: this.generateId(),
        postId,
        authorId: userId,
        author: this.getMockAuthor(userId),
        content,
        createdAt: new Date().toISOString()
      };
      
      comments.push(newComment);
      this.storeComments(comments);
      
      // Update post comment count
      const postIndex = posts.findIndex(p => p.id === postId);
      if (postIndex !== -1) {
        posts[postIndex].commentCount += 1;
        this.storePosts(posts);
      }
      
      return newComment;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  }

  // Private helper methods
  private static getStoredPosts(): SocialPost[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : this.generateMockPosts();
    } catch (error) {
      console.error('Error getting stored posts:', error);
      return this.generateMockPosts();
    }
  }

  private static storePosts(posts: SocialPost[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(posts));
    } catch (error) {
      console.error('Error storing posts:', error);
    }
  }

  private static getStoredComments(): SocialComment[] {
    try {
      const stored = localStorage.getItem(this.COMMENTS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error getting stored comments:', error);
      return [];
    }
  }

  private static storeComments(comments: SocialComment[]): void {
    try {
      localStorage.setItem(this.COMMENTS_KEY, JSON.stringify(comments));
    } catch (error) {
      console.error('Error storing comments:', error);
    }
  }

  private static sortPosts(posts: SocialPost[], sortBy: string): SocialPost[] {
    return [...posts].sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'popular':
          return (b.likeCount + b.commentCount) - (a.likeCount + a.commentCount);
        case 'newest':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
  }

  private static generateMockPosts(): SocialPost[] {
    // Generate some initial mock posts for demo
    return [
      {
        id: '1',
        authorId: 'user1',
        author: {
          name: 'Sarah Ahmed',
          batch: 'SSC 2018, HSC 2020',
          designation: 'Software Engineer',
          company: 'Google'
        },
        content: 'Just got promoted to Senior Software Engineer at Google! 🎉 The journey from CPSCS to Silicon Valley has been incredible. Special thanks to all my teachers who believed in me. #CPSCSAlumni #GoogleLife #CareerMilestone',
        mediaType: 'none',
        likeCount: 47,
        commentCount: 12,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        isLiked: false,
        isExpanded: false
      },
      {
        id: '2',
        authorId: 'user2',
        author: {
          name: 'Rafiq Hassan',
          batch: 'SSC 2016, HSC 2018',
          designation: 'Entrepreneur',
          company: 'Tech Startup'
        },
        content: 'Reminiscing about our days at CPSCS... Remember when we used to play cricket in the small field during lunch break? Those were the golden days! Miss all my classmates and teachers. Planning to organize a reunion soon. Who\'s interested? 🏏',
        mediaType: 'none',
        likeCount: 32,
        commentCount: 8,
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        isLiked: true,
        isExpanded: false
      }
    ];
  }

  private static getMockAuthor(userId: string) {
    // In real app, this would fetch from user service
    const mockAuthors = [
      { name: 'John Doe', batch: 'SSC 2019, HSC 2021', designation: 'Developer', company: 'Tech Corp' },
      { name: 'Jane Smith', batch: 'SSC 2017, HSC 2019', designation: 'Designer', company: 'Creative Agency' },
      { name: 'Ali Rahman', batch: 'SSC 2020, HSC 2022', designation: 'Student', company: 'University' }
    ];
    
    return mockAuthors[Math.floor(Math.random() * mockAuthors.length)];
  }

  private static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
