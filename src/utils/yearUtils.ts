
/**
 * Utility functions for generating dynamic year ranges
 */

/**
 * Generate an array of years from start to end (inclusive)
 * @param start - Starting year
 * @param end - Ending year
 * @returns Array of years as strings in descending order (newest first)
 */
export const generateYears = (start: number, end: number): string[] => {
  return Array.from({ length: end - start + 1 }, (_, i) => (end - i).toString());
};

/**
 * Get the current year
 * @returns Current year as number
 */
export const getCurrentYear = (): number => {
  return new Date().getFullYear();
};

/**
 * Generate SSC batch years from 1979 to current year
 * @returns Array of SSC years as strings
 */
export const getSSCYears = (): string[] => {
  const currentYear = getCurrentYear();
  return generateYears(1979, currentYear);
};

/**
 * Generate HSC batch years from 1981 to current year
 * HSC starts from 1981 as students typically complete HSC 2 years after SSC
 * @returns Array of HSC years as strings
 */
export const getHSCYears = (): string[] => {
  const currentYear = getCurrentYear();
  return generateYears(1981, currentYear);
};
