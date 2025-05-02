
import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, MapPin, Users, CreditCard } from "lucide-react";

// Generate year options from 1979 to 2025
const generateYears = (start: number, end: number) => {
  return Array.from({ length: end - start + 1 }, (_, i) => (end - i).toString());
};

const formSchema = z.object({
  fullName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  sscYear: z.string({ required_error: "Please select your SSC batch year." }),
  hscYear: z.string().optional(),
  phone: z.string().min(11, { message: "Please enter a valid phone number." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  bringingGuests: z.boolean().default(false),
  bringingSpouse: z.boolean().default(false),
  numberOfKids: z.string().default("0"),
  bringingMother: z.boolean().default(false),
  bringingFather: z.boolean().default(false),
  notes: z.string().optional(),
  agreeToShare: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

const Register = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [totalFee, setTotalFee] = useState(0);
  const [baseFee, setBaseFee] = useState(0);
  const [spouseFee, setSpouseFee] = useState(0);
  const [kidsFee, setKidsFee] = useState(0);
  const [parentsFee, setParentsFee] = useState(0);
  const [showingPaymentModal, setShowingPaymentModal] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      bringingGuests: false,
      bringingSpouse: false,
      numberOfKids: "0",
      bringingMother: false,
      bringingFather: false,
      notes: "",
      agreeToShare: false,
    }
  });

  const watchBringingGuests = form.watch("bringingGuests");
  const watchBringingSpouse = form.watch("bringingSpouse");
  const watchNumberOfKids = form.watch("numberOfKids");
  const watchBringingMother = form.watch("bringingMother");
  const watchBringingFather = form.watch("bringingFather");
  const watchSSCYear = form.watch("sscYear");

  // Calculate fees when relevant form values change
  useEffect(() => {
    // Calculate base fee based on SSC year
    let base = 0;
    if (watchSSCYear) {
      const year = parseInt(watchSSCYear);
      if (year <= 2000) base = 5000;
      else if (year <= 2015) base = 3500;
      else if (year <= 2022) base = 3000;
      else base = 1000;
    }
    setBaseFee(base);

    // Calculate spouse fee
    const spouse = watchBringingSpouse ? 2000 : 0;
    setSpouseFee(spouse);

    // Calculate kids fee
    const kids = watchNumberOfKids ? parseInt(watchNumberOfKids) * 1000 : 0;
    setKidsFee(kids);

    // Calculate parents fee
    const parents = (watchBringingMother ? 1000 : 0) + (watchBringingFather ? 1000 : 0);
    setParentsFee(parents);

    // Set total fee
    setTotalFee(base + spouse + kids + parents);
  }, [watchSSCYear, watchBringingSpouse, watchNumberOfKids, watchBringingMother, watchBringingFather]);

  // Handle form submission
  const onSubmit = (data: FormValues) => {
    // Show payment modal
    setShowingPaymentModal(true);
    
    // Implement bKash integration here...
    console.log("Form data submitted:", data);
    console.log("Total fee:", totalFee);
  };

  // Simulate bKash payment process
  const handleBkashPayment = () => {
    // This would be replaced by actual bKash integration
    toast({
      title: "Payment Processing",
      description: "Connecting to bKash...",
    });
    
    // Simulate payment processing
    setTimeout(() => {
      toast({
        title: "Payment Successful",
        description: "Your payment has been processed successfully!",
        variant: "default",
      });
      
      setTimeout(() => {
        navigate("/complete-profile");
      }, 1500);
    }, 2000);
  };

  const cancelPayment = () => {
    setShowingPaymentModal(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow pt-24 pb-16 bg-cpscs-light">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-10">
            <h1 className="text-4xl font-bold text-cpscs-blue mb-4">Grand Alumni Reunion 2025</h1>
            
            <Card className="bg-gradient-to-r from-blue-800 via-cpscs-blue to-blue-900 text-white overflow-hidden mb-8">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Event Details</h2>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <Calendar size={20} className="mr-3 text-cpscs-gold" />
                        <span>December 25, 2025</span>
                      </div>
                      <div className="flex items-center">
                        <Clock size={20} className="mr-3 text-cpscs-gold" />
                        <span>9:00 AM - 10:00 PM</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin size={20} className="mr-3 text-cpscs-gold" />
                        <span>CPSCS Campus, Saidpur</span>
                      </div>
                      <div className="flex items-center">
                        <Users size={20} className="mr-3 text-cpscs-gold" />
                        <span>All Alumni Batches Welcome</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Activities</h2>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Campus Tour</li>
                      <li>Cultural Program</li>
                      <li>Alumni Dinner</li>
                      <li>Guest Speeches</li>
                      <li>Cultural Events</li>
                      <li>Group Photos</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <h2 className="text-2xl font-bold text-cpscs-blue mb-4">Registration Form</h2>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Please provide your details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
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
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select year" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {generateYears(1979, 2025).map((year) => (
                                <SelectItem key={year} value={year}>{year}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="hscYear"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>HSC Batch Year (Optional)</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select year" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="">Not Applicable</SelectItem>
                              {generateYears(1981, 2027).map((year) => (
                                <SelectItem key={year} value={year}>{year}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="01XXXXXXXXX" {...field} />
                          </FormControl>
                          <FormDescription>
                            We'll use this for payment verification
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="your.email@example.com" {...field} />
                          </FormControl>
                          <FormDescription>
                            We'll send your ticket to this email
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Guest Information</CardTitle>
                  <CardDescription>Are you bringing any guests?</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="bringingGuests"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Bringing Guests</FormLabel>
                          <FormDescription>
                            Will you be bringing family members?
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
                  
                  {watchBringingGuests && (
                    <div className="space-y-4 pl-4 border-l-2 border-cpscs-gold">
                      <FormField
                        control={form.control}
                        name="bringingSpouse"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Spouse</FormLabel>
                              <FormDescription>
                                Will your spouse attend? (Additional ৳2,000)
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
                      
                      <FormField
                        control={form.control}
                        name="numberOfKids"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Number of Children</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select number" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {[0, 1, 2, 3, 4, 5].map((num) => (
                                  <SelectItem key={num} value={num.toString()}>
                                    {num} {num === 1 ? "Child" : "Children"}
                                    {num > 0 && ` (Additional ৳${num * 1000})`}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Each child: ৳1,000
                            </FormDescription>
                          </FormItem>
                        )}
                      />
                      
                      <div className="space-y-2">
                        <FormLabel>Bringing Parents</FormLabel>
                        <FormDescription className="mb-2">
                          Additional ৳1,000 per parent
                        </FormDescription>
                        
                        <div className="flex space-x-4">
                          <FormField
                            control={form.control}
                            name="bringingMother"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center space-x-2">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <FormLabel>Mother</FormLabel>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="bringingFather"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center space-x-2">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <FormLabel>Father</FormLabel>
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Additional Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Special Notes</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Dietary restrictions, special accommodations, etc."
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="agreeToShare"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            I agree to share my contact details with the alumni network
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </CardContent>
                
                <CardFooter className="flex flex-col">
                  <div className="bg-cpscs-light p-4 rounded-lg w-full mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Base Registration Fee:</span>
                      <span>৳{baseFee.toLocaleString()}</span>
                    </div>
                    {spouseFee > 0 && (
                      <div className="flex justify-between text-sm mb-1">
                        <span>Spouse Fee:</span>
                        <span>৳{spouseFee.toLocaleString()}</span>
                      </div>
                    )}
                    {kidsFee > 0 && (
                      <div className="flex justify-between text-sm mb-1">
                        <span>Children Fee ({watchNumberOfKids}):</span>
                        <span>৳{kidsFee.toLocaleString()}</span>
                      </div>
                    )}
                    {parentsFee > 0 && (
                      <div className="flex justify-between text-sm mb-1">
                        <span>Parents Fee:</span>
                        <span>৳{parentsFee.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="border-t border-gray-300 mt-2 pt-2 flex justify-between font-bold">
                      <span>Total Fee:</span>
                      <span>৳{totalFee.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full bg-gradient-to-r from-cpscs-blue to-blue-700 hover:from-blue-700 hover:to-cpscs-blue py-6">
                    Proceed to Payment
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </Form>
          
          {/* Payment Modal */}
          {showingPaymentModal && (
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
                    <p className="font-bold text-lg mb-2">Total Amount</p>
                    <p className="text-3xl font-bold text-cpscs-blue">৳{totalFee.toLocaleString()}</p>
                  </div>
                  
                  <div className="space-y-3">
                    <p className="text-sm">Please follow these steps:</p>
                    <ol className="list-decimal pl-5 text-sm space-y-1">
                      <li>Open your bKash app</li>
                      <li>Go to "Make Payment"</li>
                      <li>Enter merchant number: 01XXXXXXXXX</li>
                      <li>Enter the exact amount: ৳{totalFee}</li>
                      <li>Use reference: "CPSCS Reunion"</li>
                      <li>Complete payment with your PIN</li>
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
                    onClick={cancelPayment}
                    className="w-full"
                  >
                    Cancel
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Register;
