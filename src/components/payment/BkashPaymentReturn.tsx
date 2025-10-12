import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, AlertCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { BkashService } from '@/services/bkashService';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface PaymentContext {
  type: string;
  invoice: string;
  amount: number;
  description: string;
  timestamp: number;
}

const BkashPaymentReturn: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(true);
  const [paymentResult, setPaymentResult] = useState<{
    status: 'success' | 'failed' | 'cancelled' | 'error';
    message: string;
    transactionId?: string;
    paymentId?: string;
  } | null>(null);

  useEffect(() => {
    const processPaymentReturn = async () => {
      try {
        // Parse URL parameters
        const returnParams = BkashService.parseReturnParams(searchParams);
        const { status, paymentID } = returnParams;

        // Get payment context from session storage
        const contextStr = sessionStorage.getItem('bkash_payment_context');
        const paymentContext: PaymentContext | null = contextStr ? JSON.parse(contextStr) : null;

        if (!paymentContext) {
          throw new Error('Payment context not found');
        }

        // Handle different return statuses
        switch (status) {
          case 'success':
            if (!paymentID) {
              throw new Error('Payment ID not provided');
            }
            await handleSuccessfulPayment(paymentID, paymentContext);
            break;

          case 'failed':
            setPaymentResult({
              status: 'failed',
              message: 'Payment failed. Please try again.',
              paymentId: paymentID || undefined
            });
            break;

          case 'cancelled':
            setPaymentResult({
              status: 'cancelled',
              message: 'Payment was cancelled by user.',
              paymentId: paymentID || undefined
            });
            break;

          default:
            throw new Error('Invalid payment status');
        }
      } catch (error) {
        console.error('Payment processing error:', error);
        setPaymentResult({
          status: 'error',
          message: error instanceof Error ? error.message : 'An unexpected error occurred'
        });
      } finally {
        setIsProcessing(false);
        // Clean up session storage
        sessionStorage.removeItem('bkash_payment_context');
        sessionStorage.removeItem('bkash_payment_id');
      }
    };

    processPaymentReturn();
  }, [searchParams]);

  const handleSuccessfulPayment = async (paymentID: string, context: PaymentContext) => {
    try {
      // Execute the payment
      const executeResult = await BkashService.executePayment({ paymentID });

      if (executeResult.success && executeResult.data) {
        const { trxID, amount, transactionStatus } = executeResult.data;

        if (transactionStatus === 'Completed') {
          setPaymentResult({
            status: 'success',
            message: 'Payment completed successfully!',
            transactionId: trxID,
            paymentId: paymentID
          });

          // Show success toast
          toast({
            title: "Payment Successful",
            description: `Transaction ID: ${trxID}`,
            variant: "default",
          });

          // If this was a reunion registration payment, trigger registration completion
          if (context.type === 'reunion-registration') {
            // Store payment details for registration completion
            const paymentDetails = {
              paymentID,
              transactionId: trxID,
              amount: parseFloat(amount),
              paymentStatus: 'success',
              paymentMethod: 'bkash',
              paymentDate: new Date().toISOString()
            };

            // Trigger custom event for registration completion
            window.dispatchEvent(new CustomEvent('bkash-payment-success', {
              detail: paymentDetails
            }));

            // Redirect to event page after a short delay
            setTimeout(() => {
              navigate('/events/grand-reunion-2025');
            }, 3000);
          }
        } else {
          throw new Error(`Payment execution failed: ${transactionStatus}`);
        }
      } else {
        throw new Error(executeResult.error || 'Payment execution failed');
      }
    } catch (error) {
      console.error('Payment execution error:', error);
      setPaymentResult({
        status: 'error',
        message: error instanceof Error ? error.message : 'Payment execution failed'
      });
    }
  };

  const getStatusIcon = () => {
    if (isProcessing) {
      return <Loader2 className="animate-spin text-blue-500" size={48} />;
    }

    switch (paymentResult?.status) {
      case 'success':
        return <CheckCircle className="text-green-500" size={48} />;
      case 'failed':
      case 'error':
        return <XCircle className="text-red-500" size={48} />;
      case 'cancelled':
        return <AlertCircle className="text-orange-500" size={48} />;
      default:
        return <AlertCircle className="text-gray-500" size={48} />;
    }
  };

  const getStatusColor = () => {
    switch (paymentResult?.status) {
      case 'success':
        return 'text-green-700';
      case 'failed':
      case 'error':
        return 'text-red-700';
      case 'cancelled':
        return 'text-orange-700';
      default:
        return 'text-gray-700';
    }
  };

  const getBackgroundColor = () => {
    switch (paymentResult?.status) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'failed':
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'cancelled':
        return 'bg-orange-50 border-orange-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow pt-24 pb-16 bg-background flex items-center justify-center">
        <div className="container mx-auto px-4 max-w-md">
          <Card className={`${getBackgroundColor()} border-2`}>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                {getStatusIcon()}
              </div>
              <CardTitle className={`text-xl ${getStatusColor()}`}>
                {isProcessing ? 'Processing Payment...' : 
                 paymentResult?.status === 'success' ? 'Payment Successful!' :
                 paymentResult?.status === 'failed' ? 'Payment Failed' :
                 paymentResult?.status === 'cancelled' ? 'Payment Cancelled' :
                 'Payment Error'}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className={`${getStatusColor()}`}>
                {isProcessing ? 'Please wait while we process your payment...' : paymentResult?.message}
              </p>

              {paymentResult?.transactionId && (
                <div className="bg-white p-3 rounded border">
                  <p className="text-sm text-gray-600">Transaction ID:</p>
                  <p className="font-mono font-semibold text-green-700">{paymentResult.transactionId}</p>
                </div>
              )}

              {paymentResult?.paymentId && (
                <div className="bg-white p-3 rounded border">
                  <p className="text-sm text-gray-600">Payment ID:</p>
                  <p className="font-mono text-sm text-gray-700">{paymentResult.paymentId}</p>
                </div>
              )}

              {!isProcessing && (
                <div className="space-y-2 pt-4">
                  {paymentResult?.status === 'success' ? (
                    <p className="text-sm text-gray-600">
                      You will be redirected to the event page shortly...
                    </p>
                  ) : (
                    <div className="space-y-2">
                      <Button 
                        onClick={() => navigate('/events/grand-reunion-2025')}
                        className="w-full"
                      >
                        Return to Event Page
                      </Button>
                      {(paymentResult?.status === 'failed' || paymentResult?.status === 'error') && (
                        <Button 
                          variant="outline"
                          onClick={() => window.location.reload()}
                          className="w-full"
                        >
                          Try Again
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BkashPaymentReturn;
