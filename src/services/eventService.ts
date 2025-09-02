
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
        title: "Grand Alumni Reunion 2025",
        description: `<div style="font-family: 'Noto Sans Bengali', sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 2rem;">
    <div style="max-width: 800px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08); overflow: hidden;">
        <div style="padding: 2.5rem; text-align: center; background: linear-gradient(135deg, #4f46e5, #522081); color: #ffffff;">
            <h1 style="font-size: 2.75rem; font-weight: 700; margin: 0; letter-spacing: 1px;">গ্র্যান্ড অ্যালামনাই রিইউনিয়ন ২০২৫</h1>
            <p style="font-size: 1.25rem; opacity: 0.9; margin-top: 0.5rem;">এসো প্রাণে প্রাণে মিলি সবাই</p>
        </div>
        <div style="padding: 2.5rem;">
            <p style="font-size: 1.1rem; text-align: center; line-height: 1.8; color: #475569; margin-bottom: 3rem;">
                বহুল প্রতীক্ষিত সেই মাহেন্দ্রক্ষণের আর দেরি নেই! স্মৃতির করিডোর ধরে হেঁটে পুরনো বন্ধুদের সাথে reconnect করার এবং আমাদের প্রিয় প্রতিষ্ঠান <strong>ক্যান্টনমেন্ট পাবলিক স্কুল অ্যান্ড কলেজ, সৈয়দপুর</strong>-এর গৌরব উদযাপন করার সময় এসেছে। এটি শুধু একটি অনুষ্ঠান নয়, এটি আমাদের শেকড়ে ফেরার উৎসব।
            </p>

            <h2 style="font-size: 2rem; font-weight: 600; text-align: center; margin-bottom: 2.5rem; color: #1e293b;">অনুষ্ঠান সূচি</h2>
            <div style="position: relative; padding-left: 40px; border-left: 3px solid #cbd5e1;">
                <div style="position: relative; margin-bottom: 2rem;">
                    <div style="position: absolute; left: -54px; top: 0; width: 40px; height: 40px; background-color: #ffffff; border: 3px solid #cbd5e1; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">☀️</div>
                    <p style="font-weight: 600; color: #4f46e5; margin-bottom: 0.25rem;">সকাল ৮:০০ - ৮:৩০ মিনিট</p>
                    <p style="color: #475569; margin: 0;">অতিথিদের আগমন, গিফট ব্যাগ ও টোকেন বিতরণ</p>
                </div>
                <div style="position: relative; margin-bottom: 2rem;">
                    <div style="position: absolute; left: -54px; top: 0; width: 40px; height: 40px; background-color: #ffffff; border: 3px solid #cbd5e1; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">👥</div>
                    <p style="font-weight: 600; color: #4f46e5; margin-bottom: 0.25rem;">সকাল ৮:৩০ - ৯:০০ মিনিট</p>
                    <p style="color: #475569; margin: 0;">প্রাক্তন শিক্ষক ও অতিথিদের আসন গ্রহণ</p>
                </div>
                <div style="position: relative; margin-bottom: 2rem;">
                    <div style="position: absolute; left: -54px; top: 0; width: 40px; height: 40px; background-color: #ffffff; border: 3px solid #cbd5e1; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">🚩</div>
                    <p style="font-weight: 600; color: #4f46e5; margin-bottom: 0.25rem;">সকাল ৯:০০ - ৯:৩০ মিনিট</p>
                    <p style="color: #475569; margin: 0;">জাতীয় পতাকা উত্তোলন, র‍্যালি ও উদ্বোধন</p>
                </div>
                <div style="position: relative; margin-bottom: 2rem;">
                    <div style="position: absolute; left: -54px; top: 0; width: 40px; height: 40px; background-color: #ffffff; border: 3px solid #cbd5e1; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">💬</div>
                    <p style="font-weight: 600; color: #4f46e5; margin-bottom: 0.25rem;">সকাল ৯:৩০ - ১১:০০ মিনিট</p>
                    <p style="color: #475569; margin: 0;">স্বাগত বক্তব্য, স্মৃতিচারণ ও ব্যাচ পরিচিতি</p>
                </div>
                <div style="position: relative; margin-bottom: 2rem;">
                    <div style="position: absolute; left: -54px; top: 0; width: 40px; height: 40px; background-color: #ffffff; border: 3px solid #cbd5e1; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">☕</div>
                    <p style="font-weight: 600; color: #4f46e5; margin-bottom: 0.25rem;">সকাল ১১:০০ - ১১:৩০ মিনিট</p>
                    <p style="color: #475569; margin: 0;">সকালের নাস্তা</p>
                </div>
                <div style="position: relative; margin-bottom: 2rem;">
                    <div style="position: absolute; left: -54px; top: 0; width: 40px; height: 40px; background-color: #ffffff; border: 3px solid #cbd5e1; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">📸</div>
                    <p style="font-weight: 600; color: #4f46e5; margin-bottom: 0.25rem;">সকাল ১১:৩০ - দুপুর ১:০০ মিনিট</p>
                    <p style="color: #475569; margin: 0;">ব্যাচ ভিত্তিক ফটোসেশন</p>
                </div>
                <div style="position: relative; margin-bottom: 2rem;">
                    <div style="position: absolute; left: -54px; top: 0; width: 40px; height: 40px; background-color: #ffffff; border: 3px solid #cbd5e1; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">🍽️</div>
                    <p style="font-weight: 600; color: #4f46e5; margin-bottom: 0.25rem;">দুপুর ১:০০ - দুপুর ২:৩০ মিনিট</p>
                    <p style="color: #475569; margin: 0;">নামাজ ও মধ্যাহ্নভোজের বিরতি</p>
                </div>
                <div style="position: relative; margin-bottom: 2rem;">
                    <div style="position: absolute; left: -54px; top: 0; width: 40px; height: 40px; background-color: #ffffff; border: 3px solid #cbd5e1; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">🏆</div>
                    <p style="font-weight: 600; color: #4f46e5; margin-bottom: 0.25rem;">দুপুর ২:৩০ - বিকাল ৫:৩০ মিনিট</p>
                    <p style="color: #475569; margin: 0;">বিভিন্ন ধরনের খেলাধুলা ও পুরস্কার বিতরণ</p>
                </div>
                <div style="position: relative; margin-bottom: 2rem;">
                    <div style="position: absolute; left: -54px; top: 0; width: 40px; height: 40px; background-color: #ffffff; border: 3px solid #cbd5e1; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">🎤</div>
                    <p style="font-weight: 600; color: #4f46e5; margin-bottom: 0.25rem;">বিকাল ৫:৩০ - সন্ধ্যা ৭:০০ মিনিট</p>
                    <p style="color: #475569; margin: 0;">সম্মাননা প্রদান ও অতিথিদের বক্তব্য</p>
                </div>
                <div style="position: relative; margin-bottom: 2rem;">
                    <div style="position: absolute; left: -54px; top: 0; width: 40px; height: 40px; background-color: #ffffff; border: 3px solid #cbd5e1; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">🌙</div>
                    <p style="font-weight: 600; color: #4f46e5; margin-bottom: 0.25rem;">সন্ধ্যা ৭:০০ - রাত ১১:০০ মিনিট</p>
                    <p style="color: #475569; margin: 0;">সাংস্কৃতিক অনুষ্ঠান, র‍্যাফেল ড্র ও রাতের খাবার</p>
                </div>
            </div>

            <div style="background-color: #f1f5f9; border-radius: 8px; padding: 2rem; margin-top: 3rem;">
                <h2 style="font-size: 2rem; font-weight: 600; text-align: center; margin-bottom: 1.5rem; color: #1e293b;">🎟️ রেজিস্ট্রেশন ফি</h2>
                <ul style="list-style: none; padding: 0; margin: 0;">
                    <li style="display: flex; justify-content: space-between; align-items: center; padding: 1rem 0; border-bottom: 1px solid #e2e8f0; font-size: 1.1rem;">
                        <span style="color: #475569;">আর্লি বার্ড (Early Birds)</span>
                        <strong style="font-weight: 600; color: #1e293b;">২০০০ টাকা</strong>
                    </li>
                    <li style="display: flex; justify-content: space-between; align-items: center; padding: 1rem 0; border-bottom: 1px solid #e2e8f0; font-size: 1.1rem;">
                        <span style="color: #475569;">লেট আউল (Late Owls)</span>
                        <strong style="font-weight: 600; color: #1e293b;">২৫০০ টাকা</strong>
                    </li>
                    <li style="display: flex; justify-content: space-between; align-items: center; padding: 1rem 0; border-bottom: 1px solid #e2e8f0; font-size: 1.1rem;">
                        <span style="color: #475569;">ইয়াং অ্যালামনাই (এসএসসি ২০২০-২০২৫)</span>
                        <strong style="font-weight: 600; color: #1e293b;">১৫০০ টাকা</strong>
                    </li>
                    <li style="display: flex; justify-content: space-between; align-items: center; padding: 1rem 0; font-size: 1.1rem;">
                        <span style="color: #475569;">পরিবার ও শিশু (৫ বছরের উর্ধ্বে)</span>
                        <strong style="font-weight: 600; color: #1e293b;">১০০০ টাকা</strong>
                    </li>
                </ul>
                <p style="text-align: center; font-size: 0.9rem; color: #64748b; margin-top: 1.5rem;">
                    <em><strong>দ্রষ্টব্য:</strong> ৫ বছরের কম বয়সী শিশুদের জন্য কোনো ফি লাগবে না, তবে তাদের জন্য আলাদা খাবারের প্যাকেট থাকবে না। গেস্টদের মধ্যে স্বামী/স্ত্রী, বাবা-মা অথবা ৫ বছরের বেশি বয়সী শিশুরা অন্তর্ভুক্ত।</em>
                </p>
            </div>
        </div>
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
