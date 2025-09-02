
import React, { useState } from 'react';
import { Search, Filter, Calendar, Users, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SponsorFilters } from '@/types/sponsors';

interface SponsorSearchProps {
  onFiltersChange: (filters: SponsorFilters) => void;
  totalCount: number;
  activeTab: 'organizations' | 'patrons';
}

const SponsorSearch: React.FC<SponsorSearchProps> = ({ onFiltersChange, totalCount, activeTab }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSort, setSelectedSort] = useState<'newest' | 'oldest'>('newest');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    updateFilters({ searchQuery: value });
  };

  const handleSortChange = (value: 'newest' | 'oldest') => {
    setSelectedSort(value);
    updateFilters({ sortBy: value });
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    updateFilters({ category: value === 'all' ? undefined : value });
  };

  const updateFilters = (partialFilters: Partial<SponsorFilters>) => {
    const filters: SponsorFilters = {
      searchQuery,
      sortBy: selectedSort,
      category: selectedCategory || undefined,
      ...partialFilters
    };
    onFiltersChange(filters);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedSort('newest');
    setSelectedCategory('all');
    onFiltersChange({ sortBy: 'newest' });
  };

  const categories = activeTab === 'organizations' 
    ? ['Banking', 'Technology', 'Telecommunications', 'Finance', 'Healthcare', 'Education']
    : ['Technology', 'Finance', 'Healthcare', 'Education', 'Government', 'NGO'];

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-8 border border-white/30">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        {/* Count Display */}
        <div className="flex items-center gap-2 text-gray-600 font-medium whitespace-nowrap">
          {activeTab === 'organizations' ? (
            <Building2 className="h-4 w-4 text-cpscs-blue" />
          ) : (
            <Users className="h-4 w-4 text-cpscs-blue" />
          )}
          <span>{totalCount} {activeTab === 'organizations' ? 'organizations' : 'patrons'}</span>
        </div>

        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 bg-white/50 border-white/40 focus:bg-white/80 transition-all duration-300"
          />
        </div>

        {/* Sort Dropdown */}
        <Select value={selectedSort} onValueChange={handleSortChange}>
          <SelectTrigger className="w-48 bg-white/50 border-white/40">
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
          className="flex items-center gap-2 bg-white/50 border-white/40 hover:bg-white/80"
        >
          <Filter className="h-4 w-4" />
          Filters
        </Button>

        {/* Clear Filters */}
        <Button 
          variant="ghost" 
          onClick={clearFilters} 
          className="text-sm hover:bg-white/50"
        >
          Clear All
        </Button>
      </div>

      {/* Expanded Filters */}
      {showFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200/50">
          <div className="flex flex-wrap gap-4 items-center">
            <span className="text-sm font-medium text-gray-700">Category:</span>
            <Select value={selectedCategory} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-48 bg-white/50 border-white/40">
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
};

export default SponsorSearch;
