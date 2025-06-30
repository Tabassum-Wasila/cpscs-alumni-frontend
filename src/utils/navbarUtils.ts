
export const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'Events', path: '/events' },
  { name: 'Alumni Directory', path: '/alumni-directory' },
  { name: 'Committee', path: '/committee' },
  { name: 'Sponsors', path: '/sponsors' },
  { name: 'Hall of Fame', path: '/hall-of-fame' },
  { name: 'Magazine', path: '/magazine' },
  { name: 'Notice Board', path: '/notice-board' },
];

export const getTextColorClass = (isScrolled: boolean) => {
  if (isScrolled) {
    return 'text-gray-900 dark:text-white';
  }
  return 'text-white';
};

export const getLinkColorClass = (isScrolled: boolean) => {
  if (isScrolled) {
    return 'text-gray-700 hover:text-cpscs-blue dark:text-gray-300 dark:hover:text-cpscs-gold';
  }
  return 'text-white/90 hover:text-cpscs-gold';
};

export const getLogoTextColorClass = (isScrolled: boolean) => {
  if (isScrolled) {
    return 'text-cpscs-blue';
  }
  return 'text-white';
};
