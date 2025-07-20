import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { MockBkashService } from '@/services/mockBkashService';

// This lets TypeScript know that the 'bKash' object will be available on the window
declare const bKash: any;
declare global {
  interface Window {
    bKash: any;
  }
}

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
    let attempts = 0;
    const maxAttempts = 50; // Wait up to 5 seconds
    
    // Check if bKash script is loaded
    const checkBkashLoaded = () => {
      attempts++;
      console.log(`Attempt ${attempts}: Checking bKash loaded...`);
      console.log('- typeof bKash:', typeof bKash);
      console.log('- window.bKash:', typeof window.bKash);
      console.log('- Available window properties:', Object.keys(window).filter(key => key.toLowerCase().includes('bkash')));
      
      if (typeof bKash !== 'undefined' || typeof window.bKash !== 'undefined') {
        console.log('✅ bKash is loaded successfully');
        setIsScriptLoaded(true);
        return;
      }
      
      if (attempts < maxAttempts) {
        console.log('❌ bKash not loaded yet, retrying...');
        setTimeout(checkBkashLoaded, 100);
      } else {
        console.error('❌ bKash script failed to load after maximum attempts');
        setIsScriptLoaded(false);
      }
    };
    
    // Start checking immediately
    checkBkashLoaded();
  }, []);

  const initiatePayment = async () => {
    console.log('=== BKASH PAYMENT INITIALIZATION ===');
    console.log('Script loaded:', isScriptLoaded);
    console.log('bKash object:', typeof bKash !== 'undefined');
    console.log('window.bKash:', typeof window.bKash !== 'undefined');
    
    if (!isScriptLoaded || typeof bKash === 'undefined') {
      console.error('bKash script not loaded');
      alert('bKash payment system is not ready. Please try again.');
      return;
    }

    setIsLoading(true);
    try {
      // Use mock service to get payment data, but show real bKash modal
      console.log('Creating payment with mock service for testing...');
      const paymentData = await MockBkashService.createPayment(amount, invoice);
      
      console.log('Mock payment created:', paymentData);
      
      if (paymentData && paymentData.paymentID) {
        console.log('Initializing bKash with payment data...');
        initializeBkash(paymentData);
      } else {
        throw new Error(paymentData.statusMessage || 'Failed to initialize payment.');
      }
    } catch (error) {
      console.error('Mock payment creation error:', error);
      alert('Payment initialization failed. Please try again.');
      setIsLoading(false);
    }
  };

  const initializeBkash = (paymentData: any) => {
    try {
      // Initialize bKash with the correct API structure
      bKash.init({
        paymentMode: 'checkout',
        paymentRequest: {
          amount: paymentData.amount,
          intent: paymentData.intent,
          currency: paymentData.currency,
          merchantInvoiceNumber: paymentData.merchantInvoiceNumber
        },
        createRequest: function(request: any) {
          console.log('bKash createRequest called:', request);
          // This is automatically handled by the init
        },
        executeRequestOnAuthorization: function() {
          console.log('bKash executeRequestOnAuthorization called');
          // Execute the payment using mock service
          MockBkashService.executePayment(paymentData.paymentID).then(executeResult => {
            console.log('Mock payment executed:', executeResult);
            
            if (executeResult && executeResult.statusCode === '0000') {
              // Call bKash success callback
              bKash.execute().onSuccess(executeResult);
              setIsLoading(false);
              onSuccess({
                paymentID: executeResult.paymentID,
                trxID: executeResult.trxID
              });
            } else {
              bKash.execute().onError();
              setIsLoading(false);
              alert(executeResult.statusMessage || 'Payment execution failed.');
            }
          }).catch(error => {
            console.error('Mock payment execution error:', error);
            bKash.execute().onError();
            setIsLoading(false);
            alert('Payment execution failed. Please try again.');
          });
        },
        onClose: function() {
          console.log('bKash modal closed');
          setIsLoading(false);
          onClose();
        }
      });

      // Create and trigger the checkout
      bKash.create().onSuccess(function(data: any) {
        console.log('bKash checkout success:', data);
        // This will trigger executeRequestOnAuthorization
      }).onClose(function() {
        console.log('bKash checkout closed');
        setIsLoading(false);
        onClose();
      }).onClick();
      
    } catch (error) {
      console.error('bKash initialization error:', error);
      setIsLoading(false);
      alert('Failed to initialize bKash payment. Please try again.');
    }
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