
import React, { useState, useEffect } from 'react';
import { Play, Loader2, AlertCircle } from 'lucide-react';
import { YouTubeService, YouTubeVideoData } from '@/services/youtubeService';
import { cn } from '@/lib/utils';

interface YouTubeEmbedProps {
  url: string;
  className?: string;
  autoplay?: boolean;
}

const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({ 
  url, 
  className,
  autoplay = false 
}) => {
  const [videoData, setVideoData] = useState<YouTubeVideoData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const loadVideoData = async () => {
      try {
        setIsLoading(true);
        setError('');
        
        const data = await YouTubeService.validateAndExtractData(url);
        
        if (data) {
          setVideoData(data);
        } else {
          setError('Invalid YouTube URL');
        }
      } catch (err) {
        console.error('Error loading video data:', err);
        setError('Failed to load video');
      } finally {
        setIsLoading(false);
      }
    };

    if (url) {
      loadVideoData();
    }
  }, [url]);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  if (isLoading) {
    return (
      <div className={cn(
        "aspect-video bg-gray-100 rounded-lg flex items-center justify-center",
        className
      )}>
        <div className="flex flex-col items-center space-y-2">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          <span className="text-sm text-gray-500">Loading video...</span>
        </div>
      </div>
    );
  }

  if (error || !videoData) {
    return (
      <div className={cn(
        "aspect-video bg-red-50 rounded-lg flex items-center justify-center border border-red-200",
        className
      )}>
        <div className="flex flex-col items-center space-y-2 text-red-600">
          <AlertCircle className="w-8 h-8" />
          <span className="text-sm">{error || 'Failed to load video'}</span>
        </div>
      </div>
    );
  }

  if (!isPlaying) {
    return (
      <div 
        className={cn(
          "relative aspect-video bg-black rounded-lg overflow-hidden cursor-pointer group",
          className
        )}
        onClick={handlePlay}
      >
        {/* Thumbnail */}
        <img
          src={videoData.thumbnail}
          alt={videoData.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        
        {/* Play overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center group-hover:bg-opacity-30 transition-all duration-200">
          <div className="bg-red-600 rounded-full p-4 group-hover:scale-110 transition-transform duration-200 shadow-lg">
            <Play className="w-8 h-8 text-white fill-current ml-1" />
          </div>
        </div>
        
        {/* Video info */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
          <h3 className="text-white font-medium text-sm line-clamp-2">
            {videoData.title}
          </h3>
        </div>
        
        {/* YouTube logo */}
        <div className="absolute top-3 right-3 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
          YouTube
        </div>
      </div>
    );
  }

  return (
    <div className={cn("aspect-video rounded-lg overflow-hidden", className)}>
      <iframe
        src={videoData.embedUrl}
        title={videoData.title}
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
      />
    </div>
  );
};

export default YouTubeEmbed;
