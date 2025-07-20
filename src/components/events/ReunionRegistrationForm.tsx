import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users, CreditCard } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { EventService, ReunionRegistration, FeeBreakdown, ReunionPricing } from '@/services/eventService';
import { useToast } from "@/hooks/use-toast";
import BkashPaymentButton from '../payment/BkashPayment';
import RegistrationSuccessModal from './RegistrationSuccessModal';
import { getSSCYears } from '@/utils/yearUtils';

const formSchema = z.object({
  sscYear: z.string({ required_error: "Please select your SSC batch year." }),
  isCurrentStudent: z.boolean().default(false),
  bringingSpouse: z.boolean().default(false),
  numberOfKids: z.string().default("0"),
  bringingMother: z.boolean().default(false),
  bringingFather: z.boolean().default(false),
  specialRequests: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ReunionRegistrationFormProps {
  eventId: string;
  onSuccess: () => void;
}

const ReunionRegistrationForm: React.FC<ReunionRegistrationFormProps> = ({ eventId, onSuccess }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [feeBreakdown, setFeeBreakdown] = useState<FeeBreakdown>({
    baseFee: 0,
    spouseFee: 0,
    kidsFee: 0,
    parentsFee: 0,
    totalFee: 0
  });
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [pricing, setPricing] = useState<ReunionPricing>();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sscYear: user?.sscYear || "",
      isCurrentStudent: false,
      bringingSpouse: false,
      numberOfKids: "0",
      bringingMother: false,
      bringingFather: false,
      specialRequests: "",
    }
  });

  const watchValues = form.watch();

  // Load pricing and user data
  useEffect(() => {
    const reunionPricing = EventService.getReunionPricing();
    setPricing(reunionPricing);
    
    // Pre-fill user data if available
    if (user?.sscYear) {
      form.setValue("sscYear", user.sscYear);
    }
  }, [user, form]);

  // Calculate fees when form values change
  useEffect(() => {
    if (!pricing) return;
    
    const registration: ReunionRegistration = {
      sscYear: watchValues.sscYear || '',
      isCurrentStudent: watchValues.isCurrentStudent,
      bringingSpouse: watchValues.bringingSpouse,
      numberOfKids: parseInt(watchValues.numberOfKids) || 0,
      bringingMother: watchValues.bringingMother,
      bringingFather: watchValues.bringingFather
    };

    const fees = EventService.calculateReunionFees(registration, pricing);
    setFeeBreakdown(fees);
  }, [watchValues, pricing]);

  const onSubmit = async (data: FormValues) => {
    if (feeBreakdown.totalFee === 0) {
      toast({
        title: "Registration Error",
        description: "Unable to calculate registration fee. Please try again.",
        variant: "destructive",
      });
      return;
    }

    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = async (data: { paymentID: string; trxID: string }) => {
    // Complete registration data to send to backend
    const registrationData = {
      eventId,
      userId: user?.id,
      userProfile: {
        name: user?.fullName,
        email: user?.email,
        phone: user?.phoneNumber,
        sscYear: user?.sscYear,
        hscYear: user?.hscYear,
        countryCode: user?.countryCode,
        isAdmin: user?.isAdmin,
        hasMembership: user?.hasMembership
      },
      registrationDetails: {
        sscYear: watchValues.sscYear,
        isCurrentStudent: watchValues.isCurrentStudent,
        bringingSpouse: watchValues.bringingSpouse,
        numberOfKids: parseInt(watchValues.numberOfKids) || 0,
        bringingMother: watchValues.bringingMother,
        bringingFather: watchValues.bringingFather,
        specialRequests: watchValues.specialRequests
      },
      feeBreakdown,
      paymentDetails: {
        paymentID: data.paymentID,
        transactionId: data.trxID,
        amount: feeBreakdown.totalFee,
        paymentStatus: 'success',
        paymentMethod: 'bkash',
        paymentDate: new Date().toISOString()
      },
      registrationDate: new Date().toISOString(),
    };

    console.log('Complete registration data to be sent to backend:', registrationData);
    
    // TODO: Send to backend API
    // await fetch('/api/reunion-registration', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(registrationData)
    // });
    
    setShowPaymentModal(false);
    setShowSuccessModal(true);
  };

  const getPricingDisplay = () => {
    if (!pricing) return null;
    
    const currentDate = new Date();
    const earlyBirdDeadline = new Date(pricing.earlyBirdDeadline);
    const isEarlyBird = currentDate <= earlyBirdDeadline;

    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Registration Pricing
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>Regular Alumni:</span>
                <div className="flex flex-col items-end gap-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Early Bird</Badge>
                    <span className="font-semibold">৳{pricing.regularEarlyBird}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Late Owl</Badge>
                    <span className="font-semibold">৳{pricing.regularLateOwl}</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span>SSC 2020-2025:</span>
                <span className="font-semibold">৳{pricing.ssc2020to2025}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Current Students:</span>
                <span className="font-semibold">৳{pricing.currentStudent}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>Guests (each):</span>
                <span className="font-semibold">৳{pricing.guest}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                <div>Early Bird Deadline: {new Date(pricing.earlyBirdDeadline).toLocaleDateString()}</div>
                <div>Late Owl Deadline: {new Date(pricing.lateOwlDeadline).toLocaleDateString()}</div>
              </div>
              <div className="text-xs text-muted-foreground">
                *Children under 5 are free (no separate meal)
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {getPricingDisplay()}
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Registration Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="sscYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SSC Batch Year</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        disabled={watchValues.isCurrentStudent}
                      >
                        <FormControl>
                          <SelectTrigger className={watchValues.isCurrentStudent ? "opacity-50" : ""}>
                            <SelectValue placeholder="Select year" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {getSSCYears().map((year) => (
                            <SelectItem key={year} value={year}>{year}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {watchValues.isCurrentStudent && (
                        <FormDescription className="text-muted-foreground">
                          SSC batch not required for current students
                        </FormDescription>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isCurrentStudent"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Current Student</FormLabel>
                        <FormDescription>
                          I am currently studying at CPSCS
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Guest Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="bringingSpouse"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Bringing Spouse</FormLabel>
                      <FormDescription>৳{pricing?.guest || 1000}</FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="numberOfKids"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Children (Age 5+)</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select number" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[0, 1, 2, 3, 4, 5].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} {num === 0 ? '' : `(৳${(pricing?.guest || 1000) * num})`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Children under 5 are free but won't receive separate meals
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="bringingMother"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Bringing Mother</FormLabel>
                        <FormDescription>৳{pricing?.guest || 1000}</FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bringingFather"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Bringing Father</FormLabel>
                        <FormDescription>৳{pricing?.guest || 1000}</FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="specialRequests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Special Requests (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Dietary restrictions, accessibility needs, etc." 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Any special accommodations needed for you or your guests
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Fee Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Registration Fee:</span>
                  <span>৳{feeBreakdown.baseFee}</span>
                </div>
                {feeBreakdown.spouseFee > 0 && (
                  <div className="flex justify-between">
                    <span>Spouse:</span>
                    <span>৳{feeBreakdown.spouseFee}</span>
                  </div>
                )}
                {feeBreakdown.kidsFee > 0 && (
                  <div className="flex justify-between">
                    <span>Children ({watchValues.numberOfKids}):</span>
                    <span>৳{feeBreakdown.kidsFee}</span>
                  </div>
                )}
                {feeBreakdown.parentsFee > 0 && (
                  <div className="flex justify-between">
                    <span>Parents:</span>
                    <span>৳{feeBreakdown.parentsFee}</span>
                  </div>
                )}
                <hr />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total Amount:</span>
                  <span>৳{feeBreakdown.totalFee}</span>
                </div>
              </div>
              
              {!showPaymentModal ? (
                <Button 
                  type="submit" 
                  className="w-full mt-6 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary transition-all duration-300"
                  disabled={feeBreakdown.totalFee === 0}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Proceed to Payment - ৳{feeBreakdown.totalFee}
                </Button>
              ) : (
                <div className="mt-6 space-y-4">
                  <p className="text-center text-muted-foreground">
                    Complete your payment below to confirm registration
                  </p>
                  
                  <div className="flex flex-col gap-3">
                    {/* Production bKash button - will only work with live backend */}
                    <BkashPaymentButton
                      amount={feeBreakdown.totalFee}
                      invoice={`CPSCS-R25-${Date.now()}`}
                      onSuccess={handlePaymentSuccess}
                      onClose={() => setShowPaymentModal(false)}
                    />
                    
                    {/* Development bypass button */}
                    <Button 
                      onClick={() => {
                        console.log('--- DEVELOPMENT: Bypassing bKash payment ---');
                        handlePaymentSuccess({
                          paymentID: 'mock-payment-id',
                          trxID: 'mock-transaction-id'
                        });
                      }}
                      variant="outline"
                      className="w-full border-orange-500 text-orange-600 hover:bg-orange-50"
                    >
                      🚧 Bypass Payment (Dev Only)
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </form>
      </Form>

      <RegistrationSuccessModal
        open={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          onSuccess();
        }}
        eventTitle="Grand Alumni Reunion 2025"
      />
    </div>
  );
};

export default ReunionRegistrationForm;