
import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, Link } from "react-router-dom";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreditCard, Eye, EyeOff } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';

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
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type FormValues = z.infer<typeof formSchema>;

const Signup = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showingPaymentModal, setShowingPaymentModal] = useState(false);
  const { signup, checkEmailExists } = useAuth();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
    }
  });

  const onSubmit = async (data: FormValues) => {
    try {
      // Check if email already exists
      const exists = await checkEmailExists(data.email);
      if (exists) {
        toast({
          title: "Email Already Registered",
          description: "This email is already in use. Please try logging in instead.",
          variant: "destructive",
        });
        return;
      }
      
      // Show payment modal before completing signup
      setShowingPaymentModal(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Simulate bKash payment process
  const handleBkashPayment = async () => {
    // This would be replaced by actual bKash integration
    toast({
      title: "Payment Processing",
      description: "Connecting to bKash...",
    });
    
    // Simulate payment processing
    setTimeout(async () => {
      const data = form.getValues();
      
      // Complete signup after payment
      const success = await signup({
        fullName: data.fullName,
        email: data.email,
        sscYear: data.sscYear,
        hscYear: data.hscYear,
        password: data.password,
      });
      
      if (success) {
        toast({
          title: "Registration Successful",
          description: "Your account has been created. Please complete your profile to access all features.",
          variant: "default",
        });
        
        navigate("/complete-profile");
      } else {
        toast({
          title: "Registration Failed",
          description: "Could not create your account. Please try again.",
          variant: "destructive",
        });
      }
    }, 2000);
  };

  const cancelPayment = () => {
    setShowingPaymentModal(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow pt-24 pb-16 bg-cpscs-light">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">Join the Alumni Community</CardTitle>
              <CardDescription className="text-center">
                Create an account to connect with other CPSCS alumni
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  
                  <div className="bg-cpscs-light p-4 rounded-lg w-full mt-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Membership Fee:</span>
                      <span>৳1,000</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      This one-time fee gives you access to the Alumni Directory and all alumni benefits.
                    </p>
                  </div>
                  
                  <Button type="submit" className="w-full bg-gradient-to-r from-cpscs-blue to-blue-700 py-6">
                    Proceed to Payment
                  </Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="text-sm text-center text-gray-600">
                Already have an account?{" "}
                <Link to="/login" className="text-cpscs-blue font-medium hover:underline">
                  Sign in
                </Link>
              </div>
              <div className="text-sm text-center text-gray-600">
                Attending the reunion?{" "}
                <Link to="/register" className="text-cpscs-blue font-medium hover:underline">
                  Register for reunion
                </Link>
              </div>
            </CardFooter>
          </Card>
          
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
                    <p className="font-bold text-lg mb-2">Membership Fee</p>
                    <p className="text-3xl font-bold text-cpscs-blue">৳1,000</p>
                  </div>
                  
                  <div className="space-y-3">
                    <p className="text-sm">Please follow these steps:</p>
                    <ol className="list-decimal pl-5 text-sm space-y-1">
                      <li>Open your bKash app</li>
                      <li>Go to "Make Payment"</li>
                      <li>Enter merchant number: 01XXXXXXXXX</li>
                      <li>Enter the exact amount: ৳1,000</li>
                      <li>Use reference: "CPSCS Alumni"</li>
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

export default Signup;
