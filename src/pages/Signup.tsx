
import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, Link } from "react-router-dom";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import FileUpload from '@/components/FileUpload';
import CountryCodeSelect from '@/components/CountryCodeSelect';
import ApprovalCountdown from '@/components/ApprovalCountdown';
import PostApprovalLogin from '@/components/PostApprovalLogin';

// Generate year options
const generateYears = (start: number, end: number) => {
  return Array.from({ length: end - start + 1 }, (_, i) => (end - i).toString());
};

// Enhanced validation schema
const formSchema = z.object({
  fullName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  sscYear: z.string({ required_error: "Please select your SSC batch year." }),
  hscYear: z.string({ required_error: "Please select your HSC batch year." }),
  countryCode: z.string().min(1, { message: "Please select country code." }),
  phoneNumber: z.string().min(7, { message: "Please enter a valid phone number." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters." })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
      message: "Password must contain at least one uppercase letter, one lowercase letter, and one number."
    }),
  confirmPassword: z.string(),
  socialProfileLink: z.string().url({ message: "Please enter a valid URL." }),
  proofDocument: z.instanceof(File, { message: "Please upload a proof document." }),
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
  const [showApprovalProcess, setShowApprovalProcess] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [isManualApproval, setIsManualApproval] = useState(false); // This would come from admin settings
  const [submittedEmail, setSubmittedEmail] = useState('');
  const { signup, checkEmailExists } = useAuth();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      sscYear: "",
      hscYear: "",
      countryCode: "+880",
      phoneNumber: "",
      email: "",
      password: "",
      confirmPassword: "",
      socialProfileLink: "",
    }
  });

  const validatePhoneNumber = (countryCode: string, phoneNumber: string): boolean => {
    // Basic phone number validation for different countries
    const phoneRegex = {
      '+880': /^1[3-9]\d{8}$/, // Bangladesh
      '+1': /^\d{10}$/, // USA/Canada
      '+44': /^\d{10,11}$/, // UK
      '+86': /^\d{11}$/, // China
      '+91': /^\d{10}$/, // India
    };

    const regex = phoneRegex[countryCode as keyof typeof phoneRegex] || /^\d{7,15}$/;
    return regex.test(phoneNumber.replace(/\s+/g, ''));
  };

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

      // Validate phone number
      if (!validatePhoneNumber(data.countryCode, data.phoneNumber)) {
        toast({
          title: "Invalid Phone Number",
          description: "Please enter a valid phone number for the selected country.",
          variant: "destructive",
        });
        return;
      }

      // Store the email for later use
      setSubmittedEmail(data.email);

      // Show approval process
      setShowApprovalProcess(true);

    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleApprovalComplete = async () => {
    if (!isManualApproval) {
      // Auto-approve the signup
      const formData = form.getValues();
      const success = await signup({
        fullName: formData.fullName,
        email: formData.email,
        sscYear: formData.sscYear,
        hscYear: formData.hscYear,
        password: formData.password,
      });
      
      if (success) {
        // Don't show toast here, the ApprovalCountdown component handles the success message
      } else {
        toast({
          title: "Registration Failed",
          description: "Could not create your account. Please try again.",
          variant: "destructive",
        });
        setShowApprovalProcess(false);
      }
    }
  };

  const handleShowLogin = () => {
    setShowLoginForm(true);
  };

  if (showLoginForm) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow pt-24 pb-16 bg-cpscs-light flex items-center justify-center">
          <div className="container mx-auto px-4">
            <PostApprovalLogin defaultEmail={submittedEmail} />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (showApprovalProcess) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow pt-24 pb-16 bg-cpscs-light flex items-center justify-center">
          <div className="container mx-auto px-4">
            <ApprovalCountdown 
              isManualApproval={isManualApproval}
              onComplete={handleApprovalComplete}
              onShowLogin={handleShowLogin}
            />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

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
                        <FormLabel>Full Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Your full name" {...field} />
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
                          <FormLabel>SSC Batch Year *</FormLabel>
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
                              {generateYears(1979, 2040).map((year) => (
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
                          <FormLabel>HSC Batch Year *</FormLabel>
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
                              {generateYears(1981, 2042).map((year) => (
                                <SelectItem key={year} value={year}>{year}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number *</FormLabel>
                        <div className="flex space-x-2">
                          <FormField
                            control={form.control}
                            name="countryCode"
                            render={({ field: countryField }) => (
                              <CountryCodeSelect
                                value={countryField.value}
                                onValueChange={countryField.onChange}
                                className="w-32"
                              />
                            )}
                          />
                          <FormControl>
                            <Input 
                              placeholder="Enter phone number" 
                              {...field}
                              className="flex-1"
                            />
                          </FormControl>
                        </div>
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
                          <Input type="email" placeholder="your.email@example.com" {...field} />
                        </FormControl>
                        <FormDescription className="text-orange-600 text-sm">
                          সঠিক ইমেইল এড্রেস লিখুন। আপনার রেজিস্ট্রেশনের সকল তথ্য এখানেই ইমেইল করা হবে। তাই, পুনরায় চেক করুন।
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Create Password *</FormLabel>
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
                          <FormDescription className="text-orange-600 text-sm">
                            ভবিষ্যতে ব্যবহারের জন্য এই পাসওয়ার্ড-টি মনে রাখুন
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
                          <FormLabel>Confirm Password *</FormLabel>
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
                  
                  <FormField
                    control={form.control}
                    name="socialProfileLink"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Social Profile Link (Facebook/LinkedIn) *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="https://facebook.com/yourprofile or https://linkedin.com/in/yourprofile" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription className="text-orange-600 text-sm">
                          আপনার পাবলিক প্রোফাইল দেখে চেক করার পর আপনার একাউন্ট এপ্রুভ করা হবে।
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="proofDocument"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Upload Student Proof Document *</FormLabel>
                        <FormControl>
                          <FileUpload
                            onFileSelect={(file) => {
                              if (file) {
                                field.onChange(file);
                              }
                            }}
                            error={form.formState.errors.proofDocument?.message}
                          />
                        </FormControl>
                        <FormDescription className="text-orange-600 text-sm">
                          আমাদের কমিউনিটিকে সুরক্ষিত রাখার জন্য এই প্রমাণপত্র প্রয়োজন। এখানে আপনি আপনার SSC/HSC certificate, Mark Sheet, স্কুলের পুরনো আইডি কার্ডের ছবি, স্কুলের ক্যাম্পাসে বন্ধুদের সাথে তোলা ছবি, কিংবা যেকোনো ডকুমেন্ট দিতে পারেন - যা প্রমাণ করবে আপনি এই স্কুলের শিক্ষার্থী ছিলেন।
                          আপনার দেয়া তথ্য ভেরিফাই করার আগে আপনার একাউন্ট এপ্রুভ করা হবে না।
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="w-full bg-gradient-to-r from-cpscs-blue to-blue-700 py-6">
                    Submit Request for Admin Approval
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Signup;
