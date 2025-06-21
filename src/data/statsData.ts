
import { Users, Globe, UserCheck, GraduationCap, Heart, Calendar, DollarSign, Clock, BookOpen, Baby } from 'lucide-react';

export interface StatConfig {
  statNumber: string;
  subtitle: string;
  description: string;
  iconName: string;
}

export const statsConfig: StatConfig[] = [
  {
    statNumber: "6,200+",
    subtitle: "Verified Members in Alumni Directory",
    description: "Discover and connect with thousands of verified CPSCS alumni worldwide through our real-time, ever-growing directory.",
    iconName: "Users"
  },
  {
    statNumber: "75+",
    subtitle: "Countries Connected",
    description: "Our alumni span over 75 countries—building a truly global community rooted in shared memories and values.",
    iconName: "Globe"
  },
  {
    statNumber: "400+",
    subtitle: "Active Alumni Mentors",
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
    statNumber: "150+",
    subtitle: "Events & Reunions Hosted",
    description: "From grand reunions to small meetups—our events bring together generations of CPSCS alumni in one table.",
    iconName: "Calendar"
  },
  {
    statNumber: "৳30+ Lakh",
    subtitle: "Alumni Contributions",
    description: "Your generosity has helped fund scholarships, upgrade facilities, and support community initiatives that uplift CPSCS-AA.",
    iconName: "DollarSign"
  },
  {
    statNumber: "SSC 1981",
    subtitle: "Our First Batch",
    description: "Our legacy began in 1981 with our first SSC batch—marking over four decades of alumni excellence.",
    iconName: "Clock"
  },
  {
    statNumber: "44+",
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
