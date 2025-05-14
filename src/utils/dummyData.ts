
import { User } from '@/contexts/AuthContext';

// Demo user flag key for localStorage
export const DEMO_USERS_KEY = 'cpscs_demo_users_active';

// Base URLs for profile images
const profileImages = [
  'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
  'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
  'https://images.unsplash.com/photo-1518770660439-4636190af475',
  'https://images.unsplash.com/photo-1461749280684-dccba630e2f6',
  'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d',
  'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
  'https://images.unsplash.com/photo-1485827404703-89b55fcc595e',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5',
  'https://images.unsplash.com/photo-1531297484001-80022131f5a1',
  'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7'
];

// Common professions for variation
const professions = [
  'Software Engineer', 'Doctor', 'Teacher', 'Business Analyst', 
  'Data Scientist', 'Professor', 'Entrepreneur', 'Civil Engineer', 
  'Research Scientist', 'Marketing Manager', 'Financial Analyst', 
  'Pharmacist', 'Architect', 'Product Manager', 'UX Designer'
];

// Organizations for more context
const organizations = [
  'Google', 'Microsoft', 'Apple', 'Meta', 'Amazon', 
  'Square Health', 'BRAC University', 'Bangabandhu Sheikh Mujib Medical University',
  'Bangladesh University of Engineering & Technology', 'North South University',
  'JP Morgan', 'Goldman Sachs', 'Uber', 'Airbnb', 'Grameenphone',
  'Robi Axiata', 'Nvidia', 'Netflix', 'Pathao', 'Chaldal'
];

// Countries for geographic diversity
const countries = [
  'Bangladesh', 'USA', 'Canada', 'UK', 'Australia', 
  'Singapore', 'UAE', 'Germany', 'Japan', 'India'
];

// Cities by country
const cities: Record<string, string[]> = {
  'Bangladesh': ['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna'],
  'USA': ['New York', 'San Francisco', 'Los Angeles', 'Seattle', 'Boston'],
  'Canada': ['Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Ottawa'],
  'UK': ['London', 'Manchester', 'Birmingham', 'Edinburgh', 'Glasgow'],
  'Australia': ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide'],
  'Singapore': ['Singapore'],
  'UAE': ['Dubai', 'Abu Dhabi', 'Sharjah'],
  'Germany': ['Berlin', 'Munich', 'Hamburg', 'Frankfurt'],
  'Japan': ['Tokyo', 'Osaka', 'Kyoto'],
  'India': ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Kolkata']
};

// Common expertise areas
const expertiseAreas = [
  'Machine Learning', 'Web Development', 'Mobile App Development', 'Cloud Computing',
  'Data Science', 'DevOps', 'Cybersecurity', 'Digital Marketing', 'Finance',
  'Healthcare', 'Education Technology', 'Renewable Energy', 'Blockchain',
  'Artificial Intelligence', 'UX/UI Design', 'Content Creation', 'Business Strategy',
  'E-commerce', 'IoT', 'Entrepreneurship', 'Consulting', 'Project Management',
  'Human Resources', 'Research', 'Teaching', 'Public Speaking', 'Leadership'
];

// Generate random SSC/HSC years in a realistic range
const generateSchoolYears = () => {
  const currentYear = new Date().getFullYear();
  const sscYear = Math.floor(Math.random() * 20) + (currentYear - 25);
  const hscYearGap = Math.floor(Math.random() * 2) + 2; // 2-3 years after SSC
  return {
    sscYear: sscYear.toString(),
    hscYear: (sscYear + hscYearGap).toString()
  };
};

// Generate realistic looking names
const firstNames = [
  'Anik', 'Farhan', 'Sadia', 'Nusrat', 'Tanvir', 'Ishrat', 'Mehedi',
  'Nazia', 'Rahat', 'Jannatul', 'Sakib', 'Fatima', 'Omar', 'Tasnim',
  'Imran', 'Lamia', 'Kamal', 'Samira', 'Saif', 'Noor', 'Rafiq', 'Sanjida',
  'Mahmud', 'Naima', 'Ahmed', 'Rimi', 'Adnan', 'Sharmin', 'Fahad', 'Maria'
];

const lastNames = [
  'Rahman', 'Ahmed', 'Khan', 'Akter', 'Hossain', 'Islam', 'Karim',
  'Chowdhury', 'Alam', 'Ali', 'Begum', 'Siddiqui', 'Miah', 'Jahan',
  'Khatun', 'Uddin', 'Azad', 'Bhuiyan', 'Akhtar', 'Sultana', 'Musa', 'Sarker'
];

// Get random item from array
const randomItem = <T,>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

