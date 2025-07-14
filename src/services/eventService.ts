
export interface Event {
  id: string;
  title: string;
  description: string; // Rich text HTML content
  date: string;
  time: string;
  venue: string;
  type: 'in-person' | 'online' | 'hybrid';
  category: 'reunion' | 'workshop' | 'sports' | 'cultural' | 'networking' | 'other';
  status: 'upcoming' | 'ongoing' | 'past';
  registrationDeadline: string;
  capacity?: number;
  currentRegistrations?: number;
  image?: string; // Banner image URL
  registrationUrl?: string; // External form URL (Google Forms, etc.)
  useInternalForm: boolean; // Use default form vs external
  isSpecialEvent?: boolean; // For events like Grand Reunion with custom forms
  organizer?: string;
  contactEmail?: string;
  tags?: string[];
  location?: {
    address?: string;
    coordinates?: { lat: number; lng: number };
  };
  createdAt: string;
  updatedAt: string;
}

export interface EventRegistration {
  eventId: string;
  fullName: string;
  sscYear: string;
  hscYear?: string;
  phone: string;
  email: string;
  whyAttend?: string;
  additionalInfo?: string;
}

export interface ReunionRegistration {
  sscYear: string;
  bringingSpouse: boolean;
  numberOfKids: number;
  bringingMother: boolean;
  bringingFather: boolean;
}

export interface FeeBreakdown {
  baseFee: number;
  spouseFee: number;
  kidsFee: number;
  parentsFee: number;
  totalFee: number;
}

export class EventService {
  // Get event status based on date
  static getEventStatus(eventDate: string, registrationDeadline?: string): 'upcoming' | 'ongoing' | 'past' {
    const now = new Date();
    const eventDateTime = new Date(eventDate);
    const deadlineDateTime = registrationDeadline ? new Date(registrationDeadline) : null;

    if (eventDateTime < now) {
      return 'past';
    }
    
    if (deadlineDateTime && deadlineDateTime < now && eventDateTime > now) {
      return 'ongoing';
    }
    
    return 'upcoming';
  }

  // Check if registration is open
  static isRegistrationOpen(event: Event): boolean {
    if (event.status === 'past') return false;
    
    const now = new Date();
    const deadline = new Date(event.registrationDeadline);
    
    return deadline > now;
  }

  // Check if event is at capacity
  static isEventFull(event: Event): boolean {
    return event.capacity ? (event.currentRegistrations || 0) >= event.capacity : false;
  }

  // Get category color scheme for banners
  static getCategoryColorScheme(category: Event['category']) {
    const schemes = {
      reunion: {
        primary: 'hsl(var(--primary))',
        secondary: 'hsl(var(--primary-glow))',
        gradient: 'from-primary via-primary-glow to-primary/80'
      },
      workshop: {
        primary: 'hsl(220, 85%, 57%)',
        secondary: 'hsl(220, 85%, 70%)',
        gradient: 'from-blue-600 via-blue-500 to-blue-400'
      },
      sports: {
        primary: 'hsl(142, 76%, 36%)',
        secondary: 'hsl(142, 76%, 50%)',
        gradient: 'from-green-600 via-green-500 to-green-400'
      },
      cultural: {
        primary: 'hsl(280, 85%, 57%)',
        secondary: 'hsl(280, 85%, 70%)',
        gradient: 'from-purple-600 via-purple-500 to-purple-400'
      },
      networking: {
        primary: 'hsl(25, 95%, 53%)',
        secondary: 'hsl(25, 95%, 65%)',
        gradient: 'from-orange-600 via-orange-500 to-orange-400'
      },
      other: {
        primary: 'hsl(220, 14%, 30%)',
        secondary: 'hsl(220, 14%, 50%)',
        gradient: 'from-slate-600 via-slate-500 to-slate-400'
      }
    };
    
    return schemes[category] || schemes.other;
  }

