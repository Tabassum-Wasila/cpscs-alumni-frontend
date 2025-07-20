import { Notice } from '../types/notice';

export const sampleNotices: Notice[] = [
  {
    id: '1',
    noticeTitle: 'Annual Alumni Reunion 2024',
    noticeBody: 'We are excited to announce our Annual Alumni Reunion scheduled for December 15, 2024. This year\'s reunion promises to be our biggest yet, featuring networking sessions, cultural programs, and a special awards ceremony recognizing outstanding alumni achievements. The event will be held at the university campus from 10 AM to 8 PM. Registration is now open, and early bird discounts are available until November 30th. Don\'t miss this opportunity to reconnect with your classmates and create new memories!',
    imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    publishDate: '2024-11-15T10:00:00Z',
    category: 'event',
    priority: 'high'
  },
  {
    id: '2',
    noticeTitle: 'Scholarship Program Launch',
    noticeBody: 'The CPSCS Alumni Association is proud to launch a new scholarship program for current students. This initiative aims to support academically excellent students facing financial challenges. The scholarship covers tuition fees, books, and living expenses for one academic year. Applications are open from December 1st to January 15th, 2025. Eligible candidates must maintain a minimum GPA of 3.5 and demonstrate financial need through proper documentation.',
    pdfUrl: 'https://drive.google.com/file/d/sample-scholarship-guidelines/view',
    publishDate: '2024-11-10T14:30:00Z',
    category: 'announcement',
    priority: 'high'
  },
  {
    id: '3',
    noticeTitle: 'Alumni Spotlight: Dr. Sarah Ahmed',
    noticeBody: 'This month, we are proud to feature Dr. Sarah Ahmed, Class of 2010, who has made significant contributions to the field of artificial intelligence. Dr. Ahmed recently published groundbreaking research on machine learning applications in healthcare and has been recognized with the Young Scientist Award by the National Science Foundation. She currently serves as the Lead AI Researcher at TechCorp and has been instrumental in developing innovative solutions that have impacted millions of lives globally.',
    imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    publishDate: '2024-11-08T09:15:00Z',
    category: 'spotlight',
    priority: 'medium'
  },
  {
    id: '4',
    noticeTitle: 'Updated Community Guidelines',
    noticeBody: 'We have updated our community guidelines to ensure a safe and respectful environment for all alumni members. The new guidelines include enhanced policies on professional conduct, social media interaction, and event participation. All members are encouraged to review these guidelines carefully. Key changes include updated privacy policies, clearer communication protocols, and new reporting mechanisms for any concerns or violations.',
    pdfUrl: 'https://drive.google.com/file/d/sample-community-guidelines/view',
    publishDate: '2024-11-05T16:45:00Z',
    category: 'general',
    priority: 'medium'
  },
  {
    id: '5',
    noticeTitle: 'Career Development Workshop Series',
    noticeBody: 'Join us for a comprehensive career development workshop series designed specifically for recent graduates and early-career professionals. The series covers resume building, interview skills, networking strategies, and industry insights from senior alumni. Sessions will be conducted both online and in-person throughout December 2024. Expert speakers from various industries will share their experiences and provide personalized guidance.',
    imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    publishDate: '2024-11-02T11:20:00Z',
    category: 'event',
    priority: 'medium'
  },
  {
    id: '6',
    noticeTitle: 'System Maintenance Notice',
    noticeBody: 'Please be informed that our alumni portal will undergo scheduled maintenance on November 25th, 2024, from 2:00 AM to 6:00 AM. During this time, the website and mobile app will be temporarily unavailable. We apologize for any inconvenience this may cause and appreciate your understanding as we work to improve our services.',
    publishDate: '2024-10-28T13:00:00Z',
    category: 'general',
    priority: 'low'
  }
];