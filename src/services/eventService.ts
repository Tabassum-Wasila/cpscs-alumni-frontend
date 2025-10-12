
import { API_CONFIG, getApiUrl, getAuthHeaders } from '@/config/api';

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
  isCurrentStudent: boolean;
  tshirtSize: 'S' | 'M' | 'L' | 'XL' | 'XXL';
  collectionMethod: 'event-booth' | 'batch-coordinator';
  spouse?: {
    name: string;
  };
  father?: {
    name: string;
  };
  mother?: {
    name: string;
  };
  children?: {
    numberOfChildren: number;
    names: string[];
  };
  other?: {
    relation: string;
    name: string;
  };
  wantsToVolunteer: boolean;
  specialRequests?: string;
}

export interface ReunionPricing {
  earlyBirdDeadline: string;
  lateOwlDeadline: string;
  regularEarlyBird: number;
  regularLateOwl: number;
  youngAlumni: number;
  familyAndChildren: number;
  currentStudent: number;
  // Backend control flags
  youngAlumniDiscountEnabled?: boolean;
  currentStudentAttendanceEnabled?: boolean;
  youngAlumniEligibleYears?: { start: number; end: number };
}

export interface FeeBreakdown {
  baseFee: number;
  spouseFee: number;
  fatherFee: number;
  motherFee: number;
  childrenFee: number;
  otherGuestFee: number;
  totalFee: number;
  itemizedBreakdown?: {
    baseDescription: string;
    items: Array<{
      description: string;
      amount: number;
      quantity?: number;
    }>;
  };
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

  // Fetch events from API (replaces mock data)
  static async getMockEvents(): Promise<Event[]> {
    try {
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.EVENTS), {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch events: ${response.status}`);
      }

      const data = await response.json();
      console.log(data)
      return data.data || data; // Handle both {data: []} and direct array responses
    } catch (error) {
      console.error('Error fetching events:', error);
      // Return empty array on error - frontend will handle error states
      return [];
    }
  }

  // Fetch single event by ID from API
  static async getEventById(id: string): Promise<Event | null> {
    try {
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.EVENT_BY_ID(id)), {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null; // Event not found
        }
        throw new Error(`Failed to fetch event: ${response.status}`);
      }

      const data = await response.json();
      return data.data || data; // Handle both {data: {}} and direct object responses
    } catch (error) {
      console.error('Error fetching event:', error);
      return null;
    }
  }

  static calculateReunionFees(registration: ReunionRegistration, pricing?: ReunionPricing): FeeBreakdown {
    const currentDate = new Date();
    const defaultPricing: ReunionPricing = {
      earlyBirdDeadline: "2025-11-26",
      lateOwlDeadline: "2025-12-16",
      regularEarlyBird: 2000,
      regularLateOwl: 2500,
      youngAlumni: 1500,
      familyAndChildren: 1000,
      currentStudent: 0, // Free for current students
      youngAlumniDiscountEnabled: true,
      currentStudentAttendanceEnabled: false, // Hidden by default - controlled by backend admin panel
      youngAlumniEligibleYears: { start: 2020, end: 2025 }
    };
    
    const finalPricing = pricing || defaultPricing;
    const earlyBirdDeadline = new Date(finalPricing.earlyBirdDeadline);
    
    // Calculate base fee
    let baseFee = 0;
    let baseDescription = "";
    
    if (registration.isCurrentStudent && finalPricing.currentStudentAttendanceEnabled) {
      baseFee = finalPricing.currentStudent;
      baseDescription = "Current Student";
    } else if (registration.sscYear) {
      const year = parseInt(registration.sscYear);
      const { start, end } = finalPricing.youngAlumniEligibleYears || { start: 2020, end: 2025 };
      
      if (year >= start && year <= end && finalPricing.youngAlumniDiscountEnabled) {
        baseFee = finalPricing.youngAlumni;
        baseDescription = `Young Alumni (SSC ${start}-${end})`;
      } else {
        // Check early bird vs late owl pricing
        if (currentDate <= earlyBirdDeadline) {
          baseFee = finalPricing.regularEarlyBird;
          baseDescription = "Regular Alumni (Early Bird)";
        } else {
          baseFee = finalPricing.regularLateOwl;
          baseDescription = "Regular Alumni (Late Owl)";
        }
      }
    }

    // Calculate guest fees
    const spouseFee = registration.spouse ? finalPricing.familyAndChildren : 0;
    const fatherFee = registration.father ? finalPricing.familyAndChildren : 0;
    const motherFee = registration.mother ? finalPricing.familyAndChildren : 0;
    const childrenFee = registration.children ? (registration.children.numberOfChildren * finalPricing.familyAndChildren) : 0;
    const otherGuestFee = registration.other ? finalPricing.familyAndChildren : 0;
    
    const totalFee = baseFee + spouseFee + fatherFee + motherFee + childrenFee + otherGuestFee;

    // Create itemized breakdown
    const items: Array<{ description: string; amount: number; quantity?: number }> = [];
    
    if (spouseFee > 0) items.push({ description: "Spouse", amount: finalPricing.familyAndChildren });
    if (fatherFee > 0) items.push({ description: "Father", amount: finalPricing.familyAndChildren });
    if (motherFee > 0) items.push({ description: "Mother", amount: finalPricing.familyAndChildren });
    if (childrenFee > 0) items.push({ 
      description: "Children (5+ years)", 
      amount: finalPricing.familyAndChildren, 
      quantity: registration.children?.numberOfChildren || 0 
    });
    if (otherGuestFee > 0) items.push({ 
      description: `Other Guest (${registration.other?.relation})`, 
      amount: finalPricing.familyAndChildren 
    });

    return {
      baseFee,
      spouseFee,
      fatherFee,
      motherFee,
      childrenFee,
      otherGuestFee,
      totalFee,
      itemizedBreakdown: {
        baseDescription,
        items
      }
    };
  }

  static async getReunionPricing(eventId: string): Promise<ReunionPricing> {
    try {
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.EVENT_PRICING(eventId)), {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch event pricing: ${response.status}`);
      }

      const data = await response.json();
      return data.data || data; // Handle both {data: {}} and direct object responses
    } catch (error) {
      console.error('Error fetching event pricing:', error);
      // Return default pricing as fallback
      // return {
      //   earlyBirdDeadline: "2025-11-26",
      //   lateOwlDeadline: "2025-12-16",
      //   regularEarlyBird: 2000,
      //   regularLateOwl: 2500,
      //   youngAlumni: 1500,
      //   familyAndChildren: 1000,
      //   currentStudent: 0,
      //   youngAlumniDiscountEnabled: true,
      //   currentStudentAttendanceEnabled: false,
      //   youngAlumniEligibleYears: { start: 2020, end: 2025 }
      // };
    }
  }

  // Format date for display (e.g., "26 November 2025")
  static formatDateForDisplay(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
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
