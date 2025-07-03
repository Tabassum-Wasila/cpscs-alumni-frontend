
import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { SocialFilters } from '@/types/social';

interface SocialSearchBarProps {
  onFiltersChange: (filters: SocialFilters) => void;
  totalCount: number;
  className?: string;
}

const SocialSearchBar: React.FC<SocialSearchBarProps> = ({
  onFiltersChange,
  totalCount,
  className
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'popular'>('newest');
  const scrollDirection = useScrollDirection();

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onFiltersChange({ searchQuery: value, sortBy });
  };

  const handleSortChange = (value: 'newest' | 'oldest' | 'popular') => {
    setSortBy(value);
    onFiltersChange({ searchQuery, sortBy: value });
  };

  return (
    <div className={cn(
      "sticky top-24 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200 py-4 transition-transform duration-300",
      scrollDirection === 'down' ? '-translate-y-full' : 'translate-y-0',
      className
    )}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search posts, authors..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 pr-4 py-2 w-full"
            />
          </div>

          {/* Sort Options */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <Select value={sortBy} onValueChange={handleSortChange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="popular">Most Liked</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Results Count */}
          <div className="text-sm text-gray-500">
            {totalCount} {totalCount === 1 ? 'post' : 'posts'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialSearchBar;
