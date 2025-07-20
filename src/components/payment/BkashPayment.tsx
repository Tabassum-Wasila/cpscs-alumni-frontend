import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { MockBkashService } from '@/services/mockBkashService';

// This lets TypeScript know that the 'bKash' object will be available on the window
declare const bKash: any;

interface BkashPaymentProps {
  amount: number;
  invoice: string;
  onSuccess: (data: { paymentID: string; trxID: string }) => void;
  onClose: () => void;
  disabled?: boolean;
}

const BkashPaymentButton: React.FC<BkashPaymentProps> = ({ 
  amount, 
  invoice, 
  onSuccess, 
  onClose, 
  disabled = false 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    // Check if bKash script is loaded
    const checkBkashLoaded = () => {
      if (typeof bKash !== 'undefined') {
        setIsScriptLoaded(true);
      } else {
        // If not loaded, check again after a short delay
        setTimeout(checkBkashLoaded, 100);
      }
    };
    
    checkBkashLoaded();
  }, []);

  const initiatePayment = async () => {
    setIsLoading(true);
    try {
      // For testing: Use mock service until backend is ready
      // TODO: Replace with real backend calls when ready
      console.log('Creating payment with mock service for testing...');
      const paymentData = await MockBkashService.createPayment(amount, invoice);
      
      console.log('Mock payment created:', paymentData);
      
      // For testing: Simulate bKash modal interaction
      // In production, this would use the real bKash library
      setTimeout(async () => {
        try {
          console.log('Executing payment with mock service...');
          const executeResult = await MockBkashService.executePayment(paymentData.paymentID);
          
          console.log('Mock payment executed:', executeResult);
          
          if (executeResult && executeResult.statusCode === '0000') {
            onSuccess({
              paymentID: executeResult.paymentID,
              trxID: executeResult.trxID
            });
          } else {
            alert(executeResult.statusMessage || 'Payment execution failed.');
          }
        } catch (error) {
          console.error('Mock payment execution error:', error);
          alert('Payment execution failed. Please try again.');
        }
        setIsLoading(false);
      }, 2000); // Simulate user interaction time
      
    } catch (error) {
      console.error('Mock payment creation error:', error);
      alert('Payment initialization failed. Please try again.');
      setIsLoading(false);
    }
  };

  const initializeBkash = (paymentData: any) => {
    bKash.init({
      paymentMode: 'checkout',
      paymentRequest: paymentData,

      // This function is called by bKash after the user authorizes the payment
      executeRequestOnAuthorization: async () => {
        try {
          // 2. Call your own backend to execute the payment
          const executeResponse = await fetch('/api/bkash/execute-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ paymentID: paymentData.paymentID }),
          });
          
          if (!executeResponse.ok) {
            throw new Error('Failed to execute payment');
          }
          
          const executeResult = await executeResponse.json();

          if (executeResult && executeResult.statusCode === '0000') {
            // Payment is successful
            bKash.execute().onSuccess(executeResult);
            onSuccess({
              paymentID: executeResult.paymentID,
              trxID: executeResult.trxID
            });
          } else {
            alert(executeResult.statusMessage || 'Payment execution failed.');
            bKash.execute().onError();
          }
        } catch (error) {
          console.error('bKash execute payment error:', error);
          alert('Payment execution failed. Please try again.');
          bKash.execute().onError();
        }
        setIsLoading(false);
      },
      
      onClose: () => {
        setIsLoading(false);
        onClose();
      },
    });

    // All setup is done, now trigger the bKash modal
    bKash.create().onClick();
  };

  const isButtonDisabled = disabled || isLoading || !isScriptLoaded || !amount || amount <= 0;

  return (
    <Button
      onClick={initiatePayment}
      disabled={isButtonDisabled}
      className="w-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105"
      size="lg"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing Payment...
        </>
      ) : !isScriptLoaded ? (
        'Loading bKash...'
      ) : (
        `Pay ${amount.toLocaleString()} BDT with bKash`
      )}
    </Button>
  );
};

export default BkashPaymentButton;