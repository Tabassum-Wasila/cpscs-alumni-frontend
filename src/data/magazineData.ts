
import { MagazineArticle } from '@/types/magazine';

export const magazineArticles: MagazineArticle[] = [
  {
    id: '1',
    title: 'From CPSCS to Silicon Valley: A Journey of Innovation',
    slug: 'cpscs-to-silicon-valley-journey',
    excerpt: 'How a small-town student from CPSCS made it to the tech giants of Silicon Valley, overcoming challenges and embracing opportunities.',
    content: `
      <p>When I first stepped into the corridors of CPSCS, I never imagined that this journey would lead me to the heart of Silicon Valley. The foundation laid during my school years became the bedrock of my success in the tech industry.</p>
      
      <p>The discipline instilled by our teachers, the collaborative spirit fostered among classmates, and the emphasis on critical thinking prepared me for the challenges ahead. Today, as I work with cutting-edge AI technologies at a leading tech company, I realize how much I owe to my alma mater.</p>
      
      <p>The key turning point came during my final year when our computer science teacher introduced us to programming. The logical thinking and problem-solving skills we developed through mathematics and science subjects seamlessly translated into coding abilities.</p>
      
      <p>To my fellow alumni and current students, remember that every challenge is an opportunity in disguise. The values we learned at CPSCS - perseverance, integrity, and continuous learning - remain relevant no matter where life takes us.</p>
    `,
    author: {
      id: 'author-1',
      name: 'Rahul Ahmed',
      profilePhoto: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=400&fit=crop&crop=face',
      bio: 'Senior Software Engineer at Google, CPSCS Alumni Batch 2015',
      batch: '2015',
      designation: 'Senior Software Engineer',
      company: 'Google',
      socialLinks: {
        linkedin: 'https://linkedin.com/in/rahulahmed',
        twitter: 'https://twitter.com/rahulahmed'
      }
    },
    category: 'achievement',
    tags: ['Silicon Valley', 'Technology', 'Career', 'Success Story'],
    featuredImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop',
    bannerImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=675&fit=crop',
    readTime: 8,
    publishedAt: '2024-12-15T10:00:00Z',
    loveCount: 1450,
    viewCount: 5200,
    featured: true,
    status: 'published'
  },
  {
    id: '2',
    title: 'The Golden Days: Memories from the 90s Batch',
    slug: 'golden-days-memories-90s-batch',
    excerpt: 'A nostalgic journey through the corridors of CPSCS in the 1990s, capturing the essence of simpler times and lasting friendships.',
    content: `
      <p>The 1990s were a different era at CPSCS. We didn't have smartphones or social media, but we had something more precious - genuine connections and unforgettable memories that have stood the test of time.</p>
      
      <p>I remember the morning assemblies where we would gather in the courtyard, the echo of our voices during prayer resonating through the building. The smell of fresh chalk, the squeaking of the blackboard, and the afternoon breeze through the classroom windows are memories etched in my heart.</p>
      
      <p>Our friendships were forged through shared experiences - studying together for exams, playing cricket during lunch breaks, and the annual sports day that brought the entire school together. We celebrated each other's successes and supported one another through challenges.</p>
      
      <p>The teachers weren't just educators; they were mentors who shaped our character. They taught us that success isn't just about grades but about becoming good human beings who contribute positively to society.</p>
      
      <p>As I look back, I realize that those golden days at CPSCS gave us more than education - they gave us a foundation of values, friendships that last a lifetime, and memories that bring a smile to our faces even today.</p>
    `,
    author: {
      id: 'author-2',
      name: 'Fatima Khatun',
      profilePhoto: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=400&fit=crop&crop=face',
      bio: 'Senior Manager at International Development Agency, CPSCS Alumni Batch 1995',
      batch: '1995',
      designation: 'Senior Manager',
      company: 'International Development Agency',
      socialLinks: {
        linkedin: 'https://linkedin.com/in/fatimakhatun'
      }
    },
    category: 'memories',
    tags: ['Nostalgia', '90s', 'School Life', 'Friendship'],
    featuredImage: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=800&h=600&fit=crop',
    bannerImage: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=1200&h=675&fit=crop',
    readTime: 6,
    publishedAt: '2024-12-10T14:30:00Z',
    loveCount: 890,
    viewCount: 3100,
    featured: false,
    status: 'published'
  },
  {
    id: '3',
    title: 'Building Tomorrow: How CPSCS Alumni Are Shaping Bangladesh',
    slug: 'building-tomorrow-cpscs-alumni-shaping-bangladesh',
    excerpt: 'Meet the CPSCS graduates who are making significant contributions to Bangladesh\'s development across various sectors.',
    content: `
      <p>Across Bangladesh, CPSCS alumni are quietly making a difference in their respective fields. From healthcare to technology, education to business, our graduates are contributing to the nation's progress with the same dedication they showed during their school years.</p>
      
      <p>In the healthcare sector, Dr. Nasir Ahmed (Batch 2008) has established a chain of affordable clinics in rural areas, providing quality medical care to underserved communities. His initiative has treated over 50,000 patients in the past five years.</p>
      
      <p>In technology, several alumni have founded startups that are solving local problems with innovative solutions. From fintech companies making banking accessible to farmers, to ed-tech platforms providing quality education in remote areas, our graduates are leveraging technology for social good.</p>
      
      <p>The entrepreneurial spirit fostered at CPSCS continues to drive these success stories. The school's emphasis on leadership, social responsibility, and excellence has produced graduates who don't just seek personal success but strive to uplift their communities.</p>
      
      <p>These stories remind us that the true measure of an institution's success isn't just in the achievements of its graduates, but in how they use their success to benefit society. CPSCS can be proud that its alumni are building a better tomorrow for Bangladesh.</p>
    `,
    author: {
      id: 'author-3',
      name: 'Mohammad Karim',
      profilePhoto: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=400&fit=crop&crop=face',
      bio: 'Journalist and Social Activist, CPSCS Alumni Batch 2010',
      batch: '2010',
      designation: 'Senior Journalist',
      company: 'The Daily Observer',
      socialLinks: {
        linkedin: 'https://linkedin.com/in/mohammadkarim',
        twitter: 'https://twitter.com/mkarim_journalist'
      }
    },
    category: 'community',
    tags: ['Social Impact', 'Development', 'Healthcare', 'Technology'],
    featuredImage: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=800&h=600&fit=crop',
    bannerImage: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&h=675&fit=crop',
    readTime: 7,
    publishedAt: '2024-12-05T09:15:00Z',
    loveCount: 620,
    viewCount: 2800,
    featured: true,
    status: 'published'
  },
  {
    id: '4',
    title: 'The Art of Balancing: Career and Family Life',
    slug: 'art-of-balancing-career-family-life',
    excerpt: 'Insights on maintaining work-life balance from successful CPSCS alumni who have excelled in their careers while nurturing their families.',
    content: `
      <p>One of the most challenging aspects of modern life is finding the right balance between professional aspirations and family responsibilities. As CPSCS alumni, we've learned that success isn't just about climbing the corporate ladder - it's about creating a fulfilling life that encompasses all aspects of our being.</p>
      
      <p>The values instilled in us during our school years - time management, prioritization, and emotional intelligence - have proven invaluable in navigating this balance. At CPSCS, we learned that excellence in one area shouldn't come at the expense of others.</p>
      
      <p>Setting boundaries is crucial. I've learned to create dedicated time for family without the intrusion of work emails or calls. Similarly, when I'm at work, I give my complete attention to professional responsibilities.</p>
      
      <p>The support system we built at CPSCS extends beyond school years. Our alumni network provides not just professional connections but also personal support during challenging times. Many of us have found mentors and friends within our community who understand the unique challenges we face.</p>
      
      <p>Remember, balance doesn't mean perfection. Some days work will demand more attention, other days family will be the priority. The key is maintaining overall equilibrium and staying true to the values that define us as CPSCS alumni.</p>
    `,
    author: {
      id: 'author-4',
      name: 'Ayesha Rahman',
      profilePhoto: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=400&fit=crop&crop=face',
      bio: 'Chief Marketing Officer at Grameenphone, CPSCS Alumni Batch 2005',
      batch: '2005',
      designation: 'Chief Marketing Officer',
      company: 'Grameenphone',
      socialLinks: {
        linkedin: 'https://linkedin.com/in/ayesharahman'
      }
    },
    category: 'career',
    tags: ['Work-Life Balance', 'Career Growth', 'Family', 'Success'],
    featuredImage: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&h=600&fit=crop',
    bannerImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&h=675&fit=crop',
    readTime: 5,
    publishedAt: '2024-11-28T16:45:00Z',
    loveCount: 340,
    viewCount: 1900,
    featured: false,
    status: 'published'
  }
];
