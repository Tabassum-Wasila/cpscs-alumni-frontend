
import React, { useState } from 'react';
import { Plus, X, Image, Youtube, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { SocialService } from '@/services/socialService';
import { YouTubeService } from '@/services/youtubeService';
import { CreatePostData } from '@/types/social';
import RichTextEditor from './RichTextEditor';
import EnhancedFileUpload from '../EnhancedFileUpload';
import { useToast } from '@/hooks/use-toast';

interface PostCreatorProps {
  onPostCreated: () => void;
}

const PostCreator: React.FC<PostCreatorProps> = ({ onPostCreated }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState('');
  const [mediaType, setMediaType] = useState<'none' | 'image' | 'youtube'>('none');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [youtubeError, setYoutubeError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const resetForm = () => {
    setContent('');
    setMediaType('none');
    setSelectedImage(null);
    setYoutubeUrl('');
    setYoutubeError('');
  };

  const handleClose = () => {
    setIsOpen(false);
    resetForm();
  };

  const handleMediaTypeChange = (type: 'none' | 'image' | 'youtube') => {
    setMediaType(type);
    if (type !== 'image') setSelectedImage(null);
    if (type !== 'youtube') {
      setYoutubeUrl('');
      setYoutubeError('');
    }
  };

  const handleYoutubeUrlChange = (url: string) => {
    setYoutubeUrl(url);
    if (url && !YouTubeService.isValidYouTubeUrl(url)) {
      setYoutubeError('Please enter a valid YouTube URL');
    } else {
      setYoutubeError('');
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to create a post",
        variant: "destructive"
      });
      return;
    }

    if (!content.trim()) {
      toast({
        title: "Content Required",
        description: "Please write some content for your post",
        variant: "destructive"
      });
      return;
    }

    if (mediaType === 'youtube' && youtubeUrl && !YouTubeService.isValidYouTubeUrl(youtubeUrl)) {
      toast({
        title: "Invalid YouTube URL",
        description: "Please enter a valid YouTube URL",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const postData: CreatePostData = {
        content: content.trim(),
        mediaType,
        imageFile: mediaType === 'image' ? selectedImage || undefined : undefined,
        youtubeUrl: mediaType === 'youtube' ? youtubeUrl : undefined
      };

      await SocialService.createPost(postData, user.id);
      
      toast({
        title: "Post Created!",
        description: "Your post has been published successfully",
      });

      handleClose();
      onPostCreated();
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = content.trim() && 
    (mediaType === 'none' || 
     (mediaType === 'image' && selectedImage) || 
     (mediaType === 'youtube' && youtubeUrl && !youtubeError));

  if (!user) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => window.location.href = '/login'}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-cpscs-blue to-cpscs-gold hover:from-cpscs-blue/90 hover:to-cpscs-gold/90 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
        >
          <Plus className="h-6 w-6 text-white" />
        </Button>
      </div>
    );
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <div className="fixed bottom-6 right-6 z-50">
            <Button
              className="w-14 h-14 rounded-full bg-gradient-to-r from-cpscs-blue to-cpscs-gold hover:from-cpscs-blue/90 hover:to-cpscs-gold/90 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
            >
              <Plus className="h-6 w-6 text-white" />
            </Button>
          </div>
        </DialogTrigger>

        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-cpscs-blue">
              Share Your Story
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Rich Text Editor */}
            <div>
              <Label htmlFor="content" className="text-sm font-medium text-gray-700 mb-2 block">
                What's on your mind?
              </Label>
              <RichTextEditor
                value={content}
                onChange={setContent}
                placeholder="Share your thoughts, memories, achievements, or stories with fellow CPSCS alumni..."
                className="min-h-[200px]"
              />
            </div>

            {/* Media Type Selection */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Add Media (Optional)
              </Label>
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant={mediaType === 'none' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleMediaTypeChange('none')}
                >
                  Text Only
                </Button>
                <Button
                  type="button"
                  variant={mediaType === 'image' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleMediaTypeChange('image')}
                >
                  <Image className="h-4 w-4 mr-1" />
                  Photo
                </Button>
                <Button
                  type="button"
                  variant={mediaType === 'youtube' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleMediaTypeChange('youtube')}
                >
                  <Youtube className="h-4 w-4 mr-1" />
                  YouTube
                </Button>
              </div>
            </div>

            {/* Image Upload */}
            {mediaType === 'image' && (
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Upload Photo
                </Label>
                <EnhancedFileUpload
                  onFileSelect={setSelectedImage}
                  maxSizeMB={5}
                  accept="image/*"
                />
              </div>
            )}

            {/* YouTube URL Input */}
            {mediaType === 'youtube' && (
              <div>
                <Label htmlFor="youtube-url" className="text-sm font-medium text-gray-700 mb-2 block">
                  YouTube URL
                </Label>
                <Input
                  id="youtube-url"
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={youtubeUrl}
                  onChange={(e) => handleYoutubeUrlChange(e.target.value)}
                  className={youtubeError ? 'border-red-500' : ''}
                />
                {youtubeError && (
                  <p className="text-sm text-red-600 mt-1">{youtubeError}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Supports regular videos, YouTube Shorts, and playlists
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!canSubmit || isSubmitting}
                className="bg-cpscs-blue hover:bg-cpscs-blue/90"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Publish Post
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PostCreator;
