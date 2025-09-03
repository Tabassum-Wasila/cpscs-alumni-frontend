
// Navigation links are now dynamic based on reunion status
// Use useDynamicNavigation hook to get current nav links

export const getTextColorClass = (isScrolled: boolean, isHomePage: boolean) => {
  if (isScrolled) {
    return 'text-gray-900 dark:text-white';
  }
  // White text on home page (dark gradient background), dark text on other pages
  return isHomePage ? 'text-white' : 'text-gray-900 dark:text-white';
};

export const getLinkColorClass = (isScrolled: boolean, isHomePage: boolean) => {
  if (isScrolled) {
    return 'text-gray-700 hover:text-cpscs-blue dark:text-gray-300 dark:hover:text-cpscs-gold';
  }
  // White links on home page, dark links on other pages
  return isHomePage 
    ? 'text-white/90 hover:text-cpscs-gold' 
    : 'text-gray-700 hover:text-cpscs-blue dark:text-gray-300 dark:hover:text-cpscs-gold';
};

export const getLogoTextColorClass = (isScrolled: boolean, isHomePage: boolean) => {
  if (isScrolled) {
    return 'text-cpscs-blue';
  }
  return isHomePage ? 'text-white' : 'text-cpscs-blue';
};
