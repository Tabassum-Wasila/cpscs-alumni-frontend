
export interface EventRegistration {
  userId: string;
  eventType: 'reunion' | 'workshop' | 'networking';
  attendeeInfo: {
    name: string;
    email: string;
    phone: string;
    batch: string;
    dietaryRestrictions?: string;
    accommodationNeeded?: boolean;
    emergencyContact?: {
      name: string;
      phone: string;
    };
  };
  paymentStatus: 'pending' | 'completed' | 'failed';
  registrationDate: string;
}

export class EventService {
  private static REGISTRATIONS_KEY = 'cpscs_registrations';

  static async registerForEvent(registration: Omit<EventRegistration, 'registrationDate'>): Promise<boolean> {
    try {
      const registrations = this.getStoredRegistrations();
      
      const newRegistration: EventRegistration = {
        ...registration,
        registrationDate: new Date().toISOString()
      };

      registrations.push(newRegistration);
      localStorage.setItem(this.REGISTRATIONS_KEY, JSON.stringify(registrations));
      
      return true;
    } catch (error) {
      console.error('Event registration error:', error);
      return false;
    }
  }

  static async updatePaymentStatus(userId: string, eventType: string, status: 'completed' | 'failed'): Promise<boolean> {
    try {
      const registrations = this.getStoredRegistrations();
      const registrationIndex = registrations.findIndex(
        reg => reg.userId === userId && reg.eventType === eventType
      );

      if (registrationIndex !== -1) {
        registrations[registrationIndex].paymentStatus = status;
        localStorage.setItem(this.REGISTRATIONS_KEY, JSON.stringify(registrations));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Payment status update error:', error);
      return false;
    }
  }

  static async getUserRegistrations(userId: string): Promise<EventRegistration[]> {
    try {
      const registrations = this.getStoredRegistrations();
      return registrations.filter(reg => reg.userId === userId);
    } catch (error) {
      console.error('Get user registrations error:', error);
      return [];
    }
  }

  static async checkRegistrationExists(userId: string, eventType: string): Promise<boolean> {
    try {
      const registrations = this.getStoredRegistrations();
      return registrations.some(reg => reg.userId === userId && reg.eventType === eventType);
    } catch (error) {
      console.error('Check registration error:', error);
      return false;
    }
  }

  private static getStoredRegistrations(): EventRegistration[] {
    try {
      return JSON.parse(localStorage.getItem(this.REGISTRATIONS_KEY) || '[]');
    } catch (error) {
      console.error('Error getting stored registrations:', error);
      return [];
    }
  }

  static getEventDetails(eventType: string) {
    const events = {
      reunion: {
        title: 'CPSCS Alumni Reunion 2024',
        description: 'Join us for an unforgettable reunion celebration',
        venue: 'Dhaka Regency Hotel',
        date: '2024-12-15',
        time: '6:00 PM - 11:00 PM'
      },
      workshop: {
        title: 'Professional Development Workshop',
        description: 'Enhance your career skills with industry experts',
        venue: 'CPSCS Campus',
        date: '2024-11-20',
        time: '2:00 PM - 5:00 PM'
      },
      networking: {
        title: 'Alumni Networking Evening',
        description: 'Connect with fellow alumni across industries',
        venue: 'Pan Pacific Sonargaon',
        date: '2024-10-25',
        time: '7:00 PM - 10:00 PM'
      }
    };

    return events[eventType as keyof typeof events] || null;
  }
}
