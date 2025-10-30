
import { Users, Globe, UserCheck, GraduationCap, Heart, Calendar, DollarSign, Clock, BookOpen, Baby } from 'lucide-react';

export interface StatConfig {
  statNumber: string;
  subtitle: string;
  description: string;
  iconName: string;
}

export const statsConfig: StatConfig[] = [
  {
    statNumber: "3000+",
    subtitle: "Verified Alumni Worldwide",
    description: "Discover and connect with thousands of verified CPSCS alumni worldwide through our real-time, ever-growing directory.",
    iconName: "Users"
  },
  {
    statNumber: "25+",
    subtitle: "Countries Connected",
    description: "Our alumni span over 75 countries—building a truly global community rooted in shared memories and values.",
    iconName: "Globe"
  },
  {
    statNumber: "100+",
    subtitle: "Alumni Mentors",
    description: "Experienced alumni have stepped up to guide the next generation—offering advice, mentorship, and career support.",
    iconName: "UserCheck"
  },
  {
    statNumber: "10,000+",
    subtitle: "Students Inspired",
    description: "Through mentorship, events, and outreach, our alumni have impacted over 10,000 students—lighting the path for future leaders.",
    iconName: "GraduationCap"
  },
  {
    statNumber: "15,000+",
    subtitle: "Alumni Connections Made",
    description: "Our platform has facilitated thousands of professional and personal connections—mentorships, collaborations, and lifelong friendships.",
    iconName: "Heart"
  },
  {
    statNumber: "100+",
    subtitle: "Events & Reunions Hosted",
    description: "From grand reunions to small meetups—our events bring together generations of CPSCS alumni in one table.",
    iconName: "Calendar"
  },
  {
    statNumber: "HSC 1986",
    subtitle: "First HSC Batch",
    description: "Our legacy began in 1986 with our first HSC batch—marking over four decades of alumni excellence.",
    iconName: "Clock"
  },
  {
    statNumber: "SSC 1983",
    subtitle: "First SSC Batch",
    description: "Our legacy began in 1983 with our first SSC batch—marking over four decades of alumni excellence.",
    iconName: "Clock"
  },
  {
    statNumber: "42+",
    subtitle: "Alumni Batches United",
    description: "We've brought together over 44 SSC and HSC batches—creating one unified, intergenerational alumni family.",
    iconName: "BookOpen"
  },
  {
    statNumber: "600+",
    subtitle: "Alumni Children Enrolled",
    description: "The CPSCS legacy lives on—over 600 alumni have chosen the same school for their children's future.",
    iconName: "Baby"
  }
];

export const getIconComponent = (iconName: string) => {
  const iconMap: { [key: string]: any } = {
    Users,
    Globe,
    UserCheck,
    GraduationCap,
    Heart,
    Calendar,
    DollarSign,
    Clock,
    BookOpen,
    Baby
  };
  
  return iconMap[iconName] || Users;
};
