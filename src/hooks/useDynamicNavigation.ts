import { useQuery } from '@tanstack/react-query';
import { reunionCommitteeService } from '@/services/reunionCommitteeService';

interface NavLink {
  name: string;
  path: string;
}

export const useDynamicNavigation = () => {
  // Check for an active reunion by asking the reunion committee API.
  // If a reunion committee exists (non-null), treat that as an active reunion
  // for navigation purposes.
  const { data: reunionCommitteeData } = useQuery({
    queryKey: ['active-reunion-committee'],
    queryFn: () => reunionCommitteeService.getActiveReunionCommittee(),
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
  
  // If the reunion committee API returned a non-null object, show the link.
  if (reunionCommitteeData) {
    const insertIndex = baseNavLinks.findIndex(link => link.path === '/committee') + 1;
    dynamicNavLinks.splice(insertIndex, 0, { name: 'Reunion Committee', path: '/reunion-committee' });
  }

  // Add remaining static links
  dynamicNavLinks.push(
    // { name: 'Sponsors', path: '/sponsors' },
    { name: 'Hall of Fame', path: '/hall-of-fame' },
    { name: 'Magazine', path: '/magazine' },
    { name: 'Notice Board', path: '/notice-board' }
  );

  return {
    navLinks: dynamicNavLinks,
    hasActiveReunion: !!reunionCommitteeData
  };
};