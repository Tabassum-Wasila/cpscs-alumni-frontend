
import React, { useState } from 'react';
import { Search, Filter, Calendar, Tag, Images } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SearchFilters } from '@/services/galleryService';

interface GallerySearchProps {
  onFiltersChange: (filters: SearchFilters) => void;
  availableTags: string[];
  imageCount: number;
}

const GallerySearch: React.FC<GallerySearchProps> = ({ onFiltersChange, availableTags, imageCount }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSort, setSelectedSort] = useState<'newest' | 'oldest'>('newest');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    updateFilters({ query: value });
  };

  const handleSortChange = (value: 'newest' | 'oldest') => {
    setSelectedSort(value);
    updateFilters({ sortBy: value });
  };

  const updateFilters = (partialFilters: Partial<SearchFilters>) => {
    const filters: SearchFilters = {
      query: searchQuery,
      sortBy: selectedSort,
      tags: selectedTags,
      ...partialFilters
    };
    onFiltersChange(filters);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedSort('newest');
    setSelectedTags([]);
    onFiltersChange({ sortBy: 'newest' });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        {/* Image Count */}
        <div className="flex items-center gap-2 text-gray-600 font-medium whitespace-nowrap">
          <Images className="h-4 w-4 text-cpscs-blue" />
          <span>{imageCount} photos</span>
        </div>

        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search by caption, tags, or description..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Sort Dropdown */}
        <Select value={selectedSort} onValueChange={handleSortChange}>
          <SelectTrigger className="w-48">
            <Calendar className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
          </SelectContent>
        </Select>

        {/* Filter Toggle */}
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
        </Button>

        {/* Clear Filters */}
        <Button variant="ghost" onClick={clearFilters} className="text-sm">
          Clear All
        </Button>
      </div>

      {/* Expanded Filters */}
      {showFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2 items-center">
            <Tag className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700 mr-2">Tags:</span>
            {availableTags.slice(0, 10).map((tag) => (
              <Button
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  const newTags = selectedTags.includes(tag)
                    ? selectedTags.filter(t => t !== tag)
                    : [...selectedTags, tag];
                  setSelectedTags(newTags);
                  updateFilters({ tags: newTags });
                }}
                className="text-xs"
              >
                {tag}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GallerySearch;
