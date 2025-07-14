import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAuth } from '@/contexts/AuthContext';
import { Event } from '@/services/eventService';
import { Loader2 } from 'lucide-react';

const registrationSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  sscYear: z.string().min(4, 'SSC year is required'),
  hscYear: z.string().optional(),
  phone: z.string().min(10, 'Valid phone number is required'),
  email: z.string().email('Valid email is required'),
  whyAttend: z.string().optional()
});

type RegistrationForm = z.infer<typeof registrationSchema>;

interface EventRegistrationFormProps {
  event: Event;
  onSuccess: () => void;
}

const EventRegistrationForm: React.FC<EventRegistrationFormProps> = ({ event, onSuccess }) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<RegistrationForm>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      fullName: user?.fullName || '',
      sscYear: user?.sscYear || '',
      hscYear: user?.hscYear || '',
      phone: user?.phoneNumber || '',
      email: user?.email || '',
      whyAttend: ''
    }
  });

  const onSubmit = async (data: RegistrationForm) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call - replace with actual backend integration
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Event registration:', {
        eventId: event.id,
        eventTitle: event.title,
        ...data,
        registeredAt: new Date().toISOString()
      });
      
      onSuccess();
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name *</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter your full name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="sscYear"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SSC Year *</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g., 2015" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hscYear"
            render={({ field }) => (
              <FormItem>
                <FormLabel>HSC Year</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g., 2017" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number *</FormLabel>
              <FormControl>
                <Input {...field} placeholder="+880 1234567890" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address *</FormLabel>
              <FormControl>
                <Input {...field} type="email" placeholder="your@email.com" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="whyAttend"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Why do you want to attend? (Optional)</FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  placeholder="Share your excitement or expectations..."
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary transition-all duration-300"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Registering...
            </>
          ) : (
            'Complete Registration'
          )}
        </Button>
      </form>
    </Form>
  );
};

export default EventRegistrationForm;