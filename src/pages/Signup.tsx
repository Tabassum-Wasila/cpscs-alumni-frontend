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
import PasswordStrengthIndicator from '@/components/PasswordStrengthIndicator';
import ConfirmPasswordFeedback from '@/components/ConfirmPasswordFeedback';
import HoverTooltip from '@/components/HoverTooltip';
import SmartDocumentTooltip from '@/components/SmartDocumentTooltip';
import ProofDocumentInstructions from '@/components/ProofDocumentInstructions';
import { ImageUploadField } from '@/components/ImageUploadField';
import { getSSCYears, getHSCYears, generateYears, getCurrentYear } from '@/utils/yearUtils';

// Enhanced validation schema with all fields mandatory except proof document
const formSchema = z.object({
  fullName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  sscYear: z.string().min(1, { message: "Please select your SSC batch year." }),
  hscYear: z.string().min(1, { message: "Please select your HSC batch year." }),
  attendanceFromYear: z.string().min(1, { message: "Please select from year." }),
  attendanceToYear: z.string().min(1, { message: "Please select to year." }),
  countryCode: z.string().min(1, { message: "Please select country code." }),
  phoneNumber: z.string()
    .min(7, { message: "Please enter a valid phone number." })
    .regex(/^[\d\s\-+()]*$/, { message: "Phone number can only contain numbers, spaces, dashes, and parentheses." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters." })
    .regex(/^(?=.*[a-zA-Z])(?=.*\d)/, {
      message: "Password must contain at least one letter and one number."
    }),
  confirmPassword: z.string().min(1, { message: "Please confirm your password." }),
  profilePhoto: z.string().min(1, { message: "Please upload a profile photo." }),
  socialProfileLink: z.string().optional().refine((url) => {
    // Make field optional; if present validate its structure
    if (!url || url.trim() === '') return true;
    const cleanUrl = url.toLowerCase().trim();
    return (
      cleanUrl.includes('facebook.com') ||
      cleanUrl.includes('linkedin.com') ||
      cleanUrl.includes('twitter.com') ||
      cleanUrl.includes('instagram.com') ||
      /^(www\.)?[\w\-]+(\.[\w\-]+)+.*$/.test(cleanUrl)
    );
  }, { message: "Please enter a valid social media profile URL." }),
  proofDocument: z.string().optional(), // Store as base64 string, optional
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
}).refine(data => parseInt(data.attendanceFromYear) <= parseInt(data.attendanceToYear), {
  message: "From year must be before or same as to year",
  path: ["attendanceToYear"],
});

type FormValues = z.infer<typeof formSchema>;

const Signup = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showApprovalProcess, setShowApprovalProcess] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [isManualApproval, setIsManualApproval] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [socialProfileCompleted, setSocialProfileCompleted] = useState(false);
  const [documentUploaded, setDocumentUploaded] = useState(false);
  const [profilePhotoUploaded, setProfilePhotoUploaded] = useState(false);
  const { signup, checkEmailExists } = useAuth();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onBlur', // Enable real-time validation
    defaultValues: {
      fullName: "",
      sscYear: "",
      hscYear: "",
      attendanceFromYear: "",
      attendanceToYear: "",
      countryCode: "+880",
      phoneNumber: "",
      email: "",
      password: "",
      confirmPassword: "",
      profilePhoto: "",
  socialProfileLink: "",
    }
  });

  const watchedPassword = form.watch("password");
  const watchedConfirmPassword = form.watch("confirmPassword");
  const watchedSocialProfile = form.watch("socialProfileLink");

  // Check if social profile is completed
  React.useEffect(() => {
    if (watchedSocialProfile && watchedSocialProfile.trim().length > 10) {
      setSocialProfileCompleted(true);
    } else {
      setSocialProfileCompleted(false);
    }
  }, [watchedSocialProfile]);

  // Real-time email validation
  const handleEmailBlur = async (email: string) => {
    if (email && email.includes('@')) {
      try {
        const exists = await checkEmailExists(email);
        if (exists) {
          form.setError("email", {
            type: "manual",
            message: "This email is already registered. Please try logging in instead."
          });
        } else {
          form.clearErrors("email");
        }
      } catch (error) {
        // Handle error silently for better UX
      }
    }
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
        attendanceFromYear: formData.attendanceFromYear,
        attendanceToYear: formData.attendanceToYear,
        password: formData.password,
        countryCode: formData.countryCode,
        phoneNumber: formData.phoneNumber,
        profilePhoto: formData.profilePhoto,
        socialProfileLink: formData.socialProfileLink,
        proofDocument: formData.proofDocument,
      });
      
      if (!success) {
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
            <CardHeader className="pb-4">
              <CardTitle className="text-xl md:text-2xl font-bold text-center">Join the Alumni Community</CardTitle>
              <CardDescription className="text-center text-sm md:text-base">
                Create an account to connect with other CPSCS alumni
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 md:px-8 py-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 md:space-y-8">
                  {/* Personal Information Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground mb-4">Personal Information</h3>
                    
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-foreground">Full Name *</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Your full name" 
                              {...field} 
                              className="h-11 text-sm md:text-base"
                            />
                          </FormControl>
                          <FormMessage className="text-xs md:text-sm" />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  {/* Academic Information Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground mb-4">Academic Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="sscYear"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-foreground">SSC Batch Year *</FormLabel>
                           <Select 
                             onValueChange={field.onChange} 
                             defaultValue={field.value}
                           >
                             <FormControl>
                               <SelectTrigger className="h-10 md:h-12">
                                 <SelectValue placeholder="Select year" />
                               </SelectTrigger>
                             </FormControl>
                             <SelectContent className="max-h-48 md:max-h-60 bg-white z-50">
                               {getSSCYears().map((year) => (
                                 <SelectItem key={year} value={year}>{year}</SelectItem>
                               ))}
                             </SelectContent>
                           </Select>
                           <FormMessage className="text-xs md:text-sm" />
                         </FormItem>
                       )}
                     />
                     
                      <FormField
                        control={form.control}
                        name="hscYear"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-foreground">HSC Batch Year *</FormLabel>
                           <Select 
                             onValueChange={field.onChange} 
                             defaultValue={field.value}
                           >
                             <FormControl>
                               <SelectTrigger className="h-10 md:h-12">
                                 <SelectValue placeholder="Select year" />
                               </SelectTrigger>
                             </FormControl>
                             <SelectContent className="max-h-48 md:max-h-60 bg-white z-50">
                               {getHSCYears().map((year) => (
                                 <SelectItem key={year} value={year}>{year}</SelectItem>
                               ))}
                             </SelectContent>
                           </Select>
                           <FormMessage className="text-xs md:text-sm" />
                         </FormItem>
                          )}
                        />
                      </div>

                    <FormItem>
                      <FormLabel className="text-sm font-medium text-foreground">From which year to which year did you attend this institution? *</FormLabel>
                     <HoverTooltip 
                       tooltip="আপনি কোন সাল থেকে কোন সাল পর্যন্ত এখানে অধ্যয়ন করেছেন?"
                     >
                       <div className="grid grid-cols-2 gap-4">
                         <FormField
                           control={form.control}
                           name="attendanceFromYear"
                           render={({ field }) => (
                             <FormItem>
                               <FormLabel className="text-xs text-muted-foreground font-medium">From Year</FormLabel>
                               <Select 
                                 onValueChange={field.onChange} 
                                 defaultValue={field.value}
                               >
                                 <FormControl>
                                   <SelectTrigger className="h-10 md:h-12">
                                     <SelectValue placeholder="From" />
                                   </SelectTrigger>
                                 </FormControl>
                                 <SelectContent className="max-h-48 md:max-h-60 bg-white z-50">
                                   {generateYears(1979, getCurrentYear() + 10).map((year) => (
                                     <SelectItem key={year} value={year}>{year}</SelectItem>
                                   ))}
                                 </SelectContent>
                               </Select>
                               <FormMessage className="text-xs md:text-sm" />
                             </FormItem>
                           )}
                         />
                         
                         <FormField
                           control={form.control}
                           name="attendanceToYear"
                           render={({ field }) => (
                             <FormItem>
                               <FormLabel className="text-xs text-muted-foreground font-medium">To Year</FormLabel>
                               <Select 
                                 onValueChange={field.onChange} 
                                 defaultValue={field.value}
                               >
                                 <FormControl>
                                   <SelectTrigger className="h-10 md:h-12">
                                     <SelectValue placeholder="To" />
                                   </SelectTrigger>
                                 </FormControl>
                                 <SelectContent className="max-h-48 md:max-h-60 bg-white z-50">
                                   {generateYears(1979, getCurrentYear() + 10).map((year) => (
                                     <SelectItem key={year} value={year}>{year}</SelectItem>
                                   ))}
                                 </SelectContent>
                               </Select>
                               <FormMessage className="text-xs md:text-sm" />
                             </FormItem>
                           )}
                         />
                       </div>
                      </HoverTooltip>
                    </FormItem>
                  </div>
                  
                  {/* Contact Information Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground mb-4">Contact Information</h3>
                    
                    <FormField
                      control={form.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-foreground">Phone Number *</FormLabel>
                        <div className="flex space-x-2">
                          <FormField
                            control={form.control}
                            name="countryCode"
                            render={({ field: countryField }) => (
                              <CountryCodeSelect
                                value={countryField.value}
                                onValueChange={countryField.onChange}
                                className="w-24 md:w-32 h-10 md:h-12"
                              />
                            )}
                          />
                          <FormControl>
                            <Input 
                              placeholder="Enter phone number" 
                              {...field}
                              className="flex-1 h-10 md:h-12 text-sm md:text-base"
                              onBlur={(e) => {
                                field.onBlur();
                                // Real-time validation for phone
                                const value = e.target.value;
                                if (value && !/^[\d\s\-+()]*$/.test(value)) {
                                  form.setError("phoneNumber", {
                                    type: "manual",
                                    message: "Phone number can only contain numbers, spaces, dashes, and parentheses."
                                  });
                                }
                              }}
                            />
                          </FormControl>
                        </div>
                        <FormMessage className="text-xs md:text-sm" />
                      </FormItem>
                    )}
                  />
                  
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-foreground">Email Address *</FormLabel>
                        <HoverTooltip 
                          tooltip="সঠিক ইমেইল এড্রেস লিখুন। আপনার রেজিস্ট্রেশনের সকল তথ্য এখানেই ইমেইল করা হবে। তাই, পুনরায় চেক করুন।"
                        >
                          <FormControl>
                            <Input 
                              type="email" 
                              placeholder="your.email@example.com" 
                              {...field} 
                              className="h-10 md:h-12 text-sm md:text-base"
                              onBlur={(e) => {
                                field.onBlur();
                                handleEmailBlur(e.target.value);
                              }}
                            />
                          </FormControl>
                        </HoverTooltip>
                          <FormMessage className="text-xs md:text-sm" />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  {/* Security Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground mb-4">Account Security</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-foreground">Create Password *</FormLabel>
                          <HoverTooltip 
                            tooltip="ভবিষ্যতে ব্যবহারের জন্য এই পাসওয়ার্ড-টি মনে রাখুন"
                          >
                            <div className="relative">
                              <FormControl>
                                <Input 
                                  type={showPassword ? "text" : "password"} 
                                  placeholder="••••••••" 
                                  {...field} 
                                  className="h-10 md:h-12 text-sm md:text-base pr-10"
                                />
                              </FormControl>
                              <button 
                                type="button"
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 focus:outline-none touch-manipulation"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                              </button>
                            </div>
                          </HoverTooltip>
                          <PasswordStrengthIndicator password={watchedPassword} />
                            <FormMessage className="text-xs md:text-sm" />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-foreground">Confirm Password *</FormLabel>
                          <div className="relative">
                            <FormControl>
                              <Input 
                                type={showConfirmPassword ? "text" : "password"} 
                                placeholder="••••••••" 
                                {...field} 
                                className="h-10 md:h-12 text-sm md:text-base pr-16"
                              />
                            </FormControl>
                            <ConfirmPasswordFeedback 
                              password={watchedPassword}
                              confirmPassword={watchedConfirmPassword}
                            />
                            <button 
                              type="button"
                              className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-500 focus:outline-none touch-manipulation"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                          </div>
                            <FormMessage className="text-xs md:text-sm" />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Profile Information Section */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4">Profile Information</h3>
                    
                    <FormField
                      control={form.control}
                      name="profilePhoto"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <ImageUploadField
                              title="Upload Profile Photo *"
                              subtitle="অ্যাডমিন ভেরিফিকেশনের জন্য, অনুগ্রহ করে আপনার এমন একটি ছবি দিন, যেখানে আপনার মুখমণ্ডল স্পষ্টভাবে চেনা যায়।"
                              type="profile"
                              onImageSelect={(base64Image) => {
                                if (base64Image) {
                                  field.onChange(base64Image);
                                  setProfilePhotoUploaded(true);
                                } else {
                                  field.onChange("");
                                  setProfilePhotoUploaded(false);
                                }
                              }}
                              currentImage={field.value}
                            />
                          </FormControl>
                          <FormMessage className="text-xs md:text-sm" />
                        </FormItem>
                      )}
                    />
                   
                    <FormField
                      control={form.control}
                      name="socialProfileLink"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-foreground">Social Profile Link (Facebook/LinkedIn)</FormLabel>
                         <HoverTooltip 
                           tooltip="আপনার পাবলিক প্রোফাইল দেখে চেক করার পর আপনার একাউন্ট এপ্রুভ করা হবে।"
                         >
                           <FormControl>
                             <Input 
                               placeholder="facebook.com/yourprofile or linkedin.com/in/yourprofile" 
                               {...field} 
                               className="h-10 md:h-12 text-sm md:text-base"
                               onBlur={(e) => {
                                 field.onBlur();
                                 // Real-time validation for social profile
                                 const value = e.target.value.toLowerCase().trim();
                                 if (value && !value.includes('facebook.com') && !value.includes('linkedin.com') && !value.includes('twitter.com') && !value.includes('instagram.com') && !/^(www\.)?[\w\-]+(\.[\w\-]+)+.*$/.test(value)) {
                                   form.setError("socialProfileLink", {
                                     type: "manual",
                                     message: "Please enter a valid social media profile URL."
                                   });
                                 }
                               }}
                             />
                           </FormControl>
                         </HoverTooltip>
                          <FormMessage className="text-xs md:text-sm" />
                        </FormItem>
                      )}
                    />
                  </div>
                    
                  {/* Verification Section */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4">Account Verification</h3>
                    
                    <FormField
                      control={form.control}
                      name="proofDocument"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <ImageUploadField
                              title="Upload Student Proof Image"
                              subtitle="আমাদের এই প্ল্যাটফর্ম শুধুমাত্র প্রাক্তন ছাত্র-ছাত্রীদের জন্য। আপনি যে আমাদেরই একজন, তা নিশ্চিত করতে একটি প্রমাণপত্রের ছবি প্রয়োজন।"
                              type="document"
                              onImageSelect={(base64Image) => {
                                if (base64Image) {
                                  field.onChange(base64Image);
                                  setDocumentUploaded(true);
                                } else {
                                  field.onChange("");
                                  setDocumentUploaded(false);
                                }
                              }}
                              currentImage={field.value}
                            />
                          </FormControl>
                          <ProofDocumentInstructions 
                            show={true} 
                            hasFile={documentUploaded} 
                          />
                          <FormMessage className="text-xs md:text-sm" />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-primary to-primary/80 h-12 md:h-14 text-sm md:text-base font-semibold mt-8"
                  >
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
