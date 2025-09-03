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
import { getSSCYears } from '@/utils/yearUtils';

const formSchema = z.object({
  sscYear: z.string({ required_error: "Please select your SSC batch year." }),
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
  numberOfChildren: z.number().min(0).max(5).default(0),
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
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [pricing, setPricing] = useState<ReunionPricing>();

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
        tshirtSize: watchValues.tshirtSize,
        collectionMethod: watchValues.collectionMethod,
        spouse: watchValues.bringingSpouse ? { name: watchValues.spouseName } : null,
        father: watchValues.bringingFather ? { name: watchValues.fatherName } : null,
        mother: watchValues.bringingMother ? { name: watchValues.motherName } : null,
        children: watchValues.bringingChildren && watchValues.numberOfChildren > 0 ? {
          numberOfChildren: watchValues.numberOfChildren,
          names: watchValues.childNames || []
        } : null,
        other: watchValues.bringingOther ? {
          relation: watchValues.otherRelation,
          name: watchValues.otherName
        } : null,
        wantsToVolunteer: watchValues.wantsToVolunteer,
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
    
    // TODO: Send to Laravel backend API
    // This will trigger confirmation email with unique registration code
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
              
              {pricing.youngAlumniDiscountEnabled && (
                <div className="flex justify-between items-center">
                  <span>Young Alumni (SSC 2020-2025):</span>
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Registration Details */}
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shirt className="h-5 w-5" />
                Gifts and Goodies
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
                              className="cursor-pointer font-medium px-4 py-2 rounded-md border border-input hover:bg-accent hover:text-accent-foreground"
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Guest Information
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Please provide your guest or family member information (if any)
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
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
                              <Slider
                                min={0}
                                max={5}
                                step={1}
                                value={[field.value]}
                                onValueChange={(value) => field.onChange(value[0])}
                                className="w-full"
                              />
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
          <Card>
            <CardHeader>
              <CardTitle>Do you want to volunteer?</CardTitle>
            </CardHeader>
            <CardContent>
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
          <Card>
            <CardHeader>
              <CardTitle>Special Requests (Optional)</CardTitle>
            </CardHeader>
            <CardContent>
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
          <Card>
            <CardHeader>
              <CardTitle>Fee Summary</CardTitle>
            </CardHeader>
            <CardContent>
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
                  
                  <BkashPaymentButton
                    amount={feeBreakdown.totalFee}
                    invoice={`REUNION_${Date.now()}`}
                    onSuccess={handlePaymentSuccess}
                    onClose={() => setShowPaymentModal(false)}
                  />
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
        }}
        eventTitle="Grand Alumni Reunion"
      />
    </div>
  );
};

export default ReunionRegistrationForm;
