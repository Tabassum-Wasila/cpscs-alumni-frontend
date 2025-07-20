
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
        description: `<div style="text-align: center; border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 30px;">
    <h1>Grand Alumni Reunion 2025: Back to Our Roots! 🌳</h1>
    <h2>এসো প্রাণে প্রাণে মিলি সবাই (Let's all unite in spirit)</h2>
    <p>Get ready for the most anticipated event of the year! It's time to walk down memory lane, reconnect with lifelong friends, and celebrate the legacy of Cantonment Public School and College, Saidpur. This isn't just an event; it's a homecoming. A day filled with laughter, memories, and the joy of togetherness.</p>
</div>

<h3>✨ What to Expect</h3>
<div style="display: flex; gap: 20px; flex-wrap: wrap; justify-content: center; margin-bottom: 30px;">
    <div style="flex: 1; min-width: 250px; text-align: center;">
        <h4>🤝 Reconnect & Reminisce</h4>
        <p>Meet your batchmates, catch up with your favorite teachers, and share stories from the good old days.</p>
    </div>
    <div style="flex: 1; min-width: 250px; text-align: center;">
        <h4>🎉 Fun & Festivities</h4>
        <p>Enjoy exciting games, a grand rally, and a spectacular cultural program to light up the evening.</p>
    </div>
    <div style="flex: 1; min-width: 250px; text-align: center;">
        <h4>🍽️ Delicious Cuisine</h4>
        <p>From morning snacks to a grand dinner, treat your taste buds to a delightful culinary journey.</p>
    </div>
</div>

<h3>⏰ Full Day Itinerary</h3>
<ul style="list-style: none; padding: 0;">
    <li><strong>☀️ Morning Session (8:00 AM - 12:30 PM)</strong>
        <ul>
            <li><strong>8:00 AM:</strong> Gate Opens! Welcome & Registration Kit Distribution.</li>
            <li><strong>9:00 AM:</strong> Grand Inauguration & Rally Preparation.</li>
            <li><strong>9:30 AM:</strong> Batch-wise Campus Procession & Nostalgia Walk.</li>
            <li><strong>10:40 AM:</strong> Welcome speeches & heartfelt reminiscence session.</li>
        </ul>
    </li>
    <li><strong>🌙 Afternoon Session (12:30 PM - 6:00 PM)</strong>
        <ul>
            <li><strong>12:30 PM:</strong> Prayer & Grand Lunch Break.</li>
            <li><strong>2:30 PM:</strong> Batch-wise Photo Sessions, Adda & Networking.</li>
            <li><strong>3:30 PM:</strong> Fun Sports, Games & Prize Giving Ceremony.</li>
        </ul>
    </li>
    <li><strong>✨ Evening Gala (6:00 PM - 11:00 PM)</strong>
        <ul>
            <li><strong>6:00 PM:</strong> Honoring Our Legends: Crests for Teachers & Donors.</li>
            <li><strong>7:00 PM:</strong> Mesmerizing Cultural Program & Raffle Draw.</li>
            <li><strong>9:00 PM:</strong> Grand Reunion Dinner.</li>
        </ul>
    </li>
</ul>

<h3>🎟️ Registration & Fees</h3>
<div style="background: #f1f5f9; padding: 20px; border-radius: 8px; text-align: center;">
    <h4>Don't miss out! Secure your spot today.</h4>
    <p>Registration is mandatory for all attendees, including guests.</p>
    <ul style="list-style: none; padding: 0; margin-bottom: 20px;">
        <li><strong>Early Birds (Until Nov 26, 2025):</strong> 2000 BDT</li>
        <li><strong>Late Owls (After Nov 26, 2025):</strong> 3000 BDT</li>
        <li><strong>Alumni (SSC 2020 - 2025):</strong> 1500 BDT</li>
        <li><strong>Current Students:</strong> 1000 BDT</li>
        <li><strong>Guests (Spouse/Parent/Child over 5):</strong> 1000 BDT each</li>
    </ul>
    <p><em><strong>Note:</strong> Children under 5 are free but will not receive a separate food pack.</em></p>
</div>`,
        date: "2025-12-25",
        time: "8:00 AM - 11:00 PM",
        venue: "Cantonment Public School and College, Saidpur",
        type: "in-person",
        category: "reunion",
        status: "upcoming",
        registrationDeadline: "2025-12-20",
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
      lateOwlDeadline: "2025-12-20",
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
      lateOwlDeadline: "2025-12-20",
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
