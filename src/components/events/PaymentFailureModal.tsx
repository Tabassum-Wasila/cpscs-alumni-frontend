import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertCircle, XCircle, Clock } from 'lucide-react';

interface PaymentFailureModalProps {
  open: boolean;
  onClose: () => void;
  onRetry: () => void;
  reason?: 'cancelled' | 'failed' | 'timeout' | 'error';
}

const PaymentFailureModal: React.FC<PaymentFailureModalProps> = ({ 
  open, 
  onClose, 
  onRetry, 
  reason = 'failed' 
}) => {
  const getFailureContent = () => {
    switch (reason) {
      case 'cancelled':
        return {
          icon: <XCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />,
          title: 'Payment Cancelled',
          message: 'You cancelled the payment process. No charges were made to your account.',
          buttonText: 'Try Again'
        };
      case 'timeout':
        return {
          icon: <Clock className="h-16 w-16 text-orange-500 mx-auto mb-4" />,
          title: 'Payment Timeout',
          message: 'The payment session has expired. Please try again to complete your registration.',
          buttonText: 'Retry Payment'
        };
      case 'error':
        return {
          icon: <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />,
          title: 'Payment Error',
          message: 'An unexpected error occurred during payment processing. Please try again or contact support.',
          buttonText: 'Try Again'
        };
      default:
        return {
          icon: <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />,
          title: 'Payment Failed',
          message: 'Your payment could not be processed at this time. Please check your payment details and try again.',
          buttonText: 'Retry Payment'
        };
    }
  };

  const content = getFailureContent();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md text-center">
        <DialogHeader>
          <DialogTitle className="sr-only">{content.title}</DialogTitle>
        </DialogHeader>
        
        <div className="py-6">
          <div className="animate-pulse">
            {content.icon}
          </div>
          
          <h3 className="text-xl font-semibold text-foreground mb-2">
            {content.title}
          </h3>
          
          <p className="text-muted-foreground mb-6 leading-relaxed">
            {content.message}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={onRetry}
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary transition-all duration-300"
            >
              {content.buttonText}
            </Button>
            
            <Button
              variant="outline"
              onClick={onClose}
            >
              Go Back
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground mt-4">
            If the problem persists, please contact our support team for assistance.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentFailureModal;