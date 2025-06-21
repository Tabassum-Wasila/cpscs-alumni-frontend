
export interface PaymentConfig {
  amount: number;
  currency: string;
  description: string;
  merchantNumber?: string;
  reference?: string;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  error?: string;
}

export class PaymentService {
  private static readonly MEMBERSHIP_FEE = 1000;
  private static readonly REUNION_EARLY_BIRD_FEE = 2500;
  private static readonly REUNION_REGULAR_FEE = 3000;
  private static readonly EARLY_BIRD_CUTOFF = new Date('2024-12-31');

  static getMembershipFee(): number {
    return this.MEMBERSHIP_FEE;
  }

  static getReunionFee(): number {
    const now = new Date();
    return now <= this.EARLY_BIRD_CUTOFF 
      ? this.REUNION_EARLY_BIRD_FEE 
      : this.REUNION_REGULAR_FEE;
  }

  static isEarlyBird(): boolean {
    return new Date() <= this.EARLY_BIRD_CUTOFF;
  }

  static getPaymentInstructions(config: PaymentConfig): string[] {
    return [
      'Open your bKash app',
      'Go to "Make Payment"',
      `Enter merchant number: ${config.merchantNumber || '01XXXXXXXXX'}`,
      `Enter the exact amount: ৳${config.amount}`,
      `Use reference: "${config.reference || 'CPSCS Alumni'}"`,
      'Complete payment with your PIN'
    ];
  }

  static async processBkashPayment(config: PaymentConfig): Promise<PaymentResult> {
    // Simulate payment processing
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate successful payment (in real implementation, this would call bKash API)
        const transactionId = `TXN_${Date.now()}`;
        resolve({
          success: true,
          transactionId,
        });
      }, 2000);
    });
  }

  static async processCardPayment(config: PaymentConfig): Promise<PaymentResult> {
    // Placeholder for future card payment integration
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: false,
          error: 'Card payment not yet implemented'
        });
      }, 1000);
    });
  }
}
