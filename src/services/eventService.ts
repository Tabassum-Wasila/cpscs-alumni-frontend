
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
  isCurrentStudent?: boolean;
}

export interface ReunionPricing {
  earlyBirdDeadline: string;
  lateOwlDeadline: string;
  regularEarlyBird: number;
  regularLateOwl: number;
  ssc2020to2025: number;
  currentStudent: number;
  guest: number;
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
        id: "grand-reunion-2025",
        title: "Grand Alumni Reunion 2025: Back to Our Roots! 🌳",
        description: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color: #1f2937; background-color: #f9fafb; padding: 2rem; border-radius: 12px;">

    <div style="text-align: center; margin-bottom: 3rem;">
        <h1 style="font-size: 2.75rem; font-weight: 800; letter-spacing: -1px; background: linear-gradient(90deg, #4f46e5, #ec4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin: 0;">এসো প্রাণে প্রাণে মিলি সবাই</h1>
        <p style="font-size: 1.25rem; color: #6b7280; margin-top: 0.5rem;">Let's all unite in spirit</p>
    </div>

    <p style="font-size: 1.1rem; text-align: center; max-width: 750px; margin: 0 auto 3rem; line-height: 1.7;">
        The moment we've all been waiting for is finally here! It's time to walk down memory lane, reconnect with lifelong friends, and celebrate the legacy of <strong>Cantonment Public School and College, Saidpur</strong>. This isn't just an event; it's a homecoming. A day filled with laughter, memories, and the joy of togetherness.
    </p>

    <div>
        <h2 style="font-size: 2rem; font-weight: 700; text-align: center; margin-bottom: 2.5rem; color: #111827;">A Day to Remember: The Official Schedule</h2>
        
        <div style="border-left: 3px solid #d1d5db; margin-left: 1.5rem; padding-left: 2rem;">

            <div style="position: relative; margin-bottom: 2rem;">
                <div style="position: absolute; left: -2.7rem; top: 0; background-color: #f9fafb; border: 3px solid #d1d5db; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;">☀️</div>
                <p style="margin: 0; font-weight: 600; color: #374151;">8:00 AM - 8:30 AM</p>
                <p style="margin: 0; color: #6b7280;">Arrival, Gift Bag & Token Distribution.</p>
            </div>

            <div style="position: relative; margin-bottom: 2rem;">
                 <div style="position: absolute; left: -2.7rem; top: 0; background-color: #f9fafb; border: 3px solid #d1d5db; border-radius: 50%; width: 24px; height: 24px;"></div>
                <p style="margin: 0; font-weight: 600; color: #374151;">8:30 AM - 9:00 AM</p>
                <p style="margin: 0; color: #6b7280;">Former Teachers & Guests Arrive and are Seated.</p>
            </div>
            
            <div style="position: relative; margin-bottom: 2rem;">
                 <div style="position: absolute; left: -2.7rem; top: 0; background-color: #f9fafb; border: 3px solid #d1d5db; border-radius: 50%; width: 24px; height: 24px;"></div>
                <p style="margin: 0; font-weight: 600; color: #374151;">9:00 AM - 9:30 AM</p>
                <p style="margin: 0; color: #6b7280;">Assembly, Rally Preparation, Inauguration & 1 Minute of Silence.</p>
            </div>

            <div style="position: relative; margin-bottom: 2rem;">
                 <div style="position: absolute; left: -2.7rem; top: 0; background-color: #f9fafb; border: 3px solid #d1d5db; border-radius: 50%; width: 24px; height: 24px;"></div>
                <p style="margin: 0; font-weight: 600; color: #374151;">9:30 AM - 10:15 AM</p>
                <p style="margin: 0; color: #6b7280;">Grand Rally & Batch-wise Campus Procession.</p>
            </div>
            
             <div style="position: relative; margin-bottom: 2rem;">
                <div style="position: absolute; left: -2.7rem; top: 0; background-color: #f9fafb; border: 3px solid #d1d5db; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;">☕</div>
                <p style="margin: 0; font-weight: 600; color: #374151;">10:15 AM - 12:30 PM</p>
                <p style="margin: 0; color: #6b7280;">Snacks Break, followed by Welcome Speeches & a Heartfelt Reminiscence Session.</p>
            </div>
            
            <div style="position: relative; margin-bottom: 2rem;">
                 <div style="position: absolute; left: -2.7rem; top: 0; background-color: #f9fafb; border: 3px solid #d1d5db; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;">🍽️</div>
                <p style="margin: 0; font-weight: 600; color: #374151;">12:30 PM - 3:30 PM</p>
                <p style="margin: 0; color: #6b7280;">Prayer & Lunch Break, followed by Batch-wise Discussions & Photo Sessions.</p>
            </div>
            
            <div style="position: relative; margin-bottom: 2rem;">
                 <div style="position: absolute; left: -2.7rem; top: 0; background-color: #f9fafb; border: 3px solid #d1d5db; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;">🏆</div>
                <p style="margin: 0; font-weight: 600; color: #374151;">3:30 PM - 6:30 PM</p>
                <p style="margin: 0; color: #6b7280;">Fun & Games, Prize Distribution, and Speeches by Honored Guests.</p>
            </div>
            
