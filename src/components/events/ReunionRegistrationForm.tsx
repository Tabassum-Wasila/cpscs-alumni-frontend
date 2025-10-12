import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Calendar, Clock, MapPin, Users, CreditCard, ChevronDown, Shirt, Package } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { EventService, ReunionRegistration, FeeBreakdown, ReunionPricing } from '@/services/eventService';
import { useToast } from "@/hooks/use-toast";
import BkashPaymentButton from '../payment/BkashPayment';
import RegistrationSuccessModal from './RegistrationSuccessModal';
import TShirtSizeGuideModal from './TShirtSizeGuideModal';
import PaymentFailureModal from './PaymentFailureModal';
import PaymentModal from '../PaymentModal';
import { BkashService } from '@/services/bkashService';
import { ReunionRegistrationService, ReunionRegistrationRequest } from '@/services/reunionRegistrationService';
import { getSSCYears } from '@/utils/yearUtils';

const formSchema = z.object({
  sscYear: z.string().min(1, "SSC batch year is required."),
  isCurrentStudent: z.boolean().default(false),
  
  // Gifts and Goodies - Required fields
  tshirtSize: z.enum(['S', 'M', 'L', 'XL', 'XXL'], { required_error: "Please select your T-shirt size." }),
  collectionMethod: z.enum(['event-booth', 'batch-coordinator'], { required_error: "Please select how you want to collect your reunion kit." }),
  
  // Guest Information - Checkboxes
  bringingSpouse: z.boolean().default(false),
  spouseName: z.string().optional(),
  bringingFather: z.boolean().default(false),
  fatherName: z.string().optional(),
  bringingMother: z.boolean().default(false),
  motherName: z.string().optional(),
  bringingChildren: z.boolean().default(false),
  numberOfChildren: z.number().min(0).max(7).default(0),
  childNames: z.array(z.string()).optional(),
  bringingOther: z.boolean().default(false),
  otherRelation: z.string().optional(),
  otherName: z.string().optional(),
  
  // Volunteer section
  wantsToVolunteer: z.boolean().default(false),
  
  specialRequests: z.string().optional(),
}).refine((data) => {
  // Conditional validation for expanded sections
  if (data.bringingSpouse && !data.spouseName?.trim()) {
    return false;
  }
  if (data.bringingFather && !data.fatherName?.trim()) {
    return false;
  }
  if (data.bringingMother && !data.motherName?.trim()) {
    return false;
  }
  if (data.bringingChildren && data.numberOfChildren > 0) {
    const requiredNames = data.numberOfChildren;
    const providedNames = data.childNames?.filter(name => name.trim()).length || 0;
    return providedNames === requiredNames;
  }
  if (data.bringingOther && (!data.otherRelation?.trim() || !data.otherName?.trim())) {
    return false;
  }
  return true;
}, {
  message: "Please fill in all required guest information fields.",
});

type FormValues = z.infer<typeof formSchema>;

interface ReunionRegistrationFormProps {
  eventId: string;
  onSuccess: () => void;
}

