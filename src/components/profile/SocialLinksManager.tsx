import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, X, Facebook, Linkedin, Youtube, Twitter, Instagram, Globe } from 'lucide-react';
import { UserProfile } from '@/services/userService';

interface SocialLinksManagerProps {
  socialLinks: UserProfile['socialLinks'];
  onChange: (socialLinks: UserProfile['socialLinks']) => void;
  className?: string;
}

const SOCIAL_PLATFORMS = [
  { key: 'facebook', label: 'Facebook', icon: Facebook, placeholder: 'https://facebook.com/your-profile' },
  { key: 'linkedin', label: 'LinkedIn', icon: Linkedin, placeholder: 'https://linkedin.com/in/your-profile' },
  { key: 'youtube', label: 'YouTube', icon: Youtube, placeholder: 'https://youtube.com/@your-channel' },
  { key: 'twitter', label: 'Twitter', icon: Twitter, placeholder: 'https://twitter.com/your-handle' },
  { key: 'instagram', label: 'Instagram', icon: Instagram, placeholder: 'https://instagram.com/your-profile' },
  { key: 'website', label: 'Personal Website', icon: Globe, placeholder: 'https://your-website.com' },
];

const SocialLinksManager: React.FC<SocialLinksManagerProps> = ({
  socialLinks = {},
  onChange,
  className = ""
}) => {
  const [newPlatform, setNewPlatform] = useState('');
  const [newUrl, setNewUrl] = useState('');


  const addSocialLink = () => {
    if (!newPlatform || !newUrl) return;

    const updated = {
      ...socialLinks,
      [newPlatform]: ensureHttpPrefix(newUrl)
    };
    
    onChange(updated);
    setNewPlatform('');
    setNewUrl('');
  };

  const removeSocialLink = (platform: string) => {
    const updated = { ...socialLinks };
    delete updated[platform as keyof typeof updated];
    onChange(updated);
  };

  const ensureHttpPrefix = (url: string): string => {
    if (!url) return url;
    url = url.trim();
    // Don't add prefix if it already has http:// or https://
    if (url.match(/^https?:\/\//i)) return url;
    // Add https:// prefix
    return `https://${url}`;
  };

  const updateSocialLink = (platform: string, url: string) => {
    const updated = {
      ...socialLinks,
      [platform]: url
    };
    onChange(updated);
  };

  const getIcon = (platform: string) => {
    const platformConfig = SOCIAL_PLATFORMS.find(p => p.key === platform);
    const IconComponent = platformConfig?.icon || Globe;
    return <IconComponent className="h-4 w-4" />;
  };

  const activePlatforms = Object.entries(socialLinks || {}).filter(([_, url]) => url);
  const availablePlatforms = SOCIAL_PLATFORMS.filter(p => !socialLinks?.[p.key as keyof typeof socialLinks]);

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <Label className="text-base font-medium">Social Media Links</Label>
        <Badge variant="outline" className="text-xs">
          {activePlatforms.length > 0 ? `${activePlatforms.length} connected` : 'At least 1 required'}
        </Badge>
      </div>

      {/* Existing social links */}
      <div className="space-y-3">
        {activePlatforms.map(([platform, url]) => {
          const platformConfig = SOCIAL_PLATFORMS.find(p => p.key === platform);
          // Log for debugging
          console.log(`Social link - ${platform}:`, url);
          return (
            <div key={platform} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg border">
              <div className="flex items-center space-x-2 flex-1">
                {getIcon(platform)}
                <div className="flex-1">
                  <Label className="text-sm font-medium capitalize">{platformConfig?.label || platform}</Label>
                  <Input
                    value={url}
                    onChange={(e) => updateSocialLink(platform, e.target.value)}
                    placeholder={platformConfig?.placeholder}
                    className="mt-1 text-sm"
                  />
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeSocialLink(platform)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          );
        })}
      </div>

      {/* Add new social link */}
      {availablePlatforms.length > 0 && (
        <div className="space-y-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <Label className="text-sm font-medium text-blue-800">Add Social Media Link</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <Select value={newPlatform} onValueChange={setNewPlatform}>
              <SelectTrigger>
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent>
                {availablePlatforms.map((platform) => (
                  <SelectItem key={platform.key} value={platform.key}>
                    <div className="flex items-center space-x-2">
                      <platform.icon className="h-4 w-4" />
                      <span>{platform.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Input
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder={
                newPlatform ? 
                SOCIAL_PLATFORMS.find(p => p.key === newPlatform)?.placeholder : 
                "Enter URL"
              }
              className="md:col-span-1"
            />
            
            <Button
              onClick={addSocialLink}
              disabled={!newPlatform || !newUrl}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        </div>
      )}

      {activePlatforms.length === 0 && (
        <div className="text-center p-4 border border-red-200 bg-red-50 rounded-lg">
          <p className="text-sm text-red-700 font-medium">
            Please add at least one social media link to complete your profile.
          </p>
        </div>
      )}
    </div>
  );
};

export default SocialLinksManager;
