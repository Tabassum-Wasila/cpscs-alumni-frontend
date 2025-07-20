import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

// This lets TypeScript know that the 'bKash' object from index.html is available
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

  const initiatePayment = async () => {
    setIsLoading(true);
    try {
      // 1. Call YOUR OWN BACKEND to create a payment session.
      // This endpoint must be live for this to work.
      const createResponse = await fetch('/api/bkash/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, invoice }),
      });
      const paymentData = await createResponse.json();

      // The bKash modal will only initialize with a REAL paymentID from the bKash server.
      if (paymentData && paymentData.paymentID) {
        initializeBkash(paymentData);
      } else {
        throw new Error(paymentData.statusMessage || 'Failed to initialize payment.');
      }
    } catch (error) {
      console.error('bKash create payment error:', error);
      alert('Payment initialization failed. Please try again. (Is the backend running?)');
      setIsLoading(false);
    }
  };

  const initializeBkash = (paymentData: any) => {
    bKash.init({
      paymentMode: 'checkout',
      paymentRequest: paymentData,
      executeRequestOnAuthorization: async () => {
        try {
          // 2. Call YOUR OWN BACKEND to execute the payment.
          const executeResponse = await fetch('/api/bkash/execute-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ paymentID: paymentData.paymentID }),
          });
          const executeResult = await executeResponse.json();

          if (executeResult && executeResult.statusCode === '0000') {
            bKash.execute().onError(); // Close the modal
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
          bKash.execute().onError();
        }
      },
      onClose: () => {
        setIsLoading(false);
        onClose();
      },
    });
    // Trigger the bKash modal
    bKash.create().onClick();
  };

  const isButtonDisabled = disabled || isLoading || !amount || amount <= 0;

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
      ) : (
        `Pay ${amount.toLocaleString()} BDT with bKash`
      )}
    </Button>
  );
};

export default BkashPaymentButton;