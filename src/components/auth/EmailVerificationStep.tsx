import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { AuthService } from '@/services/authService';
import { Loader2 } from 'lucide-react';

const emailSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

type EmailFormValues = z.infer<typeof emailSchema>;

interface EmailVerificationStepProps {
  onNext: (email: string) => void;
  onCancel: () => void;
}

const EmailVerificationStep: React.FC<EmailVerificationStepProps> = ({ onNext, onCancel }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    }
  });

  const onSubmit = async (data: EmailFormValues) => {
    setIsLoading(true);
    try {
      const result = await AuthService.sendPasswordResetOTP(data.email);
      
      if (result.success) {
        toast({
          title: "OTP Sent",
          description: result.message,
        });
        onNext(data.email);
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send OTP. Please try again." + error,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input 
                    type="email" 
                    placeholder="you@example.com" 
                    {...field} 
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex flex-col-reverse sm:flex-row gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-cpscs-blue to-blue-700"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Send OTP
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EmailVerificationStep;