            <div style="position: relative; margin-bottom: 2rem;">
                 <div style="position: absolute; left: -2.7rem; top: 0; background-color: #f9fafb; border: 3px solid #d1d5db; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;">🌙</div>
                <p style="margin: 0; font-weight: 600; color: #374151;">6:30 PM - 11:00 PM</p>
                <p style="margin: 0; color: #6b7280;">Crest Presentation, spectacular Cultural Program, Raffle Draw, and Grand Dinner.</p>
            </div>

        </div>
    </div>
    
    <div style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 2rem; margin-top: 3rem;">
        <h2 style="font-size: 2rem; font-weight: 700; color: #111827; text-align:center; margin-bottom: 1.5rem;">🎟️ Registration Fees & Deadlines</h2>
        <ul style="list-style: none; padding: 0; max-width: 550px; margin: 0 auto;">
            <li style="display: flex; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px solid #e5e7eb;">
                <span style="color: #4b5563;">Early Birds <em style="font-style: normal; color: #6b7280;">(Until Nov 26, 2025)</em></span>
                <strong style="color: #16a34a;">2000 BDT</strong>
            </li>
            <li style="display: flex; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px solid #e5e7eb;">
                <span style="color: #4b5563;">Late Owls <em style="font-style: normal; color: #6b7280;">(Until Dec 16, 2025)</em></span>
                <strong style="color: #f97316;">3000 BDT</strong>
            </li>
            <li style="display: flex; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px solid #e5e7eb;">
                <span style="color: #4b5563;">Young Alumni <em style="font-style: normal; color: #6b7280;">(SSC 2020-2025)</em></span>
                <strong style="color: #4f46e5;">1500 BDT</strong>
            </li>
            <li style="display: flex; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px solid #e5e7eb;">
                <span style="color: #4b5563;">Current Students</span>
                <strong>1000 BDT</strong>
            </li>
            <li style="display: flex; justify-content: space-between; padding: 0.75rem 0;">
                <span style="color: #4b5563;">Guests & Children (5+)</span>
                <strong>1000 BDT</strong>
            </li>
        </ul>
        <p style="text-align: center; font-size: 0.9rem; color: #6b7280; margin-top: 1.5rem;"><em><strong>Note:</strong> Children under 5 are welcome free of charge but will not receive a separate food pack. Guests include spouse, parents, or children over 5.</em></p>
    </div>

</div>`,
        date: "2025-12-26",
        time: "8:00 AM - 11:00 PM",
        venue: "Cantonment Public School and College, Saidpur",
        type: "in-person",
        category: "reunion",
        status: "upcoming",
        registrationDeadline: "2025-12-16",
        capacity: 500,
        currentRegistrations: 234,
        image: "https://i.postimg.cc/fR9gCNtY/IMG-7464.jpg",
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

  static calculateReunionFees(registration: ReunionRegistration, pricing?: ReunionPricing): FeeBreakdown {
    const currentDate = new Date();
    const defaultPricing: ReunionPricing = {
      earlyBirdDeadline: "2025-11-26",
      lateOwlDeadline: "2025-12-16",
      regularEarlyBird: 2000,
      regularLateOwl: 3000,
      ssc2020to2025: 1500,
      currentStudent: 1000,
      guest: 1000
    };
    
    const finalPricing = pricing || defaultPricing;
    const earlyBirdDeadline = new Date(finalPricing.earlyBirdDeadline);
    
    // Calculate base fee
    let baseFee = 0;
    
    if (registration.isCurrentStudent) {
      baseFee = finalPricing.currentStudent;
    } else if (registration.sscYear) {
      const year = parseInt(registration.sscYear);
      if (year >= 2020 && year <= 2025) {
        baseFee = finalPricing.ssc2020to2025;
      } else {
        // Check early bird vs late owl pricing
        baseFee = currentDate <= earlyBirdDeadline 
          ? finalPricing.regularEarlyBird 
          : finalPricing.regularLateOwl;
      }
    }

    // Calculate guest fees
    const spouseFee = registration.bringingSpouse ? finalPricing.guest : 0;
    const kidsFee = registration.numberOfKids * finalPricing.guest;
    const parentsFee = (registration.bringingMother ? finalPricing.guest : 0) + 
                       (registration.bringingFather ? finalPricing.guest : 0);
    const totalFee = baseFee + spouseFee + kidsFee + parentsFee;

    return {
      baseFee,
      spouseFee,
      kidsFee,
      parentsFee,
      totalFee
    };
  }

  static getReunionPricing(): ReunionPricing {
    // This would normally come from backend/admin panel
    return {
      earlyBirdDeadline: "2025-11-26",
      lateOwlDeadline: "2025-12-16",
      regularEarlyBird: 2000,
      regularLateOwl: 3000,
      ssc2020to2025: 1500,
      currentStudent: 1000,
      guest: 1000
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
