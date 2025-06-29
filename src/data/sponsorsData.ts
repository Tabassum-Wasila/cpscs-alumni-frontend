
import { SponsorsData } from '@/types/sponsors';

export const sponsorsData: SponsorsData = {
  organizations: [
    {
      id: 'org-1',
      type: 'organization',
      name: 'Bangladesh Bank',
      logo: 'https://i.imgur.com/CoqSTIF.jpg',
      industry: 'Banking & Finance',
      shortDescription: 'Central bank of Bangladesh supporting educational initiatives',
      bannerImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=675&fit=crop',
      website: 'https://www.bb.org.bd',
      contributedAmount: 50000,
      quote: 'Investing in education is investing in the future of Bangladesh.',
      tags: ['Banking', 'Finance', 'Government'],
      dateAdded: '2024-01-15'
    },
    {
      id: 'org-2',
      type: 'organization',
      name: 'Grameen Phone',
      logo: 'https://i.imgur.com/JYNxmqf.jpg',
      industry: 'Telecommunications',
      shortDescription: 'Leading telecommunications provider in Bangladesh',
      bannerImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&h=675&fit=crop',
      website: 'https://www.grameenphone.com',
      contributedAmount: 35000,
      quote: 'Connecting communities through education and technology.',
      tags: ['Telecom', 'Technology', 'Innovation'],
      dateAdded: '2024-02-20'
    },
    {
      id: 'org-3',
      type: 'organization',
      name: 'Dhaka Bank',
      logo: 'https://i.imgur.com/nwn1g7L.jpg',
      industry: 'Banking & Finance',
      shortDescription: 'Premier commercial bank supporting alumni initiatives',
      bannerImage: 'https://images.unsplash.com/photo-1497604401993-f2e922e5cb0a?w=1200&h=675&fit=crop',
      website: 'https://www.dhakabank.com.bd',
      contributedAmount: 25000,
      tags: ['Banking', 'Finance', 'Commercial'],
      dateAdded: '2024-03-10'
    }
  ],
  patrons: [
    {
      id: 'patron-1',
      type: 'patron',
      name: 'Dr. Ahmed Rahman',
      fullName: 'Dr. Ahmed Rahman Khan',
      profilePhoto: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=400&fit=crop&crop=face',
      designation: 'Chief Technology Officer',
      company: 'Tech Solutions Ltd.',
      shortDescription: 'Alumni batch 2010, leading technology innovation in Bangladesh',
      bannerImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&h=675&fit=crop',
      website: 'https://linkedin.com/in/ahmedrahman',
      contributedAmount: 15000,
      quote: 'Proud to give back to the institution that shaped my future.',
      dateAdded: '2024-01-25'
    },
    {
      id: 'patron-2',
      type: 'patron',
      name: 'Ms. Fatima Khatun',
      fullName: 'Ms. Fatima Khatun Begum',
      profilePhoto: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=400&fit=crop&crop=face',
      designation: 'Senior Manager',
      company: 'International Development Agency',
      shortDescription: 'Alumni batch 2008, working in international development',
      bannerImage: 'https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=1200&h=675&fit=crop',
      socialLinks: {
        linkedin: 'https://linkedin.com/in/fatimakhatun'
      },
      contributedAmount: 10000,
      quote: 'Education is the foundation of progress.',
      dateAdded: '2024-02-15'
    }
  ]
};
