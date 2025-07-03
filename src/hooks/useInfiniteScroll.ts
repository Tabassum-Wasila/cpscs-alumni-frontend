
import { useState, useEffect, useCallback } from 'react';

interface UseInfiniteScrollProps<T> {
  fetchMore: (page: number) => Promise<{ items: T[]; hasMore: boolean; total: number }>;
  initialPage?: number;
  enabled?: boolean;
}

interface UseInfiniteScrollReturn<T> {
  items: T[];
  loading: boolean;
  hasMore: boolean;
  total: number;
  loadMore: () => void;
  refresh: () => void;
}

export function useInfiniteScroll<T>({
  fetchMore,
  initialPage = 1,
  enabled = true
}: UseInfiniteScrollProps<T>): UseInfiniteScrollReturn<T> {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(initialPage);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore || !enabled) return;

    try {
      setLoading(true);
      const result = await fetchMore(page);
      
      setItems(prev => page === 1 ? result.items : [...prev, ...result.items]);
      setHasMore(result.hasMore);
      setTotal(result.total);
      setPage(prev => prev + 1);
    } catch (error) {
      console.error('Error loading more items:', error);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, enabled, page, fetchMore]);

  const refresh = useCallback(() => {
    setItems([]);
    setPage(1);
    setHasMore(true);
    setTotal(0);
  }, []);

  // Initial load
  useEffect(() => {
    if (enabled && items.length === 0) {
      loadMore();
    }
  }, [enabled, items.length, loadMore]);

  // Infinite scroll listener
  useEffect(() => {
    if (!enabled) return;

    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;

      if (scrollTop + clientHeight >= scrollHeight - 100) {
        loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [enabled, loadMore]);

  return {
    items,
    loading,
    hasMore,
    total,
    loadMore,
    refresh
  };
}
