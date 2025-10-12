
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { BkashService, BkashCreatePaymentRequest } from '@/services/bkashService';

interface PaymentModalProps {
  amount: number;
  description: string;
  invoice?: string;
  reference?: string;
  onSuccess: (transactionData: any) => void;
  onCancel: () => void;
  onError?: (error: string) => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ 
  amount, 
  description, 
  invoice,
  reference,
  onSuccess, 
  onCancel,
  onError 
}) => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleBkashPayment = async () => {
    setIsProcessing(true);
    
    try {
      toast({
        title: "Initializing Payment",
        description: "Setting up bKash payment...",
      });

      // Generate unique invoice if not provided
      const paymentInvoice = invoice || BkashService.generateInvoiceNumber('REUNION');
            
      // Store payment context in sessionStorage for return handling
      const paymentContext = {
        type: 'reunion-registration',
        invoice: paymentInvoice,
        amount,
        description,
        timestamp: Date.now()
      };
      sessionStorage.setItem('bkash_payment_context', JSON.stringify(paymentContext));

      // Create payment request matching expected bkash fields
      const paymentRequest: BkashCreatePaymentRequest = {
        amount,
        currency: 'BDT',
        intent: 'sale',
        mode: '0011',
        payerReference: '01770618575',
        merchantInvoiceNumber: `Reunion Registration - ${paymentInvoice}`,
        callbackURL: 'https://alumnicpscs.org/bkash-callback'
        // "https://b5619000018e.ngrok-free.app/api/bkash/callback"

      };

      // Call backend to create bKash payment
      const result = await BkashService.createPayment(paymentRequest);

      console.log("Create Payment Response:", result.data);
      
      if (result.success && result.data?.bkashURL) {
        toast({
          title: "Redirecting to bKash",
          description: "You will be redirected to bKash payment page...",
        });

        // Store payment ID for later execution
        sessionStorage.setItem('bkash_payment_id', result.data.paymentID);
        
        // Redirect to bKash payment page
        window.location.href = result.data.bkashURL;
      } else {
        throw new Error(result.error || 'Failed to initialize payment');
      }
    } catch (error) {
      console.error('Payment initialization error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Payment initialization failed';
      
      toast({
        title: "Payment Failed",
        description: errorMessage,
        variant: "destructive",
      });

      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const paymentInstructions = [
    'Click "Pay with bKash" below',
    'You will be redirected to bKash payment page',
    'Enter your bKash mobile number',
    'Enter your bKash PIN to confirm payment',
    'You will be redirected back after payment'
  ];

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#E2136E] rounded flex items-center justify-center">
              <CreditCard className="text-white" size={16} />
            </div>
            bKash Payment
          </CardTitle>
          <CardDescription>
            Complete your payment securely with bKash
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-lg border text-center">
            <p className="font-semibold text-gray-700 mb-2">{description}</p>
            <p className="text-3xl font-bold text-[#E2136E]">৳{amount.toLocaleString()}</p>
          </div>
          
          <div className="space-y-3">
            <p className="text-sm font-medium">Payment Process:</p>
            <ol className="list-decimal pl-5 text-sm space-y-1 text-gray-600">
              {paymentInstructions.map((instruction, index) => (
                <li key={index}>{instruction}</li>
              ))}
            </ol>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-xs text-amber-800">
              <strong>Note:</strong> Make sure you have sufficient balance in your bKash account. 
              The payment page will open in the same window.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button 
            onClick={handleBkashPayment}
            disabled={isProcessing}
            className="w-full bg-[#E2136E] hover:bg-[#c11160] flex items-center justify-center gap-2 py-6 text-white font-semibold"
          >
            {isProcessing ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Initializing Payment...
              </>
            ) : (
              <>
                <CreditCard size={18} />
                Pay with bKash
              </>
            )}
          </Button>
          <Button 
            variant="outline" 
            onClick={onCancel}
            disabled={isProcessing}
            className="w-full"
          >
            Cancel
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PaymentModal;
