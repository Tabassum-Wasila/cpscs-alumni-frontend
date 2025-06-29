
import React, { useState, useMemo } from 'react';
import { PenTool, BookOpen, Heart, Users } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MagazineCard from '../components/magazine/MagazineCard';
import MagazineModal from '../components/magazine/MagazineModal';
import MagazineSearch from '../components/magazine/MagazineSearch';
import { Button } from '@/components/ui/button';
import { magazineArticles } from '@/data/magazineData';
import { MagazineArticle, MagazineFilters } from '@/types/magazine';

const Magazine = () => {
  const [selectedArticle, setSelectedArticle] = useState<MagazineArticle | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState<MagazineFilters>({ sortBy: 'newest' });
  const [articles, setArticles] = useState(magazineArticles);

  const filteredArticles = useMemo(() => {
    let filtered = [...articles];

    // Search filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(article => 
        article.title.toLowerCase().includes(query) ||
        article.excerpt.toLowerCase().includes(query) ||
        article.author.name.toLowerCase().includes(query) ||
        article.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Category filter
    if (filters.category) {
      filtered = filtered.filter(article => article.category === filters.category);
    }

    // Author filter
    if (filters.author) {
      filtered = filtered.filter(article => 
        article.author.name.toLowerCase().replace(/\s+/g, '-') === filters.author
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'oldest':
          return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
        case 'popular':
          return b.loveCount - a.loveCount;
        case 'trending':
          return (b.loveCount + b.viewCount) - (a.loveCount + a.viewCount);
        case 'newest':
        default:
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      }
    });

    return filtered;
  }, [articles, filters]);

  const featuredArticles = filteredArticles.filter(article => article.featured);
  const regularArticles = filteredArticles.filter(article => !article.featured);

  const handleCardClick = (article: MagazineArticle) => {
    setSelectedArticle(article);
    setIsModalOpen(true);
    
    // Increment view count
    setArticles(prev => prev.map(a => 
      a.id === article.id ? { ...a, viewCount: a.viewCount + 1 } : a
    ));
  };

  const handleLoveClick = (articleId: string) => {
    setArticles(prev => prev.map(article => 
      article.id === articleId 
        ? { ...article, loveCount: article.loveCount + 10 } // 10x multiplier
        : article
    ));
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedArticle(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-cpscs-light via-white to-cpscs-light/50">
      <Navbar />
      
      <div className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <BookOpen className="h-12 w-12 text-cpscs-gold" />
              <h1 className="text-5xl font-bold bg-gradient-to-r from-cpscs-blue to-cpscs-blue/80 bg-clip-text text-transparent">
                CPSCS Magazine
              </h1>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
              Our digital literary hub where alumni share their journeys, achievements, memories, and insights. 
              From classroom memories to Silicon Valley success stories, discover the diverse tapestry of CPSCS alumni experiences.
            </p>
            
            {/* Stats */}
            <div className="flex items-center justify-center gap-8 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-cpscs-blue">{articles.length}</div>
                <div className="text-sm text-gray-600">Articles Published</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-cpscs-blue">
                  {articles.reduce((sum, article) => sum + article.loveCount, 0).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Community Loves</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-cpscs-blue">
                  {articles.reduce((sum, article) => sum + article.viewCount, 0).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Total Reads</div>
              </div>
            </div>

            {/* CTA Button */}
            <Button 
              className="bg-gradient-to-r from-cpscs-gold to-yellow-400 hover:from-cpscs-gold/90 hover:to-yellow-400/90 text-cpscs-blue font-bold px-8 py-3 rounded-full text-lg transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <PenTool className="h-5 w-5 mr-2" />
              Share Your Story
            </Button>
          </div>

          {/* Search and Filters */}
          <MagazineSearch 
            onFiltersChange={setFilters}
            totalCount={filteredArticles.length}
          />

          {/* Featured Articles */}
          {featuredArticles.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-cpscs-gold to-yellow-400 rounded-full flex items-center justify-center">
                  <Heart className="h-4 w-4 text-cpscs-blue" />
                </div>
                <h2 className="text-2xl font-bold text-cpscs-blue">Featured Stories</h2>
              </div>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {featuredArticles.map((article) => (
                  <MagazineCard
                    key={article.id}
                    article={article}
                    onCardClick={handleCardClick}
                    onLoveClick={handleLoveClick}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Regular Articles */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-cpscs-blue to-cpscs-blue/80 rounded-full flex items-center justify-center">
                <Users className="h-4 w-4 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-cpscs-blue">Latest Articles</h2>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {regularArticles.map((article) => (
                <MagazineCard
                  key={article.id}
                  article={article}
                  onCardClick={handleCardClick}
                  onLoveClick={handleLoveClick}
                />
              ))}
            </div>
          </div>

          {/* No Results */}
          {filteredArticles.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No articles found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          )}

          {/* Bottom CTA */}
          <div className="text-center mt-16 p-8 bg-gradient-to-r from-cpscs-blue to-cpscs-blue/90 rounded-2xl text-white">
            <h3 className="text-2xl font-bold mb-4">Have a story to tell?</h3>
            <p className="text-lg mb-6 opacity-90">
              Join our community of storytellers and share your journey with fellow CPSCS alumni
            </p>
            <Button 
              className="bg-cpscs-gold hover:bg-cpscs-gold/90 text-cpscs-blue font-bold px-8 py-3 rounded-full text-lg transition-all duration-300 hover:scale-105"
            >
              <PenTool className="h-5 w-5 mr-2" />
              Upload Your Own Writing
            </Button>
          </div>
        </div>
      </div>

      {/* Article Modal */}
      <MagazineModal
        article={selectedArticle}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onLoveClick={handleLoveClick}
      />
      
      <Footer />
    </div>
  );
};

export default Magazine;
