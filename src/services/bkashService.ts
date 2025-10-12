import { API_CONFIG, getApiUrl, getAuthHeaders } from '@/config/api';

export interface BkashCreatePaymentRequest {
  amount: number;
  currency: 'BDT';
  intent: 'sale';
  mode: '0011';
  merchantInvoiceNumber: string;
  payerReference: string;
  callbackURL?: string;
}

export interface BkashCreatePaymentResponse {
  success: boolean;
  data?: {
    paymentID: string;
    bkashURL: string;
    amount: string;
    intent: string;
    currency: string;
    createTime: string;
    transactionStatus: string;
    merchantInvoiceNumber: string;
    callbackURL: string;
  };
  message?: string;
  error?: string;
}

export interface BkashExecutePaymentRequest {
  paymentID: string;
}

export interface BkashExecutePaymentResponse {
  success: boolean;
  data?: {
    paymentID: string;
    trxID: string;
    amount: string;
    currency: string;
    intent: string;
    paymentExecuteTime: string;
    transactionStatus: string;
    merchantInvoiceNumber: string;
    customerMsisdn: string;
  };
  message?: string;
  error?: string;
}

export interface BkashQueryPaymentRequest {
  paymentID: string;
}

export interface BkashQueryPaymentResponse {
  success: boolean;
  data?: {
    paymentID: string;
    trxID?: string;
    amount: string;
    currency: string;
    intent: string;
    transactionStatus: string;
    merchantInvoiceNumber: string;
    customerMsisdn?: string;
    paymentCreateTime: string;
    paymentExecuteTime?: string;
  };
  message?: string;
  error?: string;
}

export class BkashService {
  /**
   * Create a bKash payment
   */
  static async createPayment(paymentData: BkashCreatePaymentRequest): Promise<BkashCreatePaymentResponse> {
    try {
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.BKASH_CREATE_PAYMENT), {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(paymentData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || `HTTP error! status: ${response.status}`);
      }

      return result;
    } catch (error) {
      console.error('Error creating bKash payment:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create payment'
      };
    }
  }

  /**
   * Execute a bKash payment after user returns from bKash
   */
  static async executePayment(executeData: BkashExecutePaymentRequest): Promise<BkashExecutePaymentResponse> {
    try {
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.BKASH_EXECUTE_PAYMENT), {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(executeData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || `HTTP error! status: ${response.status}`);
      }

      return result;
    } catch (error) {
      console.error('Error executing bKash payment:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to execute payment'
      };
    }
  }

  /**
   * Query payment status
   */
  static async queryPayment(queryData: BkashQueryPaymentRequest): Promise<BkashQueryPaymentResponse> {
    try {
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.BKASH_QUERY_PAYMENT), {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(queryData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || `HTTP error! status: ${response.status}`);
      }

      return result;
    } catch (error) {
      console.error('Error querying bKash payment:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to query payment'
      };
    }
  }

  /**
   * Generate unique invoice number
   */
  static generateInvoiceNumber(prefix: string = 'REUNION'): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}_${timestamp}_${random}`;
  }

  /**
   * Parse bKash return URL parameters
   */
  static parseReturnParams(searchParams: URLSearchParams) {
    return {
      status: searchParams.get('status'),
      paymentID: searchParams.get('paymentID'),
      intent: searchParams.get('intent'),
      signature: searchParams.get('signature'),
    };
  }
}
