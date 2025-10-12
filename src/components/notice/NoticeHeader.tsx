import React from 'react';
import { Search, SortDesc, SortAsc, Filter } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { NoticeFilters } from '../../types/notice';

interface NoticeHeaderProps {
  filters: NoticeFilters;
  onFiltersChange: (filters: NoticeFilters) => void;
  totalNotices: number;
}

const NoticeHeader: React.FC<NoticeHeaderProps> = ({ filters, onFiltersChange, totalNotices }) => {
  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, searchQuery: value });
  };

  const handleSortChange = (value: string) => {
    onFiltersChange({ ...filters, sortBy: value as NoticeFilters['sortBy'] });
  };

  const handleCategoryChange = (value: string) => {
    onFiltersChange({ ...filters, category: value === 'all' ? undefined : value });
  };


  return (
    <div className="bg-background/80 backdrop-blur-sm border-b border-border/50 py-4 px-6 sticky top-0 z-40">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search notices..."
            value={filters.searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 h-9 text-sm"
          />
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          {/* Results count */}
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            {totalNotices} notice{totalNotices !== 1 ? 's' : ''}
          </span>

          {/* Category Filter */}
          <Select value={filters.category || 'all'} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-36 h-9 text-sm">
              <Filter className="h-3 w-3 mr-1" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="announcement">Announcement</SelectItem>
              <SelectItem value="event">Event</SelectItem>
              <SelectItem value="general">General</SelectItem>
              <SelectItem value="spotlight">Spotlight</SelectItem>
            </SelectContent>
          </Select>

          {/* Sort */}
          <Select value={filters.sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-32 h-9 text-sm">
              {filters.sortBy === 'date-desc' ? (
                <SortDesc className="h-3 w-3 mr-1" />
              ) : (
                <SortAsc className="h-3 w-3 mr-1" />
              )}
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date-desc">Latest First</SelectItem>
              <SelectItem value="date-asc">Oldest First</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default NoticeHeader;