// Get random subset of array items
const randomSubset = <T,>(array: T[], min = 1, max = 3): T[] => {
  const count = Math.floor(Math.random() * (max - min + 1)) + min;
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Generate a random bio
const generateBio = (name: string, profession: string, years: { sscYear: string }) => {
  const bios = [
    `${name} is a passionate ${profession} with over ${new Date().getFullYear() - parseInt(years.sscYear) - 4} years of experience. Graduated from CPSCS in the class of ${years.sscYear} with fond memories.`,
    `A CPSCS alumnus from the class of ${years.sscYear}, ${name} has built a successful career as a ${profession}. Always credits the school for building a strong foundation.`,
    `After graduating from CPSCS, ${name} pursued higher studies and is now working as a ${profession}. Loves to connect with fellow alumni and give back to the community.`,
    `${name} is an experienced ${profession} who graduated from CPSCS in ${years.sscYear}. Passionate about mentoring young professionals and staying connected with the alma mater.`,
    `A proud CPSCS graduate (Class of ${years.sscYear}), ${name} has been working in the field of ${profession.toLowerCase()} for several years. Enjoys networking with fellow alumni.`
  ];
  return randomItem(bios);
};

// Generate a random dummy user
export const generateDummyUser = (id: string): User => {
  const firstName = randomItem(firstNames);
  const lastName = randomItem(lastNames);
  const fullName = `${firstName} ${lastName}`;
  
  const years = generateSchoolYears();
  const profession = randomItem(professions);
  const organization = randomItem(organizations);
  const country = randomItem(countries);
  const city = country in cities ? randomItem(cities[country]) : '';
  
  const expertise = randomSubset(expertiseAreas, 2, 5);
  
  // 40% chance to be a mentor
  const willingToMentor = Math.random() < 0.4;
  
  // Only add mentorship areas if willing to mentor
  const mentorshipAreas = willingToMentor ? randomSubset(expertise, 1, 3) : [];
  
  // Generate user emails based on name
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(Math.random() * 100)}@example.com`;
  
  // Create phone number for some users (70% chance)
  const hasPhone = Math.random() < 0.7;
  const phoneNumber = hasPhone ? `+880 1${Math.floor(Math.random() * 9) + 1}${Math.random().toString().substring(2, 10)}` : '';
  
  // Random profile picture
  const profilePicture = `${randomItem(profileImages)}?auto=format&fit=crop&w=500&h=500`;
  
  return {
    id,
    fullName,
    email,
    sscYear: years.sscYear,
    hscYear: years.hscYear,
    isDemoUser: true, // Mark as demo user for easy filtering
    isAuthenticated: true, // Add missing property
    hasMembership: true, // Add missing property
    profile: {
      profession,
      organization,
      country,
      city,
      expertise,
      bio: generateBio(firstName, profession, years),
      willingToMentor,
      mentorshipAreas,
      phoneNumber,
      profilePicture,
      socialLinks: {
        facebook: Math.random() > 0.3 ? `https://facebook.com/${firstName.toLowerCase()}${lastName.toLowerCase()}` : '',
        linkedin: Math.random() > 0.2 ? `https://linkedin.com/in/${firstName.toLowerCase()}-${lastName.toLowerCase()}` : '',
        youtube: Math.random() > 0.8 ? `https://youtube.com/@${firstName.toLowerCase()}${lastName.toLowerCase()}` : '',
      }
    }
  };
};

// Generate multiple dummy users
export const generateDummyUsers = (count: number): User[] => {
  return Array.from({ length: count }, (_, i) => {
    const id = `demo-user-${i + 1}-${Date.now().toString(36)}`;
    return generateDummyUser(id);
  });
};

// Check if demo mode is active
export const isDemoModeActive = (): boolean => {
  return localStorage.getItem(DEMO_USERS_KEY) === 'true';
};

// Add demo users to localStorage
export const addDemoUsers = (count: number = 20): void => {
  // Check existing users in localStorage
  const existingUsersJson = localStorage.getItem('users');
  let users: User[] = existingUsersJson ? JSON.parse(existingUsersJson) : [];
  
  // Generate and add dummy users
  const dummyUsers = generateDummyUsers(count);
  
  // Merge with existing users
  users = [...users, ...dummyUsers];
  
  // Save back to localStorage
  localStorage.setItem('users', JSON.stringify(users));
  
  // Mark demo mode as active
  localStorage.setItem(DEMO_USERS_KEY, 'true');
};

// Remove all demo users
export const removeDemoUsers = (): void => {
  // Get users from localStorage
  const existingUsersJson = localStorage.getItem('users');
  if (!existingUsersJson) return;
  
  let users: User[] = JSON.parse(existingUsersJson);
  
  // Filter out demo users
  users = users.filter(user => !user.isDemoUser);
  
  // Save back to localStorage
  localStorage.setItem('users', JSON.stringify(users));
  
  // Mark demo mode as inactive
  localStorage.setItem(DEMO_USERS_KEY, 'false');
};

