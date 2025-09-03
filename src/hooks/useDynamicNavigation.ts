import { useQuery } from '@tanstack/react-query';
import { reunionService } from '@/services/reunionService';

interface NavLink {
  name: string;
  path: string;
}

export const useDynamicNavigation = () => {
  const { data: reunionData } = useQuery({
    queryKey: ['active-reunion'],
    queryFn: () => reunionService.getActiveReunion(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000 // 10 minutes
  });

  const baseNavLinks: NavLink[] = [
    { name: 'Home', path: '/' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Events', path: '/events' },
    { name: 'Alumni Directory', path: '/alumni-directory' },
    { name: 'Committee', path: '/committee' },
  ];

  // Insert reunion committee after main committee if reunion is active
  const dynamicNavLinks: NavLink[] = [...baseNavLinks];
  
  if (reunionData?.is_reunion && reunionData?.is_active) {
    const insertIndex = baseNavLinks.findIndex(link => link.path === '/committee') + 1;
    dynamicNavLinks.splice(insertIndex, 0, { name: 'Reunion Committee', path: '/reunion-committee' });
  }

  // Add remaining static links
  dynamicNavLinks.push(
    { name: 'Sponsors', path: '/sponsors' },
    { name: 'Hall of Fame', path: '/hall-of-fame' },
    { name: 'Magazine', path: '/magazine' },
    { name: 'Notice Board', path: '/notice-board' }
  );

  return {
    navLinks: dynamicNavLinks,
    hasActiveReunion: reunionData?.is_reunion && reunionData?.is_active
  };
};