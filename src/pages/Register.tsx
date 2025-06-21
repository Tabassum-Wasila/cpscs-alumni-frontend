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
import { Calendar, Clock, MapPin, Users, Eye, EyeOff } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventService, FeeBreakdown } from '@/services/eventService';
import PaymentModal from '@/components/PaymentModal';

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
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters." })
    .optional()
    .or(z.literal('')),
  confirmPassword: z.string().optional().or(z.literal('')),
  hasAccount: z.boolean().default(false),
  bringingGuests: z.boolean().default(false),
  bringingSpouse: z.boolean().default(false),
  numberOfKids: z.string().default("0"),
  bringingMother: z.boolean().default(false),
  bringingFather: z.boolean().default(false),
  notes: z.string().optional(),
  agreeToShare: z.boolean().default(false),
})
.refine(data => data.hasAccount || (data.password && data.password.length >= 8), {
  message: "Password is required for new accounts",
  path: ["password"],
})
.refine(data => data.hasAccount || data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type FormValues = z.infer<typeof formSchema>;

const Register = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [feeBreakdown, setFeeBreakdown] = useState<FeeBreakdown>({
    baseFee: 0,
    spouseFee: 0,
    kidsFee: 0,
    parentsFee: 0,
    totalFee: 0
  });
  const [showingPaymentModal, setShowingPaymentModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [currentTab, setCurrentTab] = useState('register');
  const [checkingEmail, setCheckingEmail] = useState(false);
  const { login, signup, checkEmailExists } = useAuth();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
      hasAccount: false,
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
  const watchHasAccount = form.watch("hasAccount");
  const watchEmail = form.watch("email");

  // Calculate fees when relevant form values change
  useEffect(() => {
    const fees = EventService.calculateReunionFees({
      sscYear: watchSSCYear || '',
      bringingSpouse: watchBringingSpouse,
      numberOfKids: parseInt(watchNumberOfKids) || 0,
      bringingMother: watchBringingMother,
      bringingFather: watchBringingFather
    });
    setFeeBreakdown(fees);
  }, [watchSSCYear, watchBringingSpouse, watchNumberOfKids, watchBringingMother, watchBringingFather]);

  // Check if email already exists when email changes
  useEffect(() => {
    const checkEmail = async () => {
      if (watchEmail && watchEmail.includes('@')) {
        setCheckingEmail(true);
        const exists = await checkEmailExists(watchEmail);
        if (exists) {
          form.setValue("hasAccount", true);
        }
        setCheckingEmail(false);
      }
    };

    const debounceTimer = setTimeout(checkEmail, 800);
    return () => clearTimeout(debounceTimer);
  }, [watchEmail, checkEmailExists, form]);

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    try {
      // Handle existing user login
      if (data.hasAccount) {
        if (!data.password) {
          toast({
            title: "Password Required",
            description: "Please enter your password to continue.",
            variant: "destructive",
          });
          return;
        }
        
        const success = await login(data.email, data.password);
        if (!success) {
          toast({
            title: "Login Failed",
            description: "Invalid email or password. Please try again.",
            variant: "destructive",
          });
          return;
        }
      } else {
        // Handle new user registration
        if (!data.password) {
          toast({
            title: "Password Required",
            description: "Please create a password for your new account.",
            variant: "destructive",
          });
          return;
        }
        
        const success = await signup({
          fullName: data.fullName,
          email: data.email,
          sscYear: data.sscYear,
          password: data.password,
        });
        
        if (!success) {
          toast({
            title: "Registration Failed",
            description: "Could not create your account. Please try again.",
            variant: "destructive",
          });
          return;
        }
      }
      
      // Proceed to payment after successful authentication
      setShowingPaymentModal(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const success = await login(loginEmail, loginPassword);
      if (success) {
        toast({
          title: "Login Successful",
          description: "Welcome back! You can now continue with your registration.",
        });
        setCurrentTab('register');
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid email or password. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Login Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePaymentSuccess = () => {
    setShowingPaymentModal(false);
    navigate("/complete-profile");
  };

  const cancelPayment = () => {
    setShowingPaymentModal(false);
  };

  const eventDetails = EventService.getEventDetails();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow pt-24 pb-16 bg-cpscs-light">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-10">
            <h1 className="text-4xl font-bold text-cpscs-blue mb-4">{eventDetails.title}</h1>
            
            <Card className="bg-gradient-to-r from-blue-800 via-cpscs-blue to-blue-900 text-white overflow-hidden mb-8">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Event Details</h2>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <Calendar size={20} className="mr-3 text-cpscs-gold" />
                        <span>{eventDetails.date}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock size={20} className="mr-3 text-cpscs-gold" />
                        <span>{eventDetails.time}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin size={20} className="mr-3 text-cpscs-gold" />
                        <span>{eventDetails.venue}</span>
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
                      {eventDetails.activities.map((activity, index) => (
                        <li key={index}>{activity}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="register">Registration</TabsTrigger>
                <TabsTrigger value="login">Login</TabsTrigger>
              </TabsList>
              
              <TabsContent value="register">
                <h2 className="text-2xl font-bold text-cpscs-blue mb-4">Registration Form</h2>
                
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
                                    <SelectItem value="not_applicable">Not Applicable</SelectItem>
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
                                  {checkingEmail ? "Checking email..." : "We'll send your ticket to this email"}
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
                        <CardTitle>Account Information</CardTitle>
                        <CardDescription>Set up your alumni account</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <FormField
                          control={form.control}
                          name="hasAccount"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">I already have an account</FormLabel>
                                <FormDescription>
                                  Check this if you have registered before
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
                        
                        {!watchHasAccount ? (
                          <div className="space-y-4">
                            <FormField
                              control={form.control}
                              name="password"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Create Password</FormLabel>
                                  <div className="relative">
                                    <FormControl>
                                      <Input 
                                        type={showPassword ? "text" : "password"} 
                                        placeholder="••••••••" 
                                        {...field} 
                                      />
                                    </FormControl>
                                    <button 
                                      type="button"
                                      className="absolute right-3 top-2.5 text-gray-500 focus:outline-none"
                                      onClick={() => setShowPassword(!showPassword)}
                                    >
                                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                  </div>
                                  <FormDescription>
                                    Password must be at least 8 characters
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="confirmPassword"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Confirm Password</FormLabel>
                                  <div className="relative">
                                    <FormControl>
                                      <Input 
                                        type={showConfirmPassword ? "text" : "password"} 
                                        placeholder="••••••••" 
                                        {...field} 
                                      />
                                    </FormControl>
                                    <button 
                                      type="button"
                                      className="absolute right-3 top-2.5 text-gray-500 focus:outline-none"
                                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                  </div>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        ) : (
                          <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Enter Password</FormLabel>
                                <div className="relative">
                                  <FormControl>
                                    <Input 
                                      type={showPassword ? "text" : "password"} 
                                      placeholder="Enter your password" 
                                      {...field} 
                                    />
                                  </FormControl>
                                  <button 
                                    type="button"
                                    className="absolute right-3 top-2.5 text-gray-500 focus:outline-none"
                                    onClick={() => setShowPassword(!showPassword)}
                                  >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                  </button>
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}
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
                            <span>৳{feeBreakdown.baseFee.toLocaleString()}</span>
                          </div>
                          {feeBreakdown.spouseFee > 0 && (
                            <div className="flex justify-between text-sm mb-1">
                              <span>Spouse Fee:</span>
                              <span>৳{feeBreakdown.spouseFee.toLocaleString()}</span>
                            </div>
                          )}
                          {feeBreakdown.kidsFee > 0 && (
                            <div className="flex justify-between text-sm mb-1">
                              <span>Children Fee ({watchNumberOfKids}):</span>
                              <span>৳{feeBreakdown.kidsFee.toLocaleString()}</span>
                            </div>
                          )}
                          {feeBreakdown.parentsFee > 0 && (
                            <div className="flex justify-between text-sm mb-1">
                              <span>Parents Fee:</span>
                              <span>৳{feeBreakdown.parentsFee.toLocaleString()}</span>
                            </div>
                          )}
                          <div className="border-t border-gray-300 mt-2 pt-2 flex justify-between font-bold">
                            <span>Total Fee:</span>
                            <span>৳{feeBreakdown.totalFee.toLocaleString()}</span>
                          </div>
                        </div>
                        
                        <Button type="submit" className="w-full bg-gradient-to-r from-cpscs-blue to-blue-700 hover:from-blue-700 hover:to-cpscs-blue py-6">
                          Proceed to Payment
                        </Button>
                      </CardFooter>
                    </Card>
                  </form>
                </Form>
              </TabsContent>
              
              <TabsContent value="login">
                <Card>
                  <CardHeader>
                    <CardTitle>Login to Your Account</CardTitle>
                    <CardDescription>
                      Enter your credentials to log in to your alumni account
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <FormLabel htmlFor="login-email">Email</FormLabel>
                        <Input
                          id="login-email"
                          type="email"
                          placeholder="your.email@example.com"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <FormLabel htmlFor="login-password">Password</FormLabel>
                        <div className="relative">
                          <Input
                            id="login-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            required
                          />
                          <button 
                            type="button"
                            className="absolute right-3 top-2.5 text-gray-500 focus:outline-none"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>
                      
                      <Button type="submit" className="w-full">Login</Button>
                    </form>
                  </CardContent>
                  <CardFooter className="flex flex-col items-center gap-4">
                    <div className="text-sm text-center">
                      <span>Don't have an account? </span>
                      <Button 
                        variant="link" 
                        className="p-0" 
                        onClick={() => setCurrentTab('register')}
                      >
                        Register now
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Payment Modal */}
          {showingPaymentModal && (
            <PaymentModal
              amount={feeBreakdown.totalFee}
              description="Alumni Reunion Registration"
              onSuccess={handlePaymentSuccess}
              onCancel={cancelPayment}
            />
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Register;
