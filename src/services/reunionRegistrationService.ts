import { API_CONFIG, getApiUrl, getAuthHeaders } from '@/config/api';

export interface ReunionRegistrationRequest {
  eventId: string;
  userId: string;
  userProfile: {
    name: string;
    email: string;
    phone: string;
    sscYear: string;
    hscYear?: string;
    countryCode?: string;
    isAdmin?: boolean;
    hasMembership?: boolean;
  };
  registrationDetails: {
    sscYear: string;
    isCurrentStudent: boolean;
    tshirtSize: string;
    collectionMethod: string;
    spouse?: { name: string } | null;
    father?: { name: string } | null;
    mother?: { name: string } | null;
    children?: {
      numberOfChildren: number;
      names: string[];
    } | null;
    other?: {
      relation: string;
      name: string;
    } | null;
    wantsToVolunteer: boolean;
    specialRequests?: string;
  };
  feeBreakdown: {
    baseFee: number;
    spouseFee: number;
    fatherFee: number;
    motherFee: number;
    childrenFee: number;
    otherGuestFee: number;
    totalFee: number;
  };
  paymentDetails: {
  paymentID: string;
  transactionId: string;
  amount: number;
  paymentStatus: string;
  paymentMethod: string;
  paymentDate?: string;
  // additional fields from frontend
  payment_payer_number?: string;
  verified_by?: string;
  secret_code?: string | null;
  };
  registrationDate: string;
}

export interface ReunionRegistrationResponse {
  success: boolean;
  message: string;
  data?: {
    registrationId: string;
    registrationCode: string;
    status: string;
    confirmationEmail: string;
    qrCode?: string;
    registrationDate: string;
    eventDetails: {
      eventId: string;
      eventTitle: string;
      eventDate: string;
      venue: string;
    };
  };
  errors?: Record<string, string[]>;
}

export class ReunionRegistrationService {
  /**
   * Submit reunion registration after successful payment
   */
  static async submitRegistration(registrationData: ReunionRegistrationRequest): Promise<ReunionRegistrationResponse> {
    try {
      console.log('submitRegistration called with data:', registrationData);
      if (!registrationData?.eventId) {
        throw new Error('eventId is required on registrationData');
      }

      const endpoint = API_CONFIG.ENDPOINTS.EVENT_REGISTRATION(registrationData.eventId);
      const response = await fetch(getApiUrl(endpoint), {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(registrationData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || `HTTP error! status: ${response.status}`);
      }

      return result;
    } catch (error) {
      console.error('Error submitting reunion registration:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Registration submission failed',
        errors: {
          general: ['Failed to submit registration. Please try again.']
        }
      };
    }
  }

  /**
   * Get registration by ID
   */
  // static async getRegistration(registrationId: string): Promise<ReunionRegistrationResponse> {
  //   try {
  //     const response = await fetch(getApiUrl(`${API_CONFIG.ENDPOINTS.REUNION_REGISTRATION}/${registrationId}`), {
  //       method: 'GET',
  //       headers: getAuthHeaders(),
  //     });

  //     const result = await response.json();

  //     if (!response.ok) {
  //       throw new Error(result.message || `HTTP error! status: ${response.status}`);
  //     }

  //     return result;
  //   } catch (error) {
  //     console.error('Error fetching reunion registration:', error);
  //     return {
  //       success: false,
  //       message: error instanceof Error ? error.message : 'Failed to fetch registration'
  //     };
  //   }
  // }

  // /**
  //  * Update registration details (before event)
  //  */
  // static async updateRegistration(registrationId: string, updateData: Partial<ReunionRegistrationRequest>): Promise<ReunionRegistrationResponse> {
  //   try {
  //     const response = await fetch(getApiUrl(`${API_CONFIG.ENDPOINTS.REUNION_REGISTRATION}/${registrationId}`), {
  //       method: 'PUT',
  //       headers: getAuthHeaders(),
  //       body: JSON.stringify(updateData),
  //     });

  //     const result = await response.json();

  //     if (!response.ok) {
  //       throw new Error(result.message || `HTTP error! status: ${response.status}`);
  //     }

  //     return result;
  //   } catch (error) {
  //     console.error('Error updating reunion registration:', error);
  //     return {
  //       success: false,
  //       message: error instanceof Error ? error.message : 'Registration update failed'
  //     };
  //   }
  // }

  // /**
  //  * Cancel registration (with refund logic)
  //  */
  // static async cancelRegistration(registrationId: string, reason?: string): Promise<ReunionRegistrationResponse> {
  //   try {
  //     const response = await fetch(getApiUrl(`${API_CONFIG.ENDPOINTS.REUNION_REGISTRATION}/${registrationId}/cancel`), {
  //       method: 'POST',
  //       headers: getAuthHeaders(),
  //       body: JSON.stringify({ reason }),
  //     });

  //     const result = await response.json();

  //     if (!response.ok) {
  //       throw new Error(result.message || `HTTP error! status: ${response.status}`);
  //     }

  //     return result;
  //   } catch (error) {
  //     console.error('Error cancelling reunion registration:', error);
  //     return {
  //       success: false,
  //       message: error instanceof Error ? error.message : 'Registration cancellation failed'
  //     };
  //   }
  // }
}