  // Mock data for development (will be replaced with backend API)
  static getMockEvents(): Event[] {
    return [
      {
        id: "1",
        title: "Grand Alumni Reunion 2025",
        description: "<p>Join us for the most anticipated event of the year! A day filled with nostalgia, networking, and celebration.</p><p>Activities include campus tour, cultural programs, alumni dinner, and much more.</p>",
        date: "2025-12-25",
        time: "9:00 AM - 10:00 PM",
        venue: "Cantonment Public School and College, Saidpur",
        type: "in-person",
        category: "reunion",
        status: "upcoming",
        registrationDeadline: "2025-11-30",
        capacity: 500,
        currentRegistrations: 234,
        image: "https://i.imgur.com/j75BIZN.jpg",
        useInternalForm: true,
        isSpecialEvent: true,
        organizer: "CPSCS Alumni Association",
        contactEmail: "reunion@cpscsalumni.org",
        tags: ["reunion", "networking", "cultural"],
        location: {
          address: "Cantonment Public School and College, Saidpur",
          coordinates: { lat: 25.7439, lng: 88.9294 }
        },
        createdAt: "2025-01-01",
        updatedAt: "2025-01-10"
      },
      {
        id: "2",
        title: "Career Development Workshop",
        description: "<p>Enhance your professional skills with our comprehensive career development workshop.</p><p>Topics covered: Resume building, interview techniques, networking strategies, and industry insights.</p>",
        date: "2025-09-15",
        time: "3:00 PM - 5:00 PM",
        venue: "Zoom",
        type: "online",
        category: "workshop",
        status: "upcoming",
        registrationDeadline: "2025-09-10",
        capacity: 100,
        currentRegistrations: 67,
        useInternalForm: true,
        organizer: "Career Development Committee",
        contactEmail: "career@cpscsalumni.org",
        tags: ["career", "professional", "skills"],
        createdAt: "2025-01-05",
        updatedAt: "2025-01-12"
      },
      {
        id: "3",
        title: "Alumni Sports Day",
        description: "<p>Get ready for a day of friendly competition and fun!</p><p>Events include cricket, football, badminton, and various other sports activities.</p>",
        date: "2025-10-08",
        time: "10:00 AM - 4:00 PM",
        venue: "CPSCS Sports Ground",
        type: "in-person",
        category: "sports",
        status: "upcoming",
        registrationDeadline: "2025-09-30",
        capacity: 200,
        currentRegistrations: 89,
        useInternalForm: true,
        organizer: "Sports Committee",
        contactEmail: "sports@cpscsalumni.org",
        tags: ["sports", "competition", "outdoor"],
        location: {
          address: "CPSCS Sports Ground, Saidpur",
          coordinates: { lat: 25.7445, lng: 88.9301 }
        },
        createdAt: "2025-01-03",
        updatedAt: "2025-01-08"
      }
    ];
  }

  static calculateReunionFees(registration: ReunionRegistration): FeeBreakdown {
    // Calculate base fee based on SSC year
    let baseFee = 0;
    if (registration.sscYear) {
      const year = parseInt(registration.sscYear);
      if (year <= 2000) baseFee = 5000;
      else if (year <= 2015) baseFee = 3500;
      else if (year <= 2022) baseFee = 3000;
      else baseFee = 1000;
    }

    // Calculate additional fees
    const spouseFee = registration.bringingSpouse ? 2000 : 0;
    const kidsFee = registration.numberOfKids * 1000;
    const parentsFee = (registration.bringingMother ? 1000 : 0) + (registration.bringingFather ? 1000 : 0);
    const totalFee = baseFee + spouseFee + kidsFee + parentsFee;

    return {
      baseFee,
      spouseFee,
      kidsFee,
      parentsFee,
      totalFee
    };
  }

  static getEventDetails() {
    return {
      title: "Grand Alumni Reunion 2025",
      date: "December 25, 2025",
      time: "9:00 AM - 10:00 PM",
      venue: "CPSCS Campus, Saidpur",
      activities: [
        "Campus Tour",
        "Cultural Program", 
        "Alumni Dinner",
        "Guest Speeches",
        "Cultural Events",
        "Group Photos"
      ]
    };
  }

  static getFeeStructure() {
    return {
      batchFees: {
        "2000 and before": 5000,
        "2001-2015": 3500,
        "2016-2022": 3000,
        "2023 and after": 1000
      },
      additionalFees: {
        spouse: 2000,
        childPerPerson: 1000,
        parentPerPerson: 1000
      }
    };
  }
}