const ReunionRegistrationForm: React.FC<ReunionRegistrationFormProps> = ({ eventId, onSuccess }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [feeBreakdown, setFeeBreakdown] = useState<FeeBreakdown>({
    baseFee: 0,
    spouseFee: 0,
    fatherFee: 0,
    motherFee: 0,
    childrenFee: 0,
    otherGuestFee: 0,
    totalFee: 0
  });
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentOption, setPaymentOption] = useState<'bkash' | 'offline'>('bkash');
  const [showOfflineModal, setShowOfflineModal] = useState(false);
  const [showRegistrationPointModal, setShowRegistrationPointModal] = useState(false);
  const [offlinePaidFrom, setOfflinePaidFrom] = useState('');
  const [offlineTrxId, setOfflineTrxId] = useState('');
  const [offlineVerifiedBy, setOfflineVerifiedBy] = useState('');
  const [offlineCodeType, setOfflineCodeType] = useState<'secret' | 'trx'>('trx');
  const [offlineSecretCode, setOfflineSecretCode] = useState('');
  const [showCustomSuccessModal, setShowCustomSuccessModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFailureModal, setShowFailureModal] = useState(false);
  const [paymentFailureReason, setPaymentFailureReason] = useState<'cancelled' | 'failed' | 'timeout' | 'error'>('failed');
  const [pricing, setPricing] = useState<ReunionPricing>();
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sscYear: user?.sscYear || "",
      isCurrentStudent: false,
      tshirtSize: undefined,
      collectionMethod: undefined,
      bringingSpouse: false,
      bringingFather: false,
      bringingMother: false,
      bringingChildren: false,
      numberOfChildren: 0,
      bringingOther: false,
      wantsToVolunteer: false,
      specialRequests: "",
    }
  });

  const watchValues = form.watch();

  // Load pricing and user data
  useEffect(() => {
    const loadPricing = async () => {
      try {
        const reunionPricing = await EventService.getReunionPricing(eventId);
        setPricing(reunionPricing);
      } catch (error) {
        console.error('Failed to load reunion pricing:', error);
        // Use default pricing from EventService if API fails
      }
    };

    loadPricing();
    
    // Pre-fill user data if available
    if (user?.sscYear) {
      form.setValue("sscYear", user.sscYear);
    }
  }, [user, form, eventId]);

  // Handle URL parameters for payment success/failure from bKash redirect
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment');
    const trxID = urlParams.get('trxID');
    const paymentID = urlParams.get('paymentID');
    const reason = urlParams.get('reason');
    
    if (paymentStatus === 'success' && trxID && paymentID) {
      // Handle successful payment
      handlePaymentSuccess({ paymentID, trxID });
      // Clean up URL parameters
      window.history.replaceState({}, '', window.location.pathname);
    } else if (paymentStatus === 'failed' || paymentStatus === 'cancelled') {
      // Handle failed payment
      setPaymentFailureReason((reason as any) || 'failed');
      setShowFailureModal(true);
      // Clean up URL parameters
      window.history.replaceState({}, '', window.location.pathname);
    }

    // Listen for bKash payment success events from payment return page
    const handleBkashSuccess = (event: CustomEvent) => {
      const paymentDetails = event.detail;
      handlePaymentSuccess({
        paymentID: paymentDetails.paymentID,
        trxID: paymentDetails.transactionId
      });
    };

    window.addEventListener('bkash-payment-success', handleBkashSuccess as EventListener);
    
    return () => {
      window.removeEventListener('bkash-payment-success', handleBkashSuccess as EventListener);
    };
  }, []);

  // Calculate fees when form values change
  useEffect(() => {
    if (!pricing) return;
    
    const registration: ReunionRegistration = {
      sscYear: watchValues.sscYear || '',
      isCurrentStudent: watchValues.isCurrentStudent,
      tshirtSize: watchValues.tshirtSize || 'M',
      collectionMethod: watchValues.collectionMethod || 'event-booth',
      spouse: watchValues.bringingSpouse ? { name: watchValues.spouseName || '' } : undefined,
      father: watchValues.bringingFather ? { name: watchValues.fatherName || '' } : undefined,
      mother: watchValues.bringingMother ? { name: watchValues.motherName || '' } : undefined,
      children: watchValues.bringingChildren && watchValues.numberOfChildren > 0 ? {
        numberOfChildren: watchValues.numberOfChildren,
        names: watchValues.childNames || []
      } : undefined,
      other: watchValues.bringingOther ? {
        relation: watchValues.otherRelation || '',
        name: watchValues.otherName || ''
      } : undefined,
      wantsToVolunteer: watchValues.wantsToVolunteer,
      specialRequests: watchValues.specialRequests
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

    // open modal based on selected option
    // Note: the QR / bKash instructions modal (existing) is shown for the 'bkash' option.
    // The new "registration point" modal is shown for the offline registration-point option.
    if (paymentOption === 'bkash') {
      setShowOfflineModal(true);
    } else {
      setShowRegistrationPointModal(true);
    }
  };

  const onInvalidSubmit = (errors: any) => {
    console.log('Form submission failed due to validation errors:', errors);
    toast({
      title: "Form Validation Error",
      description: "Please fill in all required fields before proceeding to payment.",
      variant: "destructive",
    });
  };

  const handlePaymentSuccess = async (
    data: { paymentID: string; trxID: string },
    metadata?: { paidFromNumber?: string; verifiedBy?: string; secretCode?: string }
  ) => {
    try {
      setLoading(true);
      
      // Prepare registration data for the API using the ReunionRegistrationRequest shape
      const registrationData: ReunionRegistrationRequest = {
        eventId: eventId,
        userId: user?.id || '',
        userProfile: {
          name: user?.fullName || '',
          email: user?.email || '',
          phone: user?.phoneNumber || '',
          sscYear: user?.sscYear || watchValues.sscYear || '',
          countryCode: user?.countryCode || '' ,
          hasMembership: !!user?.hasMembership,
        },
        registrationDetails: {
          sscYear: watchValues.sscYear,
          isCurrentStudent: watchValues.isCurrentStudent,
          tshirtSize: watchValues.tshirtSize || 'M',
          collectionMethod: watchValues.collectionMethod || 'event-booth',
          spouse: watchValues.bringingSpouse ? { name: watchValues.spouseName || '' } : null,
          father: watchValues.bringingFather ? { name: watchValues.fatherName || '' } : null,
          mother: watchValues.bringingMother ? { name: watchValues.motherName || '' } : null,
          children: watchValues.bringingChildren && watchValues.numberOfChildren > 0 ? {
            numberOfChildren: watchValues.numberOfChildren,
            names: watchValues.childNames || []
          } : null,
          other: watchValues.bringingOther ? { relation: watchValues.otherRelation || '', name: watchValues.otherName || '' } : null,
          wantsToVolunteer: watchValues.wantsToVolunteer,
          specialRequests: watchValues.specialRequests || undefined,
        },
        feeBreakdown: {
          baseFee: feeBreakdown.baseFee,
          spouseFee: feeBreakdown.spouseFee,
          fatherFee: feeBreakdown.fatherFee,
          motherFee: feeBreakdown.motherFee,
          childrenFee: feeBreakdown.childrenFee,
          otherGuestFee: feeBreakdown.otherGuestFee,
          totalFee: feeBreakdown.totalFee,
        },
        paymentDetails: {
          paymentID: data.paymentID,
          transactionId: data.trxID,
          amount: feeBreakdown.totalFee,
          paymentStatus: 'pending', // will be updated by backend after verification
          paymentMethod: paymentOption === 'bkash' ? 'bkash' : 'offline',
          paymentDate: new Date().toISOString(),
          payment_payer_number: metadata?.paidFromNumber || undefined,
          verified_by: metadata?.verifiedBy || undefined,
          secret_code: metadata?.secretCode || null,
        },
        registrationDate: new Date().toISOString(),
      };

      // Submit registration to backend
      const result = await ReunionRegistrationService.submitRegistration(registrationData);
      
      console.log('Registration submitted successfully:', result);
      
  setShowPaymentModal(false);
  setShowOfflineModal(false);
  // show custom success modal with required message
  // setShowCustomSuccessModal(true);
  setShowSuccessModal(true);
      
    } catch (error) {
      console.error('Registration submission failed:', error);
      alert('Registration submission failed. Please contact support.');
    } finally {
      setLoading(false);
    }
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
              
              {pricing.youngAlumniDiscountEnabled && (
                <div className="flex justify-between items-center">
                  <span>Young Alumni ({pricing.youngAlumniEligibleYears.start} - {pricing.youngAlumniEligibleYears.end}):</span>
                  <span className="font-semibold">৳{pricing.youngAlumni}</span>
                </div>
              )}
              
              {pricing.currentStudentAttendanceEnabled && (
                <div className="flex justify-between items-center">
                  <span>Current Students:</span>
                  <span className="font-semibold">N/A</span>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>Family & Children (5+):</span>
                <span className="font-semibold">৳{pricing.familyAndChildren}</span>
              </div>
                <div className="text-sm text-muted-foreground">
                  <div>Early Bird Deadline: {EventService.formatDateForDisplay(pricing.earlyBirdDeadline)}</div>
                  <div>Late Owl Deadline: {EventService.formatDateForDisplay(pricing.lateOwlDeadline)}</div>
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

  // Generate child name fields based on number of children
  const renderChildNameFields = () => {
    if (!watchValues.bringingChildren || watchValues.numberOfChildren === 0) {
      return null;
    }

    const fields = [];
    for (let i = 0; i < watchValues.numberOfChildren; i++) {
      fields.push(
        <FormField
          key={i}
          control={form.control}
          name={`childNames.${i}` as any}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Child Name {i + 1}</FormLabel>
              <FormControl>
                <Input {...field} placeholder={`Enter child ${i + 1} name`} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );
    }
    return <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{fields}</div>;
  };

  return (
    <div className="space-y-6">
      {getPricingDisplay()}
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, onInvalidSubmit)} className="space-y-8">
          {/* Registration Details */}
          <Card className="border-2 hover:border-primary/20 transition-colors duration-300 shadow-lg hover:shadow-xl">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-primary-glow/5 rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-primary">
                <Calendar className="h-5 w-5" />
                Registration Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="sscYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SSC Batch Year *</FormLabel>
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

                {pricing?.currentStudentAttendanceEnabled && (
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
                )}
              </div>
            </CardContent>
          </Card>

          {/* Gifts and Goodies */}
          <Card className="border-2 hover:border-primary/20 transition-colors duration-300 shadow-lg hover:shadow-xl">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-primary-glow/5 rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-primary">
                <Shirt className="h-5 w-5" />
                Gifts and Goodies
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <FormField
                control={form.control}
                name="tshirtSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      T-shirt Size *
                      <TShirtSizeGuideModal />
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex flex-wrap gap-4"
                      >
                        {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                          <div key={size} className="flex items-center space-x-2">
                            <RadioGroupItem value={size} id={size} />
                            <label
                              htmlFor={size}
                              className="cursor-pointer font-medium px-6 py-3 rounded-lg border-2 border-input hover:border-primary hover:bg-primary/5 hover:text-primary transition-all duration-200 hover:scale-105 hover:shadow-md"
                            >
                              {size}
                            </label>
                          </div>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="collectionMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select your preferred way to collect the reunion kits / goodie bag: *</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="space-y-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="event-booth" id="event-booth" />
                          <label
                            htmlFor="event-booth"
                            className="cursor-pointer font-medium"
                          >
                            I want to collect from the Event Booth
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="batch-coordinator" id="batch-coordinator" />
                          <label
                            htmlFor="batch-coordinator"
                            className="cursor-pointer font-medium"
                          >
                            I want to collect from my Batch Coordinator (Easier)
                          </label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Guest Information */}
          <Card className="border-2 hover:border-primary/20 transition-colors duration-300 shadow-lg hover:shadow-xl">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-primary-glow/5 rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-primary">
                <Users className="h-5 w-5" />
                Guest Information
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                Please provide your guest or family member information (if any)
              </p>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              {/* Spouse */}
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="bringingSpouse"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="font-medium">Spouse</FormLabel>
                    </FormItem>
                  )}
                />
                <Collapsible open={watchValues.bringingSpouse}>
                  <CollapsibleContent className="space-y-2 pl-6">
                    <FormField
                      control={form.control}
                      name="spouseName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Spouse Name</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter spouse name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CollapsibleContent>
                </Collapsible>
              </div>

              {/* Father */}
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="bringingFather"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="font-medium">Father</FormLabel>
                    </FormItem>
                  )}
                />
                <Collapsible open={watchValues.bringingFather}>
                  <CollapsibleContent className="space-y-2 pl-6">
                    <FormField
                      control={form.control}
                      name="fatherName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Father's Name</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter father's name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CollapsibleContent>
                </Collapsible>
              </div>

              {/* Mother */}
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="bringingMother"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="font-medium">Mother</FormLabel>
                    </FormItem>
                  )}
                />
                <Collapsible open={watchValues.bringingMother}>
                  <CollapsibleContent className="space-y-2 pl-6">
                    <FormField
                      control={form.control}
                      name="motherName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mother's Name</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter mother's name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CollapsibleContent>
                </Collapsible>
              </div>

              {/* Children */}
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="bringingChildren"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="font-medium">Children</FormLabel>
                    </FormItem>
                  )}
                />
                <Collapsible open={watchValues.bringingChildren}>
                  <CollapsibleContent className="space-y-4 pl-6">
                    <FormField
                      control={form.control}
                      name="numberOfChildren"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Number of Children Above 5 Years Old</FormLabel>
                          <FormControl>
                            <div className="space-y-2">
                              <div className="relative">
                                <Slider
                                  min={0}
                                  max={7}
                                  step={1}
                                  value={[field.value]}
                                  onValueChange={(value) => field.onChange(value[0])}
                                  className="w-full"
                                />
                                {/* Slider markers */}
                                <div className="flex justify-between mt-2 px-1 text-xs text-muted-foreground">
                                  {[0, 1, 2, 3, 4, 5, 6, 7].map((num) => (
                                    <span key={num} className="text-center min-w-[12px]">{num}</span>
                                  ))}
                                </div>
                              </div>
                              <div className="text-center text-sm text-muted-foreground">
                                {field.value} {field.value === 1 ? 'child' : 'children'}
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {renderChildNameFields()}
                  </CollapsibleContent>
                </Collapsible>
              </div>

              {/* Other */}
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="bringingOther"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="font-medium">Other</FormLabel>
                    </FormItem>
                  )}
                />
                <Collapsible open={watchValues.bringingOther}>
                  <CollapsibleContent className="space-y-2 pl-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="otherRelation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Relation</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="e.g., Brother, Sister, Friend" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="otherName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Enter name" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </CardContent>
          </Card>

          {/* Volunteer Section */}
          <Card className="border-2 hover:border-primary/20 transition-colors duration-300 shadow-lg hover:shadow-xl">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-primary-glow/5 rounded-t-lg">
              <CardTitle className="text-primary">Do you want to volunteer?</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <FormField
                control={form.control}
                name="wantsToVolunteer"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="font-medium">
                      I want to volunteer to make this event successful
                    </FormLabel>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Special Requests */}
          <Card className="border-2 hover:border-primary/20 transition-colors duration-300 shadow-lg hover:shadow-xl">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-primary-glow/5 rounded-t-lg">
              <CardTitle className="text-primary">Special Requests (Optional)</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <FormField
                control={form.control}
                name="specialRequests"
                render={({ field }) => (
                  <FormItem>
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

          {/* Fee Summary */}
          <Card className="border-2 border-primary/30 shadow-xl bg-gradient-to-br from-primary/5 via-background to-primary-glow/5">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-primary-glow/10 rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-primary text-xl">
                <CreditCard className="h-6 w-6" />
                Fee Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>{feeBreakdown.itemizedBreakdown?.baseDescription || 'Registration Fee'}:</span>
                  <span>৳{feeBreakdown.baseFee}</span>
                </div>
                {feeBreakdown.itemizedBreakdown?.items.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <span>
                      {item.description}
                      {item.quantity ? ` (${item.quantity})` : ''}:
                    </span>
                    <span>৳{item.quantity ? item.amount * item.quantity : item.amount}</span>
                  </div>
                ))}
                <hr />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total Amount:</span>
                  <span>৳{feeBreakdown.totalFee}</span>
                </div>
              </div>
              
              {/* Payment option selector */}
              <div className="mt-6 mb-4">
                <div>
                    <div className="flex justify-between font-medium text-md">
                    <span>Please specify your payment method:</span>
                  </div>
                  <label className="block mt-4">
                    <input
                      type="radio"
                      name="paymentOption"
                      value="bkash"
                      checked={paymentOption === 'bkash'}
                      onChange={() => setPaymentOption('bkash')}
                      className="mr-2"
                    />
                    Pay via bKash App or Phone
                  </label>
                  <label className="block mt-4">
                    <input
                      type="radio"
                      name="paymentOption"
                      value="offline"
                      checked={paymentOption === 'offline'}
                      onChange={() => setPaymentOption('offline')}
                      className="mr-2"
                    />
                    Paid through offline registration point
                  </label>
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
                  
                  <Button 
                    onClick={() => setShowPaymentModal(false)}
                    variant="outline"
                    className="w-full"
                  >
                    Back to Form
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </form>
      </Form>

      {/* Success Modal */}
      <RegistrationSuccessModal
        open={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          onSuccess();
          navigate('/', { replace: true });
          setTimeout(() => window.scrollTo({ top: 0, left: 0, behavior: 'auto' }), 50);
        }}
        eventTitle="Grand Alumni Reunion"
      />

      {/* Payment Failure Modal */}
      <PaymentFailureModal
        open={showFailureModal}
        onClose={() => setShowFailureModal(false)}
        onRetry={() => {
          setShowFailureModal(false);
          setShowPaymentModal(true);
        }}
        reason={paymentFailureReason}
      />

      {/* bKash Payment Modal */}
      {showPaymentModal && (
        <PaymentModal
          amount={feeBreakdown.totalFee}
          description="Grand Alumni Reunion 2025 Registration"
          invoice={BkashService.generateInvoiceNumber('REUNION')}
          reference={`Reunion Registration - ${user?.fullName || 'Alumni'}`}
          onSuccess={(data) => handlePaymentSuccess(data)}
          onCancel={() => setShowPaymentModal(false)}
          onError={(error) => {
            console.error('Payment error:', error);
            setPaymentFailureReason('error');
            setShowFailureModal(true);
            setShowPaymentModal(false);
          }}
        />
      )}

      {/* Offline Payment Modal */}
      {showOfflineModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-lg bg-white rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Offline / bKash App Payment</h3>
              <div className="flex flex-col items-center mb-4">
              <img src="/bkash-qr.jpeg" alt="bKash QR" className="w-56 h-56 md:w-72 md:h-72 object-contain mb-3" />
              <div className="text-center font-medium">কীভাবে পেমেন্ট করবেন?</div>
              <div className="mt-2 text-sm text-muted-foreground text-left">
                <p>বিকাশ অ্যাপ ওপেন করুন &gt;&gt; Make Payment অপশনে যান &gt;&gt; পাশের QR code স্ক্যান করুন, অথবা মার্চেন্ট নাম্বার 01886579596 টাইপ করুন &gt;&gt; নির্দিষ্ট এমাউন্ট দিন &gt;&gt; রেফারেন্স এ আপনার Full Name লিখুন &gt;&gt; পেমেন্ট সম্পন্ন করুন।</p>
                <p className="mt-2">অথবা,  বাটন ফোনে পেমেন্ট করতে চাইলে *২৪৭# ডায়াল করে &gt;&gt; পেমেন্ট অপশন সিলেক্ট করে &gt;&gt; উপরের পদ্ধতি অনুসরণ করুন।</p>
              </div>
            </div>

            <div className="mb-4">
              <div className="text-sm font-medium">Your Amount: ৳{feeBreakdown.totalFee}</div>
              <div className="text-sm font-medium">Your Reference: {user?.fullName || ''}</div>
            </div>

            <div className="grid grid-cols-1 gap-3 mb-4">
              <div>
                <label className="block text-sm font-medium">Paid from (Number):*</label>
                <input value={offlinePaidFrom} onChange={(e) => setOfflinePaidFrom(e.target.value)} className="w-full border p-2 rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium">Transaction ID:*</label>
                <input value={offlineTrxId} onChange={(e) => setOfflineTrxId(e.target.value)} className="w-full border p-2 rounded" />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowOfflineModal(false)}>Cancel</Button>
              <Button onClick={async () => {
                // Validate fields before submitting form
                if (!offlinePaidFrom.trim() || !offlineTrxId.trim()) {
                  toast({ title: 'Validation', description: 'Please fill required fields', variant: 'destructive' });
                  return;
                }

                // call handlePaymentSuccess with metadata (simulate paymentID/trxID)
                const fakePayment = { paymentID: BkashService.generateInvoiceNumber('TRX'), trxID: offlineTrxId };
                await handlePaymentSuccess(fakePayment, { paidFromNumber: offlinePaidFrom, verifiedBy: offlineVerifiedBy, secretCode: offlineSecretCode });
              }}>Submit</Button>
            </div>
          </div>
        </div>
      )}

      {/* Registration Point Modal (for offline registration by operator) */}
      {showRegistrationPointModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md bg-white rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">অফলাইন রেজিস্ট্রেশন পয়েন্ট</h3>
            <p className="text-sm text-muted-foreground mb-4">অফলাইন রেজিস্ট্রেশন পয়েন্টে কাগজের ফরমে রেজিস্ট্রেশন করলে, এই অপশন প্রযোজ্য হবে। নিচে অপারেটর/ভলান্টিয়ার তথ্য দিন।</p>

            <div className="mb-3">
              <label className="block text-sm font-medium">Verified by (Name / Operator ID):*</label>
              <input value={offlineVerifiedBy} onChange={(e) => setOfflineVerifiedBy(e.target.value)} className="w-full border p-2 rounded" />
            </div>

            <div className="mb-3">
              <FormLabel className="block text-sm font-medium mb-1">Verification Type</FormLabel>
              <div className="flex items-center gap-4">
                <label className="inline-flex items-center">
                  <input type="radio" name="regPointCodeType" checked={offlineCodeType === 'secret'} onChange={() => setOfflineCodeType('secret')} className="mr-2" />
                  Secret Code
                </label>
                <label className="inline-flex items-center">
                  <input type="radio" name="regPointCodeType" checked={offlineCodeType === 'trx'} onChange={() => setOfflineCodeType('trx')} className="mr-2" />
                  Transaction ID
                </label>
              </div>
            </div>

            {offlineCodeType === 'secret' ? (
              <div className="mb-3">
                <label className="block text-sm font-medium">Secret Code:*</label>
                <input value={offlineSecretCode} onChange={(e) => setOfflineSecretCode(e.target.value)} className="w-full border p-2 rounded" />
              </div>
            ) : (
              <div className="mb-3">
                <label className="block text-sm font-medium">Transaction ID:*</label>
                <input value={offlineTrxId} onChange={(e) => setOfflineTrxId(e.target.value)} className="w-full border p-2 rounded" />
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowRegistrationPointModal(false)}>Cancel</Button>
              <Button onClick={async () => {
                if (!offlineVerifiedBy.trim() || (offlineCodeType === 'secret' ? !offlineSecretCode.trim() : !offlineTrxId.trim())) {
                  toast({ title: 'Validation', description: 'Please fill required fields', variant: 'destructive' });
                  return;
                }

                // Simulate a payment/registration id and submit same success behavior
                const fakePayment = { paymentID: BkashService.generateInvoiceNumber('REGPT'), trxID: offlineTrxId || offlineSecretCode };
                await handlePaymentSuccess(fakePayment, { paidFromNumber: offlinePaidFrom, verifiedBy: offlineVerifiedBy, secretCode: offlineCodeType === 'secret' ? offlineSecretCode : undefined });
                setShowRegistrationPointModal(false);
              }}>Submit</Button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Success Modal (Offline / bKash) */}
      {showCustomSuccessModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md bg-white rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold mb-4">আপনার রেজিস্ট্রেশন Request সফল হয়েছে।</h3>
            <p className="text-sm mb-4">একজন এডমিন আপনার ফরম এবং Transaction ID চেক করবেন। আপনার রেজিস্ট্রেশন Approved হলে, আপনি একটি ইমেইল পাবেন। ইন শা আল্লাহ।</p>
            <p className="text-sm mb-4">তিন কার্যদিবসের মধ্যে Approved ইমেইল না পেলে, অনুগ্রহ পূর্বক 01886579596 নাম্বারে যোগাযোগ করুন।</p>
            <div className="flex justify-center">
              <Button onClick={() => { setShowCustomSuccessModal(false);}}>Close</Button>
              {/* <Button onClick={() => { setShowCustomSuccessModal(false); setShowSuccessModal(true); }}>Close</Button> */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReunionRegistrationForm;
