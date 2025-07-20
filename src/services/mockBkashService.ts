// Mock bKash service for testing until backend is ready
export class MockBkashService {
  static async createPayment(amount: number, invoice: string) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock successful payment creation response
    return {
      statusCode: '0000',
      statusMessage: 'Successful',
      paymentID: `BKASH_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      bkashURL: '#', // Mock URL
      amount: amount.toString(),
      intent: 'sale',
      currency: 'BDT',
      invoice,
      paymentCreateTime: new Date().toISOString(),
      transactionStatus: 'Initiated',
      merchantInvoiceNumber: invoice
    };
  }

  static async executePayment(paymentID: string) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock successful payment execution response
    return {
      statusCode: '0000',
      statusMessage: 'Successful',
      paymentID,
      trxID: `BKASH_TRX_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      amount: '1500', // This would come from the original payment
      currency: 'BDT',
      intent: 'sale',
      paymentExecuteTime: new Date().toISOString(),
      transactionStatus: 'Completed',
      merchantInvoiceNumber: `CPSCS-R25-${Date.now()}`
    };
  }
}