
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PaymentService } from '@/services/paymentService';

interface PaymentModalProps {
  amount: number;
  description: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ amount, description, onSuccess, onCancel }) => {
  const { toast } = useToast();

  const handleBkashPayment = async () => {
    toast({
      title: "Payment Processing",
      description: "Connecting to bKash...",
    });
    
    const paymentConfig = {
      amount,
      currency: 'BDT',
      description,
      reference: 'CPSCS Alumni'
    };

    const result = await PaymentService.processBkashPayment(paymentConfig);
    
    if (result.success) {
      toast({
        title: "Payment Successful",
        description: `Transaction ID: ${result.transactionId}`,
        variant: "default",
      });
      onSuccess();
    } else {
      toast({
        title: "Payment Failed",
        description: result.error || "Payment could not be processed.",
        variant: "destructive",
      });
    }
  };

  const paymentInstructions = PaymentService.getPaymentInstructions({
    amount,
    currency: 'BDT',
    description,
    reference: 'CPSCS Alumni'
  });

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md animate-fade-in">
        <CardHeader>
          <CardTitle>bKash Payment</CardTitle>
          <CardDescription>
            Complete your payment securely with bKash
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-white p-4 rounded-lg border text-center">
            <p className="font-bold text-lg mb-2">{description}</p>
            <p className="text-3xl font-bold text-cpscs-blue">৳{amount}</p>
          </div>
          
          <div className="space-y-3">
            <p className="text-sm">Please follow these steps:</p>
            <ol className="list-decimal pl-5 text-sm space-y-1">
              {paymentInstructions.map((instruction, index) => (
                <li key={index}>{instruction}</li>
              ))}
            </ol>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button 
            onClick={handleBkashPayment}
            className="w-full bg-[#E2136E] hover:bg-[#c11160] flex items-center justify-center gap-2 py-6"
          >
            <CreditCard size={18} />
            Pay with bKash
          </Button>
          <Button 
            variant="outline" 
            onClick={onCancel}
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
