
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
