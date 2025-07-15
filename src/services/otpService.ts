export interface OTPData {
  email: string;
  otp: string;
  expiresAt: number;
  type: 'password-reset';
}

export class OTPService {
  private static OTP_KEY = 'cpscs_otps';
  private static OTP_EXPIRY_MINUTES = 10;

  // Generate a 6-digit OTP
  static generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Store OTP for email verification
  static storeOTP(email: string, otp: string, type: 'password-reset'): void {
    const otpData: OTPData = {
      email,
      otp,
      expiresAt: Date.now() + (this.OTP_EXPIRY_MINUTES * 60 * 1000),
      type
    };

    const storedOTPs = this.getStoredOTPs();
    // Remove any existing OTPs for this email and type
    const filteredOTPs = storedOTPs.filter(
      (item: OTPData) => !(item.email === email && item.type === type)
    );
    
    filteredOTPs.push(otpData);
    localStorage.setItem(this.OTP_KEY, JSON.stringify(filteredOTPs));
  }

  // Verify OTP
  static verifyOTP(email: string, otp: string, type: 'password-reset'): boolean {
    const storedOTPs = this.getStoredOTPs();
    const otpData = storedOTPs.find(
      (item: OTPData) => item.email === email && item.type === type && item.otp === otp
    );

    if (!otpData) {
      return false;
    }

    // Check if OTP has expired
    if (Date.now() > otpData.expiresAt) {
      this.removeOTP(email, type);
      return false;
    }

    return true;
  }

  // Remove OTP after successful verification or expiry
  static removeOTP(email: string, type: 'password-reset'): void {
    const storedOTPs = this.getStoredOTPs();
    const filteredOTPs = storedOTPs.filter(
      (item: OTPData) => !(item.email === email && item.type === type)
    );
    localStorage.setItem(this.OTP_KEY, JSON.stringify(filteredOTPs));
  }

  // Get remaining time for OTP in minutes
  static getRemainingTime(email: string, type: 'password-reset'): number {
    const storedOTPs = this.getStoredOTPs();
    const otpData = storedOTPs.find(
      (item: OTPData) => item.email === email && item.type === type
    );

    if (!otpData) {
      return 0;
    }

    const remainingMs = otpData.expiresAt - Date.now();
    return Math.max(0, Math.ceil(remainingMs / (60 * 1000)));
  }

  // Clean up expired OTPs
  static cleanupExpiredOTPs(): void {
    const storedOTPs = this.getStoredOTPs();
    const validOTPs = storedOTPs.filter(
      (item: OTPData) => Date.now() <= item.expiresAt
    );
    localStorage.setItem(this.OTP_KEY, JSON.stringify(validOTPs));
  }

  private static getStoredOTPs(): OTPData[] {
    try {
      const stored = localStorage.getItem(this.OTP_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error getting stored OTPs:", error);
      return [];
    }
  }

  // Simulate sending email OTP (backend integration point)
  static async sendPasswordResetOTP(email: string): Promise<{ success: boolean; message: string }> {
    try {
      // Clean up expired OTPs first
      this.cleanupExpiredOTPs();

      const otp = this.generateOTP();
      this.storeOTP(email, otp, 'password-reset');

      // TODO: Replace with actual email service integration
      // This is where you would integrate with your email service
      console.log(`Password Reset OTP for ${email}: ${otp}`);
      console.log('Backend Integration Point: Send email with OTP via your email service');
      
      // Simulate email sending delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      return {
        success: true,
        message: 'Password reset OTP sent successfully to your email'
      };
    } catch (error) {
      console.error("Error sending password reset OTP:", error);
      return {
        success: false,
        message: 'Failed to send password reset OTP. Please try again.'
      };
    }
  }
}