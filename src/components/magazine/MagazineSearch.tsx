
import React, { useState } from 'react';
import { Search, Filter, Calendar, BookOpen, User, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MagazineFilters } from '@/types/magazine';

interface MagazineSearchProps {
  onFiltersChange: (filters: MagazineFilters) => void;
  totalCount: number;
}

const MagazineSearch: React.FC<MagazineSearchProps> = ({ onFiltersChange, totalCount }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSort, setSelectedSort] = useState<'newest' | 'oldest' | 'popular' | 'trending'>('newest');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedAuthor, setSelectedAuthor] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    updateFilters({ searchQuery: value });
  };

  const handleSortChange = (value: 'newest' | 'oldest' | 'popular' | 'trending') => {
    setSelectedSort(value);
    updateFilters({ sortBy: value });
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    updateFilters({ category: value || undefined });
  };

  const handleAuthorChange = (value: string) => {
    setSelectedAuthor(value);
    updateFilters({ author: value || undefined });
  };

  const updateFilters = (partialFilters: Partial<MagazineFilters>) => {
    const filters: MagazineFilters = {
      searchQuery,
      sortBy: selectedSort,
      category: selectedCategory || undefined,
      author: selectedAuthor || undefined,
      ...partialFilters
    };
    onFiltersChange(filters);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedSort('newest');
    setSelectedCategory('');
    setSelectedAuthor('');
    onFiltersChange({ sortBy: 'newest' });
  };

  const categories = [
    { value: 'story', label: 'Stories' },
    { value: 'achievement', label: 'Achievements' },
    { value: 'career', label: 'Career' },
    { value: 'memories', label: 'Memories' },
    { value: 'innovation', label: 'Innovation' },
    { value: 'community', label: 'Community' }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First', icon: Calendar },
    { value: 'oldest', label: 'Oldest First', icon: Calendar },
    { value: 'popular', label: 'Most Popular', icon: TrendingUp },
    { value: 'trending', label: 'Trending', icon: TrendingUp }
  ];

  const getSortIcon = (sortType: string) => {
    const option = sortOptions.find(opt => opt.value === sortType);
    return option ? option.icon : Calendar;
  };

  const SortIcon = getSortIcon(selectedSort);

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-8 border border-white/40">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        {/* Magazine Info */}
        <div className="flex items-center gap-3 text-cpscs-blue font-bold whitespace-nowrap">
          <BookOpen className="h-5 w-5 text-cpscs-gold" />
          <span className="text-lg">CPSCS Magazine</span>
          <span className="text-sm font-normal text-gray-600">({totalCount} articles)</span>
        </div>

        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search articles, authors, or topics..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 bg-white/60 border-white/50 focus:bg-white/90 transition-all duration-300"
          />
        </div>

        {/* Sort Dropdown */}
        <Select value={selectedSort} onValueChange={handleSortChange}>
          <SelectTrigger className="w-48 bg-white/60 border-white/50">
            <SortIcon className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => {
              const Icon = option.icon;
              return (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {option.label}
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>

        {/* Filter Toggle */}
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 bg-white/60 border-white/50 hover:bg-white/90"
        >
          <Filter className="h-4 w-4" />
          Filters
        </Button>

        {/* Clear Filters */}
        <Button 
          variant="ghost" 
          onClick={clearFilters} 
          className="text-sm hover:bg-white/60"
        >
          Clear All
        </Button>
      </div>

      {/* Expanded Filters */}
      {showFilters && (
        <div className="mt-6 pt-6 border-t border-gray-200/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                <SelectTrigger className="bg-white/60 border-white/50">
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Author</label>
              <Select value={selectedAuthor} onValueChange={handleAuthorChange}>
                <SelectTrigger className="bg-white/60 border-white/50">
                  <User className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="All authors" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All authors</SelectItem>
                  <SelectItem value="rahul-ahmed">Rahul Ahmed</SelectItem>
                  <SelectItem value="fatima-khatun">Fatima Khatun</SelectItem>
                  <SelectItem value="mohammad-karim">Mohammad Karim</SelectItem>
                  <SelectItem value="ayesha-rahman">Ayesha Rahman</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MagazineSearch;
