
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
        description: `<!DOCTYPE html>
<html lang="bn">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>গ্র্যান্ড অ্যালামনাই রিইউনিয়ন ২০২৫</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Noto Sans Bengali', sans-serif;
            background-color: #f8fafc;
            color: #1e293b;
            margin: 0;
            padding: 2rem;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
            overflow: hidden;
        }
        .header {
            padding: 2.5rem;
            text-align: center;
            background: transparent;
        }
        .header h1 {
            font-size: 2.75rem;
            font-weight: 800;
            margin: 0;
            letter-spacing: 1px;
            background: linear-gradient(90deg, #4f46e5, #522081);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .header p {
            font-size: 1.25rem;
            color: #475569;
            margin-top: 0.5rem;
        }
        .content {
            padding: 2.5rem;
            padding-top: 0;
        }
        .intro {
            font-size: 1.1rem;
            text-align: center;
            line-height: 1.8;
            color: #475569;
            margin-bottom: 3rem;
        }
        .section-title {
            font-size: 2rem;
            font-weight: 600;
            text-align: center;
            margin-bottom: 2.5rem;
            color: #1e293b;
        }
        .timeline {
            position: relative;
            padding-left: 40px;
            border-left: 3px solid #cbd5e1;
        }
        .timeline-item {
            position: relative;
            margin-bottom: 2rem;
        }
        .timeline-item:last-child {
             margin-bottom: 0;
        }
        .timeline-icon {
            position: absolute;
            left: -54px; /* Adjusted from -54px to align better */
            top: 0;
            width: 40px;
            height: 40px;
            background-color: #ffffff;
            border: 3px solid #cbd5e1;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
        }
        .timeline-time {
            font-weight: 600;
            color: #522081; 
            margin-bottom: 0.25rem;
        }
        .timeline-activity {
            color: #475569;
            margin: 0;
        }
        .section-break {
            font-weight: 700;
            font-size: 1.25rem;
            color: #1e293b;
        }
        .fees-section {
            background-color: #f1f5f9;
            border-radius: 8px;
            padding: 2rem;
            margin-top: 3rem;
        }
        .fees-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        .fees-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem 0;
            border-bottom: 1px solid #e2e8f0;
            font-size: 1.1rem;
        }
        .fees-item:last-child {
            border-bottom: none;
        }
        .fees-item span {
            color: #475569;
        }
        .fees-item strong {
            font-weight: 600;
            color: #1e293b;
        }
        .fees-note {
            text-align: center;
            font-size: 0.9rem;
            color: #64748b;
            margin-top: 1.5rem;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>গ্র্যান্ড অ্যালামনাই রিইউনিয়ন ২০২৫</h1>
            <p>এসো প্রাণে প্রাণে মিলি সবাই</p>
        </div>
        <div class="content">
            <p class="intro">
                বহুল প্রতীক্ষিত সেই মাহেন্দ্রক্ষণের আর দেরি নেই! স্মৃতির করিডোর ধরে হেঁটে পুরনো বন্ধুদের সাথে reconnect করার এবং আমাদের প্রিয় প্রতিষ্ঠান <strong>ক্যান্টনমেন্ট পাবলিক স্কুল অ্যান্ড কলেজ, সৈয়দপুর</strong>-এর গৌরব উদযাপন করার সময় এসেছে। এটি শুধু একটি অনুষ্ঠান নয়, এটি আমাদের শেকড়ে ফেরার উৎসব।
            </p>

            <h2 class="section-title">পূর্ণাঙ্গ অনুষ্ঠান সূচি</h2>
            <div class="timeline">
                
                <div class="timeline-item">
                    <div class="timeline-icon">➡️</div>
                    <p class="timeline-activity section-break">প্রথম পর্ব</p>
                </div>
                <div class="timeline-item">
                    <div class="timeline-icon">🎁</div>
                    <p class="timeline-time">সকাল ৮:০০ - ৮:৩০ মিনিট পর্যন্ত।</p>
                    <p class="timeline-activity">গিফট ব্যাগ ও টোকেন প্রদান</p>
                </div>
                <div class="timeline-item">
                    <div class="timeline-icon">👥</div>
                    <p class="timeline-time">সকাল ৮:৪০ - ৯:১৫ মিনিট পর্যন্ত।</p>
                    <p class="timeline-activity">প্রাক্তন শিক্ষক ও অতিথিবৃন্দের আসন গ্রহণ</p>
                </div>
                <div class="timeline-item">
                    <div class="timeline-icon">🚩</div>
                    <p class="timeline-time">সকাল ৯:২০ - ১০:০০ টা পর্যন্ত।</p>
                    <p class="timeline-activity">বড় মাঠে সমাবেশ</p>
                </div>
                <div class="timeline-item">
                    <div class="timeline-icon">📣</div>
                    <p class="timeline-time">১০:১৫ - ১১:০০ টা পর্যন্ত।</p>
                    <p class="timeline-activity">উদ্বোধনী ঘোষণা, প্রধান অতিথি, বিশেষ অতিথিবৃন্দ ও সভাপতির স্বাগত বক্তব্য ও মাঠ পরিদর্শন। (জুলাই শহীদদের, এবং হারানো শিক্ষক ও শিক্ষার্থীদের স্মরণে ১ মিনিট নীরবতা পালন।)</p>
                </div>
                <div class="timeline-item">
                    <div class="timeline-icon">☕</div>
                    <p class="timeline-time">১১:১০ - ১২:৫৫ মিনিট পর্যন্ত।</p>
                    <p class="timeline-activity">নাস্তার বিরতি: প্রাক্তন শিক্ষক ও ব্যাচ ভিত্তিক শিক্ষার্থীদের স্মৃতিচারণ, ফটোসেশন।</p>
                </div>
                <div class="timeline-item">
                    <div class="timeline-icon">🍽️</div>
                    <p class="timeline-time">১:০০ - ২:৩০ মিনিট পর্যন্ত।</p>
                    <p class="timeline-activity">নামাজ ও দুপুরের খাবার বিরতি</p>
                </div>
                <div class="timeline-item">
                    <div class="timeline-icon">⚽</div>
                    <p class="timeline-time">২:৩৫ - ৫:৩৫ মিনিট পর্যন্ত।</p>
                    <p class="timeline-activity">বিভিন্ন ধরনের খেলাধুলা</p>
                </div>
                 <div class="timeline-item">
                    <div class="timeline-icon">🍵</div>
                    <p class="timeline-time">৫:৪০ - ৬:১৫ মিনিট পর্যন্ত।</p>
                    <p class="timeline-activity">নামাজ ও চা বিরতি</p>
                </div>

                <div class="timeline-item">
                    <div class="timeline-icon">➡️</div>
                    <p class="timeline-activity section-break">দ্বিতীয় পর্ব</p>
                </div>
                <div class="timeline-item">
                    <div class="timeline-icon">🎤</div>
                    <p class="timeline-time">৬: ২০ - ০৭ টা পর্যন্ত।</p>
                    <p class="timeline-activity">প্রধান ও বিশেষ অতিথিবৃন্দের আসন গ্রহণ ও বক্তব্য প্রদান</p>
                </div>
                <div class="timeline-item">
                    <div class="timeline-icon">🏆</div>
                    <p class="timeline-time">০৭: ০৫ - ৭:৩০ মিনিট পর্যন্ত।</p>
                    <p class="timeline-activity">প্রাক্তন শিক্ষক, ডোনার ও কমিটি সদস্যদের ক্রেস্ট প্রদান</p>
                </div>
                <div class="timeline-item">
                    <div class="timeline-icon">🎶</div>
                    <p class="timeline-time">৭:৩৫ - ১১: ০০ টা পর্যন্ত।</p>
                    <p class="timeline-activity">রাতের খাবার, লটারি র‍্যাফেল ড্র ও সাংস্কৃতিক অনুষ্ঠান</p>
                </div>
            </div>

            <div class="fees-section">
                <h2 class="section-title" style="margin-bottom: 1.5rem;">🎟️ রেজিস্ট্রেশন ফি</h2>
                <ul class="fees-list">
                    <li class="fees-item">
                        <span>আর্লি বার্ড (Early Birds)</span>
                        <strong>২০০০ টাকা</strong>
                    </li>
                    <li class="fees-item">
                        <span>লেট আউল (Late Owls)</span>
                        <strong>২৫০০ টাকা</strong>
                    </li>
                    <li class="fees-item">
                        <span>ইয়াং অ্যালামনাই (এসএসসি ২০২০-২০২৫)</span>
                        <strong>১৫০০ টাকা</strong>
                    </li>
                    <li class="fees-item">
                        <span>পরিবার ও শিশু (৫ বছরের উর্ধ্বে)</span>
                        <strong>১০০০ টাকা</strong>
                    </li>
                </ul>
                <p class="fees-note">
                    <em><strong>দ্রষ্টব্য:</strong> ৫ বছরের কম বয়সী শিশুদের জন্য কোনো ফি লাগবে না, তবে তাদের জন্য আলাদা খাবারের প্যাকেট থাকবে না। গেস্টদের মধ্যে স্বামী/স্ত্রী, বাবা-মা অথবা ৫ বছরের বেশি বয়সী শিশুরা অন্তর্ভুক্ত।</em>
                </p>
            </div>
        </div>
    </div>
</body>
</html>`,
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
